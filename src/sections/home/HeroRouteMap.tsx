import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { HEX_POINTS } from '@/components/ui/HexMark.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { healthcareSolutions } from '@/content/healthcare.ts'
import { cn } from '@/lib/cn.ts'
import { useMediaQuery } from '@/sections/home/homeJourney.ts'

/*
 * The care route: a transit-map line from Idea to Reality, with the five
 * healthcare solutions as stations. Coordinates live in a 560 × 460 box;
 * HTML stations sit on top at matching percentages so labels stay crisp.
 */
const W = 560
const H = 460
const ROUTE = 'M 40 70 H 300 L 380 150 V 310 L 300 390 H 40'
const DRAW_S = 1.6
const START_S = 0.2
const ROTATE_MS = 5200
const ease = [0.65, 0, 0.35, 1] as const

type Side = 'top' | 'right' | 'bottom'

/** Station positions, and how far along the route each sits (0–1). */
const stops: Record<(typeof healthcareSolutions)[number]['id'], { x: number; y: number; at: number; side: Side }> = {
  cds: { x: 150, y: 70, at: 0.121, side: 'top' },
  telemedicine: { x: 340, y: 110, at: 0.349, side: 'right' },
  hie: { x: 380, y: 230, at: 0.5, side: 'right' },
  ehr: { x: 340, y: 350, at: 0.651, side: 'right' },
  interop: { x: 150, y: 390, at: 0.879, side: 'bottom' },
}

const pct = (value: number, total: number) => `${(value / total) * 100}%`

const labelPlacement: Record<Side, string> = {
  top: 'bottom-[calc(100%+0.6rem)] left-1/2 -translate-x-1/2 text-center',
  right: 'top-1/2 left-[calc(100%+0.75rem)] -translate-y-1/2 text-left',
  bottom: 'top-[calc(100%+0.6rem)] left-1/2 -translate-x-1/2 text-center',
}

function Terminal({ x, y, label, side, delay, reduced }: { x: number; y: number; label: string; side: 'top' | 'bottom'; delay: number; reduced: boolean }) {
  return (
    <m.div
      aria-hidden="true"
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pct(x, W), top: pct(y, H) }}
      initial={reduced ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="block size-[1.15rem] rounded-full border-4 border-text bg-surface" />
      <span
        className={cn(
          'absolute left-1/2 -translate-x-1/2 text-eyebrow whitespace-nowrap text-text-secondary',
          side === 'top' ? 'bottom-[calc(100%+0.55rem)]' : 'top-[calc(100%+0.55rem)]',
        )}
      >
        {label}
      </span>
    </m.div>
  )
}

/** Wide screens: the route map with a detail card inside the loop. */
function RouteMap({
  active,
  select,
  reduced,
}: {
  active: number
  select: (index: number) => void
  reduced: boolean
}) {
  const solution = healthcareSolutions[active] ?? healthcareSolutions[0]

  return (
    <div className="@container relative aspect-[560/460] w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {/* The planned route, then the route itself drawing in on top */}
        <path d={ROUTE} fill="none" stroke="var(--color-brand-soft)" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <m.path
          d={ROUTE}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: DRAW_S, delay: START_S, ease }}
        />
      </svg>

      <Terminal x={40} y={70} label="Idea" side="top" delay={START_S} reduced={reduced} />
      <Terminal x={40} y={390} label="Reality" side="bottom" delay={START_S + DRAW_S} reduced={reduced} />

      {healthcareSolutions.map((item, index) => {
        const stop = stops[item.id]
        const selected = index === active
        return (
          <m.button
            key={item.id}
            type="button"
            aria-pressed={selected}
            aria-label={`${item.title}: ${item.summary}`}
            onClick={() => select(index)}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') select(index)
            }}
            onFocus={() => select(index)}
            className="group absolute size-9 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            style={{ left: pct(stop.x, W), top: pct(stop.y, H) }}
            initial={reduced ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: reduced ? 0 : START_S + stop.at * DRAW_S, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg viewBox="0 0 24 24" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
              {/* "You are here" halo on the selected station */}
              <polygon
                points={HEX_POINTS}
                transform="translate(12 12) scale(1.55) translate(-12 -12)"
                fill="var(--color-accent)"
                fillOpacity={selected ? 0.28 : 0}
                className="transition-[fill-opacity] duration-300"
              />
              <polygon
                points={HEX_POINTS}
                fill={selected ? 'var(--color-accent)' : 'var(--color-surface)'}
                stroke="var(--color-text)"
                strokeWidth="2.6"
                strokeLinejoin="round"
                className={cn('transition-[fill] duration-300', !selected && 'group-hover:fill-accent-soft')}
              />
            </svg>
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute text-body-small leading-tight font-semibold whitespace-nowrap transition-colors duration-300',
                labelPlacement[stop.side],
                selected ? 'text-text' : 'text-text-secondary group-hover:text-text',
              )}
            >
              {item.station}
            </span>
          </m.button>
        )
      })}

      {/*
        Detail card inside the loop of the route, clear of every station
        (x 53–311, y 101–372 in map units). Type steps down with the map width.
      */}
      <m.div
        className="absolute top-[22%] left-[9.5%] w-[46%]"
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: reduced ? 0 : START_S + DRAW_S * 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-xl border border-border-subtle bg-surface/95 p-4 shadow-float backdrop-blur-sm @xl:p-5">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={solution.id}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18 }}
              aria-live="polite"
            >
              <p className="text-[0.75rem] leading-snug text-text-muted tabular-nums @xl:text-caption">
                Stop {active + 1} of {healthcareSolutions.length}
              </p>
              <p className="mt-1.5 text-[1rem] leading-tight font-semibold tracking-[-0.01em] text-text @xl:mt-2 @xl:text-card-title">
                {solution.title}
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-snug text-text-secondary @xl:mt-2 @xl:text-body-small">
                {solution.summary}
              </p>
              <p className="mt-2.5 @xl:mt-3">
                <TextLink to={`/work/${solution.slug}`} inline>
                  View case study
                </TextLink>
              </p>
            </m.div>
          </AnimatePresence>
        </div>
      </m.div>
    </div>
  )
}

