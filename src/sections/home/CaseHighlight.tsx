import { Container } from '@/components/layout/Container.tsx'
import { TintPanel } from '@/components/layout/TintPanel.tsx'
import { Parallax } from '@/components/motion/Parallax.tsx'
import { Reveal, RevealText } from '@/components/motion/Reveal.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { homeContent } from '@/content/home.ts'
import { mockups } from '@/content/mockups.ts'

/**
 * One case, told plainly: the problem in the legacy site's words, the product
 * beside it. Not a testimonial, so no quotation marks.
 */
export function CaseHighlight() {
  const copy = homeContent.caseHighlight

  return (
    <section id="proof" className="relative py-2 md:py-3" aria-labelledby="case-highlight-title">
      <TintPanel tint="cream">
        <div className="section-y md:px-8">
      <Container variant="wide" className="relative w-full">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal as="figure" variant="clip" className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-border bg-white p-6 sm:p-10">
              <Parallax amount={24}>
                <img
                  src={mockups.optimizedStrengthScreens}
                  alt="Optimized Strength app screens"
                  className="mx-auto h-auto w-full max-w-[40rem] object-contain"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </Parallax>
            </div>
          </Reveal>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal variant="fade">
              <p className="inline-flex rounded-pill bg-accent px-3 py-1 text-caption font-semibold text-text">{copy.eyebrow}</p>
            </Reveal>
            <h2 id="case-highlight-title" className="mt-4 text-section-title text-text">
              <RevealText text={copy.title} delay={80} />
            </h2>
            <Reveal delay={220}>
              <p className="mt-6 text-body-large text-text-secondary">{copy.problem}</p>
            </Reveal>
            <Reveal delay={340}>
              <p className="mt-5 border-l-[3px] border-accent ps-5 text-body-large font-medium text-text">{copy.answer}</p>
            </Reveal>
            <Reveal delay={440}>
              <TextLink to={copy.to} className="mt-6">
                {copy.cta}
              </TextLink>
            </Reveal>
          </div>
        </div>
      </Container>
        </div>
      </TintPanel>
    </section>
  )
}

export default CaseHighlight
