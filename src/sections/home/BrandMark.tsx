import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperLink, PaperSection } from '@/components/paper/kit.tsx'
import { cn } from '@/lib/cn.ts'
import { paperInk } from '@/lib/paper-theme.ts'
import { MELT_URLS, ROTATION_URLS, poolOnScreen, sampleArt, type Art } from '@/sections/home/brand-melt/frames.ts'
import {
  PIN_END,
  framesOpacityAt,
  liquidLevel,
  revealStart,
  stepPlayhead,
  stillOpacityAt,
  textOpacityAt,
  waveAmp,
  type MeltMode,
} from '@/sections/home/brand-melt/meltTimeline.ts'
import { useFramePlayer } from '@/sections/home/brand-melt/useFramePlayer.ts'
import { EmptyTestSection } from '@/sections/home/EmptyTestSection.tsx'
import { MarkConcepts } from '@/sections/home/MarkConcepts.tsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const specs = [
  { label: 'Form', value: 'Extruded hexagon' },
  { label: 'Finish', value: 'Gloss enamel' },
  { label: 'Ink', value: '#009BDF' },
] as const

const LOGO_SIZE = 'size-[min(300px,80vw)] md:size-[380px] lg:size-[460px]'
/** Only if the frames cannot be sampled at all: the theme's blue, not a new colour. */
const FALLBACK_LIQUID = paperInk.blue
const MAX_DPR = 1.5

/**
 * 'frames': rotation and melt sequences on a full-viewport canvas (≥1024px).
 * 'still': the first rotation frame as a still, then only the rise and reveal
 *   (phones and tablets, or if the frames fail to load).
 * 'static': reduced motion: no pin, no playback, the test section just follows.
 */
type Mode = MeltMode | 'static'

function detectMode(): Mode {
  if (typeof window === 'undefined') return 'static'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static'
  // The frames are 16:9 with the logo in the middle third; below lg the layout
  // stacks and a full-viewport frame would sit on top of the text.
  const wide = window.matchMedia('(min-width: 1024px)').matches
  return wide && ROTATION_URLS.length > 0 && MELT_URLS.length > 0 ? 'frames' : 'still'
}

/** The liquid's crest line: the liquid mixed towards white. */
function lighten(hexColour: string, amount: number) {
  const n = Number.parseInt(hexColour.replace('#', ''), 16)
  if (Number.isNaN(n)) return 'rgba(255,255,255,0.6)'
  const mix = (c: number) => Math.round(c + (255 - c) * amount)
  return `rgb(${mix((n >> 16) & 255)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`
}

/**
 * The mark: the Bizaffix logo as a rendered image sequence. At the section start
 * it rotates; scrolling pins the sheet, the logo turns to face front and melts
 * into a pool, a code-drawn liquid takes over from the pool and floods the
 * screen, and the next section appears under it.
 *
 * Everything follows one playhead: the pin's scroll progress, paced so a fast
 * scroll cannot skip the melt (see stepPlayhead). At rest it equals the scroll
 * progress, and it plays backwards when the scroll does.
 */
