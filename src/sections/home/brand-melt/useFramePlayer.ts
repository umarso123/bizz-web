import { useEffect, type RefObject } from 'react'
import { coverLayout, FrameSequence, MELT_URLS, ROTATION_URLS, type Art } from '@/sections/home/brand-melt/frames.ts'
import { FRAMES, clamp01, slideAt } from '@/sections/home/brand-melt/meltTimeline.ts'

/** Idle rotation speed. */
const FPS = 24
/** Turning back to the front takes at most this long, however far round the logo is. */
const SETTLE_MAX_S = 0.6
const SETTLE_MIN_S = 0.18
/** Below SETTLE_MAX_S, settle at about this speed (4× the idle spin). */
const SETTLE_FPS = 96
/** Rotation-to-melt crossfade. */
const FADE_MS = 120
/**
 * Arriving with the playhead already this far in (scrolling back up into the
 * section, a deep link) goes straight to the melt frames instead of turning the
 * logo to the front first.
 */
const ARRIVE_IN = 0.05
const MAX_DPR = 1.5
/** The share of the frame's width stretched to fill an uncovered side strip, and in how many slices. */
const EDGE_BAND = 0.25
const EDGE_SLICES = 16
/** Decode windows for the sequence that is waiting rather than playing. */
const ROTATION_PARKED = { ahead: 0, behind: 0 }
const MELT_PARKED = { ahead: 12, behind: 0 }

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

type Options = {
  enabled: boolean
  art: Art | null
  canvasRef: RefObject<HTMLCanvasElement | null>
  anchorRef: RefObject<HTMLElement | null>
  /** Where the scroll is: the pinned timeline's (scrubbed) progress. */
  targetRef: RefObject<number>
  /** Where the animation is: the paced playhead that follows the target. */
  playRef: RefObject<number>
  /** Set while the logo turns to the front: the playhead waits at 0 until it faces front. */
  holdRef: RefObject<boolean>
  /** The first rotation frame could not be loaded: switch to the still logo. */
  onFail: () => void
}

/**
 * Plays the mark's frames on a canvas that covers the pinned section.
 *
 * At the section start the rotation ping-pongs at 24 fps, time based: the art is
 * a half turn, front to back, so a plain loop would snap from the back view to
 * the front. When the scroll leaves the start, the logo turns back to the front
 * (eased, at most SETTLE_MAX_S) while the playhead waits, then crossfades to melt
 * frame 1. From then on the melt frame is a function of the playhead, which
 * follows the scroll at a capped pace, so a fast scroll still plays the whole
 * melt. Over the first half of the melt the frame glides from the logo column to
 * cover the screen edge to edge. Back at the start (playhead and scroll both at
 * 0) the idle rotation resumes from the front frame.
 *
 * Draws only when the frame, the crossfade step or the glide changes, never steps
 * back to a frame further from the playhead than the one on screen, and runs only
 * while the canvas is on screen.
 */
