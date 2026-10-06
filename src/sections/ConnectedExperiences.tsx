import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { CareDevice } from '@/sections/CareDevice.tsx'

export function ConnectedExperiences() {
  const reduced = useReducedMotion() === true
  const cinematic =
    !reduced && typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const copyY = useTransform(scrollYProgress, [0, 0.18], cinematic ? [24, 0] : [0, 0])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.16], cinematic ? [0.4, 1] : [1, 1])

  return (
    <section
      ref={sectionRef}
      className={cinematic ? 'relative h-[210vh] bg-page-white' : 'relative bg-page-white'}
      aria-labelledby="connected-experiences-title"
    >
      <div
        className={
          cinematic
            ? 'sticky top-0 flex h-svh items-center overflow-hidden'
            : 'py-16 md:py-20'
        }
      >
        <Container variant="page" className="relative w-full">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <m.div className="max-w-[34rem]" style={{ y: copyY, opacity: copyOpacity }}>
              <Eyebrow tone="brand">CONNECTED HEALTHCARE EXPERIENCES</Eyebrow>
              <h2 id="connected-experiences-title" className="mt-4 text-section-title">
                Turning healthcare complexity into connected digital products.
              </h2>
              <p className="mt-5 max-w-[38rem] text-body-large text-text-secondary">
                We design AI-powered platforms, healthcare applications, and digital experiences that connect
                patients, providers, and data.
              </p>
            </m.div>
            <CareDevice progress={scrollYProgress} cinematic={cinematic} />
          </div>
        </Container>
      </div>
    </section>
  )
}
