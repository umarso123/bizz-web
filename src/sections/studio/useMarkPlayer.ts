import { useEffect, useRef, type RefObject } from 'react'
import { FrameSequence, MELT_URLS, ROTATION_URLS, type Art } from '@/sections/home/brand-melt/frames.ts'

/** Auto-play speed through the rotation, art frames per second. */
const FPS = 22
/** Drag sensitivity: frames per pixel. */
const FRAMES_PER_PX = 0.32
/** Turning back to the front before the melt. */
const SETTLE_MAX_S = 0.55
const SETTLE_MIN_S = 0.18
const SETTLE_FPS = 90
/** Letterbox rows cropped before the art has been measured. */
const FALLBACK_CROP = 16
/** The backing store never exceeds the art's own width (1280px): more pixels only cost fill rate. */
const MAX_BACKING_W = 1280
/** The melt never plays faster than this, however fast the scroll (seconds, start to pool). */
const MELT_MIN_S = 1.4
/** Melt frames kept decoded while the logo is still spinning, so the melt starts at once. */
const MELT_PARKED = { ahead: 12, behind: 0 }
/** How far in from each edge the frame dissolves into the stage colour, as a fraction of the drawn frame. */
const FEATHER = 0.07

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

export type MarkPlayer = {
  /** Turn the spinning logo by this many frames (keyboard). */
  nudge: (frames: number) => void
}

export type MarkInputs = {
  /** Melt progress 0–1, written by the pinned scroll. */
  melt: number
  /** Drawn size of the art relative to a cover fit (1 = cover). Under 1 the stage colour shows round it. */
  zoom: number
}

/**
 * The Bizaffix mark on a canvas, in three states:
 *  - spin: the half-turn rotation ping-pongs on its own, and can be dragged or turned with keys;
 *  - settle: once the melt starts, the mark turns back to face front;
 *  - melt: the melt frame follows `inputs.melt`, never faster than MELT_MIN_S.
 *
 * Improvements over the first player:
 *  - in-between frames: the playhead is fractional and the two nearest art
 *    frames are cross-faded, so 22fps art moves smoothly on 60/120Hz screens
 *    and a slow scroll through the melt never steps;
 *  - zoom: the art can be drawn smaller than cover, its edges feathered into the
 *    stage colour so there is never a visible frame rectangle.
 *
 * Frames decode in a small window around the playhead and nothing runs off screen.
 */
