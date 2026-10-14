import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { careersCopy } from '@/content/careers.ts'
import { useMagnetic, usePointerParallax } from '@/sections/careers/useCareerMotion.ts'
import { Reveal } from '@/sections/home/Reveal.tsx'

function MagneticButton({ children, to }: { children: ReactNode; to: string }) {
  const reduced = useReducedMotion() === true
  const magnetic = useMagnetic({ strength: 0.24, disabled: reduced })

  return (
    <m.div
      ref={magnetic.ref as React.RefObject<HTMLDivElement>}
      style={{ x: magnetic.x, y: magnetic.y }}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      className="inline-flex"
    >
      <Button to={to} size="lg">
        {children}
      </Button>
    </m.div>
  )
}

export function CareerCultureCta() {
  const reduced = useReducedMotion() === true
  const ref = useRef<HTMLElement>(null)
  const pointer = usePointerParallax(reduced)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const geoX = useTransform(pointer.x, [-1, 1], [-30, 30])
  const geoY = useTransform(pointer.y, [-1, 1], [-20, 20])
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const words = careersCopy.cultureCta.headline.split(' ')

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-page-brand py-28 md:py-36"
      aria-labelledby="culture-cta-title"
    >
      <m.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ x: reduced ? 0 : geoX, y: reduced ? 0 : geoY }}
      >
        <span className="absolute top-[18%] left-[12%] h-16 w-16 rounded-full border border-brand/25" />
        <span className="absolute top-[30%] right-[18%] h-3 w-3 rounded-full bg-[#F66C2A]" />
        <span className="absolute bottom-[22%] left-[28%] h-24 w-24 rotate-12 rounded-xl border border-[rgb(246_108_42_/0.25)]" />
        <span className="absolute right-[12%] bottom-[28%] h-2 w-28 rounded-full bg-brand/30" />
        <span className="absolute top-[55%] left-[8%] h-2 w-2 rounded-full bg-brand" />
      </m.div>

      <Container variant="page" className="relative w-full">
        <m.h2
          id="culture-cta-title"
          className="mx-auto max-w-[16ch] text-center text-4xl font-medium text-text sm:text-5xl lg:text-6xl"
          style={{ y: reduced ? 0 : textY }}
        >
          {words.map((word, index) => (
            <m.span
              key={`${word}-${index}`}
              className="mr-[0.28em] inline-block"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{
                duration: reduced ? 0 : 0.55,
                delay: reduced ? 0 : index * 0.05,
                ease: [0.2, 0, 0, 1],
              }}
            >
              {word}
            </m.span>
          ))}
        </m.h2>
        <div className="mt-10 flex justify-center">
          <MagneticButton to="/careers#open-positions">
            {careersCopy.cultureCta.cta}
          </MagneticButton>
        </div>
      </Container>
    </section>
  )
}

export function CareerFinalCta() {
  return (
    <section className="relative overflow-hidden bg-page-white py-24 md:py-32" aria-labelledby="final-cta-title">
      <Container variant="page" className="relative w-full">
        <Reveal className="max-w-[42rem]">
          <h2
            id="final-cta-title"
            className="text-3xl font-medium text-text sm:text-4xl lg:text-5xl"
          >
            {careersCopy.finalCta.headline}
          </h2>
          <p className="mt-5 max-w-[36rem] text-body-large text-text-secondary">
            {careersCopy.finalCta.body}
          </p>
          <div className="mt-8">
            <MagneticButton to="/careers#open-positions">
              {careersCopy.finalCta.cta}
            </MagneticButton>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
