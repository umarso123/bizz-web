import { m, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/layout/Container.tsx'
import { Button } from '@/components/ui/Button.tsx'

const ease = [0.22, 1, 0.36, 1] as const

const steps = [
  { title: 'Describe your product', body: 'Software, hardware or AI, in plain language.' },
  { title: 'Answer adaptive questions', body: 'Only the ones that matter for your markets.' },
  { title: 'Get a launch roadmap', body: 'Laws, certifications and markings per location.' },
]

/** Homepage feature block that sends visitors into Bizaffix Compass at /compass. */
export function CompassPromo() {
  const reduced = useReducedMotion() === true

  return (
    <section
      id="compass"
      className="relative overflow-x-clip bg-page-white section-y"
      aria-labelledby="compass-promo-title"
    >
      <Container variant="wide" className="relative w-full">
        <m.div
          className="relative overflow-hidden rounded-2xl px-6 py-10 shadow-card md:px-12 md:py-14"
          style={{
            background:
              'linear-gradient(110deg, var(--color-brand-soft) 0%, var(--color-bg) 52%, var(--color-surface-warm) 100%)',
          }}
          initial={reduced ? false : { opacity: 0, y: 22, scale: 0.985 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-10 h-64 w-64 rounded-full bg-brand/15 blur-3xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="text-caption font-semibold tracking-[0.08em] text-brand uppercase">
                Free tool · Bizaffix Compass
              </p>
              <h2 id="compass-promo-title" className="mt-4 max-w-140 text-section-title text-text">
                Know what your product may need before launch.
              </h2>
              <p className="mt-5 max-w-130 text-body text-text-secondary">
                Pick every market you plan to launch in and get a preliminary engineering and
                compliance roadmap in about five minutes. No signup needed.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/compass" variant="brand" size="lg">
                  Try Compass free
                </Button>
              </div>
            </div>

            <ol className="grid gap-3">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-xl border border-border bg-surface/80 p-4 backdrop-blur-sm"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-body-small font-semibold text-brand">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-body-small font-semibold text-text">{step.title}</p>
                    <p className="text-caption text-text-secondary">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </m.div>
      </Container>
    </section>
  )
}
