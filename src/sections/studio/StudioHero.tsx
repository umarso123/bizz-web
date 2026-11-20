import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { studioHero } from '@/data/studio-home.ts'
import { MELT_URLS, sampleArt, type Art } from '@/sections/home/brand-melt/frames.ts'
import { PillButton, SplitChars, Sticker } from '@/sections/studio/kit.tsx'
import { useMarkPlayer, type MarkInputs } from '@/sections/studio/useMarkPlayer.ts'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** The mark's resting size against a cover fit, by viewport shape. Grows to 1 as the headline parts. */
const aspect = () => window.innerWidth / window.innerHeight
const restZoom = () => (aspect() > 1.2 ? 0.74 : aspect() > 0.8 ? 0.8 : 0.55)
/** How far it grows while the headline parts: to a cover fit on wide screens, less on tall ones. */
const peakZoom = () => (aspect() > 1.2 ? 1 : aspect() > 0.8 ? 0.95 : 0.78)

/** Two cyan loops that frame the stage, like ribbons left on the table. */
function Loops() {
  return (
    <svg className="sh-hero-loops" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path
        className="sh-loop"
        d="M -90 150 C 130 200, 236 360, 210 510 C 186 650, 52 690, 14 612 C -22 536, 56 448, 156 486 C 252 524, 214 716, -90 880"
        fill="none"
        stroke="#009BDF"
        strokeWidth="30"
        strokeLinecap="round"
      />
      <path
        className="sh-loop"
        d="M 1530 330 C 1420 200, 1236 236, 1196 404 C 1158 566, 1284 700, 1438 664 C 1566 634, 1590 470, 1494 424 C 1406 382, 1330 474, 1380 572 C 1420 650, 1470 760, 1420 940"
        fill="none"
        stroke="#009BDF"
        strokeWidth="30"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * 01: the hero, a pinned scene in five frames.
 *  1. load: the loops draw on, the mark settles in, the headline rises letter
 *     by letter and the stickers slap on;
 *  2. scroll: the headline parts (top line left, bottom line right), stickers fly
 *     off, and the mark grows into the space and turns to face front;
 *  3. it melts into a pool (scrubbed: scrolling back up un-melts it);
 *  4. a caption rises out of the melt;
 *  5. the cream sheet arches up over everything and becomes the next section.
 * Drag the mark to spin it (or use the arrow keys); it leans toward the pointer.
 */
export function StudioHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const artRef = useRef<Art | null>(null)
  const inputsRef = useRef<MarkInputs>({ melt: 0, zoom: restZoom() })
  const [bg, setBg] = useState<string | null>(null)

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

  const playerRef = useMarkPlayer(canvasRef, artRef, inputsRef)

  useGSAP(
    () => {
      gsap.set(tiltRef.current, { transformPerspective: 1400 })
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const delay = document.getElementById('initial-loader') ? 0.75 : 0.1
        const loops = gsap.utils.toArray<SVGPathElement>('.sh-loop')
        loops.forEach((path) => {
          const length = path.getTotalLength()
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        })

        // Frame 1: the entrance.
        gsap
          .timeline({ delay, defaults: { ease: 'expo.out' } })
          .to(loops, { strokeDashoffset: 0, duration: 2.4, ease: 'power3.inOut', stagger: 0.2 }, 0)
          .from(tiltRef.current, { scale: 0.62, autoAlpha: 0, duration: 1.8 }, 0.1)
          .from('.sh-hero-line[data-line="0"] .sh-char', { yPercent: 105, duration: 1.15, stagger: 0.035 }, 0.25)
          .from('.sh-hero-line[data-line="1"] .sh-char', { yPercent: 105, duration: 1.15, stagger: 0.035 }, 0.4)
          .from(
            '.sh-hero-sticker .sh-sticker',
            { scale: 0, rotation: (i: number) => [-40, 34, -28][i % 3], duration: 0.9, ease: 'back.out(2.2)', stagger: 0.14 },
            0.95,
          )
          .from('.sh-hero-foot > *', { autoAlpha: 0, y: 18, duration: 1, stagger: 0.08 }, 1.05)

        // The sheet waits below the stage (CSS hides it without JS; GSAP owns it from here).
        const sheet = sectionRef.current?.querySelector<HTMLElement>('.sh-hero-sheet')
        const rise = { y: 101, arch: 22 }
        const drawSheet = () => {
          if (!sheet) return
          sheet.style.transform = `translate3d(0, ${rise.y.toFixed(3)}%, 0)`
          sheet.style.borderTopLeftRadius = sheet.style.borderTopRightRadius = `50% ${rise.arch.toFixed(3)}vw`
        }
        drawSheet()
        if (sheet) sheet.style.visibility = 'visible'

        // Frames 2–5: the pinned scroll.
        const zoomProxy = { zoom: restZoom(), melt: 0 }
        const vw = () => window.innerWidth
        const vh = () => window.innerHeight
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stageRef.current,
            start: 'top top',
            end: '+=240%',
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        tl.to('.sh-hero-line[data-line="0"]', { x: () => -vw() * 0.22, y: () => -vh() * 0.08, autoAlpha: 0, duration: 0.24, ease: 'power2.in' }, 0)
          .to('.sh-hero-line[data-line="1"]', { x: () => vw() * 0.22, y: () => vh() * 0.08, autoAlpha: 0, duration: 0.24, ease: 'power2.in' }, 0)
          .to(
            '.sh-hero-sticker',
            {
              x: (i: number) => [-0.5, 0.45, 0.4][i % 3] * vw(),
              y: (i: number) => [-0.25, -0.4, 0.35][i % 3] * vh(),
              rotation: (i: number) => [-50, 40, 60][i % 3],
              autoAlpha: 0,
              duration: 0.22,
              ease: 'power2.in',
            },
            0,
          )
          .to('.sh-hero-foot', { autoAlpha: 0, y: 30, duration: 0.12 }, 0)
          .to('.sh-hero-loops', { scale: 1.25, autoAlpha: 0, duration: 0.3, transformOrigin: '50% 50%' }, 0)
          .fromTo(
            zoomProxy,
            { zoom: () => restZoom() },
            { zoom: () => peakZoom(), duration: 0.26, ease: 'power2.inOut', onUpdate: () => void (inputsRef.current.zoom = zoomProxy.zoom) },
            0.02,
          )
          .to(zoomProxy, { melt: 1, duration: 0.48, onUpdate: () => void (inputsRef.current.melt = zoomProxy.melt) }, 0.18)
          // Frame 4: the caption rises out of the melt.
          .from('.sh-hero-caption .sh-char', { yPercent: 110, duration: 0.12, stagger: 0.005, ease: 'power3.out' }, 0.38)
          .from('.sh-hero-caption .sh-sticker', { scale: 0, rotation: -30, duration: 0.07, ease: 'back.out(2)' }, 0.5)
          // Frame 5: the next sheet arches up and flattens.
          .to('.sh-hero-caption', { yPercent: -40, autoAlpha: 0, duration: 0.12, ease: 'power2.in' }, 0.62)
          .to(rise, { y: 0, duration: 0.2, ease: 'power2.inOut', onUpdate: drawSheet }, 0.62)
          .to(rise, { arch: 0, duration: 0.12, ease: 'power1.out', onUpdate: drawSheet }, 0.72)
          // The ribbon (pulled up over the pin's end) slides in as the sheet settles.
          .to({}, { duration: 0.16 }, 0.84)

        return () => {
          if (sheet) sheet.style.cssText = ''
          inputsRef.current.melt = 0
          inputsRef.current.zoom = restZoom()
        }
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        inputsRef.current.zoom = restZoom()
        gsap.set('.sh-hero-caption', { autoAlpha: 0 })
      })
    },
    { scope: sectionRef },
  )

  // Depth: the mark leans toward the pointer, stickers drift with it, the headline against it.
  // quickTo setters are built once and reused: a pointermove never allocates a new tween.
  const leanTo = useRef<null | ((x: number, y: number) => void)>(null)
  const { contextSafe: leanSafe } = useGSAP(
    () => {
      if (!tiltRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const q = (target: gsap.TweenTarget, prop: string, duration: number) => gsap.quickTo(target, prop, { duration, ease: 'power3.out' })
      const tiltY = q(tiltRef.current, 'rotationY', 0.9)
      const tiltX = q(tiltRef.current, 'rotationX', 0.9)
      const ax = q('.sh-hero-depth-a', 'x', 1.1)
      const ay = q('.sh-hero-depth-a', 'y', 1.1)
      const bx = q('.sh-hero-depth-b', 'x', 1.2)
      const by = q('.sh-hero-depth-b', 'y', 1.2)
      leanTo.current = (x, y) => {
        tiltY(x * 7)
        tiltX(-y * 5)
        ax(x * 26)
        ay(y * 18)
        bx(-x * 14)
        by(-y * 8)
      }
      return () => {
        leanTo.current = null
      }
    },
    { scope: sectionRef },
  )
  const lean = leanSafe((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || !leanTo.current) return
    const box = event.currentTarget.getBoundingClientRect()
    leanTo.current((event.clientX - box.left) / box.width - 0.5, (event.clientY - box.top) / box.height - 0.5)
  })
  const settle = leanSafe(() => leanTo.current?.(0, 0))

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') playerRef.current.nudge(8)
    else if (event.key === 'ArrowLeft') playerRef.current.nudge(-8)
    else return
    event.preventDefault()
  }

  const stageBg = { backgroundColor: bg ?? 'var(--sh-hero)' } as CSSProperties

  return (
    <section
      ref={sectionRef}
      onPointerMove={lean}
      onPointerLeave={settle}
      aria-labelledby="hero-title"
      className="sh-hero -mt-(--header-clearance)"
      style={stageBg}
    >
      <div ref={stageRef} className="sh-hero-stage" style={stageBg}>
        <Loops />

        <div className="sh-hero-canvas-wrap">
          <div
            ref={tiltRef}
            className="sh-hero-tilt"
            role="img"
            tabIndex={0}
            onKeyDown={onKey}
            aria-label={`The Bizaffix mark, spinning. ${studioHero.dragHint}, or use the arrow keys.`}
          >
            <canvas ref={canvasRef} className="sh-hero-canvas" />
          </div>
        </div>

        <h1 id="hero-title" className="sh-hero-title sh-display">
          <span className="sr-only">{studioHero.title}</span>
          {studioHero.lines.map((line, i) => (
            <span key={line} className="sh-hero-depth-b block">
              <span className="sh-hero-line" data-line={i}>
                <SplitChars text={line} mask />
              </span>
            </span>
          ))}
        </h1>

        <div aria-hidden="true" className="sh-hero-depth-a pointer-events-none absolute inset-0 z-3">
          {studioHero.stickers.map((sticker) => (
            <div key={sticker.text} className="sh-hero-sticker absolute" style={sticker.at}>
              <Sticker sticker={{ ...sticker, at: {} }} className="relative" />
            </div>
          ))}
        </div>

        <div className="sh-hero-caption">
          <p className="sh-display relative inline-block text-[clamp(3.5rem,10vw,10rem)] text-white">
            {studioHero.caption.title.map((line) => (
              <span key={line} className="block overflow-hidden pt-[0.04em]">
                <SplitChars text={line} />
              </span>
            ))}
            <span className="sh-sticker" data-tone="yellow" style={{ right: '-6%', bottom: '-6%', '--r': '-6deg' } as CSSProperties}>
              {studioHero.caption.sticker}
            </span>
          </p>
        </div>

        <div className="sh-hero-foot sh-wrap">
          <p className="sh-body max-w-[30ch] text-white/90 max-md:hidden">{studioHero.lead}</p>
          <p className="sh-hero-cue sh-label max-md:hidden" aria-hidden="true">
            {studioHero.scrollCue}
            <span className="sh-hero-cue-line" />
          </p>
          <div className="flex justify-end max-md:col-span-3 max-md:row-start-1 max-md:justify-center">
            <PillButton tone="light">{studioHero.cta}</PillButton>
          </div>
        </div>

        <div aria-hidden="true" className="sh-hero-sheet" />
      </div>
    </section>
  )
}

export default StudioHero
