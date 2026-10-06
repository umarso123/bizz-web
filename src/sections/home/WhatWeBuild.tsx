import {
  AnimatePresence,
  m,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useId, useRef, useState } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { homeContent } from '@/content/home.ts'
import { useMediaQuery } from '@/sections/home/homeJourney.ts'
import { cn } from '@/lib/cn.ts'

const copy = homeContent.whatWeBuild
const caps = copy.capabilities
const N = caps.length

const LABELS = [
  ['Evidence', 'Decision', 'Pathway'],
  ['Patient', 'Consult', 'Provider'],
  ['System', 'Exchange', 'System'],
  ['Record', 'Workflow', 'Layer'],
  ['Platform', 'Interop', 'Platform'],
  ['Web', 'Experience', 'Mobile'],
] as const

/** Node layouts — continuous morph across chapters */
const LAYOUTS: ReadonlyArray<ReadonlyArray<{ x: number; y: number }>> = [
  [
    { x: 260, y: 210 },
    { x: 260, y: 90 },
    { x: 130, y: 150 },
    { x: 390, y: 150 },
    { x: 150, y: 310 },
    { x: 370, y: 310 },
    { x: 260, y: 350 },
  ],
  [
    { x: 150, y: 210 },
    { x: 370, y: 210 },
    { x: 260, y: 120 },
    { x: 260, y: 300 },
    { x: 120, y: 110 },
    { x: 400, y: 110 },
    { x: 260, y: 350 },
  ],
  [
    { x: 260, y: 210 },
    { x: 130, y: 100 },
    { x: 390, y: 100 },
    { x: 130, y: 320 },
    { x: 390, y: 320 },
    { x: 260, y: 70 },
    { x: 260, y: 350 },
  ],
  [
    { x: 260, y: 190 },
    { x: 260, y: 90 },
    { x: 260, y: 290 },
    { x: 155, y: 140 },
    { x: 365, y: 140 },
    { x: 155, y: 250 },
    { x: 365, y: 250 },
  ],
  [
    { x: 260, y: 210 },
    { x: 120, y: 110 },
    { x: 400, y: 110 },
    { x: 100, y: 250 },
    { x: 420, y: 250 },
    { x: 170, y: 340 },
    { x: 350, y: 340 },
  ],
  [
    { x: 180, y: 190 },
    { x: 360, y: 230 },
    { x: 260, y: 110 },
    { x: 140, y: 300 },
    { x: 400, y: 310 },
    { x: 260, y: 270 },
    { x: 300, y: 80 },
  ],
]

const EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [2, 3],
  [4, 5],
]

function stage(p: number) {
  return Math.min(N - 1, Math.max(0, Math.floor(p * N)))
}

function stageF(p: number) {
  return Math.min(N - 1, Math.max(0, p * (N - 0.001)))
}

/* -------------------------------------------------------------------------- */
/* Flowing paths — match reference: blue cluster up top, orange below          */
/* -------------------------------------------------------------------------- */

