import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef, useState } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { homeContent } from '@/content/home.ts'
import { useMediaQuery } from '@/sections/home/homeJourney.ts'
import { cn } from '@/lib/cn.ts'

export function HowWeWork() {
  const reduced = useReducedMotion() === true
  const desktop = useMediaQuery('(min-width: 960px)')
  const ref = useRef<HTMLElement>(null)
  const stages = homeContent.process.stages
  const copy = homeContent.process
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const [active, setActive] = useState(0)
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `-${((stages.length - 1) / stages.length) * 100}%`],
  )
  const pathDraw = useTransform(scrollYProgress, [0, 1], [0.08, 1])
  const markerX = useTransform(scrollYProgress, [0, 1], ['12%', '78%'])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActive(Math.min(stages.length - 1, Math.max(0, Math.round(value * (stages.length - 1)))))
  })

  if (!desktop || reduced) {
    return (
      <section id="how-we-work" className="relative bg-page-white section-y" aria-labelledby="process-title">
        <Container variant="page" className="relative w-full">
          <Eyebrow tone="brand">{copy.eyebrow}</Eyebrow>
          <h2 id="process-title" className="mt-4 text-section-title text-text">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-[40rem] text-body-large text-text-secondary">{copy.body}</p>
          <ol className="mt-12 space-y-4">
            {stages.map((stage, index) => (
              <li
                key={stage.number}
                className={cn(
                  'rounded-xl border p-6 shadow-card transition-shadow hover:shadow-card-hover md:grid md:grid-cols-[5.5rem_minmax(0,1fr)] md:items-start md:gap-8 md:p-8',
                  index % 2 === 0
                    ? 'border-brand/25 bg-surface'
                    : 'border-[#F66C2A]/25 bg-page-white',
                )}
              >
                <p className="text-[clamp(2rem,1.5rem+1vw,2.75rem)] leading-none font-semibold tracking-[-0.03em] text-brand">
                  {stage.number}
                </p>
                <div>
                  <h3 className="text-title text-text">{stage.title}</h3>
                  <p className="mt-3 max-w-[36rem] text-body text-text-secondary">{stage.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    )
  }

  return (
    <section
      id="how-we-work"
      ref={ref}
      className="relative h-[360vh] bg-page-white"
      aria-labelledby="process-title"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden sticky-section">
        <Container variant="page" className="relative z-10 w-full">
          <Eyebrow tone="brand">{copy.eyebrow}</Eyebrow>
          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
            <div>
              <h2 id="process-title" className="text-section-title text-text">
                {copy.title}
              </h2>
              <p className="mt-4 max-w-[34rem] text-body text-text-secondary">{copy.body}</p>
            </div>
            <AnimatePresence mode="wait">
              <m.div
                key={stages[active]?.number}
                className="rounded-xl border border-brand/20 bg-surface/90 p-5 shadow-card backdrop-blur-md"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-caption font-semibold text-brand-hover">
                  {stages[active]?.number} · {stages[active]?.title}
                </p>
                <p className="mt-2 text-body text-text-secondary">{stages[active]?.body}</p>
              </m.div>
            </AnimatePresence>
          </div>
        </Container>

        <div className="relative mt-12 overflow-hidden">
          <div className="pointer-events-none absolute top-[48%] right-[8%] left-[8%] h-1.5 -translate-y-1/2 rounded-full bg-brand/15">
            <m.div
              className="h-full origin-left rounded-full bg-brand"
              style={{ scaleX: pathDraw }}
            />
          </div>
          <m.span
            aria-hidden="true"
            className="absolute top-[48%] z-20 size-4 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#F66C2A] shadow-md"
            style={{ left: markerX }}
          />

          <m.div
            className="flex w-max gap-5 will-change-transform"
            style={{
              x,
              paddingInline: 'max(var(--page-gutter), 2.5rem)',
            }}
          >
            {stages.map((stage, index) => {
              const on = index === active
              return (
                <article
                  key={stage.number}
                  className={cn(
                    'relative flex w-[min(18.5rem,52vw)] shrink-0 flex-col justify-center rounded-2xl border px-7 py-8 transition-all duration-500',
                    on
                      ? 'border-brand/35 bg-surface shadow-card-hover'
                      : 'border-border/80 bg-surface/80 shadow-card opacity-70',
                  )}
                >
                  <p
                    className={cn(
                      'text-[clamp(2.75rem,2rem+1.5vw,4rem)] leading-none font-semibold tracking-[-0.04em]',
                      on ? 'text-brand' : 'text-brand/40',
                    )}
                  >
                    {stage.number}
                  </p>
                  <h3
                    className={cn(
                      'mt-4 text-[clamp(1.5rem,1.2rem+0.8vw,2rem)] leading-none font-semibold tracking-[-0.03em]',
                      on ? 'text-text' : 'text-text-muted',
                    )}
                  >
                    {stage.title}
                  </h3>
                  {on ? (
                    <span
                      aria-hidden="true"
                      className="mt-6 block h-1 w-14 rounded-full bg-brand"
                    />
                  ) : null}
                </article>
              )
            })}
          </m.div>
        </div>
      </div>
    </section>
  )
}
