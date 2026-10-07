import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { Link } from 'react-router'
import { useRef, useState } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { homeContent } from '@/content/home.ts'
import { useMediaQuery } from '@/sections/home/homeJourney.ts'

function FlowNode({
  label,
  index,
  active,
  progress,
  reduced,
}: {
  label: string
  index: number
  active: number
  progress: MotionValue<number>
  reduced: boolean
}) {
  const y = 48 + index * 72
  const lit = active >= index
  const pulse = useTransform(progress, [index / 5, (index + 0.6) / 5], reduced ? [1, 1] : [0.7, 1])

  return (
    <g transform={`translate(200 ${y})`}>
      <m.circle
        r={lit ? 18 : 12}
        fill={lit ? 'rgb(47 91 234 / 0.16)' : 'white'}
        stroke={lit ? '#2f5bea' : 'rgb(47 91 234 / 0.25)'}
        strokeWidth={1.5}
        style={{ scale: pulse }}
      />
      <circle r={4} fill={lit ? (index % 2 === 0 ? '#2f5bea' : '#f5c84c') : 'rgb(47 91 234 / 0.35)'} />
      <text
        x={36}
        y={5}
        fill={lit ? '#0d121f' : '#67737E'}
        fontSize="15"
        fontWeight="600"
      >
        {label}
      </text>
    </g>
  )
}

function CareFlow({
  active,
  progress,
  reduced,
}: {
  active: number
  progress: MotionValue<number>
  reduced: boolean
}) {
  const draw = useTransform(progress, [0.05, 0.85], reduced ? [1, 1] : [0.08, 1])
  const aiOpacity = useTransform(progress, [0.55, 0.8], reduced ? [1, 1] : [0, 1])

  return (
    <div className="relative h-full min-h-[24rem] overflow-hidden rounded-2xl border border-border bg-page-white p-6 shadow-card">
      <svg viewBox="0 0 420 420" className="relative h-full w-full" aria-hidden="true">
        <m.path
          d="M200 48 V336"
          fill="none"
          stroke="#2f5bea"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: draw }}
        />
        {homeContent.specialization.flow.map((label, index) => (
          <FlowNode
            key={label}
            label={label}
            index={index}
            active={active}
            progress={progress}
            reduced={reduced}
          />
        ))}
        <m.g style={{ opacity: aiOpacity }}>
          <rect x="300" y="160" width="96" height="36" rx="18" fill="rgb(245 200 76 / 0.12)" stroke="#f5c84c" />
          <text x="348" y="183" textAnchor="middle" fill="#C45A20" fontSize="12" fontWeight="700">
            AI
          </text>
          <path d="M300 178 H236" stroke="#f5c84c" strokeWidth="1.4" strokeDasharray="4 4" />
        </m.g>
      </svg>
    </div>
  )
}

/**
 * Specialization bridge to /digital-health.
 * Motion: vertical care system assembly (not medical illustration).
 */
export function HealthcareExpertise() {
  const reduced = useReducedMotion() === true
  const desktop = useMediaQuery('(min-width: 1024px)')
  const ref = useRef<HTMLElement>(null)
  const copy = homeContent.specialization
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActive(Math.min(copy.flow.length - 1, Math.max(0, Math.floor(value * copy.flow.length))))
  })

  const body = (
    <>
      <Eyebrow tone="brand">{copy.eyebrow}</Eyebrow>
      <h2
        id="expertise-title"
        className="mt-4 max-w-[14ch] text-section-title text-text"
      >
        {copy.title}
      </h2>
      <p className="mt-5 max-w-[36rem] text-body-large text-text-secondary">{copy.body}</p>
      <ul className="mt-8 flex flex-wrap gap-2">
        {copy.offers.map((offer) => (
          <li
            key={offer}
            className="rounded-full border border-brand/20 bg-brand-subtle px-3 py-1.5 text-caption font-medium text-brand-hover"
          >
            {offer}
          </li>
        ))}
      </ul>
      <Link
        to={copy.ctaTo}
        className="mt-8 inline-flex text-body-small font-semibold text-brand-hover underline underline-offset-[0.22em]"
      >
        {copy.cta} →
      </Link>
    </>
  )

  if (!desktop || reduced) {
    return (
      <section
        id="digital-health"
        className="relative bg-page-white section-y"
        aria-labelledby="expertise-title"
      >
        <Container variant="page" className="relative w-full">
          {body}
          <div className="mt-12">
            <CareFlow active={copy.flow.length - 1} progress={scrollYProgress} reduced />
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section
      id="digital-health"
      ref={ref}
      className="relative h-[280vh] bg-page-white"
      aria-labelledby="expertise-title"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden sticky-section">
        <Container
          variant="page"
          className="relative grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-14"
        >
          <div>{body}</div>
          <CareFlow active={active} progress={scrollYProgress} reduced={false} />
          <p className="sr-only">
            Active stage: {copy.flow[active]}
          </p>
        </Container>
      </div>
    </section>
  )
}
