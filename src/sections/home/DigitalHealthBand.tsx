import { m, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { premiumHome } from '@/content/premium-home.ts'
import { cn } from '@/lib/cn.ts'

export function DigitalHealthBand() {
  const reduced = useReducedMotion() === true
  const copy = premiumHome.healthcare

  return (
    <section
      id="digital-health"
      className="relative overflow-hidden bg-page-white section-y"
      aria-labelledby="digital-health-title"
    >
      <Container variant="wide" className="relative z-10 w-full">
        <m.div
          className="overflow-hidden rounded-[2.15rem] bg-surface-dark px-6 py-11 text-text-inverse shadow-lg md:rounded-[2.75rem] md:px-12 md:py-16 lg:px-16"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 58% 72% at 92% 12%, rgb(47 91 234 / 0.55), transparent 58%), radial-gradient(ellipse 42% 48% at 8% 88%, rgb(245 200 76 / 0.22), transparent 52%)',
          }}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <Eyebrow inverse>{copy.label}</Eyebrow>
          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
            <div>
              <h2 id="digital-health-title" className="max-w-[14ch] text-section-title text-white">
                {copy.title}
              </h2>
              <p className="mt-4 max-w-[36rem] text-body-large text-white/70">{copy.body}</p>
            </div>
            <div>
              <ul className="flex flex-wrap gap-2">
                {copy.offers.map((offer) => (
                  <li
                    key={offer}
                    className="rounded-pill border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.78rem] font-medium text-white/85"
                  >
                    {offer}
                  </li>
                ))}
              </ul>
              <Link
                to={copy.ctaTo}
                className={cn(
                  'mt-7 inline-flex min-h-(--button-height) items-center rounded-pill bg-accent px-5 text-body-small font-semibold text-text no-underline',
                  'transition-colors hover:bg-accent-deep',
                )}
              >
                {copy.cta}
                <span aria-hidden="true" className="ms-2">
                  →
                </span>
              </Link>
            </div>
          </div>
        </m.div>
      </Container>
    </section>
  )
}
