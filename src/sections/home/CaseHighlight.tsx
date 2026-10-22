import type { CSSProperties, Ref } from 'react'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperLink } from '@/components/paper/kit.tsx'
import { CropMarks, PaperPin, usePaperGrain } from '@/components/paper/paper.tsx'
import { homeContent } from '@/content/home.ts'
import { mockups } from '@/content/mockups.ts'
import { cn } from '@/lib/cn.ts'
import { paperInk } from '@/lib/paper-theme.ts'

type CaseHighlightProps = {
  className?: string
  /** The centre tear holds the text back until the gap is wide enough. */
  contentRef?: Ref<HTMLDivElement>
}

/**
 * One case, told plainly, on a brand-blue sheet: the product as a cream poster
 * pinned with the screen's one yellow pin, the problem in the legacy site's words
 * beside it. Not a testimonial, so no quotation marks.
 */
export function CaseHighlight({ className, contentRef }: CaseHighlightProps) {
  const copy = homeContent.caseHighlight
  const grain = usePaperGrain()

  return (
    <section
      id="proof"
      aria-labelledby="case-highlight-title"
      className={cn('relative flex flex-col bg-[var(--ph-blue)] text-white', className)}
    >
      <div aria-hidden="true" className="ph-grid-inverse absolute inset-0" />
      <div aria-hidden="true" className="ph-grain absolute inset-0" style={{ '--ph-grain': grain } as CSSProperties} />

      <div className="ph-container pt-[calc(var(--header-clearance)+0.5rem)] pb-10 md:pb-14">
        <div ref={contentRef} className="relative py-6 md:py-8">
          <CropMarks className="-inset-x-3 hidden text-white md:block" />

          <div className="grid grid-cols-12 items-center gap-6">
            {/* The case poster */}
            <Reveal as="figure" variant="rise" className="relative col-span-12 lg:col-span-7">
              <div className="ph-paper ph-paper-cream ph-tilt p-4 md:p-6" style={{ '--rot': '-1.2deg' } as CSSProperties}>
                <PaperPin color={paperInk.yellow} className="top-[26px] left-1/2" />
                <span className="ph-label absolute top-4 left-4 z-10 bg-[var(--ph-yellow)] px-2 py-1 text-[var(--ph-navy)] md:top-6 md:left-6">
                  Case 01 — Fitness
                </span>
                <div className="relative overflow-hidden rounded-[2px] bg-white">
                  <img
                    src={mockups.optimizedStrengthScreens}
                    alt="Optimized Strength app screens"
                    className="h-[min(52vh,30rem)] w-full object-cover object-[51%_52%]"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
                <figcaption className="ph-label mt-3 flex justify-between text-[var(--ph-grey)]">
                  <span>{copy.title}</span>
                  <span>Mobile app</span>
                </figcaption>
              </div>
            </Reveal>

            <div className="col-span-12 lg:col-span-5">
              <h2 id="case-highlight-title" className="ph-h2 text-white">
                <RevealLines lines={['Optimized', 'Strength']} stagger={100} />
              </h2>
              <Reveal delay={150}>
                <p className="ph-body mt-6 text-white/90">{copy.problem}</p>
              </Reveal>
              <Reveal delay={250}>
                <p className="ph-body mt-5 border-l-[3px] border-[var(--ph-yellow)] ps-4 font-medium text-white">
                  {copy.answer}
                </p>
              </Reveal>
              <Reveal delay={330}>
                <PaperLink to={copy.to} className="mt-6 text-white">
                  {copy.cta}
                </PaperLink>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CaseHighlight
