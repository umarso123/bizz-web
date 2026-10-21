import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useId, useState } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { TintPanel } from '@/components/layout/TintPanel.tsx'
import { Parallax } from '@/components/motion/Parallax.tsx'
import { Reveal, RevealText } from '@/components/motion/Reveal.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { Wayfinder } from '@/components/ui/Wayfinder.tsx'
import { CareWorkspaceShot } from '@/components/visuals/HealthShots.tsx'
import { healthcareIntro, healthcareSolutions } from '@/content/healthcare.ts'
import { cn } from '@/lib/cn.ts'

function Toggle({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300',
        open ? 'border-accent bg-accent text-text' : 'border-border-strong text-text group-hover:border-text/60',
      )}
    >
      <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
      <span
        className={cn(
          'absolute h-3.5 w-[1.5px] rounded-full bg-current transition-transform duration-300 ease-standard',
          open && 'scale-y-0',
        )}
      />
    </span>
  )
}

/**
 * The healthcare wing: the five solutions over the shared page background,
 * each opening to the full description from the legacy site.
 */
export function HealthcareZone() {
  const reduced = useReducedMotion() === true
  const [open, setOpen] = useState<number>(0)
  const baseId = useId()

  return (
    <section id="healthcare" className="relative py-2 text-text md:py-3" aria-labelledby="healthcare-zone-title">
      <TintPanel tint="lightblue">
        <div className="section-y md:px-8">
      <Container variant="wide" className="relative w-full">
        <Wayfinder label="Healthcare" meta={`${healthcareSolutions.length} solutions`} />

        <div className="mt-12 grid gap-14 md:mt-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 id="healthcare-zone-title" className="max-w-[12ch] text-section-title text-text">
              <RevealText text={healthcareIntro.title} />
            </h2>
            <Reveal delay={200}>
              <p className="mt-6 max-w-[34rem] text-body-large text-text-secondary">{healthcareIntro.body}</p>
            </Reveal>
            <Reveal delay={320} className="mt-10 flex flex-wrap items-center gap-3">
              <Button size="lg" variant="primary" to="/healthcare">
                Explore healthcare
              </Button>
            </Reveal>

            <Reveal variant="clip" delay={150} className="mt-12 hidden overflow-hidden rounded-2xl lg:block">
              <Parallax amount={28} className="aspect-[16/11]">
                <CareWorkspaceShot />
              </Parallax>
            </Reveal>
          </div>

          <ul className="lg:col-span-6 lg:col-start-7">
            {healthcareSolutions.map((item, index) => {
              const isOpen = open === index
              const panelId = `${baseId}-panel-${item.id}`
              const buttonId = `${baseId}-button-${item.id}`
              return (
                <Reveal as="li" key={item.id} delay={index * 90} className="border-t border-border last:border-b">
                  <h3 className="text-title">
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? -1 : index)}
                      className="group flex w-full items-center gap-5 py-6 text-left text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:py-7"
                    >
                      <HexMark variant={isOpen ? 'active' : 'station'} size={18} />
                      <span className="flex-1 text-title text-text">{item.title}</span>
                      <Toggle open={isOpen} />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <m.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 ps-[2.375rem] pe-14">
                          <p className="max-w-[36rem] text-body text-text-secondary">{item.body}</p>
                          <TextLink to={`/work/${item.slug}`} className="mt-3">
                            View case study
                          </TextLink>
                        </div>
                      </m.div>
                    ) : null}
                  </AnimatePresence>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </Container>
        </div>
      </TintPanel>
    </section>
  )
}
