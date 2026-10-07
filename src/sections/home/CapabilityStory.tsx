import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef, useState } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { homeJourney, useMediaQuery } from '@/sections/home/homeJourney.ts'
import { cn } from '@/lib/cn.ts'

const atmospheres = ['#E8F5FC', '#FFFFFF', '#E8F5FC', '#FFFFFF', '#E8F5FC'] as const

/**
 * Motion identity: STACKED PEEL / CLIP WIPE
 * Panels sit in a deck. Scroll peels the top layer upward via clip-path.
 * Not a horizontal track.
 */
export function CapabilityStory() {
  const reduced = useReducedMotion() === true
  const desktop = useMediaQuery('(min-width: 960px)')
  const ref = useRef<HTMLElement>(null)
  const count = homeJourney.capabilities.length
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActive(Math.min(count - 1, Math.max(0, Math.floor(value * count))))
  })

  if (!desktop || reduced) {
    return (
      <section className="bg-page-white py-20 md:py-28" aria-labelledby="capability-title">
        <Container variant="page" className="w-full">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 id="capability-title" className="mt-4 text-section-title text-text">
            Experience the potential of your business.
          </h2>
          <div className="mt-12 space-y-8">
            {homeJourney.capabilities.map((panel, index) => (
              <article
                key={panel.id}
                className="overflow-hidden rounded-xl border border-brand/20 bg-white p-8 shadow-sm md:p-12"
                style={{ backgroundColor: atmospheres[index] }}
              >
                <p className="text-caption font-semibold text-brand-hover">0{index + 1}</p>
                <h3 className="mt-4 text-[clamp(2rem,1.4rem+2vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-text">
                  {panel.title}
                </h3>
                <p className="mt-4 max-w-[34rem] text-body-large text-text-secondary">{panel.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-[360vh] bg-page-white" aria-labelledby="capability-title">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <Container variant="page" className="relative w-full">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 id="capability-title" className="mt-3 text-section-title text-text">
            Experience the potential of your business.
          </h2>

          <div className="relative mt-10 h-[min(58vh,32rem)]">
            {homeJourney.capabilities.map((panel, index) => (
              <PeelPanel
                key={panel.id}
                panel={panel}
                index={index}
                count={count}
                progress={scrollYProgress}
                active={active}
                atmosphere={atmospheres[index] ?? atmospheres[0]}
              />
            ))}
          </div>

          <div className="mt-6 flex gap-2" aria-hidden="true">
            {homeJourney.capabilities.map((panel, index) => (
              <span
                key={panel.id}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors duration-300',
                  index <= active ? 'bg-brand' : 'bg-white/80',
                )}
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  )
}

function PeelPanel({
  panel,
  index,
  count,
  progress,
  active,
  atmosphere,
}: {
  panel: (typeof homeJourney.capabilities)[number]
  index: number
  count: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  active: number
  atmosphere: string
}) {
  const start = index / count
  const end = (index + 1) / count
  // Top panel peels away by clipping from bottom upward as user scrolls past it
  const clip = useTransform(progress, [start, end], ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'])
  const y = useTransform(progress, [start, end], [0, -48])
  const scale = useTransform(progress, [start, end], [1, 0.96])
  const isTop = index === active
  const isPast = index < active

  return (
    <m.article
      className="absolute inset-0 overflow-hidden rounded-2xl border border-border-subtle p-10 md:p-14"
      style={{
        zIndex: count - index,
        backgroundColor: atmosphere,
        clipPath: isPast ? 'inset(0% 0% 100% 0%)' : clip,
        y: isPast ? -48 : y,
        scale: isPast ? 0.96 : scale,
        boxShadow: isTop ? '0 18px 50px rgb(23 33 43 / 0.08)' : 'none',
      }}
    >
      <p className="text-caption text-text-muted">0{index + 1}</p>
      <h3 className="mt-5 max-w-[12ch] text-[clamp(2.5rem,1.5rem+3vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-text">
        {panel.title}
      </h3>
      <p className="mt-5 max-w-[34rem] text-body-large text-text-secondary">{panel.body}</p>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-8 right-8 text-[clamp(4rem,2rem+6vw,7rem)] font-semibold tracking-[-0.05em] text-brand/10"
      >
        0{index + 1}
      </span>
    </m.article>
  )
}
