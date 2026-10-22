import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { PaperPin } from '@/components/paper/paper.tsx'
import { paperInk } from '@/lib/paper-theme.ts'
import { XS, easeInOut, mixHex, polyD } from '@/lib/tear.ts'
import { makeSeam, seamFlap, seamPoints } from '@/lib/tear-layout.ts'
import { CaseHighlight } from '@/sections/home/CaseHighlight.tsx'
import { WhoWeWorkWith } from '@/sections/home/WhoWeWorkWith.tsx'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
/** Progress through [a, b] of a 0..1 value. */
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))

/** Phases of the pinned scroll, 0..1. */
const HOLD = 0.1
const CRACK_END = 0.36
const SPLIT_END = 0.9
const CONTENT_IN = [0.62, 0.82] as const

const SEED = 23
/** Lifts the halves off the stage once they split; set from draw(), never while the sheet is whole. */
const HALF_SHADOW = 'drop-shadow(0 10px 18px rgb(10 26 58 / 0.38))'

/**
 * The homepage's signature moment, used once: WhoWeWorkWith (cream) pins, a
 * jagged crack opens in the middle and runs to both edges, and the sheet splits
 * into two halves that swing apart on their corner pins while CaseHighlight
 * (blue) rises up through the gap.
 *
 * A sticky stage tracks scroll position directly (one rAF per frame, only while
 * the stage is near the screen). Falls back to the two sections one after the
 * other with reduced motion, or when either section is taller than the screen.
 */
