import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { useRef, useState, type CSSProperties, type Ref } from 'react'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperSection, tones } from '@/components/paper/kit.tsx'
import { PaperPin, usePaperGrain } from '@/components/paper/paper.tsx'
import { homeContent } from '@/content/home.ts'
import { cn } from '@/lib/cn.ts'
import { useMediaQuery } from '@/sections/home/homeJourney.ts'
import { WorkStill } from '@/sections/work/WorkStill.tsx'

type Stage = (typeof homeContent.process.stages)[number]

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
const t = tones.periwinkle

function StepImage({ stage }: { stage: Stage }) {
  const still = 'still' in stage ? stage.still : 'healthcare'
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] border border-[var(--ph-border)] bg-[var(--ph-light-blue)]">
      {stage.image ? (
        <img src={stage.image} alt={stage.alt} className="absolute inset-0 h-full w-full object-contain p-4" loading="lazy" decoding="async" draggable={false} />
      ) : (
        <WorkStill slug={still} />
      )}
    </div>
  )
}

function StepText({ stage, index, total }: { stage: Stage; index: number; total: number }) {
  return (
    <div className="min-w-0">
      <p className="ph-label text-[var(--ph-grey)]">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </p>
      <h3 className="ph-h3 mt-3">{stage.title}</h3>
      <p className="ph-body mt-3 text-[var(--ph-grey)]">{stage.body}</p>
    </div>
  )
}

/** Where a page sits relative to the active step: front, peeking behind, or gone above. */
function placement(offset: number) {
  if (offset < 0) return { transform: 'translateY(-40px) scale(1)', opacity: 0, z: 0 }
  if (offset === 0) return { transform: 'translateY(0) scale(1)', opacity: 1, z: 30 }
  if (offset === 1) return { transform: 'translateY(-12px) scale(0.96)', opacity: 1, z: 20 }
  if (offset === 2) return { transform: 'translateY(-24px) scale(0.92)', opacity: 1, z: 10 }
  return { transform: 'translateY(-24px) scale(0.92)', opacity: 0, z: 0 }
}

/** Five small marks, the active one navy and wide. */
function Progress({ active, total }: { active: number; total: number }) {
  return (
    <ol className="mt-16 flex items-center gap-2" aria-label={`Step ${active + 1} of ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <li
          key={index}
          className={cn(
            'h-1.5 transition-all duration-500',
            ease,
            index === active ? 'w-10 bg-[var(--ph-navy)]' : index < active ? 'w-3 bg-[rgb(13_18_31/0.5)]' : 'w-3 bg-[rgb(13_18_31/0.2)]',
          )}
        />
      ))}
    </ol>
  )
}

/**
 * 08 — What sets us apart: the five real process steps on a periwinkle sheet.
 * On wide screens the section pins and the pages cycle as you scroll; on phones
 * and with reduced motion they simply stack.
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
  const grain = usePaperGrain()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActive(Math.min(total - 1, Math.max(0, Math.floor(value * total))))
  })

  const intro = (
    <div>
      <h2 id="apart-title" className="ph-h2">
        <RevealLines
          stagger={100}
          lines={[
            'What sets us',
            <span key="accent" className="ph-mark">
              apart.
            </span>,
          ]}
        />
      </h2>
      <Reveal delay={160}>
        <p className="ph-lead mt-6">{copy.body}</p>
      </Reveal>
      <Reveal delay={240}>
        <p className={cn('ph-body mt-4 max-w-[60ch]', t.muted)}>
          With our team of skilled experts, we’re not just about lines of code; we’re about building relationships.
        </p>
      </Reveal>
    </div>
  )

  if (!pinned) {
    return (
      // The wrapper carries the scroll ref here too, so the scroll hook always has a target.
      <div ref={sectionRef as unknown as Ref<HTMLDivElement>}>
      <PaperSection tone="periwinkle" id="how-we-work" labelledBy="apart-title">
        {intro}
        <ol className="mt-16 grid gap-6 md:grid-cols-2">
          {stages.map((stage, index) => (
            <Reveal as="li" key={stage.number} delay={(index % 2) * 80} className="ph-paper flex flex-col gap-6">
              <StepImage stage={stage} />
              <StepText stage={stage} index={index} total={total} />
            </Reveal>
          ))}
        </ol>
      </PaperSection>
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      id="how-we-work"
      className={cn('relative', t.sheet)}
      style={{ height: `${total * 70 + 40}vh` }}
      aria-labelledby="apart-title"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', t.grid)} />
        <div aria-hidden="true" className="ph-grain ph-grain-light pointer-events-none absolute inset-0" style={{ '--ph-grain': grain } as CSSProperties} />
        <div className="ph-container pt-[calc(var(--header-clearance)+8px)]">
          <div className="grid grid-cols-12 items-center gap-6">
            <div className="col-span-5">
              {intro}
              <Progress active={active} total={total} />
            </div>

            {/* The pad of pages stays in its own seven columns, clear of the text */}
            <ol className="relative col-span-7 h-[400px] w-full" aria-label="Process steps">
              {stages.map((stage, index) => {
                const place = placement(index - active)
                const front = index === active
                return (
                  <li
                    key={stage.number}
                    aria-hidden={front ? undefined : true}
                    className={cn('ph-paper absolute inset-x-0 top-6 h-[376px] origin-top p-0 transition-[transform,opacity] duration-700 md:p-0', ease)}
                    style={{ transform: place.transform, opacity: place.opacity, zIndex: place.z }}
                  >
                    {front ? <PaperPin className="top-[22px] left-1/2" /> : null}
                    <div
                      className={cn(
                        'grid h-full grid-cols-[52%_minmax(0,1fr)] items-center gap-6 p-6 transition-opacity duration-500 md:p-8',
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
        </div>
      </div>
    </section>
  )
}
