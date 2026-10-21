import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { useRef, useState } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { TintPanel } from '@/components/layout/TintPanel.tsx'
import { Reveal, RevealText } from '@/components/motion/Reveal.tsx'
import { Wayfinder } from '@/components/ui/Wayfinder.tsx'
import { homeContent } from '@/content/home.ts'
import { cn } from '@/lib/cn.ts'
import { useMediaQuery } from '@/sections/home/homeJourney.ts'
import { WorkStill } from '@/sections/work/WorkStill.tsx'

type Stage = (typeof homeContent.process.stages)[number]

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

function StepImage({ stage }: { stage: Stage }) {
  const still = 'still' in stage ? stage.still : 'healthcare'
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-bg-subtle">
      {stage.image ? (
        <img
          src={stage.image}
          alt={stage.alt}
          className="absolute inset-0 h-full w-full object-contain p-4"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ) : (
        <WorkStill slug={still} />
      )}
    </div>
  )
}

function StepText({ stage, index, total }: { stage: Stage; index: number; total: number }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.8rem] text-text-muted tabular-nums">
        Step {index + 1} of {total}
      </p>
      <h3 className="mt-2 text-[length:clamp(1.75rem,1.4rem+0.8vw,2rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-text">
        {stage.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-[1rem] leading-[1.55] text-text-secondary">{stage.body}</p>
    </div>
  )
}

/** Where a card sits relative to the active step: front, peeking behind, or gone above. */
function placement(offset: number) {
  if (offset < 0) return { transform: 'translateY(-40px) scale(1)', opacity: 0, bg: 'bg-white', z: 0 }
  if (offset === 0) return { transform: 'translateY(0) scale(1)', opacity: 1, bg: 'bg-white', z: 30 }
  if (offset === 1) return { transform: 'translateY(-12px) scale(0.96)', opacity: 1, bg: 'bg-white/70', z: 20 }
  if (offset === 2) return { transform: 'translateY(-24px) scale(0.92)', opacity: 1, bg: 'bg-white/50', z: 10 }
  return { transform: 'translateY(-24px) scale(0.92)', opacity: 0, bg: 'bg-white/50', z: 0 }
}

function Progress({ active, total }: { active: number; total: number }) {
  return (
    <ol className="mt-10 flex items-center gap-2.5" aria-label={`Step ${active + 1} of ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <li
          key={index}
          className={cn(
            'h-2 rounded-full transition-all duration-500',
            ease,
            index === active ? 'w-8 bg-brand' : index < active ? 'w-2 bg-brand/45' : 'w-2 bg-border-strong',
          )}
        />
      ))}
      <li aria-hidden="true" className="ms-2 size-2 rounded-full bg-accent" />
    </ol>
  )
}

/**
 * What sets us apart: the five real process steps. On wide screens the section
 * pins and the cards cycle as you scroll; on phones and with reduced motion they
 * simply stack.
 */
export function ApproachStack() {
  const reduced = useReducedMotion() === true
  const wide = useMediaQuery('(min-width: 1024px)')
  const pinned = wide && !reduced
  const copy = homeContent.process
  const stages = copy.stages
  const total = stages.length
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActive(Math.min(total - 1, Math.max(0, Math.floor(value * total))))
  })

  const intro = (
    <div>
      <Wayfinder label={copy.eyebrow} meta={`${total} steps`} />
      <h2 id="apart-title" className="mt-10 text-section-title text-text">
        <RevealText text="What sets us" />{' '}
        <Reveal
          as="span"
          variant="fade"
          delay={260}
          className="inline-block font-['Instrument_Serif'] font-normal tracking-normal text-brand italic [font-stretch:100%]"
        >
          apart.
        </Reveal>
      </h2>
      <Reveal delay={200}>
        <p className="mt-6 max-w-[34rem] text-body-large text-text-secondary">{copy.body}</p>
      </Reveal>
      <Reveal delay={320}>
        <p className="mt-5 max-w-[34rem] text-body-small text-text-muted">
          With our team of skilled experts, we’re not just about lines of code; we’re about building relationships.
        </p>
      </Reveal>
    </div>
  )

  if (!pinned) {
    return (
      <section ref={sectionRef} id="how-we-work" className="relative py-2 md:py-3" aria-labelledby="apart-title">
        <TintPanel tint="periwinkle">
        <div className="section-y md:px-8">
        <Container variant="wide" className="relative w-full">
          {intro}
          <ol className="mt-12 grid gap-5 md:grid-cols-2">
            {stages.map((stage, index) => (
              <Reveal
                as="li"
                key={stage.number}
                delay={index * 80}
                className="flex flex-col gap-5 rounded-[20px] border border-border bg-white/90 p-5 backdrop-blur-sm sm:p-6"
              >
                <StepImage stage={stage} />
                <StepText stage={stage} index={index} total={total} />
              </Reveal>
            ))}
          </ol>
        </Container>
        </div>
        </TintPanel>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="how-we-work" className="relative" style={{ height: `${total * 70 + 40}vh` }} aria-labelledby="apart-title">
      <div className="sticky top-0 flex h-svh items-stretch px-3 py-4 md:px-5 md:py-5">
        <div className="mx-auto flex w-full max-w-[1360px] items-center rounded-[24px] bg-[linear-gradient(135deg,rgb(179_197_250/0.9),rgb(231_237_252/0.9))] md:rounded-[32px] md:px-8">
        <Container variant="wide" className="relative w-full">
          <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-16">
            <div>
              {intro}
              <Progress active={active} total={total} />
            </div>

            {/* The stack never grows past 680px, so it can't reach the text */}
            <ol className="relative h-[400px] w-full max-w-[680px] justify-self-end" aria-label="Process steps">
              {stages.map((stage, index) => {
                const place = placement(index - active)
                const front = index === active
                return (
                  <li
                    key={stage.number}
                    aria-hidden={front ? undefined : true}
                    className={cn(
                      'absolute inset-x-0 top-6 h-[376px] origin-top rounded-[20px] border border-white/70 transition-[transform,opacity,background-color,box-shadow] duration-700',
                      ease,
                      place.bg,
                      front && 'shadow-[0_12px_32px_rgb(15_23_42/0.08)]',
                    )}
                    style={{ transform: place.transform, opacity: place.opacity, zIndex: place.z }}
                  >
                    <div
                      className={cn(
                        'grid h-full grid-cols-[52%_minmax(0,1fr)] items-center gap-6 p-6 transition-opacity duration-500',
                        front ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      <StepImage stage={stage} />
                      <StepText stage={stage} index={index} total={total} />
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </Container>
        </div>
      </div>
    </section>
  )
}