export function useFramePlayer({ enabled, art, canvasRef, anchorRef, targetRef, playRef, holdRef, onFail }: Options) {
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!enabled || !art || !canvas || !ctx) return

    const ac = new AbortController()
    const rotation = new FrameSequence(ROTATION_URLS, ac.signal)
    const melt = new FrameSequence(MELT_URLS, ac.signal)
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    // The idle spin starts once the rotation's repeated frames are known.
    let spinReady = false

    // Front frame first and on its own, so it shows before anything else arrives.
    void rotation.decode(0).then(async (bmp) => {
      if (ac.signal.aborted) return
      if (!bmp) {
        onFail()
        return
      }
      start()
      // Then the rest of the rotation, then the melt: fetched in the background, never awaited by the page.
      await rotation.preload()
      await rotation.dedupe()
      if (ac.signal.aborted) return
      spinReady = true
      start()
      await melt.preload()
      await melt.dedupe()
    })

    let anchorX = 0
    let layoutVersion = 0
    const size = () => {
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (w !== canvas.width || h !== canvas.height) {
        canvas.width = w
        canvas.height = h
      }
      const anchor = anchorRef.current
      const cr = canvas.getBoundingClientRect()
      anchorX = anchor ? (anchor.getBoundingClientRect().left + anchor.offsetWidth / 2 - cr.left) * dpr : canvas.width * 0.7
      layoutVersion++
      start()
    }

    const paint = (bmp: ImageBitmap, alpha: number, slide: number) => {
      const W = canvas.width
      const L = coverLayout(W, canvas.height, bmp.width, bmp.height, art, anchorX, 16 * dpr, slide)
      const sy = art.cropTop
      ctx.globalAlpha = alpha
      ctx.drawImage(bmp, 0, sy, bmp.width, L.sh, L.dx, L.dy, L.dw, L.dh)
      // Until the glide is done, the logo column leaves a strip at one side. Fill
      // it by stretching the frame's outer quarter across strip and quarter
      // together: 1:1 where it meets the frame, widest at the screen edge, so
      // the background and the pool carry on with no seam or mirrored copy.
      const band = bmp.width * EDGE_BAND
      const right = L.dx + L.dw
      if (L.dx > 0.5) {
        // dest(x) = a·x + b·x² over source x in [0, band]: dest(0) = 0 (screen edge),
        // dest(band) = the frame's own position, dest'(band) = s (no kink).
        const a = L.s + (2 * L.dx) / band
        const b = -L.dx / (band * band)
        for (let i = 0; i < EDGE_SLICES; i++) {
          const x0 = (band * i) / EDGE_SLICES
          const x1 = (band * (i + 1)) / EDGE_SLICES
          const d0 = a * x0 + b * x0 * x0
          const d1 = a * x1 + b * x1 * x1
          ctx.drawImage(bmp, x0, sy, x1 - x0, L.sh, d0, L.dy, d1 - d0 + 1, L.dh)
        }
      }
      if (right < W - 0.5) {
        // The same on the right: u is the distance into the band from its inner edge.
        const e = W - right
        const start = right - band * L.s
        const c = e / (band * band)
        for (let i = 0; i < EDGE_SLICES; i++) {
          const u0 = (band * i) / EDGE_SLICES
          const u1 = (band * (i + 1)) / EDGE_SLICES
          const d0 = start + L.s * u0 + c * u0 * u0
          const d1 = start + L.s * u1 + c * u1 * u1
          ctx.drawImage(bmp, bmp.width - band + u0, sy, u1 - u0, L.sh, d0 - 1, L.dy, d1 - d0 + 1, L.dh)
        }
      }
      ctx.globalAlpha = 1
    }

    // Landing mid-section (a deep link, a reload) goes straight to the melt.
    let state: 'idle' | 'settling' | 'melt' = targetRef.current > 0 ? 'melt' : 'idle'
    holdRef.current = false
    let pos = 0
    let dir = 1
    let settleFrom = 0
    let settleStart = 0
    let settleDur = 0
    let fadeFrom = Number.NEGATIVE_INFINITY
    // The melt's play order, fixed when the melt starts (dedupe may finish later).
    let meltOrder = melt.order
    let lastMelt = 0
    // What is on screen, by sequence: the playhead never makes it step back.
    let shownRot: { index: number; pos: number } | null = null
    let shownMelt: { index: number; pos: number } | null = null
    let lastTime = 0
    let lastKey = ''
    let raf = 0
    let inView = false

    const enterMelt = (now: number, fade: boolean) => {
      state = 'melt'
      holdRef.current = false
      meltOrder = melt.order
      shownMelt = null
      rotation.hold(-1)
      fadeFrom = fade ? now : Number.NEGATIVE_INFINITY
    }

    /** The decoded frame nearest k, unless the one on screen is at least as close. */
    const pick = (seq: FrameSequence, order: readonly number[], k: number, shown: { index: number; pos: number } | null) => {
      const f = seq.nearest(order, k)
      if (shown && (!f || Math.abs(f.pos - k) > Math.abs(shown.pos - k))) {
        const bmp = seq.get(shown.index)
        if (bmp) return { index: shown.index, pos: shown.pos, bmp }
      }
      return f
    }

    const tick = (now: number) => {
      raf = 0
      const dt = lastTime ? Math.min(now - lastTime, 100) / 1000 : 0
      lastTime = now
      const target = targetRef.current
      const play = playRef.current
      const rotOrder = rotation.order
      const last = rotOrder.length - 1

      if (state === 'idle') {
        if (play > 0 || target > ARRIVE_IN) {
          // Already past the start (scrolled back up into the section): no turn first.
          enterMelt(now, false)
        } else if (target > 0) {
          state = 'settling'
          holdRef.current = true
          settleFrom = Math.min(pos, last)
          settleStart = now
          settleDur = Math.min(SETTLE_MAX_S, Math.max(SETTLE_MIN_S, settleFrom / SETTLE_FPS)) * 1000
        } else if (spinReady) {
          pos += dir * FPS * dt
          if (pos >= last) {
            pos = 2 * last - pos
            dir = -1
          } else if (pos <= 0) {
            pos = -pos
            dir = 1
          }
        }
      }
      if (state === 'settling') {
        if (target <= 0) {
          // Back at the start before reaching the front: spin on from here, towards the front.
          state = 'idle'
          holdRef.current = false
          dir = -1
        } else {
          const t = settleDur > 0 ? clamp01((now - settleStart) / settleDur) : 1
          pos = settleFrom * (1 - easeOutCubic(t))
          dir = -1
          if (t >= 1) {
            pos = 0
            dir = 1
            enterMelt(now, true)
          }
        }
      } else if (state === 'melt' && play <= 0 && target <= 0) {
        state = 'idle'
        pos = 0
        dir = 1
        shownRot = null
        melt.hold(-1)
      }

      // Under the liquid, the frames are hidden: nothing to decode or draw.
      if (state === 'melt' && play >= FRAMES.canvasOutEnd) {
        if (inView) raf = requestAnimationFrame(tick)
        return
      }

      let key = ''
      let draw: (() => void) | null = null
      if (state !== 'melt') {
        const k = Math.max(0, Math.min(last, Math.round(pos)))
        rotation.focus(rotOrder, k, dir)
        melt.focus(melt.order, 0, 1, MELT_PARKED)
        const f = pick(rotation, rotOrder, k, shownRot)
        if (f) {
          key = `r${f.index}`
          draw = () => {
            paint(f.bmp, 1, 0)
            shownRot = { index: f.index, pos: f.pos }
            rotation.hold(f.index)
          }
        }
      } else {
        const k = Math.round(clamp01(play / FRAMES.meltEnd) * (meltOrder.length - 1))
        const slide = slideAt(play)
        melt.focus(meltOrder, k, k >= lastMelt ? 1 : -1)
        rotation.focus(rotOrder, 0, -1, ROTATION_PARKED)
        lastMelt = k
        const f = pick(melt, meltOrder, k, shownMelt)
        const front = rotation.get(0)
        const a = clamp01((now - fadeFrom) / FADE_MS)
        const glide = Math.round(slide * 600)
        if (f && a < 1 && front) {
          key = `x${f.index}:${a.toFixed(2)}`
          draw = () => {
            paint(front, 1, slide)
            paint(f.bmp, a, slide)
            shownMelt = { index: f.index, pos: f.pos }
            melt.hold(f.index)
          }
        } else if (f) {
          key = `m${f.index}:${glide}`
          draw = () => {
            paint(f.bmp, 1, slide)
            shownMelt = { index: f.index, pos: f.pos }
            melt.hold(f.index)
          }
        }
      }
      key += `@${layoutVersion}`
      if (draw && key !== lastKey) {
        draw()
        lastKey = key
      }
      if (inView) raf = requestAnimationFrame(tick)
    }

    function start() {
      if (!raf && inView && !ac.signal.aborted) raf = requestAnimationFrame(tick)
    }

    const ro = new ResizeObserver(size)
    ro.observe(canvas)
    if (anchorRef.current) ro.observe(anchorRef.current)
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) {
        lastTime = 0
        start()
      } else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    })
    io.observe(canvas)

    return () => {
      ac.abort()
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      holdRef.current = false
      rotation.dispose()
      melt.dispose()
      canvas.width = 0
      canvas.height = 0
    }
  }, [enabled, art, canvasRef, anchorRef, targetRef, playRef, holdRef, onFail])
}