function FlowPaths({
  progress,
  reduced,
  dense,
  gid,
}: {
  progress: MotionValue<number>
  reduced: boolean
  dense: boolean
  gid: string
}) {
  const y = useTransform(progress, [0, 1], reduced ? [0, 0] : [18, -36])
  const x = useTransform(progress, [0, 1], reduced ? [0, 0] : [-12, 24])
  const bend = useTransform(progress, [0, 0.5, 1], reduced ? [0, 0, 0] : [0, 16, -14])
  const draw = useSpring(useTransform(progress, [0, 0.2, 1], reduced ? [1, 1, 1] : [0.35, 0.75, 1]), {
    stiffness: 40,
    damping: 28,
  })

  // Paths tuned to look like the mock: soft S-curves through the stage
  const blue = dense
    ? [
        { d: 'M-100 210 C 220 140, 480 280, 780 190 S 1180 100, 1600 170', w: 2.4, o: 0.55 },
        { d: 'M-80 240 C 240 170, 500 310, 800 220 S 1200 130, 1580 200', w: 1.6, o: 0.4 },
        { d: 'M-60 270 C 260 200, 520 340, 820 250 S 1220 160, 1560 230', w: 1.1, o: 0.28 },
      ]
    : [
        { d: 'M-100 220 C 220 150, 480 290, 780 200 S 1180 110, 1600 180', w: 2.2, o: 0.5 },
        { d: 'M-60 260 C 260 190, 520 330, 820 240 S 1220 150, 1560 220', w: 1.2, o: 0.3 },
      ]

  const orange = dense
    ? [
        { d: 'M-100 360 C 240 280, 500 460, 800 340 S 1160 240, 1600 320', w: 2.6, o: 0.7 },
        { d: 'M-80 390 C 260 310, 520 490, 820 370 S 1180 270, 1580 350', w: 1.7, o: 0.45 },
        { d: 'M-60 420 C 280 340, 540 520, 840 400 S 1200 300, 1560 380', w: 1.15, o: 0.3 },
      ]
    : [
        { d: 'M-100 370 C 240 290, 500 470, 800 350 S 1160 250, 1600 330', w: 2.4, o: 0.65 },
        { d: 'M-60 410 C 280 330, 540 510, 840 390 S 1200 290, 1560 370', w: 1.3, o: 0.35 },
      ]

  return (
    <m.svg
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ x, y }}
    >
      <defs>
        <linearGradient id={`${gid}-blue`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0A8FD8" stopOpacity="0" />
          <stop offset="25%" stopColor="#0A8FD8" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#0A8FD8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0A8FD8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${gid}-orange`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F66C2A" stopOpacity="0" />
          <stop offset="25%" stopColor="#F66C2A" stopOpacity="0.6" />
          <stop offset="55%" stopColor="#F66C2A" stopOpacity="1" />
          <stop offset="100%" stopColor="#F66C2A" stopOpacity="0" />
        </linearGradient>
      </defs>

      <m.g style={{ y: bend }}>
        {blue.map((l) => (
          <m.path
            key={l.d}
            d={l.d}
            fill="none"
            stroke={`url(#${gid}-blue)`}
            strokeWidth={l.w}
            strokeLinecap="round"
            opacity={l.o}
            style={{ pathLength: draw }}
          />
        ))}
        {orange.map((l) => (
          <m.path
            key={l.d}
            d={l.d}
            fill="none"
            stroke={`url(#${gid}-orange)`}
            strokeWidth={l.w}
            strokeLinecap="round"
            opacity={l.o}
            style={{ pathLength: draw }}
          />
        ))}
      </m.g>
    </m.svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Viewfinder + network (center stage from mock)                               */
/* -------------------------------------------------------------------------- */

function Edge({
  a,
  b,
  progress,
  accent,
}: {
  a: number
  b: number
  progress: MotionValue<number>
  accent: boolean
}) {
  const d = useTransform(progress, (p) => {
    const f = stageF(p)
    const i0 = Math.floor(f)
    const i1 = Math.min(N - 1, i0 + 1)
    const t = f - i0
    const A = LAYOUTS[i0]!
    const B = LAYOUTS[i1]!
    const ax = A[a]!.x + (B[a]!.x - A[a]!.x) * t
    const ay = A[a]!.y + (B[a]!.y - A[a]!.y) * t
    const bx = A[b]!.x + (B[b]!.x - A[b]!.x) * t
    const by = A[b]!.y + (B[b]!.y - A[b]!.y) * t
    const mx = (ax + bx) / 2 + (accent ? 10 : -8)
    const my = (ay + by) / 2 - 18
    return `M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`
  })

  return (
    <m.path
      d={d}
      fill="none"
      stroke={accent ? '#F66C2A' : '#0A8FD8'}
      strokeWidth={1.15}
      strokeLinecap="round"
      opacity={0.4}
    />
  )
}

function Node({
  index,
  progress,
  reduced,
}: {
  index: number
  progress: MotionValue<number>
  reduced: boolean
}) {
  const x = useTransform(progress, (p) => {
    const f = stageF(p)
    const i0 = Math.floor(f)
    const i1 = Math.min(N - 1, i0 + 1)
    const t = f - i0
    return LAYOUTS[i0]![index]!.x + (LAYOUTS[i1]![index]!.x - LAYOUTS[i0]![index]!.x) * t
  })
  const y = useTransform(progress, (p) => {
    const f = stageF(p)
    const i0 = Math.floor(f)
    const i1 = Math.min(N - 1, i0 + 1)
    const t = f - i0
    return LAYOUTS[i0]![index]!.y + (LAYOUTS[i1]![index]!.y - LAYOUTS[i0]![index]!.y) * t
  })

  const hub = index === 0

  return (
    <g>
      {hub ? (
        <m.circle cx={x} cy={y} r={22} fill="rgb(10 143 216 / 0.1)" stroke="#0A8FD8" strokeWidth={1.5} />
      ) : null}
      <m.circle
        cx={x}
        cy={y}
        r={hub ? 6 : 4.5}
        fill={hub || index % 2 === 1 ? '#F66C2A' : '#0A8FD8'}
        animate={reduced ? undefined : { opacity: [0.6, 1, 0.6] }}
        transition={
          reduced ? undefined : { duration: 3.2, delay: index * 0.12, repeat: Infinity, ease: 'easeInOut' }
        }
      />
    </g>
  )
}

function Viewfinder({
  progress,
  active,
  reduced,
}: {
  progress: MotionValue<number>
  active: number
  reduced: boolean
}) {
  const labels = LABELS[active]!
  const x = useTransform(
    progress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    reduced ? [0, 0, 0, 0, 0, 0] : [20, -10, 16, -12, 8, 0],
  )
  const scale = useTransform(progress, [0, 0.5, 1], reduced ? [1, 1, 1] : [0.97, 1.02, 1])
  const rotate = useTransform(progress, [0, 0.35, 0.7, 1], reduced ? [0, 0, 0, 0] : [-0.8, 0.6, -0.5, 0])

  return (
    <m.div className="relative mx-auto aspect-square w-full max-w-[min(28rem,72vw)]" style={{ x, scale, rotate }}>
      {/* Soft white stage */}
      <div className="absolute inset-[6%] rounded-sm bg-white/80 shadow-[0_20px_60px_rgb(23_33_43_/_0.06)]" />

      {/* Blue L corner crop marks — exact mock language */}
      <span className="absolute top-0 left-0 h-8 w-8 border-t-[2px] border-l-[2px] border-[#0A8FD8]" aria-hidden="true" />
      <span className="absolute top-0 right-0 h-8 w-8 border-t-[2px] border-r-[2px] border-[#0A8FD8]" aria-hidden="true" />
      <span className="absolute bottom-0 left-0 h-8 w-8 border-b-[2px] border-l-[2px] border-[#0A8FD8]" aria-hidden="true" />
      <span className="absolute right-0 bottom-0 h-8 w-8 border-r-[2px] border-b-[2px] border-[#0A8FD8]" aria-hidden="true" />

      <svg viewBox="0 0 520 420" className="relative z-[1] h-full w-full" aria-hidden="true">
        {EDGES.map(([a, b], i) => (
          <Edge key={`${a}-${b}`} a={a} b={b} progress={progress} accent={i % 3 === 0} />
        ))}
        {LAYOUTS[0]!.map((_, i) => (
          <Node key={i} index={i} progress={progress} reduced={reduced} />
        ))}
      </svg>

      <AnimatePresence mode="wait">
        <m.div
          key={active}
          className="pointer-events-none absolute inset-0 z-[2]"
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
        >
          <span className="absolute top-[16%] left-[10%] rounded-full border border-[#0A8FD8]/30 bg-white px-3 py-1 text-[0.7rem] font-medium text-[#0A8FD8] shadow-sm">
            {labels[0]}
          </span>
          <span className="absolute top-[28%] right-[12%] rounded-full border border-[#0A8FD8]/30 bg-white px-3 py-1 text-[0.7rem] font-medium text-[#0A8FD8] shadow-sm">
            {labels[1]}
          </span>
          <span className="absolute bottom-[24%] left-[42%] text-[0.75rem] font-medium text-[#4B5965]">
            {labels[2]}
          </span>
        </m.div>
      </AnimatePresence>
    </m.div>
  )
}

/* -------------------------------------------------------------------------- */
/* Left copy + bottom pagination                                               */
/* -------------------------------------------------------------------------- */

function ChapterCopy({
  active,
  reduced,
}: {
  active: number
  reduced: boolean
}) {
  const item = caps[active]!

  return (
    <div className="relative z-10 max-w-[22rem] md:max-w-[26rem]" aria-live="polite">
      <AnimatePresence mode="wait">
        <m.div
          key={item.id}
          initial={reduced ? false : { opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduced ? undefined : { opacity: 0, y: -14, filter: 'blur(3px)' }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        >
          <p
            className="text-[clamp(4.5rem,3rem+5vw,7rem)] leading-none font-semibold tracking-[-0.05em] text-[#0A8FD8]/35"
            aria-hidden="true"
          >
            {item.number}
          </p>
          <h2
            id="what-we-build-title"
            className="mt-2 max-w-[11ch] text-[clamp(1.85rem,1.3rem+1.5vw,2.65rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-[#17212B]"
          >
            {item.title}
          </h2>
          <p className="mt-4 max-w-[24rem] text-[1.05rem] leading-relaxed text-[#67737E]">{item.body}</p>
        </m.div>
      </AnimatePresence>
    </div>
  )
}

function Pagination({ active }: { active: number }) {
  return (
    <ol className="flex items-center justify-center gap-5 md:gap-7" aria-label="Capability chapters">
      {caps.map((c, i) => (
        <li key={c.id}>
          <span
            className={cn(
              'text-[0.8rem] font-semibold tracking-[0.04em]',
              i === active ? 'text-[#0A8FD8]' : 'text-[#B0B8C0]',
            )}
            aria-current={i === active ? 'true' : undefined}
          >
            {c.number}
          </span>
        </li>
      ))}
    </ol>
  )
}

/* -------------------------------------------------------------------------- */
/* Variants                                                                    */
/* -------------------------------------------------------------------------- */

function ReducedWhatWeBuild() {
  const [active, setActive] = useState(0)
  const progress = useMotionValue(active / Math.max(1, N - 1))

  return (
    <section
      id="what-we-build"
      className="relative overflow-hidden bg-page-white py-20 md:py-28"
      aria-labelledby="what-we-build-title"
    >
      <Container variant="page" className="relative z-10 w-full">
        <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-[#0A8FD8] uppercase">
          {copy.eyebrow}
        </p>
        <p className="mt-3 max-w-[36rem] text-body-large text-[#4B5965]">{copy.body}</p>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <ChapterCopy active={active} reduced />
            <div className="mt-10">
              <Pagination active={active} />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {caps.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setActive(i)
                    progress.set(i / Math.max(1, N - 1))
                  }}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-caption font-semibold',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                    i === active
                      ? 'border-[#0A8FD8] text-[#0A8FD8]'
                      : 'border-[#E4E9ED] text-[#67737E]',
                  )}
                >
                  {c.number}
                </button>
              ))}
            </div>
          </div>
          <Viewfinder progress={progress} active={active} reduced />
        </div>
      </Container>
    </section>
  )
}

