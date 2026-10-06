import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { bookCall } from '@/app/navigation.ts'
import { Container } from '@/components/layout/Container.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { DyeWhorl } from '@/components/ui/dye-whorl.tsx'
import { homeContent } from '@/content/home.ts'
import { floatingPortalColor } from '@/sections/home/FloatingHero.tsx'
import { HeroVisual } from '@/sections/HeroVisual.tsx'

const ease = [0.2, 0, 0, 1] as const

function Rise({ delay, children }: { delay: number; children: ReactNode }) {
  const reduced = useReducedMotion() === true

  return (
    <m.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : delay, ease }}
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
        className="relative min-h-svh overflow-x-clip"
        style={{ backgroundColor: floatingPortalColor }}
      >
        <DyeWhorl
          className="min-h-svh"
          style={{ backgroundColor: floatingPortalColor, ['--background' as string]: floatingPortalColor }}
        >
          <div className="flex min-h-svh flex-col justify-center pt-(--header-clearance) pb-12">
            <Container variant="page" className="relative w-full">
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className="flex max-w-[36rem] flex-col items-start gap-6">
                  <Rise delay={0.12}>
                    <Eyebrow tone="brand">{copy.eyebrow}</Eyebrow>
                  </Rise>
                  <m.h1
                    className="text-display text-text"
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.22, ease }}
                  >
                    {copy.title}
                  </m.h1>
                  <Rise delay={0.34}>
                    <p className="max-w-[38rem] text-body-large text-text-secondary">{copy.body}</p>
                  </Rise>
                  <Rise delay={0.46}>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button to={bookCall.to}>{copy.primaryCta}</Button>
                      <Button to="/work" variant="secondary">
                        {copy.secondaryCta}
                      </Button>
                    </div>
                  </Rise>
                  <Rise delay={0.56}>
                    <p className="text-caption font-semibold tracking-[0.08em] text-text-muted uppercase">
                      {copy.positioning}
                    </p>
                  </Rise>
                </div>
                <HeroVisual />
              </div>
            </Container>
          </div>
        </DyeWhorl>
      </section>
    </LazyMotion>
  )
}
