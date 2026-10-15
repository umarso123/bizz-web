import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { cn } from '@/lib/cn.ts'

const houseSpring = { type: 'spring' as const, stiffness: 140, damping: 20, mass: 0.8 }

export type TriadItem = {
  id: string
  label: string
  body: string
}

type TriadBandProps = {
  id: string
  title: string
  items: readonly TriadItem[]
  listLabel: string
  className?: string
}

/**
 * Clean three-word band with a soft arc — one body of copy under the active word.
 */
export function TriadBand({ id, title, items, listLabel, className }: TriadBandProps) {
  const reduced = useReducedMotion() === true
  const [active, setActive] = useState(1)
  const current = items[active] ?? items[1]

  return (
    <section id={id} className={cn('bg-page-white section-y', className)} aria-labelledby={`${id}-title`}>
      <Container variant="wide" className="w-full">
        <h2 id={`${id}-title`} className="sr-only">
          {title}
        </h2>

        <div className="relative mx-auto max-w-5xl pt-4 md:pt-8">
          <svg
            className="pointer-events-none absolute top-0 left-1/2 hidden h-16 w-[min(100%,52rem)] -translate-x-1/2 sm:block md:h-20"
            viewBox="0 0 800 80"
            fill="none"
            aria-hidden="true"
          >
            <m.path
              d="M40 62 C 180 62, 260 18, 400 18 C 540 18, 620 62, 760 62"
              stroke="var(--color-brand)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.55 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={reduced ? { duration: 0 } : { duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
            {[40, 400, 760].map((cx, index) => (
              <m.circle
                key={cx}
                cx={cx}
                cy={index === 1 ? 18 : 62}
                r="5"
                fill="var(--color-brand)"
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={
                  reduced ? { duration: 0 } : { ...houseSpring, delay: 0.35 + index * 0.08 }
                }
              />
            ))}
          </svg>

          <div
            className="relative mt-14 grid grid-cols-1 gap-10 text-center sm:mt-16 sm:grid-cols-3 sm:gap-6 md:mt-20"
            role="tablist"
            aria-label={listLabel}
          >
            {items.map((item, index) => {
              const on = index === active
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(index)}
                  onPointerEnter={() => {
                    if (!reduced) setActive(index)
                  }}
                  className={cn(
                    'justify-self-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand',
                    index === 0 && 'sm:justify-self-start',
                    index === 2 && 'sm:justify-self-end',
                  )}
                >
                  <span
                    className={cn(
                      'block text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em] transition-colors',
                      on ? 'text-text' : 'text-text-muted',
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mx-auto mt-6 min-h-24 max-w-[28rem] text-center sm:mt-8 md:min-h-20">
            <AnimatePresence mode="wait">
              <m.p
                key={current.id}
                role="tabpanel"
                className="text-body text-text-secondary"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={houseSpring}
              >
                {current.body}
              </m.p>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  )
}