function MobileWhatWeBuild({ dense }: { dense: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const gid = useId().replace(/:/g, '')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 28 })
  const [active, setActive] = useState(0)

  useMotionValueEvent(smooth, 'change', (v) => setActive(stage(v)))

  return (
    <section
      id="what-we-build"
      ref={ref}
      className="relative h-[400vh] overflow-x-clip bg-page-white"
      aria-labelledby="what-we-build-title"
    >
      <div className="sticky top-0 flex min-h-svh flex-col justify-center py-12">
        <FlowPaths progress={smooth} reduced={false} dense={dense} gid={gid} />
        <Container variant="page" className="relative z-10 w-full">
          <ChapterCopy active={active} reduced={false} />
          <div className="mt-8 max-w-[20rem]">
            <Viewfinder progress={smooth} active={active} reduced={false} />
          </div>
          <div className="mt-10">
            <Pagination active={active} />
          </div>
        </Container>
        <ol className="sr-only">
          {caps.map((c) => (
            <li key={c.id}>
              {c.number}. {c.title}: {c.body}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/**
 * What We Build — matched to the Bizaffix light reference:
 * left chapter copy, crop-mark viewfinder, blue/orange flowing paths, bottom 01–06.
 */
export function WhatWeBuild() {
  const reduced = useReducedMotion() === true
  const desktop = useMediaQuery('(min-width: 1024px)')
  const tablet = useMediaQuery('(min-width: 768px)')
  const gid = useId().replace(/:/g, '')
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 28, mass: 0.4 })
  const [active, setActive] = useState(0)
  const pointerRaw = useMotionValue(0)
  const nudge = useSpring(pointerRaw, { stiffness: 100, damping: 22 })

  useMotionValueEvent(smooth, 'change', (v) => setActive(stage(v)))

  if (reduced) return <ReducedWhatWeBuild />
  if (!desktop) return <MobileWhatWeBuild dense={tablet} />

  return (
    <section
      id="what-we-build"
      ref={ref}
      className="relative h-[580vh] overflow-x-clip bg-page-white"
      aria-labelledby="what-we-build-title"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        pointerRaw.set(((e.clientX - r.left) / r.width - 0.5) * 10)
      }}
      onPointerLeave={() => pointerRaw.set(0)}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <FlowPaths progress={smooth} reduced={false} dense gid={gid} />

        <Container variant="page" className="relative z-10 flex h-full flex-col justify-center">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-6 xl:gap-10">
            <ChapterCopy active={active} reduced={false} />
            <m.div style={{ x: nudge }}>
              <Viewfinder progress={smooth} active={active} reduced={false} />
            </m.div>
          </div>

          <div className="absolute inset-x-0 bottom-10">
            <Pagination active={active} />
          </div>
        </Container>

        <ol className="sr-only">
          {caps.map((c) => (
            <li key={c.id}>
              {c.number}. {c.title}: {c.body}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
