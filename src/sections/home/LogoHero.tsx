import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import { PaperButton, PaperLink } from '@/components/paper/kit.tsx'
import { TornEdge } from '@/components/paper/TornEdge.tsx'
import { hero } from '@/data/home.ts'
import { paperInk } from '@/lib/paper-theme.ts'
import { FrameSequence, MELT_URLS, ROTATION_URLS, sampleArt, type Art } from '@/sections/home/brand-melt/frames.ts'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Auto-play speed through the rotation, frames per second. */
const FPS = 24
/** Drag sensitivity: frames per pixel. */
const FRAMES_PER_PX = 0.3
/** Turning back to the front before the melt: at most this long, at about SETTLE_FPS. */
const SETTLE_MAX_S = 0.5
const SETTLE_MIN_S = 0.15
const SETTLE_FPS = 96
/** Letterbox rows cropped before the art has been measured. */
const FALLBACK_CROP = 16
const MAX_DPR = 1.5
/** The melt never plays faster than this, however fast the scroll (seconds, start to pool). */
const MELT_MIN_S = 1.6
/** Melt frames kept decoded while the logo is still spinning, so the melt starts at once. */
const MELT_PARKED = { ahead: 12, behind: 0 }

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

type Player = {
  /** Turn the spinning logo by this many frames (keyboard). */
  nudge: (frames: number) => void
}

/**
 * Plays the mark on a canvas, in three states:
 *  - spin: the rotation sways back and forth on its own (the art is a half turn,
 *    front to back, so it ping-pongs), and can be dragged or turned with keys;
 *  - settle: once the scroll starts the melt, the logo turns back to the front;
 *  - melt: the melt frame follows `meltRef` (0 to 1, the pinned scroll).
 * Scrolling back to the top returns to spin. Frames decode in a small window
 * around the playhead (FrameSequence) and nothing runs while off screen.
 */
