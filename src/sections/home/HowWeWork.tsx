import { m, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { homeContent } from '@/content/home.ts'
import { cn } from '@/lib/cn.ts'

type Stage = (typeof homeContent.process.stages)[number]

function StageImage({ stage, visible }: { stage: Stage; visible: boolean }) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden rounded-2xl bg-brand-soft shadow-lg ring-1 ring-border-subtle',
        !visible && 'opacity-0',
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(145deg, #e8eefc 0%, #fef6d8 48%, #d9e3fb 100%)
          `,
        }}
      />
      {!failed ? (
        <img
          src={stage.image}
          alt={stage.alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <p className="text-eyebrow text-brand">
            {stage.number}
          </p>
          <p className="text-[1.15rem] font-bold tracking-tight text-text">{stage.title}</p>
        </div>
      )}
    </div>
  )
}

/**
 * Focus-areas style process list.
 * Hover a row → dim siblings, reveal a floating image that follows the cursor.
 */
export function HowWeWork() {
  const reduced = useReducedMotion() === true
  const copy = homeContent.process
  const stages = copy.stages
  const listRef = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 280, damping: 28, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 280, damping: 28, mass: 0.4 })

  const onListMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (reduced) return
      const root = listRef.current
      if (!root) return
      const rect = root.getBoundingClientRect()
      rawX.set(event.clientX - rect.left + 28)
      rawY.set(event.clientY - rect.top - 120)
    },
    [rawX, rawY, reduced],
  )

  return (
    <section
      id="how-we-work"
      className="relative overflow-x-clip bg-surface section-y"
      aria-labelledby="how-we-work-title"
    >
      <Container variant="wide" className="relative w-full">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h2 id="how-we-work-title" className="sr-only">
          {copy.title}
        </h2>

        <div
          ref={listRef}
          className="relative mt-10 md:mt-12"
          onPointerMove={onListMove}
          onPointerLeave={() => setHovering(false)}
        >
          {/* Floating hover image — desktop */}
          {!reduced ? (
            <m.div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 z-20 hidden h-[11.5rem] w-[16rem] md:block lg:h-[13.5rem] lg:w-[19rem]"
              style={{ x, y }}
            >
              <m.div
                className="h-full w-full"
                animate={{
                  opacity: hovering ? 1 : 0,
                  scale: hovering ? 1 : 0.92,
                  rotate: hovering ? -2.5 : 0,
                }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <StageImage stage={stages[active] ?? stages[0]} visible={hovering} />
              </m.div>
            </m.div>
          ) : null}

          <ul className="border-t border-border">
            {stages.map((stage, index) => {
              const isActive = hovering ? index === active : index === 0
              const dimmed = hovering && index !== active

              return (
                <li key={stage.number} className="border-b border-border">
                  <button
                    type="button"
                    className={cn(
                      'grid w-full grid-cols-1 items-center gap-4 py-7 text-left transition-colors duration-300 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.4fr)] md:gap-8 md:py-8 lg:py-9',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2',
                    )}
                    onPointerEnter={() => {
                      setActive(index)
                      setHovering(true)
                    }}
                    onFocus={() => {
                      setActive(index)
                      setHovering(true)
                    }}
                    onClick={() => {
                      setActive(index)
                      setHovering(true)
                    }}
                  >
                    <span
                      className={cn(
                        'text-[clamp(1.85rem,1.35rem+1.8vw,3.35rem)] leading-none font-semibold tracking-tighter transition-colors duration-300',
                        dimmed ? 'text-text/22' : 'text-text',
                        !hovering && index !== 0 && 'text-text/28',
                        isActive && 'text-text',
                      )}
                    >
                      {stage.title}
                    </span>

                    <span
                      className={cn(
                        'grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 transition-colors duration-300',
                        dimmed ? 'text-text/20' : 'text-text-secondary',
                        !hovering && index !== 0 && 'text-text/25',
                        isActive && 'text-text-secondary',
                      )}
                    >
                      {stage.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-eyebrow text-brand"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </button>

                  {/* Mobile / reduced: inline image under active row */}
                  <div
                    className={cn(
                      'overflow-hidden transition-[max-height,opacity] duration-400 md:hidden',
                      index === active ? 'max-h-56 opacity-100 pb-6' : 'max-h-0 opacity-0',
                    )}
                  >
                    <div className="aspect-16/10 max-w-sm overflow-hidden rounded-2xl">
                      <StageImage stage={stage} visible={index === active} />
                    </div>
                    <p className="mt-3 max-w-md text-body-small text-text-secondary">{stage.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
