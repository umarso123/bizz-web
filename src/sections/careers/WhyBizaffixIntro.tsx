import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { careersCopy } from '@/content/careers.ts'

const headlineWords = careersCopy.why.headline.split(' ')
const bodySentences = careersCopy.why.body.split(/(?<=\.)\s+/).filter(Boolean)

export function WhyBizaffixIntro() {
  const reduced = useReducedMotion() === true
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-page-white py-28 md:py-40"
      aria-labelledby="why-bizaffix-title"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent"
        aria-hidden="true"
      />
      <Container variant="page" className="relative w-full">
        <Eyebrow>
          {careersCopy.why.eyebrow}
        </Eyebrow>

        <h2
          id="why-bizaffix-title"
          className="mt-8 max-w-[18ch] text-4xl font-medium text-text sm:text-5xl lg:text-6xl"
        >
          {headlineWords.map((word, index) => {
            const start = index / headlineWords.length
            const end = start + 1 / headlineWords.length
            return (
              <WordReveal
                key={`${word}-${index}`}
                word={word}
                progress={scrollYProgress}
                start={start}
                end={Math.min(end + 0.08, 1)}
                reduced={reduced}
              />
            )
          })}
        </h2>

        <div className="mt-12 max-w-[40rem] space-y-5">
          {bodySentences.map((sentence, index) => {
            const start = 0.35 + index * 0.18
            return (
              <SentenceReveal
                key={sentence}
                text={sentence}
                progress={scrollYProgress}
                start={start}
                end={start + 0.2}
                reduced={reduced}
              />
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function WordReveal({
  word,
  progress,
  start,
  end,
  reduced,
}: {
  word: string
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  start: number
  end: number
  reduced: boolean
}) {
  const opacity = useTransform(progress, [start, end], [0.18, 1])
  const y = useTransform(progress, [start, end], [18, 0])

  return (
    <m.span
      className="mr-[0.28em] inline-block"
      style={{ opacity: reduced ? 1 : opacity, y: reduced ? 0 : y }}
    >
      {word}
    </m.span>
  )
}

function SentenceReveal({
  text,
  progress,
  start,
  end,
  reduced,
}: {
  text: string
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  start: number
  end: number
  reduced: boolean
}) {
  const opacity = useTransform(progress, [start, end], [0, 1])
  const y = useTransform(progress, [start, end], [24, 0])

  return (
    <m.p
      className="text-body-large text-text-secondary"
      style={{ opacity: reduced ? 1 : opacity, y: reduced ? 0 : y }}
    >
      {text}
    </m.p>
  )
}