export function BrandMark() {
  const [detected] = useState(detectMode)
  const [failed, setFailed] = useState(false)
  const mode: Mode = detected === 'frames' && failed ? 'still' : detected
  const [art, setArt] = useState<Art | null>(null)
  const artRef = useRef<Art | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const stillRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<HTMLCanvasElement>(null)
  const liquidRef = useRef<HTMLCanvasElement>(null)
  const testRef = useRef<HTMLElement>(null)
  const testHeadingRef = useRef<HTMLHeadingElement>(null)
  const testTextRef = useRef<HTMLParagraphElement>(null)
  /** Where the scroll is (the pin's scrubbed progress). */
  const targetRef = useRef(0)
  /** Where the animation is: follows targetRef at a capped pace. */
  const playRef = useRef(0)
  /** Set by the frame player while the logo turns to the front: the playhead waits at 0. */
  const holdRef = useRef(false)

  // The colours and the pool come from the frames themselves (two small files).
  useEffect(() => {
    if (MELT_URLS.length === 0) return
    const ac = new AbortController()
    sampleArt(MELT_URLS[0], MELT_URLS[MELT_URLS.length - 1], ac.signal)
      .then((next) => {
        artRef.current = next
        setArt(next)
      })
      .catch(() => {
        if (!ac.signal.aborted) setFailed(true)
      })
    return () => ac.abort()
  }, [])

  const onFail = useCallback(() => setFailed(true), [])
  useFramePlayer({ enabled: mode === 'frames', art, canvasRef: framesRef, anchorRef, targetRef, playRef, holdRef, onFail })

  useGSAP(
    () => {
      if (mode === 'static') return
      const wrapper = wrapperRef.current
      const liquid = liquidRef.current
      const test = testRef.current
      const heading = testHeadingRef.current
      const text = testTextRef.current
      const ctx = liquid?.getContext('2d')
      if (!wrapper || !liquid || !ctx || !test || !heading || !text) return
      const frames = framesRef.current
      const still = stillRef.current
      const copy = textRef.current

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      let phase = 0
      let cleared = false
      let shown = false
      // Measured on resize, not per frame: reading layout while styles are being
      // written forces a reflow every frame.
      let vh = 0
      let revealLine = 0
      const frameBox = { w: 0, h: 0 }
      let poolArt: Art | null = null
      let poolCached = 0
      // The last melt frame's pool, as drawn on the frame canvas (which shares its
      // bottom edge with the liquid layer while pinned).
      const poolPx = () => {
        const a = artRef.current
        if (!a || !frameBox.h) return 0
        if (a !== poolArt) {
          poolArt = a
          poolCached = poolOnScreen(frameBox.w, frameBox.h, a.width, a.height, a)
        }
        return poolCached
      }

      // The liquid: summed sines along the crest, a lighter line on top.
      const drawLiquid = (p: number) => {
        const w = liquid.width / dpr
        const h = liquid.height / dpr
        const a = artRef.current
        const { level, alpha } = liquidLevel(p, h, poolPx(), mode)
        if (level <= 0 || alpha <= 0) {
          if (!cleared) ctx.clearRect(0, 0, liquid.width, liquid.height)
          cleared = true
          return
        }
        cleared = false
        const colour = a?.liquid ?? FALLBACK_LIQUID
        const amp = waveAmp(level)
        const base = h - level
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w, h)
        ctx.globalAlpha = alpha
        ctx.fillStyle = colour
        if (base + amp <= 0) {
          ctx.fillRect(0, 0, w, h)
          ctx.globalAlpha = 1
          return
        }
        const crest = (x: number) =>
          base +
          amp *
            (0.55 * Math.sin(x * 0.011 + phase) +
              0.3 * Math.sin(x * 0.023 - phase * 1.4 + 1.3) +
              0.15 * Math.sin(x * 0.047 + phase * 0.8 + 2.1))
        ctx.beginPath()
        ctx.moveTo(0, h)
        for (let x = 0; x <= w + 8; x += 8) ctx.lineTo(x, crest(x))
        ctx.lineTo(w, h)
        ctx.closePath()
        ctx.fill()
        ctx.beginPath()
        for (let x = 0; x <= w + 8; x += 8) ctx.lineTo(x, crest(x) + 1.2)
        ctx.strokeStyle = lighten(colour, 0.5)
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      // The test section's lines rise in as the liquid passes them, 90ms apart.
      const reveal = gsap
        .timeline({ paused: true })
        .fromTo(
          [heading, text],
          { yPercent: 40, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', stagger: 0.09 },
        )

      // Styles written only when they change.
      const written = new Map<HTMLElement, string>()
      const fade = (el: HTMLElement | null, value: number) => {
        if (!el) return
        const v = value.toFixed(3)
        if (written.get(el) === v) return
        written.set(el, v)
        el.style.opacity = v
        el.style.visibility = value <= 0 ? 'hidden' : ''
      }

      // Everything on screen, as a function of the playhead.
      let drawn = -1
      const render = (p: number, force = false) => {
        if (!force && p === drawn) {
          drawLiquid(p) // the wave still moves
          return
        }
        drawn = p
        const { level } = liquidLevel(p, vh, poolPx(), mode)
        // The section shows only below the wave's lowest trough, and only from its phase on.
        const top = p < revealStart(mode) ? vh : Math.min(vh, Math.max(0, vh - level + waveAmp(level)))
        test.style.clipPath = `inset(${top.toFixed(1)}px 0 0 0)`
        if (!shown && top < revealLine) {
          shown = true
          reveal.play()
        } else if (shown && top >= revealLine) {
          shown = false
          reveal.reverse()
        }
        fade(copy, textOpacityAt(p, mode))
        if (mode === 'frames') fade(frames, framesOpacityAt(p))
        else fade(still, stillOpacityAt(p))
        drawLiquid(p)
      }

      const sizeLiquid = () => {
        liquid.width = Math.round(liquid.clientWidth * dpr)
        liquid.height = Math.round(liquid.clientHeight * dpr)
        vh = test.clientHeight
        revealLine = heading.offsetTop + heading.offsetHeight * 0.6
        frameBox.w = frames?.clientWidth ?? 0
        frameBox.h = frames?.clientHeight ?? 0
        poolArt = null
        cleared = false
        render(playRef.current, true)
      }

      // The pin only reports where the scroll is; the ticker below moves the playhead.
      const proxy = { p: 0 }
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: wrapper,
            pin: true,
            // The wrapper is at least a viewport tall; on a tall stacked layout this pins its last screen.
            start: 'bottom bottom',
            end: PIN_END[mode],
            scrub: 0.5,
            anticipatePin: 1,
            onRefresh: sizeLiquid,
          },
        })
        .to(proxy, {
          p: 1,
          duration: 1,
          onUpdate: () => {
            targetRef.current = proxy.p
          },
        })

      // While on screen: the playhead steps towards the scroll (no faster than its
      // pace allows), and the wave moves on its own clock.
      const tick = (_time: number, deltaMs: number) => {
        const dt = Math.min(deltaMs, 100) / 1000
        phase += 0.035 * gsap.ticker.deltaRatio()
        playRef.current = mode === 'frames' && holdRef.current ? 0 : stepPlayhead(playRef.current, targetRef.current, dt, mode)
        render(playRef.current)
      }
      let ticking = false
      const io = new IntersectionObserver(([entry]) => {
        // On and off screen the playhead jumps to the scroll: arriving from below
        // shows the flooded screen at once instead of replaying the melt.
        playRef.current = targetRef.current
        render(playRef.current, true)
        if (entry.isIntersecting && !ticking) gsap.ticker.add(tick)
        else if (!entry.isIntersecting && ticking) gsap.ticker.remove(tick)
        ticking = entry.isIntersecting
      })
      io.observe(wrapper)
      const ro = new ResizeObserver(sizeLiquid)
      ro.observe(liquid)
      if (frames) ro.observe(frames)
      sizeLiquid()

      // useGSAP reverts the timeline, its ScrollTrigger and the reveal.
      return () => {
        io.disconnect()
        ro.disconnect()
        if (ticking) gsap.ticker.remove(tick)
        test.style.clipPath = ''
        for (const el of written.keys()) {
          el.style.opacity = ''
          el.style.visibility = ''
        }
        targetRef.current = 0
        playRef.current = 0
        liquid.width = 0
        liquid.height = 0
      }
    },
    { scope: wrapperRef, dependencies: [mode] },
  )

  const colours = {
    '--mark-bg': art?.bg,
    '--liquid': art?.liquid ?? FALLBACK_LIQUID,
  } as CSSProperties

  // Scaled just enough that the frame's letterbox rows fall outside the box.
  const stillScale = art ? art.height / (art.height - art.cropTop - art.cropBottom) : 1.02
  const still = (
    <img
      src={ROTATION_URLS[0]}
      alt=""
      aria-hidden="true"
      className="size-full object-cover"
      style={{ transform: `scale(${stillScale.toFixed(4)})` }}
      decoding="async"
      draggable={false}
    />
  )

  const sheet = (
    <PaperSection
      tone="night"
      id="the-mark"
      labelledBy="brand-mark-title"
      grid={false}
      className={cn(
        // The art's background; the night sheet until it has been sampled.
        mode === 'frames' ? 'relative z-[1] bg-transparent!' : 'bg-[var(--mark-bg,var(--ph-night))]!',
        mode !== 'static' && 'flex min-h-svh flex-col justify-center',
        // One screen tall where it fits: the usual 128px padding made the pinned
        // sheet taller than 768px-high screens, so part of it never showed. The
        // bottom keeps clear of Reveal's -8% trigger margin (plus its 24px rise):
        // a pinned line sitting in that band would never be revealed.
        mode === 'frames' && 'pt-[clamp(16px,4svh,128px)]! pb-[clamp(16px,calc(8svh+8px),128px)]!',
      )}
    >
      <div className="grid grid-cols-12 items-center gap-6">
        <div ref={textRef} className="col-span-12 lg:col-span-5">
          <p className="ph-label text-white/70">Fig. 00 — The mark</p>
          <h2 id="brand-mark-title" className="ph-h2 mt-4 text-white">
            <RevealLines
              stagger={100}
              lines={[
                'One mark,',
                <span key="accent" className="ph-mark">
                  every product.
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={160}>
            <p className="ph-lead mt-6 text-white/85">
              The hexagon is our station marker. Every route we map, from idea to reality, runs through it.
            </p>
          </Reveal>

          <dl className="mt-10" aria-label="The mark, in detail">
            {specs.map((spec, index) => (
              <Reveal
                key={spec.label}
                variant="fade"
                delay={200 + index * 90}
                className="flex items-baseline justify-between gap-6 border-t border-white/20 py-4 last:border-b"
              >
                <dt className="ph-label text-white/70">{spec.label}</dt>
                <dd className="text-white">{spec.value}</dd>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={420} className="mt-8">
            <PaperLink to="/about" className="text-white">
              About Bizaffix
            </PaperLink>
          </Reveal>
        </div>

        <div className="col-span-12 flex justify-center lg:col-span-6 lg:col-start-7">
          {mode === 'frames' ? (
            // The frame canvas centres the logo over this box.
            <div ref={anchorRef} aria-hidden="true" className={LOGO_SIZE} />
          ) : (
            <div ref={stillRef} className={cn('overflow-hidden', LOGO_SIZE)}>
              {still}
            </div>
          )}
        </div>
      </div>
    </PaperSection>
  )

  if (mode === 'static') {
    return (
      <div style={colours}>
        {sheet}
        <EmptyTestSection variant="flow" />
        <MarkConcepts />
      </div>
    )
  }

  return (
    <>
    <div ref={wrapperRef} className="relative overflow-hidden bg-[var(--mark-bg,var(--ph-night))]" style={colours}>
      {mode === 'frames' ? (
        <canvas ref={framesRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 block size-full" />
      ) : null}
      {sheet}
      <canvas ref={liquidRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] block h-svh w-full" />
      <EmptyTestSection
        variant="overlay"
        ref={testRef}
        headingRef={testHeadingRef}
        textRef={testTextRef}
        className="absolute inset-x-0 bottom-0 z-[3] h-svh"
        style={{ clipPath: 'inset(100% 0 0 0)' }}
      />
    </div>
    {/* After the flood: same liquid colour, so the screen carries straight on */}
    <MarkConcepts style={colours} />
    </>
  )
}

export default BrandMark