function useLogoPlayer(canvasRef: RefObject<HTMLCanvasElement | null>, artRef: RefObject<Art | null>, meltRef: RefObject<number>) {
  const playerRef = useRef<Player>({ nudge: () => {} })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const player = playerRef.current
    if (!canvas || !ctx || ROTATION_URLS.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
    const ac = new AbortController()
    const rotation = new FrameSequence(ROTATION_URLS, ac.signal, { ahead: 18, behind: 6 })
    const melt = new FrameSequence(MELT_URLS, ac.signal, { ahead: 16, behind: 6 })
    if (!saveData) {
      // The rotation first, then the melt: background fetches, never awaited by the page.
      void rotation
        .preload()
        .then(() => rotation.dedupe())
        .then(() => (reduced ? undefined : melt.preload()))
        .then(() => (reduced ? undefined : melt.dedupe()))
    }

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    let state: 'spin' | 'settle' | 'melt' = 'spin'
    /** The melt's playhead: follows meltRef, no faster than MELT_MIN_S allows. */
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
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      drawnKey = ''
    }

    /** Cover the canvas with the cropped frame, centred (the logo sits mid-frame). */
    const paint = (bmp: ImageBitmap) => {
      const art = artRef.current
      const top = art?.cropTop ?? FALLBACK_CROP
      const bottom = art?.cropBottom ?? FALLBACK_CROP
      const sh = bmp.height - top - bottom
      const W = canvas.width
      const H = canvas.height
      const s = Math.max(W / bmp.width, H / sh)
      const dw = bmp.width * s
      const dh = sh * s
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(bmp, 0, top, bmp.width, sh, (W - dw) / 2, (H - dh) / 2, dw, dh)
    }

    const draw = () => {
      let seq: FrameSequence
      let order: readonly number[]
      let k: number
      if (state === 'melt') {
        seq = melt
        order = melt.order
        k = Math.round(clamp01(meltPlay) * (order.length - 1))
        melt.focus(order, k, 1)
        rotation.focus(rotation.order, 0, -1, { ahead: 0, behind: 0 })
      } else {
        seq = rotation
        order = rotation.order
        k = Math.max(0, Math.min(order.length - 1, Math.round(pos)))
        rotation.focus(order, k, dir)
        melt.focus(melt.order, 0, 1, MELT_PARKED)
      }
      const frame = seq.nearest(order, k)
      if (!frame) return
      const key = `${state === 'melt' ? 'm' : 'r'}${frame.index}`
      if (key === drawnKey) return
      seq.hold(frame.index)
      drawnKey = key
      paint(frame.bmp)
    }

    const tick = (t: number) => {
      const dt = lastT ? Math.min((t - lastT) / 1000, 0.1) : 0
      lastT = t
      const last = Math.max(0, rotation.order.length - 1)
      const m = meltRef.current

      if (m > 0.001 && MELT_URLS.length > 0) {
        if (state === 'spin') {
          // The melt starts from the front pose: turn back to it first.
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
      const melting = m > 0.001 && MELT_URLS.length > 0
      // Scrolled back up fast: the melt plays back to the front before the spin resumes.
      const unmelting = state === 'melt' && meltPlay > 0
      if (melting || unmelting) {
        // Settle and melt were handled above.
      } else if (state !== 'spin') {
        // Back at the top: spin on from the front.
        state = 'spin'
        meltPlay = 0
        pos = 0
        dir = 1
      } else if (!dragging) {
        if (Math.abs(velocity) > 2) {
          // Let a drag coast out, then hand back to the sway.
          pos += velocity * dt
          velocity *= Math.pow(0.9, dt * 60)
          dir = Math.sign(velocity) || dir
        } else if (!reduced) {
          velocity = 0
          pos += dir * FPS * dt
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
      const dt = Math.max(1, now - lastMoveT) / 1000
      lastX = event.clientX
      lastMoveT = now
      const last = Math.max(0, rotation.order.length - 1)
      pos = Math.min(last, Math.max(0, pos - dx * FRAMES_PER_PX))
      velocity = (-dx * FRAMES_PER_PX) / dt
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
    // The front frame as soon as it decodes, even before the loop starts.
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
  }, [canvasRef, artRef, meltRef])

  return playerRef
}

/**
 * 01: the hero. The Bizaffix mark spins in the middle of a blue sheet the same
 * colour as its frames, so the art has no edges; the headline rises in on load.
 * Scrolling pins the hero: the mark turns to face front and melts into a pool
 * (scrubbed, so scrolling back up un-melts it), then the page moves on through
 * the tear. Drag the mark to spin it; it leans toward the pointer.
 */
export function LogoHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const artRef = useRef<Art | null>(null)
  /** Melt progress, 0 to 1: written by the pinned scroll, read by the player. */
  const meltRef = useRef(0)
  const [bg, setBg] = useState<string | null>(null)

  // The sheet takes the frames' own background, measured from the art.
  useEffect(() => {
    if (MELT_URLS.length === 0) return
    const ac = new AbortController()
    sampleArt(MELT_URLS[0], MELT_URLS[MELT_URLS.length - 1], ac.signal)
      .then((art) => {
        artRef.current = art
        setBg(art.bg)
      })
      .catch(() => {})
    return () => ac.abort()
  }, [])

  const playerRef = useLogoPlayer(canvasRef, artRef, meltRef)

  const { contextSafe } = useGSAP(
    () => {
      // Perspective for the pointer lean, set once (not part of any tween).
      gsap.set(tiltRef.current, { transformPerspective: 1200 })
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Wait for the page loader to clear before the reveal starts.
        const delay = document.getElementById('initial-loader') ? 0.8 : 0.15

        // Load: the mark settles in, then the headline rises line by line.
        gsap
          .timeline({ delay, defaults: { ease: 'power4.out' } })
          .from(tiltRef.current, { scale: 0.88, autoAlpha: 0, duration: 1.6, ease: 'expo.out' }, 0)
          .from('.lh-line > span', { yPercent: 110, duration: 1.2, stagger: 0.1 }, 0.15)
          .call(() => titleRef.current?.setAttribute('data-inview', 'true'), [], 0.7)
          .from('.lh-fade', { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.08 }, 0.55)

        // Scroll: pin the stage while the mark melts, then let the page move on.
        const proxy = { melt: 0 }
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: stageRef.current, start: 'top top', end: '+=120%', pin: true, scrub: 0.6, anticipatePin: 1 },
          })
          .to(proxy, { melt: 1, duration: 0.85, onUpdate: () => void (meltRef.current = proxy.melt) }, 0)
          .to('.lh-hint, .lh-cue', { autoAlpha: 0, duration: 0.1 }, 0)
          .to('.lh-copy', { yPercent: -6, duration: 1 }, 0)
          .to({}, { duration: 0.15 })

        return () => {
          meltRef.current = 0
        }
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        titleRef.current?.setAttribute('data-inview', 'true')
      })
    },
    { scope: sectionRef },
  )

  // The mark leans toward the pointer (fine pointers only).
  const lean = contextSafe((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || !tiltRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    gsap.to(tiltRef.current, { rotationY: x * 10, rotationX: -y * 8, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
  })
  const settle = contextSafe(() => {
    if (tiltRef.current) gsap.to(tiltRef.current, { rotationY: 0, rotationX: 0, duration: 1, ease: 'power3.out', overwrite: 'auto' })
  })

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') playerRef.current.nudge(8)
    else if (event.key === 'ArrowLeft') playerRef.current.nudge(-8)
    else return
    event.preventDefault()
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={lean}
      onPointerLeave={settle}
      aria-labelledby="hero-title"
      className="lh relative -mt-(--header-clearance) overflow-hidden text-white"
      style={{ backgroundColor: bg ?? 'var(--ph-blue)' } as CSSProperties}
    >
      {/* The stage: one screen tall, pinned while the mark melts; the tear sits below */}
      <div ref={stageRef} className="lh-stage" style={{ backgroundColor: bg ?? 'var(--ph-blue)' }}>
        <div className="lh-card-wrap">
          <div className="lh-card" style={{ backgroundColor: bg ?? 'var(--ph-blue)' }}>
            <div
              ref={tiltRef}
              className="lh-tilt"
              role="img"
              tabIndex={0}
              onKeyDown={onKey}
              aria-label={`The Bizaffix mark, spinning. ${hero.dragHint}, or use the arrow keys.`}
            >
              <canvas ref={canvasRef} className="lh-canvas" />
            </div>
          </div>
          <p className="lh-fade lh-hint ph-label">
            <span aria-hidden="true">↔</span> {hero.dragHint}
          </p>
        </div>

        <div className="lh-copy ph-container">
          {hero.badge ? (
            <p className="lh-fade ph-label inline-flex min-h-8 items-center gap-2.5 rounded-full border border-white/30 px-3.5">
              <span className="ph-live text-[var(--ph-yellow)]" aria-hidden="true" />
              {hero.badge}
            </p>
          ) : null}

          <h1 ref={titleRef} id="hero-title" data-inview="false" className="lh-title mt-6">
            <span className="sr-only">{hero.title}</span>
            <span aria-hidden="true">
              {hero.lines.slice(0, -1).map((line) => (
                <span key={line} className="lh-line">
                  <span>{line}</span>
                </span>
              ))}
              <span className="lh-line">
                <span>
                  {hero.lines.at(-1)} <span className="ph-mark">{hero.accent}</span>
                </span>
              </span>
            </span>
          </h1>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
            <div className="lh-fade flex flex-wrap items-center gap-x-8 gap-y-4">
              <PaperButton>{hero.primaryCta}</PaperButton>
              <PaperLink to={hero.secondaryCta.href} className="text-white">
                {hero.secondaryCta.label}
              </PaperLink>
            </div>
            <p className="lh-fade ph-body max-w-[34ch] text-white/85">{hero.lead}</p>
          </div>
        </div>

        <p className="lh-cue ph-label" aria-hidden="true">
          {hero.scrollCue}
          <span className="lh-cue-line" />
        </p>
      </div>

      {/* Hero → next: the tear from a centre pin, as before */}
      <TornEdge seed={11} pin="center" under={paperInk.white} />
    </section>
  )
}

export default LogoHero
