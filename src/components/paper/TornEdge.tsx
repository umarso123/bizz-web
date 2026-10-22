import { useEffect, useId, useMemo, useRef } from 'react'
import { PaperPin } from '@/components/paper/paper.tsx'
import { grainTile } from '@/lib/paper.ts'
import { paperInk } from '@/lib/paper-theme.ts'
import { FLAPS, START, XS, flapOpen, flapPoly, introYs, makeTear, mixHex, polyD, sheetD, type Flap } from '@/lib/tear.ts'
import { rimD, shiftTear, underD } from '@/lib/tear-layout.ts'

const PIN_X = { left: 0.26, center: 0.5, right: 0.74 } as const

type TornEdgeProps = {
  /** A different seed for every tear on the page. */
  seed: number
  pin?: keyof typeof PIN_X
  /** The paper revealed underneath (the next section's colour). */
  under: string
  /** Pin colour; brand blue unless this is the screen's one yellow pin. */
  pinColor?: string
  className?: string
  /** Band height (any CSS length). */
  height?: string
  /**
   * Pull the band up into the bottom of the section above. Above the ridge the band
   * draws nothing, and the ridge never climbs above 39% of the band, so 35% is safe.
   */
  overlap?: boolean
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * The bottom of a sheet, torn by scrolling. Place it as the last child of the
 * section being torn: above the ridge it draws nothing, so the section's own
 * surface carries on. As the band moves up the screen the sheet rips from the pin
 * outwards and reveals `under`: the footer's ridge, fibre rim, curled flaps and
 * navy shadow. Reduced motion shows the finished tear.
 */
export function TornEdge({ seed, pin = 'center', under, pinColor = paperInk.blue, className, height = 'clamp(140px, 16vw, 240px)', overlap = true }: TornEdgeProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const underRef = useRef<SVGPathElement>(null)
  const shadowRef = useRef<SVGPathElement>(null)
  const rimRef = useRef<SVGPathElement>(null)
  const flapRefs = useRef<(SVGPathElement | null)[]>([])
  const gradRefs = useRef<(SVGLinearGradientElement | null)[]>([])

  const tear = useMemo(() => shiftTear(makeTear(seed), PIN_X[pin]), [seed, pin])
  // The pin holds the paper under the sheet, a little below where the ridge settles.
  const pinIndex = useMemo(() => XS.findIndex((x) => x >= PIN_X[pin]), [pin])
  const pinTop = Math.min(0.92, tear.ys[Math.max(0, pinIndex)] + 0.2)

  const flapBase = mixHex(under, '#ffffff', 0.35)
  const rim = mixHex(flapBase, '#ffffff', 0.6)

  useEffect(() => {
    const root = rootRef.current
    const svg = svgRef.current
    if (!root || !svg) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0
    let H = 0
    let last = -1
    let raf = 0
    let near = false

    const draw = (p: number) => {
      if (!W || !H) return
      const ys = p >= 1 ? tear.ys : p <= 0 ? tear.ys.map(() => START) : introYs(tear, p)
      underRef.current?.setAttribute('d', underD(ys, W, H))
      shadowRef.current?.setAttribute('d', sheetD(ys, W, H))
      rimRef.current?.setAttribute('d', rimD(ys, W, H, tear.rim))
      // Narrow screens: fewer, smaller flaps.
      const narrow = W < 640
      tear.flaps.forEach((f: Flap, k) => {
        const el = flapRefs.current[k]
        const g = gradRefs.current[k]
        if (!el || !g) return
        const open = (p >= 1 ? 1 : flapOpen(tear, f, p)) * (narrow ? 0.6 : 1)
        if ((narrow && k % 2 === 1) || open < 0.01) return el.setAttribute('d', '')
        const pts = flapPoly(ys, f, W, H, open)
        el.setAttribute('d', polyD(pts))
        const b = Math.min(ys.length - 1, f.at + f.span)
        const tip = pts[f.span + 3]
        g.setAttribute('x1', String(((XS[f.at] + XS[b]) / 2) * W))
        g.setAttribute('y1', String(((ys[f.at] + ys[b]) / 2) * H))
        g.setAttribute('x2', String(tip[0]))
        g.setAttribute('y2', String(tip[1]))
      })
    }

    // 0 when the band's top meets the bottom of the screen, 1 when it reaches a quarter of the way down.
    const progress = () => {
      if (still) return 1
      const top = root.getBoundingClientRect().top
      const vh = window.innerHeight
      return clamp01((vh - top) / (vh * 0.75))
    }

    const frame = () => {
      raf = 0
      const p = progress()
      if (Math.abs(p - last) < 0.001) return
      last = p
      draw(p)
    }
    const request = () => {
      if (near && !raf) raf = requestAnimationFrame(frame)
    }

    const ro = new ResizeObserver(() => {
      W = root.clientWidth
      H = root.clientHeight
      svg.setAttribute('width', String(W))
      svg.setAttribute('height', String(H))
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      last = -1
      draw(progress())
    })
    ro.observe(root)

    // Listen to scroll only while the band is near the screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting
        request()
      },
      { rootMargin: '25% 0px 25% 0px' },
    )
    io.observe(root)
    if (!still) window.addEventListener('scroll', request, { passive: true })

    return () => {
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('scroll', request)
      cancelAnimationFrame(raf)
    }
  }, [tear])

  const grain = useMemo(() => (typeof document === 'undefined' ? '' : grainTile()), [])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={className}
      style={{ position: 'relative', height, marginTop: overlap ? `calc(${height} * -0.35)` : undefined, pointerEvents: 'none', overflowX: 'clip' }}
    >
      <svg ref={svgRef} className="absolute inset-0 block max-w-none overflow-visible">
        <defs>
          {grain ? (
            <pattern id={`${uid}g`} width="160" height="160" patternUnits="userSpaceOnUse">
              <image href={grain} width="160" height="160" />
            </pattern>
          ) : null}
          {/* The sheet's shadow on the paper below: the sheet's shape, blurred and dropped 3px */}
          <filter id={`${uid}d`} x="-5%" y="-5%" width="110%" height="130%">
            <feGaussianBlur stdDeviation="3.5" />
            <feOffset dy="3" />
          </filter>
          <filter id={`${uid}f`} x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="-2" dy="4" stdDeviation="4" floodColor={paperInk.shadow} floodOpacity=".26" />
          </filter>
          {Array.from({ length: FLAPS }, (_, k) => (
            <linearGradient
              key={k}
              id={`${uid}fg${k}`}
              ref={(el) => {
                gradRefs.current[k] = el
              }}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor={mixHex(flapBase, paperInk.shadow, 0.34)} />
              <stop offset=".5" stopColor={mixHex(flapBase, paperInk.shadow, 0.08)} />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
          ))}
          <path id={`${uid}u`} ref={underRef} />
          <clipPath id={`${uid}c`}>
            <use href={`#${uid}u`} />
          </clipPath>
        </defs>
        {/* Above the ridge nothing is drawn: the section's own sheet shows through, grid and grain included. */}
        <use href={`#${uid}u`} fill={under} />
        {grain ? <use href={`#${uid}u`} fill={`url(#${uid}g)`} opacity=".3" /> : null}
        <g clipPath={`url(#${uid}c)`}>
          <path ref={shadowRef} fill={paperInk.shadow} opacity=".3" filter={`url(#${uid}d)`} />
        </g>
        <path ref={rimRef} fill={rim} />
        <g filter={`url(#${uid}f)`}>
          {Array.from({ length: FLAPS }, (_, k) => (
            <path
              key={k}
              ref={(el) => {
                flapRefs.current[k] = el
              }}
              fill={`url(#${uid}fg${k})`}
            />
          ))}
        </g>
      </svg>
      <PaperPin
        color={pinColor}
        className="z-10 h-[clamp(64px,7vw,108px)] w-[clamp(32px,3.5vw,54px)]"
        style={{ left: `${PIN_X[pin] * 100}%`, top: `${pinTop * 100}%` }}
      />
    </div>
  )
}
