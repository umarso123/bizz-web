import type { CSSProperties, PointerEvent } from 'react'
import { CountUp, Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperButton, PaperLink, tones } from '@/components/paper/kit.tsx'
import { CropMarks, PaperPin, usePaperGrain } from '@/components/paper/paper.tsx'
import { TornEdge } from '@/components/paper/TornEdge.tsx'
import { aboutPage } from '@/content/about.ts'
import { premiumHome } from '@/content/premium-home.ts'
import { paperInk } from '@/lib/paper-theme.ts'

/** The old About page's figures (content/legacy-site.md); numbers count up on arrival. */
const [projects, brands, customers] = aboutPage.impact.numbers
const stats: readonly { value?: number; label: string; text?: string }[] = [
  { value: projects.value, label: projects.label },
  { value: brands.value, label: brands.label },
  { value: customers.value, label: customers.label },
  { label: 'Founded', text: '2022' },
]

/** The Healthcare card: cream paper pinned to the hero sheet with the screen's one yellow pin. */
function HealthcareCard() {
  return (
    <Reveal variant="rise" delay={150} className="relative mt-16">
      <div
        className="ph-paper ph-paper-cream ph-tilt grid gap-6 pt-10 text-[var(--ph-navy)] md:grid-cols-12 md:items-center md:pt-8"
        style={{ '--rot': '-0.6deg' } as CSSProperties}
      >
        <PaperPin color={paperInk.yellow} className="top-[22px] left-1/2 md:left-[calc(100%/12*2)]" />
        <p className="ph-label text-[var(--ph-grey)] md:col-span-3">Industry 01 — Healthcare</p>
        <p className="ph-h3 md:col-span-4">Clinical tools, telemedicine &amp; interoperability</p>
        <ul className="flex flex-wrap gap-2 md:col-span-3" aria-label="Healthcare focus areas">
          {['EHR', 'HIE', 'Telehealth'].map((tag) => (
            <li key={tag} className="ph-label rounded-[2px] border border-[var(--ph-border)] bg-white px-2 py-1">
              {tag}
            </li>
          ))}
        </ul>
        <PaperLink to="/healthcare" className="md:col-span-2 md:justify-self-end">
          Explore healthcare
        </PaperLink>
      </div>
    </Reveal>
  )
}

/**
 * 01 — The hero is a brand-blue sheet: a faint white grid, crop marks, the label
 * row, the headline, and a torn bottom edge that rips open from a centre pin as
 * the page scrolls.
 */
export function PremiumHero() {
  const copy = premiumHome.hero
  const grain = usePaperGrain()
  const t = tones.blue

  // Pins lean toward the pointer, like the footer's.
  const lean = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const tilt = Math.max(-9, Math.min(9, ((event.clientX - box.left) / box.width - 0.5) * 18))
    event.currentTarget.style.setProperty('--tilt', `${tilt.toFixed(2)}deg`)
  }

  return (
    <section
      onPointerMove={lean}
      onPointerLeave={(event) => event.currentTarget.style.setProperty('--tilt', '0deg')}
      className={`relative -mt-(--header-clearance) ${t.sheet}`}
      aria-labelledby="premium-hero-title"
    >
      <div aria-hidden="true" className={`absolute inset-0 ${t.grid}`} />
      <div aria-hidden="true" className="ph-grain absolute inset-0" style={{ '--ph-grain': grain } as CSSProperties} />

      <div className="ph-container pt-[calc(var(--header-clearance)+32px)] pb-16">
        <CropMarks className="inset-x-[calc(clamp(20px,5vw,96px)-12px)] top-[calc(var(--header-clearance)+8px)] bottom-8 hidden text-white md:block" />

        <h1 id="premium-hero-title" className="ph-h1 text-white">
          <span className="sr-only">{copy.title}</span>
          <span aria-hidden="true">
            <RevealLines
              delay={140}
              stagger={110}
              lines={[
                'Digital products',
                'that move healthcare',
                <span key="accent" className="ph-mark">
                  forward.
                </span>,
              ]}
            />
          </span>
        </h1>

        <div className="mt-6 grid grid-cols-12 gap-6 md:mt-8 lg:items-end">
          <div className="col-span-12 lg:col-span-6">
            <Reveal delay={380}>
              <p className="ph-lead text-white">
                We design and engineer mobile apps, web platforms, and healthcare software, from idea to reality.
              </p>
            </Reveal>
            <Reveal delay={460} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <PaperButton tone={t.button}>{copy.primaryCta}</PaperButton>
              <PaperLink to={copy.secondaryTo} className="text-white">
                {copy.secondaryCta}
              </PaperLink>
            </Reveal>
          </div>

          {/* Readout: the studio at a glance */}
          <dl className="col-span-12 lg:col-span-5 lg:col-start-8" aria-label="Bizaffix at a glance">
            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                variant="fade"
                delay={200 + index * 90}
                className="flex items-baseline justify-between gap-6 border-t border-white/25 py-4 last:border-b"
              >
                <dt className={`ph-label ${t.muted}`}>{stat.label}</dt>
                <dd className="text-white tabular-nums">
                  {stat.value !== undefined ? (
                    <CountUp value={stat.value} className="text-[1.5rem] leading-none font-medium tracking-[-0.03em]" />
                  ) : (
                    <span className="text-[1.5rem] leading-none font-medium tracking-[-0.03em]">{stat.text}</span>
                  )}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <HealthcareCard />

      </div>

      {/* Hero → next: a big tear from a centre pin; the sheet rips upward */}
      <TornEdge seed={11} pin="center" under={paperInk.white} />
    </section>
  )
}

export default PremiumHero
