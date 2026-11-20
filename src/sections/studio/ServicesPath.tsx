import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router'
import { studioServices, type ServiceIconId } from '@/data/studio-home.ts'
import { SplitChars } from '@/sections/studio/kit.tsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Pt = { x: number; y: number }

const ICONS: Record<ServiceIconId, ReactNode> = {
  mobile: (
    <>
      <rect x="14" y="5" width="20" height="38" rx="5" />
      <path d="M21 9.5h6" />
      <path d="M19 19h10M19 25h7" />
      <circle cx="24" cy="36.5" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  web: (
    <>
      <rect x="5" y="9" width="38" height="30" rx="4" />
      <path d="M5 17h38" />
      <circle cx="10.5" cy="13" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1.3" fill="currentColor" stroke="none" />
      <path d="m19 24-5 4.5 5 4.5M29 24l5 4.5-5 4.5M26 22.5 22 34.5" />
    </>
  ),
  health: (
    <>
      <path d="M24 41S6 30.5 6 18.5A9.5 9.5 0 0 1 24 14a9.5 9.5 0 0 1 18 4.5C42 30.5 24 41 24 41Z" />
      <path d="M11 24h7l3-5 4 10 3-5h9" />
    </>
  ),
  cloud: (
    <>
      <path d="M14 36h21a8 8 0 0 0 .8-15.96A11 11 0 0 0 14.6 22 7 7 0 0 0 14 36Z" />
      <path d="M24 31.5v-9M20 26l4-4 4 4" />
    </>
  ),
}

/** Catmull-Rom through the points, as a cubic Bézier path. */
function smooth(points: Pt[], tension = 0.5) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1 = { x: p1.x + ((p2.x - p0.x) * tension) / 3, y: p1.y + ((p2.y - p0.y) * tension) / 3 }
    const c2 = { x: p2.x - ((p3.x - p1.x) * tension) / 3, y: p2.y - ((p3.y - p1.y) * tension) / 3 }
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

/** A loop between a and b: the line runs past the midpoint, curls round once, and carries on. */
function curl(a: Pt, b: Pt, r: number, side: 1 | -1): Pt[] {
  const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
  const d = { x: (b.x - a.x) / len, y: (b.y - a.y) / len }
  const n = { x: -d.y * side, y: d.x * side }
  const c = { x: m.x + n.x * r * 0.35, y: m.y + n.y * r * 0.35 }
  const at = (u: number, v: number) => ({ x: c.x + d.x * u * r + n.x * v * r, y: c.y + d.y * u * r + n.y * v * r })
  return [at(-0.6, -1), at(0.9, -0.4), at(0.7, 0.9), at(-0.6, 0.6), at(0.2, -1.05)]
}

/**
 * 05: services. A line draws itself down the page as you scroll, looping
 * through an icon tile in each service's name; each row lands as the line
 * reaches it. The path is measured from the tiles, so it threads them at any
 * width. A pale twin runs behind it, offset, like a second pass of the pen.
 */
export function ServicesPath() {
  const ref = useRef<HTMLElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<{ w: number; h: number; d: string; twin: string } | null>(null)

  const measure = useCallback(() => {
    const body = bodyRef.current
    if (!body) return
    const box = body.getBoundingClientRect()
    const tiles = Array.from(body.querySelectorAll<HTMLElement>('.sh-icon-tile'))
    if (!tiles.length) return
    const centers = tiles.map((tile) => {
      const t = tile.getBoundingClientRect()
      return { x: t.left - box.left + t.width / 2, y: t.top - box.top + t.height / 2 }
    })
    const w = box.width
    const h = box.height
    const r = Math.min(84, w * 0.055)
    const pts: Pt[] = [{ x: w + 80, y: Math.max(0, centers[0].y - h * 0.12) }]
    centers.forEach((c, i) => {
      pts.push(c)
      const next = centers[i + 1]
      if (next && i % 2 === 0) pts.push(...curl(c, next, r, i % 4 === 0 ? 1 : -1))
    })
    const last = centers[centers.length - 1]
    pts.push({ x: last.x - w * 0.25, y: last.y + h * 0.08 }, { x: -80, y: last.y + h * 0.12 })
    const twin = pts.map((p) => ({ x: p.x + w * 0.04, y: p.y + 70 }))
    setGeo({ w, h, d: smooth(pts), twin: smooth(twin) })
  }, [])

  useLayoutEffect(() => {
    measure()
    const body = bodyRef.current
    if (!body) return
    const ro = new ResizeObserver(() => measure())
    ro.observe(body)
    // Anton arriving late changes the word widths, and with them the tile positions.
    void document.fonts?.ready.then(() => measure())
    return () => ro.disconnect()
  }, [measure])

  useGSAP(
    () => {
      if (!geo) return
      const path = ref.current?.querySelector<SVGPathElement>('.sh-path-main')
      const pen = ref.current?.querySelector<SVGGElement>('.sh-pen-g')
      if (!path) return
      const length = path.getTotalLength()
      // The pen's track, sampled once per layout: getPointAtLength() re-walks the whole
      // curve on every call, which is too much work to do on every scroll frame.
      const SAMPLES = 400
      const track = new Float32Array((SAMPLES + 1) * 2)
      for (let i = 0; i <= SAMPLES; i++) {
        const at = path.getPointAtLength((length * i) / SAMPLES)
        track[i * 2] = at.x
        track[i * 2 + 1] = at.y
      }
      const penAt = (p: number) => {
        const f = Math.min(Math.max(p, 0), 1) * SAMPLES
        const i = Math.min(Math.floor(f), SAMPLES - 1)
        const u = f - i
        const x = track[i * 2] + (track[i * 2 + 2] - track[i * 2]) * u
        const y = track[i * 2 + 1] + (track[i * 2 + 3] - track[i * 2 + 1]) * u
        return `translate(${x.toFixed(2)} ${y.toFixed(2)})`
      }
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        const state = { p: 0 }
        let penShown: boolean | null = null
        gsap.to(state, {
          p: 1,
          ease: 'none',
          scrollTrigger: { trigger: bodyRef.current, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
          onUpdate: () => {
            path.style.strokeDashoffset = String(length * (1 - state.p))
            if (pen) {
              pen.setAttribute('transform', penAt(state.p))
              const show = state.p > 0.002 && state.p < 0.995
              if (show !== penShown) {
                penShown = show
                pen.style.opacity = show ? '1' : '0'
              }
            }
          },
        })

      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(path, { strokeDasharray: 'none', strokeDashoffset: 0 })
        if (pen) pen.style.opacity = '0'
      })
    },
    { scope: ref, dependencies: [geo], revertOnUpdate: true },
  )

  // Row and title entrances: independent of the path, so re-measuring never restarts them.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.sh-service').forEach((row, i) => {
          const tile = row.querySelector('.sh-icon-tile')
          const rest = i % 2 ? 6 : -7
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: 'top 75%', toggleActions: 'play none none reverse' } })
            .fromTo(
              row.querySelectorAll('.sh-service-word'),
              { x: (k: number) => (k === 0 ? -90 : 90), autoAlpha: 0 },
              { x: 0, autoAlpha: 1, duration: 1, ease: 'expo.out' },
              0,
            )
            .fromTo(tile, { scale: 0, rotation: rest - 70 }, { scale: 1, rotation: rest, duration: 0.9, ease: 'back.out(2)' }, 0.05)
            .fromTo(
              row.querySelector('.sh-service-note'),
              { autoAlpha: 0, y: 24, rotation: (i % 2 ? 2.5 : -3) + 6 },
              { autoAlpha: 1, y: 0, rotation: i % 2 ? 2.5 : -3, duration: 0.9, ease: 'expo.out' },
              0.2,
            )
        })
        gsap.from('.sh-services-title .sh-char', { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.025, scrollTrigger: { trigger: ref.current, start: 'top 70%' } })
        gsap.from('.sh-services-lead > *', { autoAlpha: 0, y: 16, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: ref.current, start: 'top 62%' } })
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} aria-labelledby="services-title" className="sh-services pt-[clamp(96px,16vh,200px)] pb-[clamp(120px,20vh,240px)]">
      <div className="sh-wrap grid gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="sh-label mb-5 text-[var(--sh-ink-soft)]">{studioServices.label}</p>
          <h2 id="services-title" className="sh-services-title sh-display sh-fit-title">
            <span className="sr-only">{studioServices.titleLines.join(' ')}</span>
            {studioServices.titleLines.map((line) => (
              <span key={line} className="block overflow-hidden pt-[0.04em]">
                <SplitChars text={line} />
              </span>
            ))}
          </h2>
        </div>
        <div className="sh-services-lead flex flex-col items-start justify-end gap-6 md:col-span-4 md:pb-3">
          <p className="sh-body max-w-[34ch] text-[var(--sh-ink-soft)]">{studioServices.lead}</p>
          <Link to={studioServices.link.href} className="sh-text-link text-[1.0625rem]">
            {studioServices.link.label}
          </Link>
        </div>
      </div>

      <div ref={bodyRef} className="relative mt-[clamp(80px,14vh,180px)]">
        {geo ? (
          <svg className="sh-services-path" viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
            <path d={geo.twin} fill="none" stroke="#B3C5FA" strokeOpacity="0.55" strokeWidth="18" strokeLinecap="round" />
            <path className="sh-path-main" d={geo.d} fill="none" stroke="#234ED1" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
            <g className="sh-pen-g" style={{ opacity: 0 }}>
              <circle className="sh-pen" r="15" />
              <circle r="5" fill="#FFFFFF" />
            </g>
          </svg>
        ) : null}

        <ul className="sh-wrap relative grid gap-[clamp(110px,24vh,260px)]">
          {studioServices.items.map((item, i) => (
            <li
              key={item.id}
              className="sh-service"
              data-side={item.side}
              style={{ alignItems: item.side === 'right' ? 'flex-end' : 'flex-start' } as CSSProperties}
            >
              <h3>
                <Link to={item.href} className="sh-service-name sh-display text-[var(--sh-blue)] no-underline hover:text-[var(--sh-blue-deep)]">
                  <span className="sr-only">{item.words.join(' ')}</span>
                  <span className="sh-service-word" aria-hidden="true">{item.words[0]}</span>
                  <span className="sh-icon-tile" aria-hidden="true" style={{ '--r': `${i % 2 ? 6 : -7}deg` } as CSSProperties}>
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      {ICONS[item.id]}
                    </svg>
                  </span>
                  <span className="sh-service-word" aria-hidden="true">{item.words[1]}</span>
                </Link>
              </h3>
              <p
                className="sh-service-note"
                style={{ '--r': `${i % 2 ? 2.5 : -3}deg`, marginInline: item.side === 'right' ? '0 4%' : '6% 0' } as CSSProperties}
              >
                {item.note}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ServicesPath
