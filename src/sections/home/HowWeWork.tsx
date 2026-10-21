import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { HEX_POINTS } from '@/components/ui/HexMark.tsx'
import { homeContent } from '@/content/home.ts'
import { cn } from '@/lib/cn.ts'
import { WorkStill } from '@/sections/work/WorkStill.tsx'

const ease = [0.22, 1, 0.36, 1] as const

function Station({ selected, passed }: { selected: boolean; passed: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="relative z-10 size-10 shrink-0 overflow-visible" aria-hidden="true">
      <polygon
        points={HEX_POINTS}
        transform="translate(12 12) scale(1.5) translate(-12 -12)"
        fill="var(--color-accent)"
        fillOpacity={selected ? 0.3 : 0}
        className="transition-[fill-opacity] duration-300"
      />
      <polygon
        points={HEX_POINTS}
        fill={selected ? 'var(--color-accent)' : passed ? 'var(--color-brand-soft)' : 'var(--color-surface)'}
        stroke="var(--color-text)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        className="transition-[fill] duration-300"
      />
    </svg>
  )
}

/**
 * The process is a real sequence, so it is drawn as a route: five stations,
 * the line filling in up to the step you are looking at.
 */
export function HowWeWork() {
  const reduced = useReducedMotion() === true
  const copy = homeContent.process
  const stages = copy.stages
  const [active, setActive] = useState(0)
  const stage = stages[active] ?? stages[0]
  const fill = stages.length > 1 ? active / (stages.length - 1) : 0

  return (
    <section id="how-we-work" className="section-y bg-page-white" aria-labelledby="how-we-work-title">
      <Container variant="wide" className="w-full">
        <SectionHeader
          eyebrow={copy.eyebrow}
          meta={`${stages.length} steps`}
          title={copy.title}
          titleId="how-we-work-title"
          description={copy.body}
        />

        {/* Wide screens: horizontal route with a detail card under it */}
        <div className="mt-16 hidden md:block">
          <div className="relative">
            <span aria-hidden="true" className="absolute top-5 right-[10%] left-[10%] h-1 -translate-y-1/2 rounded-full bg-border" />
            <span
              aria-hidden="true"
              className="absolute top-5 left-[10%] h-1 -translate-y-1/2 rounded-full bg-brand transition-[width] duration-500 ease-standard"
              style={{ width: `${fill * 80}%` }}
            />
            <ol className="relative grid grid-cols-5" aria-label="Process steps">
              {stages.map((item, index) => {
                const selected = index === active
                return (
                  <li key={item.number} className="flex justify-center">
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setActive(index)}
                      onPointerEnter={(event) => {
                        if (event.pointerType === 'mouse') setActive(index)
                      }}
                      onFocus={() => setActive(index)}
                      className="group flex flex-col items-center gap-4 rounded-lg px-2 pb-2 text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                    >
                      <Station selected={selected} passed={index < active} />
                      <span className="flex flex-col items-center gap-1">
                        <span className="text-caption text-text-muted tabular-nums">Step {index + 1}</span>
                        <span
                          className={cn(
                            'text-card-title transition-colors duration-300',
                            selected ? 'text-text' : 'text-text-secondary group-hover:text-text',
                          )}
                        >
                          {item.title}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-border-subtle bg-bg-subtle">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={stage.number}
                className="grid items-center gap-8 p-6 lg:grid-cols-12 lg:gap-8 lg:p-10"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.22, ease }}
                aria-live="polite"
              >
                <div className="relative overflow-hidden rounded-xl bg-surface lg:col-span-6">
                  {stage.image ? (
                    <img
                      src={stage.image}
                      alt={stage.alt}
                      className="aspect-[16/10] h-full w-full object-contain p-6"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  ) : (
                    <div className="relative aspect-[16/10]">
                      <WorkStill slug={'still' in stage ? stage.still : 'healthcare'} />
                    </div>
                  )}
                </div>
                <div className="lg:col-span-5 lg:col-start-8">
                  <p className="text-caption text-text-muted tabular-nums">
                    Step {active + 1} of {stages.length}
                  </p>
                  <h3 className="mt-3 text-title text-text">{stage.title}</h3>
                  <p className="mt-4 max-w-[30rem] text-body-large text-text-secondary">{stage.body}</p>
                </div>
              </m.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Phones: the same route, top to bottom, every step open */}
        <ol className="relative mt-12 grid gap-8 md:hidden" aria-label="Process steps">
          <span aria-hidden="true" className="absolute top-5 bottom-5 left-5 w-1 -translate-x-1/2 rounded-full bg-brand" />
          {stages.map((item, index) => (
            <li key={item.number} className="relative flex gap-5">
              <Station selected={index === 0} passed={false} />
              <div className="pt-1.5">
                <p className="text-caption text-text-muted tabular-nums">Step {index + 1}</p>
                <h3 className="mt-1 text-card-title text-text">{item.title}</h3>
                <p className="mt-2 text-body-small text-text-secondary">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
