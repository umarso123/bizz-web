import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { bookCallButtonProps } from '@/app/navigation.ts'
import { Container } from '@/components/layout/Container.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { homeContent } from '@/content/home.ts'
import { cn } from '@/lib/cn.ts'

const ease = [0.2, 0, 0, 1] as const

function Rise({ delay, children }: { delay: number; children: ReactNode }) {
  const reduced = useReducedMotion() === true

  return (
    <m.div
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : delay, ease }}
    >
      {children}
    </m.div>
  )
}

export function Hero() {
  const reduced = useReducedMotion() === true
  const copy = homeContent.hero

  return (
    <LazyMotion features={domAnimation}>
      <section
        className="atmosphere-hero relative overflow-x-clip pt-(--header-clearance) pb-16 md:pb-20"
        aria-labelledby="hero-title"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-[-8%] h-[min(70vh,36rem)] w-[min(70vw,40rem)] rounded-full opacity-90 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at 40% 40%, rgb(47 91 234 / 0.55), rgb(201 215 248 / 0.35) 45%, transparent 70%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-10%] left-[-5%] h-64 w-64 rounded-full bg-accent-soft/80 blur-3xl"
        />

        <Container variant="page" className="relative z-10 w-full">
          <div className="flex max-w-[52rem] flex-col items-start">
            <Rise delay={0.08}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-accent-soft px-3.5 py-1.5 text-[0.78rem] font-semibold text-text">
                  {copy.badge}
                </span>
                <span className="text-body-small text-text-muted">{copy.support}</span>
              </div>
            </Rise>

            <m.h1
              id="hero-title"
              className="mt-7 text-display text-text md:mt-8"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : 0.16, ease }}
            >
              {copy.titleLead}
              <br />
              {copy.titleMid}
              <br />
              {copy.titleEnd}{' '}
              <span className="text-brand">{copy.titleAccent}</span>
            </m.h1>

            <Rise delay={0.28}>
              <p className="mt-6 max-w-[36rem] text-body-large text-text-secondary md:mt-7">
                {copy.body}
              </p>
            </Rise>

            <Rise delay={0.38}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button {...bookCallButtonProps()} variant="brand" size="lg">
                  {copy.primaryCta}
                  <span aria-hidden="true">→</span>
                </Button>
                <Button to="/#featured-projects" variant="secondary" size="lg">
                  {copy.secondaryCta}
                </Button>
              </div>
            </Rise>
          </div>

          <Rise delay={0.48}>
            <ul className="mt-14 grid gap-4 sm:grid-cols-3 md:mt-16 md:gap-5">
              {copy.stats.map((stat) => (
                <li
                  key={stat.id}
                  className={cn(
                    'rounded-[1.75rem] px-6 py-7 shadow-card md:rounded-[2rem] md:px-7 md:py-8',
                    stat.tone === 'brand'
                      ? 'bg-brand text-white'
                      : 'border border-border-subtle bg-surface text-text',
                  )}
                >
                  <p
                    className={cn(
                      'text-[clamp(1.65rem,1.2rem+1.4vw,2.35rem)] leading-none font-bold tracking-tighter',
                      stat.tone === 'brand' ? 'text-white' : 'text-text',
                    )}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={cn(
                      'mt-3 text-body-small leading-snug',
                      stat.tone === 'brand' ? 'text-white/80' : 'text-text-secondary',
                    )}
                  >
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </Rise>
        </Container>
      </section>
    </LazyMotion>
  )
}
