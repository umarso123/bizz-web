import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router'
import { bookCallButtonProps } from '@/app/navigation.ts'
import { Container } from '@/components/layout/Container.tsx'
import { CountUp, Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { homeContent } from '@/content/home.ts'
import { premiumHome } from '@/content/premium-home.ts'
import { servicesPage } from '@/content/services.ts'

/** Facts from the site's own content; numbers count up on arrival. */
const stats: readonly { value?: number; label: string }[] = [
  { label: 'Mobile · Web · Cloud' },
  { value: servicesPage.services.length, label: 'core services' },
  { value: homeContent.industries.length, label: 'industries served' },
]

function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** The flat Healthcare card: overlaps the hero's bottom edge and rises into place on scroll. */
function HealthcareCard() {
  const reduced = useReducedMotion() === true
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 55%'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, 0])
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1])

  return (
    <Container variant="wide" className="relative z-10 -mt-6 w-full">
      <m.div
        ref={ref}
        style={reduced ? undefined : { y, opacity }}
        className="flex flex-col gap-5 rounded-[20px] border border-border bg-white/75 p-6 backdrop-blur-md md:flex-row md:items-center md:gap-8 md:p-7"
      >
        <p className="flex shrink-0 items-center gap-2 text-eyebrow font-semibold text-text">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent ring-2 ring-accent/30" />
          Healthcare
        </p>
        <p className="min-w-0 flex-1 text-[1.125rem] leading-snug font-semibold text-text md:text-[1.25rem]">
          Clinical tools, telemedicine &amp; interoperability
        </p>
        <ul className="flex shrink-0 flex-wrap gap-2" aria-label="Healthcare focus areas">
          {['EHR', 'HIE', 'Telehealth'].map((tag) => (
            <li key={tag} className="rounded-pill border border-[rgb(15_23_42/0.08)] bg-white/70 px-3 py-1 text-caption font-medium text-text">
              {tag}
            </li>
          ))}
        </ul>
        <Link
          to="/healthcare"
          className="group inline-flex shrink-0 items-center gap-2 text-body-small font-semibold text-brand no-underline hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          Explore healthcare
          <Arrow />
        </Link>
      </m.div>
    </Container>
  )
}

export function PremiumHero() {
  const copy = premiumHome.hero

  return (
    <>
      <section
        className="relative -mt-(--header-clearance) flex min-h-[calc(100svh-3.5rem)] flex-col pt-[calc(var(--header-clearance)+2rem)]"
        aria-labelledby="premium-hero-title"
      >
        <Container variant="wide" className="relative my-auto w-full py-10 lg:py-14">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <Reveal variant="fade">
                <p className="flex items-center gap-2 text-eyebrow text-text-secondary">
                  <HexMark variant="solid" size={10} />
                  Technology studio · Austin, Texas
                </p>
              </Reveal>

              <h1
                id="premium-hero-title"
                className="mt-6 text-[length:clamp(2.5rem,6vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.03em] text-text [font-stretch:84%]"
              >
                <span className="sr-only">{copy.title}</span>
                <span aria-hidden="true">
                  <RevealLines
                    delay={120}
                    lines={[
                      'Digital products',
                      'that move healthcare',
                      <span key="accent" className="font-['Instrument_Serif'] font-normal tracking-[-0.01em] text-brand italic [font-stretch:100%]">
                        forward.
                      </span>,
                    ]}
                  />
                </span>
              </h1>

              <Reveal delay={420}>
                <p className="mt-7 max-w-[60ch] text-body-large text-text-secondary">
                  We design and engineer mobile apps, web platforms, and healthcare software, from idea to reality.
                </p>
              </Reveal>

              <Reveal delay={520} className="mt-9 flex flex-wrap items-center gap-3">
                <Button size="lg" variant="brand" {...bookCallButtonProps()}>
                  {copy.primaryCta}
                </Button>
                <Button size="lg" variant="ghost" href={copy.secondaryTo} className="group" trailingIcon={<Arrow />}>
                  {copy.secondaryCta}
                </Button>
              </Reveal>
            </div>

            {/* Breathing space where the background shows, with three small facts */}
            <ul className="flex flex-col items-start gap-3 lg:col-span-4 lg:col-start-9 lg:items-end" aria-label="Bizaffix at a glance">
              {stats.map((stat, index) => (
                <Reveal as="li" key={stat.label} variant="fade" delay={650 + index * 120} className={index === 1 ? 'lg:me-16' : undefined}>
                  <span
                    className="pill-float inline-flex items-baseline gap-2 rounded-pill border border-border bg-white/60 px-5 py-2.5 backdrop-blur-md"
                    style={{ animationDelay: `-${index * 2}s` }}
                  >
                    {stat.value !== undefined ? <CountUp value={stat.value} className="text-title text-text" /> : null}
                    <span className={stat.value !== undefined ? "text-body-small text-text-secondary" : "text-body-small font-semibold text-text"}>{stat.label}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <HealthcareCard />
    </>
  )
}

export default PremiumHero
