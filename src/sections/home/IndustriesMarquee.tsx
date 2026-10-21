import { Container } from '@/components/layout/Container.tsx'
import { Reveal } from '@/components/motion/Reveal.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { homeContent } from '@/content/home.ts'

/**
 * "We also build for…": the industries fade in one by one, then drift past
 * slowly as a marquee (two copies, the second hidden from screen readers).
 */
export function IndustriesMarquee() {
  const items = homeContent.industries

  return (
    <section className="relative py-12 md:py-16" aria-labelledby="also-build-title">
      <Container variant="wide" className="relative w-full">
        <Reveal variant="fade">
          <p id="also-build-title" className="text-eyebrow text-text-secondary">
            Healthcare leads. We also build for
          </p>
        </Reveal>
      </Container>
      <div className="marquee-mask mt-5 overflow-hidden">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 ? true : undefined}>
              {items.map((item, index) => (
                <Reveal as="li" key={item} variant="fade" delay={copy === 0 ? index * 110 : 0} className="flex items-center">
                  <span className="px-8 text-[length:clamp(1.5rem,1.1rem+1.2vw,2.25rem)] font-semibold tracking-[-0.02em] text-text/80 [font-stretch:86%]">
                    {item}
                  </span>
                  <HexMark variant="outline" size={14} className="text-brand/40" />
                </Reveal>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
