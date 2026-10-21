import { Container } from '@/components/layout/Container.tsx'
import { TintPanel } from '@/components/layout/TintPanel.tsx'
import { CountUp, Reveal, RevealText } from '@/components/motion/Reveal.tsx'
import { healthcareSolutions } from '@/content/healthcare.ts'
import { homeContent } from '@/content/home.ts'
import { servicesPage } from '@/content/services.ts'

/** Every figure here is counted from the site's own content. */
const stats = [
  { value: healthcareSolutions.length, label: 'Healthcare solutions', note: 'From decision support to interoperability' },
  { value: servicesPage.services.length, label: 'Core services', note: 'Across mobile, web, and cloud' },
  { value: homeContent.industries.length, label: 'Industries', note: 'Healthcare leads the way' },
  { value: 5, label: 'Project types', note: 'Website, logo, UI/UX, product, dashboard' },
] as const

/** The numbers, on the dark panel: white text, yellow figures counting up. */
export function StatsBand() {
  return (
    <section className="relative py-2 md:py-3" aria-labelledby="stats-title">
      <TintPanel tint="dark">
        <div className="section-y md:px-8">
          <Container variant="wide" className="relative w-full">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
              <h2 id="stats-title" className="max-w-[14ch] text-section-title text-white lg:col-span-5">
                <RevealText text="From idea to reality." />
              </h2>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:col-span-7 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <Reveal key={stat.label} delay={index * 100} className="border-t border-white/15 pt-5">
                    <dd className="text-[length:clamp(2.75rem,2rem+2.5vw,4rem)] leading-none font-semibold tracking-[-0.03em] text-accent [font-stretch:84%]">
                      <CountUp value={stat.value} />
                    </dd>
                    <dt className="mt-3 text-body-small font-semibold text-white">{stat.label}</dt>
                    <dd className="mt-1 text-caption text-white/65">{stat.note}</dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </Container>
        </div>
      </TintPanel>
    </section>
  )
}
