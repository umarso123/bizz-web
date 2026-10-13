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
          className="relative overflow-hidden rounded-2xl px-6 py-10 shadow-card md:px-12 md:py-14"
          style={{
            background:
              'linear-gradient(110deg, var(--color-accent-soft) 0%, var(--color-bg) 46%, var(--color-surface-warm) 100%)',
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
              className="mb-4 block text-section-title text-brand"
            >
              “
            </span>
            <p
              id="case-highlight-title"
              className="max-w-160 text-title text-text"
            >
              {copy.quote}
            </p>
          </blockquote>

          <figcaption className="relative mt-12 flex items-center gap-4">
            <span
              aria-hidden="true"
              className="size-12 shrink-0 rounded-full bg-accent ring-4 ring-surface"
            />
            <div>
              <p className="text-body-small font-semibold text-text">{copy.role}</p>
              <p className="text-caption text-text-secondary">{copy.meta}</p>
            </div>
          </figcaption>
        </m.figure>
      </Container>
    </section>
  )
}