export function useMarkPlayer(canvasRef: RefObject<HTMLCanvasElement | null>, artRef: RefObject<Art | null>, inputsRef: RefObject<MarkInputs>) {
  const playerRef = useRef<MarkPlayer>({ nudge: () => {} })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: false })
    const player = playerRef.current
    if (!canvas || !ctx || ROTATION_URLS.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
    const ac = new AbortController()
    const rotation = new FrameSequence(ROTATION_URLS, ac.signal, { ahead: 18, behind: 6 })
    const melt = new FrameSequence(MELT_URLS, ac.signal, { ahead: 16, behind: 6 })
    if (!saveData) {
      // The rotation first (it is on screen). The melt (~4 MB) waits for an idle
      // moment or the first scroll, whichever comes first, so it never competes
      // with the first paint. Its first frames are still parked for an instant start.
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
      let meltQueued = false
      const loadMelt = () => {
        if (meltQueued || reduced) return
        meltQueued = true
        window.removeEventListener('scroll', loadMelt)
        void melt.preload().then(() => melt.dedupe())
      }
      window.addEventListener('scroll', loadMelt, { passive: true, once: true })
      void rotation
        .preload()
        .then(() => rotation.dedupe())
        .then(() => (idle ? idle(loadMelt, { timeout: 2500 }) : window.setTimeout(loadMelt, 1200)))
      ac.signal.addEventListener('abort', () => window.removeEventListener('scroll', loadMelt))
    }

    let state: 'spin' | 'settle' | 'melt' = 'spin'
    let meltPlay = 0
    let pos = 0
    let dir = 1
    let velocity = 0
    let dragging = false
    let lastX = 0
    let lastMoveT = 0
    let settleFrom = 0
    let settleStart = 0
    let settleDur = 0
    let drawnKey = ''
    let raf = 0
    let lastT = 0
    let visible = false

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.min(canvas.clientWidth * dpr, MAX_BACKING_W)
      const k = w / canvas.clientWidth
      canvas.width = Math.round(canvas.clientWidth * k)
      canvas.height = Math.round(canvas.clientHeight * k)
      drawnKey = ''
    }

    /** Where the cropped frame lands on the canvas at the current zoom. */
    const layout = (bmp: ImageBitmap) => {
      const art = artRef.current
      const top = art?.cropTop ?? FALLBACK_CROP
      const bottom = art?.cropBottom ?? FALLBACK_CROP
      const sh = bmp.height - top - bottom
      const W = canvas.width
      const H = canvas.height
      const zoom = inputsRef.current.zoom
      const s = Math.max(W / bmp.width, H / sh) * zoom
      const dw = bmp.width * s
      const dh = sh * s
      return { top, sh, dx: (W - dw) / 2, dy: (H - dh) / 2, dw, dh }
    }

    const paint = (a: ImageBitmap, b: ImageBitmap | null, mix: number) => {
      const W = canvas.width
      const H = canvas.height
      const bg = artRef.current?.bg ?? '#2350D2'
      const { top, sh, dx, dy, dw, dh } = layout(a)
      ctx.globalAlpha = 1
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)
      ctx.drawImage(a, 0, top, a.width, sh, dx, dy, dw, dh)
      if (b && mix > 0.001) {
        ctx.globalAlpha = mix
        ctx.drawImage(b, 0, top, b.width, sh, dx, dy, dw, dh)
        ctx.globalAlpha = 1
      }
      // Feather any frame edge that falls inside the canvas into the stage colour.
      const fx = dw * FEATHER
      const fy = dh * FEATHER
      const edge = (x0: number, y0: number, x1: number, y1: number, rx: number, ry: number, rw: number, rh: number) => {
        const g = ctx.createLinearGradient(x0, y0, x1, y1)
        g.addColorStop(0, bg)
        g.addColorStop(1, `${bg}00`)
        ctx.fillStyle = g
        ctx.fillRect(rx, ry, rw, rh)
      }
      if (dx > 0.5) {
        edge(dx, 0, dx + fx, 0, dx - 1, 0, fx + 1, H)
        edge(dx + dw, 0, dx + dw - fx, 0, dx + dw - fx, 0, fx + 1, H)
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, Math.ceil(dx), H)
        ctx.fillRect(Math.floor(dx + dw), 0, W, H)
      }
      if (dy > 0.5) {
        edge(0, dy, 0, dy + fy, 0, dy - 1, W, fy + 1)
        edge(0, dy + dh, 0, dy + dh - fy, 0, dy + dh - fy, W, fy + 1)
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, W, Math.ceil(dy))
        ctx.fillRect(0, Math.floor(dy + dh), W, H)
      }
    }

    const draw = () => {
      const seq = state === 'melt' ? melt : rotation
      const order = seq.order
      const last = Math.max(0, order.length - 1)
      const p = state === 'melt' ? clamp01(meltPlay) * last : Math.max(0, Math.min(last, pos))
      const k0 = Math.floor(p)
      const k1 = Math.min(last, k0 + 1)
      const mix = p - k0
      if (state === 'melt') {
        melt.focus(order, k0, 1)
        rotation.focus(rotation.order, 0, -1, { ahead: 0, behind: 0 })
      } else {
        rotation.focus(order, k0, dir)
        melt.focus(melt.order, 0, 1, MELT_PARKED)
      }
      const a = seq.get(order[k0])
      const b = k1 !== k0 ? seq.get(order[k1]) : null
      const zoomKey = Math.round(inputsRef.current.zoom * 400)
      if (a) {
        const blend = b ? Math.round(mix * 10) / 10 : 0
        const key = `${state === 'melt' ? 'm' : 'r'}${k0}:${blend}:${zoomKey}:${canvas.width}`
        if (key === drawnKey) return
        seq.hold(order[k0])
        drawnKey = key
        paint(a, b, blend)
        return
      }
      // The exact frame is not decoded yet: show the nearest one that is.
      const near = seq.nearest(order, Math.round(p))
      if (!near) return
      const key = `${state === 'melt' ? 'm' : 'r'}~${near.index}:${zoomKey}:${canvas.width}`
      if (key === drawnKey) return
      seq.hold(near.index)
      drawnKey = key
      paint(near.bmp, null, 0)
    }

    const tick = (t: number) => {
      const dt = lastT ? Math.min((t - lastT) / 1000, 0.1) : 0
      lastT = t
      const last = Math.max(0, rotation.order.length - 1)
      const m = inputsRef.current.melt
      const canMelt = MELT_URLS.length > 0

      if (m > 0.001 && canMelt) {
        if (state === 'spin') {
          state = 'settle'
          dragging = false
          velocity = 0
          settleFrom = Math.min(pos, last)
          settleStart = t
          settleDur = Math.min(SETTLE_MAX_S, Math.max(SETTLE_MIN_S, settleFrom / SETTLE_FPS)) * 1000
        }
        if (state === 'settle') {
          const u = settleDur > 0 ? clamp01((t - settleStart) / settleDur) : 1
          pos = settleFrom * (1 - easeOutCubic(u))
          if (u >= 1) {
            pos = 0
            state = 'melt'
          }
        }
      }
      if (state === 'melt') {
        const step = dt / MELT_MIN_S
        meltPlay = m > meltPlay ? Math.min(m, meltPlay + step) : Math.max(m, meltPlay - step)
      }
      const melting = m > 0.001 && canMelt
      const unmelting = state === 'melt' && meltPlay > 0
      if (melting || unmelting) {
        // handled above
      } else if (state !== 'spin') {
        state = 'spin'
        meltPlay = 0
        pos = 0
        dir = 1
      } else if (!dragging) {
        if (Math.abs(velocity) > 2) {
          pos += velocity * dt
          velocity *= Math.pow(0.9, dt * 60)
          dir = Math.sign(velocity) || dir
        } else if (!reduced) {
          velocity = 0
          // Ease into each turn-around instead of bouncing off the ends.
          const edge = Math.min(pos, last - pos)
          const slow = 0.35 + 0.65 * Math.min(1, edge / 14)
          pos += dir * FPS * slow * dt
        }
        if (pos >= last) {
          pos = last
          dir = -1
          velocity = -Math.abs(velocity)
        } else if (pos <= 0) {
          pos = 0
          dir = 1
          velocity = Math.abs(velocity)
        }
      }
      draw()
      raf = visible ? requestAnimationFrame(tick) : 0
    }

    const start = () => {
      if (raf) return
      lastT = 0
      raf = requestAnimationFrame(tick)
    }

    player.nudge = (frames: number) => {
      if (state !== 'spin') return
      const last = Math.max(0, rotation.order.length - 1)
      pos = Math.min(last, Math.max(0, pos + frames))
      dir = Math.sign(frames) || dir
      draw()
    }

    const onDown = (event: PointerEvent) => {
      if (state !== 'spin') return
      dragging = true
      velocity = 0
      lastX = event.clientX
      lastMoveT = performance.now()
      canvas.setPointerCapture(event.pointerId)
      canvas.dataset.dragging = 'true'
    }
    const onMove = (event: PointerEvent) => {
      if (!dragging) return
      const now = performance.now()
      const dx = event.clientX - lastX
      const dts = Math.max(1, now - lastMoveT) / 1000
      lastX = event.clientX
      lastMoveT = now
      const last = Math.max(0, rotation.order.length - 1)
      pos = Math.min(last, Math.max(0, pos - dx * FRAMES_PER_PX))
      velocity = (-dx * FRAMES_PER_PX) / dts
    }
    const onUp = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      delete canvas.dataset.dragging
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      if (performance.now() - lastMoveT > 80) velocity = 0
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    io.observe(canvas)
    const ro = new ResizeObserver(() => {
      size()
      draw()
    })
    ro.observe(canvas)
    size()
    void rotation.decode(0).then(() => draw())

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      player.nudge = () => {}
      ac.abort()
      rotation.dispose()
      melt.dispose()
    }
  }, [canvasRef, artRef, inputsRef])

  return playerRef
}
