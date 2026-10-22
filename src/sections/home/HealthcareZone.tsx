import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useId, useState } from 'react'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperButton, PaperLink, PaperSection, tones } from '@/components/paper/kit.tsx'
import { healthcareSolutions } from '@/content/healthcare.ts'
import { premiumHome } from '@/content/premium-home.ts'
import { cn } from '@/lib/cn.ts'

function Toggle({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative grid size-9 shrink-0 place-items-center rounded-[2px] border transition-colors duration-300',
        open ? 'border-[var(--ph-navy)] bg-[var(--ph-navy)] text-white' : 'border-[var(--ph-border)] text-[var(--ph-navy)] group-hover:border-[var(--ph-navy)]',
      )}
    >
      <span className="absolute h-[1.5px] w-3.5 bg-current" />
      <span className={cn('absolute h-3.5 w-[1.5px] bg-current transition-transform duration-300', open && 'scale-y-0')} />
    </span>
  )
}

/**
 * 03 — The healthcare wing on a yellow sheet. The intro stays in view (sticky)
 * while the five solutions, paper rows HC-01 to HC-05, open to a short summary
 * (the full legacy description lives on the Healthcare page).
 */
export function HealthcareZone() {
  const reduced = useReducedMotion() === true
  const [open, setOpen] = useState<number>(0)
  const baseId = useId()
  const t = tones.yellow

  return (
    <PaperSection tone="yellow" id="healthcare" labelledBy="healthcare-zone-title">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-clearance)+24px)]">
            <h2 id="healthcare-zone-title" className="ph-h2">
              <RevealLines lines={['Healthcare is', 'where we go deep.']} stagger={100} />
            </h2>
            <Reveal delay={160}>
              <p className="ph-lead mt-6">{premiumHome.copy.healthcareLead}</p>
            </Reveal>
            <Reveal delay={260} className="mt-8">
              <PaperButton tone={t.button} to="/healthcare">
                Explore healthcare
              </PaperButton>
            </Reveal>
          </div>
        </div>

        <ul className="col-span-12 mt-10 grid gap-3 lg:col-span-7 lg:mt-0" aria-label="Healthcare solutions">
          {healthcareSolutions.map((item, index) => {
            const isOpen = open === index
            const panelId = `${baseId}-panel-${item.id}`
            const buttonId = `${baseId}-button-${item.id}`
            return (
              <Reveal as="li" key={item.id} delay={index * 70} className="ph-paper relative p-0 md:p-0">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    className="group grid w-full grid-cols-[3.75rem_1fr_auto] items-center gap-4 px-6 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ph-blue)] md:px-8 md:py-6"
                  >
                    <span className="ph-label text-[var(--ph-grey)]">HC-0{index + 1}</span>
                    <span className="ph-h3">{item.title}</span>
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
                      <div className="border-t border-[var(--ph-border)] px-6 pt-5 pb-6 md:ps-[calc(2rem+3.75rem+1rem)] md:pe-8 md:pb-8">
                        <p className="ph-body max-w-[60ch] text-[var(--ph-grey)]">{premiumHome.copy.healthcareSummaries[item.id] ?? item.body}</p>
                        <PaperLink to={`/work/${item.slug}`} className="mt-4">
                          View case study
                        </PaperLink>
                      </div>
                    </m.div>
                  ) : null}
                </AnimatePresence>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </PaperSection>
  )
}