export function CenterTearReveal() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [active, setActive] = useState(0)
  const [mode, setMode] = useState<'measure' | 'tear' | 'static'>('measure')
  const [narrow, setNarrow] = useState(false)
  /** The stage grows to fit CaseHighlight when it is taller than the screen (phones, tablets). */
  const [stageHeight, setStageHeight] = useState(0)

  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const leftClipRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const rightClipRef = useRef<HTMLDivElement>(null)
  const shadeRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const crackRef = useRef<SVGPathElement>(null)
  const rimLeftRef = useRef<SVGPathElement>(null)
  const rimRightRef = useRef<SVGPathElement>(null)
  const flapLeftRefs = useRef<(SVGPathElement | null)[]>([])
  const flapRightRefs = useRef<(SVGPathElement | null)[]>([])
  const svgRefs = useRef<(SVGSVGElement | null)[]>([])

  const seam = useMemo(() => makeSeam(SEED), [])
  const rim = mixHex(paperInk.cream, '#ffffff', 0.6)
  const flapBase = mixHex(paperInk.cream, '#ffffff', 0.35)

  // Choose the mode: the tear needs motion allowed and both sections to fit one screen.
  useEffect(() => {
    const decide = () => {
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const vh = window.innerHeight
      const top = topRef.current?.querySelector('section')
      const bottom = bottomRef.current?.querySelector('section')
      if (!top || !bottom) return
      // In tear mode the sections stretch to the stage; measure their content instead.
      // A section's content height, whatever the stage stretches the section to.
      const need = (el: Element) => (el.querySelector('.ph-container') as HTMLElement | null)?.offsetHeight ?? Infinity
      // WhoWeWorkWith must be readable on one screen before it tears; CaseHighlight may be taller,
      // since the stage scrolls on once the halves are away.
      const fits = need(top) <= vh
      setStageHeight(Math.max(vh, Math.ceil(need(bottom))))
      setNarrow(window.innerWidth < 768)
      setMode(still || !fits ? 'static' : 'tear')
    }
    decide()
    // Web fonts change line breaks, so measure again once they are in.
    void document.fonts.ready.then(decide)
    let timer = 0
    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(decide, 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(timer)
    }
  }, [mode])

  // The scrubbed animation.
  useEffect(() => {
    if (mode !== 'tear') return
    const wrap = wrapRef.current
    const stage = stageRef.current
    if (!wrap || !stage) return
    let W = 0
    let H = 0
    let raf = 0
    let last = -1
    let near = false
    const swing = narrow ? 2 : 4
    const flapEvery = narrow ? 2 : 1

    // Write only what changed. Rewriting an identical clip-path, rim or flap still
    // repaints the full-screen half (and its drop shadow), which is what made the
    // scroll stutter: after the first moments of the split only the transform moves,
    // and a transform alone stays on the compositor.
    const seen = new WeakMap<Element, Map<string, string>>()
    const changed = (el: Element, key: string, value: string) => {
      let m = seen.get(el)
      if (!m) seen.set(el, (m = new Map()))
      if (m.get(key) === value) return false
      m.set(key, value)
      return true
    }
    const attr = (el: Element | null | undefined, name: string, value: string) => {
      if (el && changed(el, name, value)) el.setAttribute(name, value)
    }
    const css = (el: HTMLElement | null | undefined, name: string, value: string) => {
      if (el && changed(el, name, value)) el.style.setProperty(name, value)
    }
    // Seam geometry depends only on the stage size, so build it once per resize.
    let clipLeft = ''
    let clipRight = ''
    let rimLeft = ''
    let rimRight = ''

    const clipFor = (side: 'left' | 'right', overlap: number) => {
      const pts = seamPoints(seam, W, H, side === 'left' ? overlap : -overlap)
      const edge = pts.map(([x, y]) => `${x}px ${y}px`).join(',')
      return side === 'left'
        ? `polygon(-40px -40px, ${edge}, -40px ${H + 40}px)`
        : `polygon(${W + 40}px -40px, ${edge}, ${W + 40}px ${H + 40}px)`
    }

    const draw = (p: number) => {
      if (!W || !H) return
      const crack = seg(p, HOLD, CRACK_END)
      const split = easeInOut(seg(p, CRACK_END, SPLIT_END))
      const splitting = split > 0

      // 1. The crack: a jagged opening that starts in the middle and runs to both edges.
      if (crack <= 0 || splitting) {
        attr(crackRef.current, 'd', '')
      } else {
        const reach = 0.04 + crack * 0.52
        const gap = 1.5 + crack * 3.5
        const rows = XS.map((y, i) => ({ y, i })).filter(({ y }) => Math.abs(y - 0.5) <= reach)
        const leftEdge = rows.map(({ y, i }) => [seam.xs[i] * W - gap / 2, y * H])
        const rightEdge = rows.map(({ y, i }) => [seam.xs[i] * W + gap / 2, y * H]).reverse()
        attr(crackRef.current, 'd', polyD([...leftEdge, ...rightEdge]))
      }

      // 2. The halves: one real sheet until the split, then two clipped halves swinging apart.
      const left = leftRef.current
      const right = rightRef.current
      if (left && right) {
        // Before the split the right half shows only its corner pin, holding the whole sheet.
        css(leftClipRef.current, 'clip-path', splitting ? clipLeft : 'none')
        css(rightClipRef.current, 'clip-path', splitting ? clipRight : 'inset(0 0 0 100%)')
        // The shadow only matters once the halves lift away; before that it is a full-screen filter for nothing.
        const shadow = splitting ? HALF_SHADOW : 'none'
        css(left, 'filter', shadow)
        css(right, 'filter', shadow)
        // Rotating about a top corner swings the far bottom corner back in, so travel a little past 55vw,
        // and drop the halves once they are fully away.
        const gone = split >= 0.999 ? 'hidden' : 'visible'
        css(left, 'visibility', gone)
        css(right, 'visibility', gone)
        const s = split.toFixed(4)
        css(left, 'transform', `translate3d(calc(${s} * (-55vw - 90px)), calc(${s} * 2vh), 0) rotate(calc(${s} * ${-swing}deg))`)
        css(right, 'transform', `translate3d(calc(${s} * (55vw + 90px)), calc(${s} * 2vh), 0) rotate(calc(${s} * ${swing}deg))`)
        css(left, '--tilt', `${(-10 * split).toFixed(2)}deg`)
        css(right, '--tilt', `${(10 * split).toFixed(2)}deg`)
      }

      // Fibre rim and curled flaps along each torn edge, once it has split.
      attr(rimLeftRef.current, 'd', splitting ? rimLeft : '')
      attr(rimRightRef.current, 'd', splitting ? rimRight : '')
      // Quantised so the flaps settle (and stop repainting) as soon as they are open.
      const open = Math.round(clamp01(split * 3) * 200) / 200
      seam.flaps.forEach((f, k) => {
        const show = splitting && k % flapEvery === 0 && open > 0.01
        attr(flapLeftRefs.current[k], 'd', show && k % 2 === 0 ? polyD(seamFlap(seam, f, W, H, open, 1)) : '')
        attr(flapRightRefs.current[k], 'd', show && k % 2 === 1 ? polyD(seamFlap(seam, f, W, H, open, -1)) : '')
      })

      // 3. Underneath, CaseHighlight rises through the gap; its text arrives once the gap is wide.
      const rise = easeInOut(seg(p, CRACK_END, 1))
      css(bottomRef.current, 'transform', `translate3d(0, ${(18 * (1 - rise)).toFixed(3)}%, 0) scale(${(0.94 + 0.06 * rise).toFixed(4)})`)
      css(shadeRef.current, 'opacity', (0.45 * (1 - rise)).toFixed(3))
      const k = easeInOut(seg(p, CONTENT_IN[0], CONTENT_IN[1]))
      css(contentRef.current, 'opacity', k.toFixed(3))
      css(contentRef.current, 'transform', `translate3d(0, ${(24 * (1 - k)).toFixed(2)}px, 0)`)
    }

    const progress = () => {
      const box = wrap.getBoundingClientRect()
      const run = box.height - stage.offsetHeight
      return run > 0 ? clamp01(-box.top / run) : 0
    }
    const frame = () => {
      raf = 0
      const p = progress()
      if (Math.abs(p - last) < 0.0005) return
      last = p
      draw(p)
    }
    const request = () => {
      if (near && !raf) raf = requestAnimationFrame(frame)
    }

    const ro = new ResizeObserver(() => {
      W = stage.clientWidth
      H = stage.clientHeight
      clipLeft = clipFor('left', 0.6)
      clipRight = clipFor('right', 0.6)
      const pts = seamPoints(seam, W, H)
      const rimFor = (side: 1 | -1) =>
        polyD([...pts, ...pts.map(([x, y], i) => [x - side * seam.rim[i] * 1.2, y]).reverse()])
      rimLeft = rimFor(1)
      rimRight = rimFor(-1)
      for (const svg of svgRefs.current) {
        if (!svg) continue
        svg.setAttribute('width', String(W))
        svg.setAttribute('height', String(H))
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      }
      last = -1
      draw(progress())
    })
    ro.observe(stage)
    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting
        request()
      },
      { rootMargin: '20% 0px 20% 0px' },
    )
    io.observe(wrap)
    window.addEventListener('scroll', request, { passive: true })

    return () => {
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('scroll', request)
      cancelAnimationFrame(raf)
    }
  }, [mode, narrow, seam])

  if (mode === 'static') {
    return (
      <>
        <div ref={topRef}>
          <WhoWeWorkWith />
        </div>
        <div ref={bottomRef}>
          <CaseHighlight />
        </div>
      </>
    )
  }

  // Flaps are the back of the cream sheet: shaded toward navy at the root, white at the tip.
  const flapFill = (
    <linearGradient id={`${uid}fl`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={mixHex(flapBase, paperInk.shadow, 0.3)} />
      <stop offset=".55" stopColor={mixHex(flapBase, paperInk.shadow, 0.06)} />
      <stop offset="1" stopColor="#ffffff" />
    </linearGradient>
  )
  const svgClass = 'pointer-events-none absolute inset-0 block max-w-none overflow-visible'

  return (
    <div ref={wrapRef} data-center-tear="" className="relative" style={{ height: `calc(max(100svh, ${stageHeight}px) + ${narrow ? 120 : 175}vh)` }}>
      <div ref={stageRef} className="sticky top-0 overflow-hidden bg-[var(--ph-blue)]" style={{ height: `max(100svh, ${stageHeight}px)` }}>
        {/* Underneath: CaseHighlight, rising through the gap */}
        <div ref={bottomRef} className="absolute inset-0 origin-bottom will-change-transform">
          <CaseHighlight className="h-full" contentRef={contentRef} />
        </div>

        {/* Darkness over everything under the sheet, including the stage above CaseHighlight while it rises */}
        <div ref={shadeRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#0A1A3A]" />

        {/* Left half: the real section (interactive), clipped once it splits */}
        <div ref={leftRef} className="absolute inset-0 origin-[0_0] will-change-transform">
          <div ref={leftClipRef} className="absolute inset-0">
            <div ref={topRef} className="h-full">
              <WhoWeWorkWith className="h-full" active={active} onActive={setActive} />
            </div>
          </div>
          <svg
            ref={(el) => {
              svgRefs.current[0] = el
            }}
            aria-hidden="true"
            className={svgClass}
          >
            <defs>{flapFill}</defs>
            <path ref={rimLeftRef} fill={rim} />
            <g style={{ filter: 'drop-shadow(-2px 4px 4px rgb(10 26 58 / 0.26))' }}>
              {seam.flaps.map((_, k) => (
                <path
                  key={k}
                  ref={(el) => {
                    flapLeftRefs.current[k] = el
                  }}
                  fill={`url(#${uid}fl)`}
                />
              ))}
            </g>
          </svg>
          <PaperPin className="top-[calc(var(--header-clearance)+30px)] left-[max(28px,3vw)] z-10" />
        </div>

        {/* Right half: a visual copy, shown once the sheet splits */}
        <div ref={rightRef} aria-hidden="true" className="pointer-events-none absolute inset-0 origin-[100%_0] will-change-transform">
          <div ref={rightClipRef} className="absolute inset-0">
            <WhoWeWorkWith className="h-full" active={active} decorative />
          </div>
          <svg
            ref={(el) => {
              svgRefs.current[1] = el
            }}
            className={svgClass}
          >
            <defs>
              <linearGradient id={`${uid}fr`} x1="1" y1="0" x2="0" y2="0">
                <stop offset="0" stopColor={mixHex(flapBase, paperInk.shadow, 0.3)} />
                <stop offset=".55" stopColor={mixHex(flapBase, paperInk.shadow, 0.06)} />
                <stop offset="1" stopColor="#ffffff" />
              </linearGradient>
            </defs>
            <path ref={rimRightRef} fill={rim} />
            <g style={{ filter: 'drop-shadow(2px 4px 4px rgb(10 26 58 / 0.26))' }}>
              {seam.flaps.map((_, k) => (
                <path
                  key={k}
                  ref={(el) => {
                    flapRightRefs.current[k] = el
                  }}
                  fill={`url(#${uid}fr)`}
                />
              ))}
            </g>
          </svg>
          <PaperPin className="top-[calc(var(--header-clearance)+30px)] left-[calc(100%-max(28px,3vw))] z-10" />
        </div>

        {/* The crack before the split: brand blue showing through, edged with white fibre */}
        <svg
          ref={(el) => {
            svgRefs.current[2] = el
          }}
          aria-hidden="true"
          className={svgClass}
        >
          <path ref={crackRef} fill={paperInk.blue} stroke={rim} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