/** Phones: the same route, read top to bottom. */
function RouteList({ active, select }: { active: number; select: (index: number) => void }) {
  return (
    <ol className="relative grid gap-1 ps-1" aria-label="Healthcare solutions">
      <span aria-hidden="true" className="absolute top-3 bottom-3 left-[1.05rem] w-1.5 -translate-x-1/2 rounded-full bg-brand" />
      <li className="relative flex items-center gap-4 py-2" aria-hidden="true">
        <span className="relative z-10 ms-[0.45rem] size-[1.15rem] rounded-full border-4 border-text bg-surface" />
        <span className="text-eyebrow text-text-secondary">Idea</span>
      </li>
      {healthcareSolutions.map((item, index) => {
        const selected = index === active
        return (
          <li key={item.id} className="relative">
            <button
              type="button"
              aria-expanded={selected}
              onClick={() => select(index)}
              className="flex w-full items-center gap-4 rounded-lg py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <svg viewBox="0 0 24 24" className="relative z-10 size-8 shrink-0" aria-hidden="true">
                <polygon
                  points={HEX_POINTS}
                  fill={selected ? 'var(--color-accent)' : 'var(--color-surface)'}
                  stroke="var(--color-text)"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
              </svg>
              <span className={cn('text-body font-semibold', selected ? 'text-text' : 'text-text-secondary')}>
                {item.station}
              </span>
            </button>
            {selected ? (
              <div className="ms-12 pb-3">
                <p className="text-body-small text-text-secondary">{item.summary}</p>
                <TextLink to={`/work/${item.slug}`} className="-my-1">
                  View case study
                </TextLink>
              </div>
            ) : null}
          </li>
        )
      })}
      <li className="relative flex items-center gap-4 py-2" aria-hidden="true">
        <span className="relative z-10 ms-[0.45rem] size-[1.15rem] rounded-full border-4 border-text bg-surface" />
        <span className="text-eyebrow text-text-secondary">Reality</span>
      </li>
    </ol>
  )
}

export function HeroRouteMap() {
  const reduced = useReducedMotion() === true
  // Only the wide map tours: on phones the list would reflow the page each step.
  const wide = useMediaQuery('(min-width: 640px)')
  const [active, setActive] = useState(0)
  // The map tours itself until the visitor takes over, then it stays put.
  const [touring, setTouring] = useState(true)
  const [toured, setToured] = useState(false)

  useEffect(() => {
    if (reduced || !touring || !wide) return
    // The first stop waits for the route to finish drawing.
    const wait = toured ? ROTATE_MS : (START_S + DRAW_S) * 1000 + ROTATE_MS
    const id = window.setTimeout(() => {
      setToured(true)
      setActive((value) => (value + 1) % healthcareSolutions.length)
    }, wait)
    return () => window.clearTimeout(id)
  }, [active, touring, toured, reduced, wide])

  function select(index: number) {
    setTouring(false)
    setActive(index)
  }

  return (
    <div className="w-full">
      <div className="hidden sm:block">
        <RouteMap active={active} select={select} reduced={reduced} />
      </div>
      <div className="sm:hidden">
        <RouteList active={active} select={select} />
      </div>
    </div>
  )
}
