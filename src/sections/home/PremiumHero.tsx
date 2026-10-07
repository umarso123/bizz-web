import { m, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router'
import { Container } from '@/components/layout/Container.tsx'
import { premiumHome } from '@/content/premium-home.ts'
import { cn } from '@/lib/cn.ts'

const ease = [0.22, 1, 0.36, 1] as const

export function PremiumHero() {
  const reduced = useReducedMotion() === true
  const copy = premiumHome.hero
  const facts = premiumHome.facts.cards

  return (
    <section
      className="atmosphere-hero relative min-h-svh overflow-x-clip -mt-(--header-clearance) pt-(--header-clearance) pb-12 md:pb-16 lg:pb-20"
      aria-labelledby="premium-hero-title"
    >
      {/* Full-bleed atmosphere — extends under the glass navbar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 65% at 88% 18%, rgb(254 246 216 / 0.7), transparent 58%),
            radial-gradient(ellipse 55% 50% at 72% 42%, rgb(255 249 242 / 0.85), transparent 62%),
            radial-gradient(ellipse 45% 40% at 8% 78%, rgb(254 246 216 / 0.4), transparent 55%)
          `,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-20%] right-[-18%] h-[min(95vh,52rem)] w-[min(90vw,54rem)] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 38% 40%, rgb(254 246 216 / 0.85), rgb(255 249 242 / 0.4) 48%, transparent 72%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-5%] left-[-10%] h-80 w-80 rounded-full bg-accent/30 blur-3xl"
      />

      <Container variant="wide" className="relative z-10 w-full">
        <m.div
          className="flex flex-wrap items-center gap-3"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          <span className="inline-flex items-center rounded-pill bg-accent px-3.5 py-1.5 text-[0.78rem] font-semibold tracking-tight text-text shadow-sm">
            {copy.badge}
          </span>
          <span className="text-body-small text-text-secondary">{copy.badgeNote}</span>
        </m.div>

        <m.h1
          id="premium-hero-title"
          className="mt-8 max-w-[14ch] text-display text-text md:mt-10"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease }}
        >
          {copy.titleLead} {copy.titleAccent}
        </m.h1>

        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-end lg:gap-16">
          <m.p
            className="max-w-[34rem] text-body-large text-text-secondary"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease }}
          >
            {copy.body}
          </m.p>

          <m.div
            className="flex flex-wrap items-center gap-3 md:justify-end"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease }}
          >
            <Link
              to={copy.primaryTo}
              className={cn(
                'inline-flex min-h-(--button-height-desktop) items-center justify-center rounded-pill bg-button-primary px-7 text-body-small font-semibold text-text-inverse no-underline',
                'shadow-card transition-[transform,background-color] duration-(--duration-standard)',
                'hover:-translate-y-0.5 hover:bg-button-primary-hover',
              )}
            >
              {copy.primaryCta}
              <span aria-hidden="true" className="ms-2">
                →
              </span>
            </Link>
            <Link
              to={copy.secondaryTo}
              className="inline-flex min-h-(--button-height-desktop) items-center justify-center rounded-pill border border-border bg-surface/80 px-6 text-body-small font-semibold text-text no-underline backdrop-blur-sm transition-colors hover:border-border-strong hover:bg-surface"
            >
              {copy.secondaryCta}
            </Link>
          </m.div>
        </div>

        <ul className="mt-14 grid gap-3 sm:grid-cols-3 sm:gap-4 md:mt-16 md:gap-5" aria-label="Key facts">
          {facts.map((card, index) => (
            <m.li
              key={card.id}
              className={cn(
                'group flex min-h-[9.75rem] flex-col justify-between rounded-[1.85rem] p-6 transition-transform duration-500 md:min-h-[11.5rem] md:rounded-[2.15rem] md:p-7',
                'bg-surface/85 text-text shadow-card ring-1 ring-border-subtle backdrop-blur-sm',
              )}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 + index * 0.07, ease }}
            >
              <p
                className={cn(
                  'text-[clamp(1.7rem,1.15rem+1.7vw,2.75rem)] leading-none font-bold tracking-tighter text-text',
                )}
              >
                {card.value}
              </p>
              <p
                className={cn(
                  'mt-4 max-w-[16rem] text-body-small leading-snug text-text-secondary',
                )}
              >
                {card.label}
              </p>
            </m.li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
