import { m, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/layout/Container.tsx'
import { homeContent } from '@/content/home.ts'

const ease = [0.22, 1, 0.36, 1] as const

export function CaseHighlight() {
  const reduced = useReducedMotion() === true
  const copy = homeContent.caseHighlight

  return (
    <section
      id="proof"
      className="relative overflow-x-clip bg-page-white section-y"
      aria-labelledby="case-highlight-title"
    >
      <Container variant="wide" className="relative w-full">
        <m.figure
          className="relative overflow-hidden rounded-[2.15rem] px-7 py-11 shadow-card md:rounded-[2.75rem] md:px-14 md:py-16"
          style={{
            background: 'linear-gradient(110deg, #fef6d8 0%, #fbf7f2 46%, #fff9f2 100%)',
          }}
          initial={reduced ? false : { opacity: 0, y: 22, scale: 0.985 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -left-10 h-48 w-48 rounded-full bg-accent/40 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -bottom-20 h-64 w-64 rounded-full bg-accent/25 blur-3xl"
          />

          <blockquote className="relative">
            <span
              aria-hidden="true"
              className="mb-6 block text-[3.5rem] leading-none font-bold text-text/15 md:text-[4.5rem]"
            >
              “
            </span>
            <p
              id="case-highlight-title"
              className="max-w-160 text-[clamp(1.4rem,1.05rem+1.3vw,2.25rem)] leading-tight font-bold tracking-tight text-text"
            >
              {copy.quote}
            </p>
          </blockquote>

          <figcaption className="relative mt-12 flex items-center gap-4">
            <span
              aria-hidden="true"
              className="size-12 shrink-0 rounded-full bg-accent ring-4 ring-white/80"
            />
            <div>
              <p className="text-body-small font-semibold text-text">{copy.role}</p>
              <p className="text-caption text-text-muted">{copy.meta}</p>
            </div>
          </figcaption>
        </m.figure>
      </Container>
    </section>
  )
}
