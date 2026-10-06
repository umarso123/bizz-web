import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef, useState } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { homeContent } from '@/content/home.ts'
import { useMediaQuery } from '@/sections/home/homeJourney.ts'

/**
 * Motion: WORD SUM
 * PRODUCT + DESIGN + ENGINEERING + DOMAIN → BIZAFFIX
 */
export function WhyBizaffix() {
  const reduced = useReducedMotion() === true
  const desktop = useMediaQuery('(min-width: 768px)')
  const ref = useRef<HTMLElement>(null)
  const concepts = homeContent.why.concepts
  const copy = homeContent.why
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const [active, setActive] = useState(0)
  const sumOpacity = useTransform(scrollYProgress, [0.78, 0.92], reduced ? [1, 1] : [0, 1])
  const sumScale = useTransform(scrollYProgress, [0.78, 0.92], reduced ? [1, 1] : [0.92, 1])
  const stackOpacity = useTransform(scrollYProgress, [0.78, 0.9], reduced ? [0, 0] : [1, 0])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActive(Math.min(concepts.length - 1, Math.max(0, Math.floor(value * concepts.length))))
  })

  if (!desktop || reduced) {
    return (
      <section className="bg-page-dark py-24 text-text-inverse md:py-32" aria-labelledby="why-title">
        <Container variant="page" className="w-full">
          <Eyebrow tone="brand">{copy.eyebrow}</Eyebrow>
          <h2 id="why-title" className="mt-4 max-w-[18ch] text-section-title text-text-inverse">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-[40rem] text-body-large text-white/70">{copy.body}</p>
          <div className="mt-12 space-y-3">
            {concepts.map((concept, index) => (
              <div key={concept.word}>
                <p
                  className={`text-[clamp(2.25rem,1.3rem+2.5vw,4rem)] leading-[0.95] font-semibold tracking-[-0.04em] ${
                    index % 2 === 0 ? 'text-brand' : 'text-[#F66C2A]'
                  }`}
                >
                  {concept.word}
                </p>
                <p className="mt-1 text-body text-white/65">{concept.line}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[clamp(2.5rem,1.5rem+3vw,4.5rem)] font-semibold tracking-[-0.04em] text-text-inverse">
            {copy.sum}
          </p>
        </Container>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className="relative h-[340vh] bg-page-dark text-text-inverse"
      aria-labelledby="why-title"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden sticky-section">
        <Container variant="page" className="relative w-full">
          <Eyebrow tone="brand">{copy.eyebrow}</Eyebrow>
          <h2 id="why-title" className="mt-4 max-w-[16ch] text-section-title text-text-inverse">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-[36rem] text-body-large text-white/70">{copy.body}</p>

          <m.div className="relative mt-10 min-h-[42vh]" style={{ opacity: stackOpacity }}>
            <AnimatePresence mode="wait">
              <m.div
                key={concepts[active]?.word}
                initial={{ y: '55%', opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
                animate={{ y: '0%', opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
                exit={{ y: '-35%', opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
                transition={{ duration: 0.55, ease: [0.2, 0, 0, 1] }}
              >
                <p
                  className={`text-[clamp(3.5rem,2rem+6vw,8rem)] leading-[0.9] font-semibold tracking-[-0.045em] ${
                    active % 2 === 0 ? 'text-brand' : 'text-[#F66C2A]'
                  }`}
                >
                  {concepts[active]?.word}
                </p>
                <p className="mt-4 max-w-[32rem] text-body-large text-white/70">
                  {concepts[active]?.line}
                </p>
              </m.div>
            </AnimatePresence>
          </m.div>

          <m.div
            className="absolute inset-x-[var(--page-gutter)] top-1/2 -translate-y-1/2 text-center"
            style={{ opacity: sumOpacity, scale: sumScale }}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-caption font-semibold tracking-[0.12em] text-white/50 uppercase">
              {concepts.map((concept, index) => (
                <span key={concept.word} className="inline-flex items-center gap-3">
                  <span className={index % 2 === 0 ? 'text-brand' : 'text-[#F66C2A]'}>
                    {concept.word}
                  </span>
                  {index < concepts.length - 1 ? <span className="text-white/35">+</span> : null}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[clamp(3rem,1.8rem+4vw,5.5rem)] font-semibold tracking-[-0.04em] text-white/80">
              ↓
            </p>
            <p className="text-[clamp(3.25rem,2rem+5vw,6.5rem)] font-semibold tracking-[-0.045em] text-brand">
              {copy.sum}
            </p>
          </m.div>
        </Container>
      </div>
    </section>
  )
}
