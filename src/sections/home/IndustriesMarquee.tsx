import { Reveal } from '@/components/motion/Reveal.tsx'
import { PaperSection } from '@/components/paper/kit.tsx'
import { homeContent } from '@/content/home.ts'

/** A printer's registration mark: a circle and a cross. */
function RegistrationMark() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0 text-[var(--ph-blue)]" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="10" cy="10" r="5.5" />
      <path d="M10 1v18M1 10h18" />
    </svg>
  )
}

/**
 * 02 — "We also build for…": the industries as an uppercase marquee that drifts
 * past slowly (two copies, the second hidden from screen readers).
 * It directly follows the hero's tear, so the tear's paper is its top padding.
 */
export function IndustriesMarquee() {
  const items = homeContent.industries

  return (
    <PaperSection tone="white" labelledBy="also-build-title" grid={false} crop={false} className="pt-8 pb-16 md:pt-8 md:pb-16">
      <h2 id="also-build-title" className="sr-only">
        Healthcare leads. We also build for
      </h2>
      <div className="marquee-mask -mx-[clamp(20px,5vw,96px)] overflow-hidden">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 ? true : undefined}>
              {items.map((item, index) => (
                <Reveal as="li" key={item} variant="fade" delay={copy === 0 ? index * 90 : 0} className="flex items-center">
                  <span className="px-8 text-[length:clamp(1.5rem,1rem+2vw,2.5rem)] leading-none font-medium tracking-[0.06em] text-[var(--ph-navy)] uppercase">
                    {item}
                  </span>
                  <RegistrationMark />
                </Reveal>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </PaperSection>
  )
}
