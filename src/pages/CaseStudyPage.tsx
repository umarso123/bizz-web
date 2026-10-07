import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { getCaseStudy, workPageContent } from '@/content/work.ts'
import { cn } from '@/lib/cn.ts'

const ease = [0.22, 1, 0.36, 1] as const

function CaseMedia({ src, alt, title }: { src: string | null; alt: string; title: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="relative aspect-16/10 overflow-hidden rounded-[1.75rem] bg-brand-soft shadow-card ring-1 ring-border-subtle md:rounded-[2.25rem]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(145deg, #e8eefc 0%, #fef6d8 45%, #d9e3fb 100%)',
        }}
      />
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <p className="text-[clamp(1.5rem,1.1rem+1.5vw,2.5rem)] font-bold tracking-tight text-text/80">
            {title}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Single case study — Productea-style detail:
 * title, category, summary, challenge / solution, services.
 */
export function CaseStudyPage() {
  const { slug } = useParams()
  const reduced = useReducedMotion() === true
  const study = slug ? getCaseStudy(slug) : undefined

  useEffect(() => {
    if (!study) return
    const previous = document.title
    document.title = `${study.title} · Bizaffix`
    return () => {
      document.title = previous
    }
  }, [study])

  if (!study) {
    return <Navigate to="/work" replace />
  }

  return (
    <LazyMotion features={domAnimation}>
      <main className="relative min-h-svh overflow-x-clip bg-page-white pb-20 md:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-88"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 85% 0%, rgb(201 215 248 / 0.5), transparent 58%)',
          }}
        />

        <Container variant="wide" className="relative z-10 w-full pt-8 md:pt-12">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-body-small font-semibold text-text-secondary no-underline transition-colors hover:text-brand"
          >
            <span aria-hidden="true">←</span>
            {workPageContent.backLabel}
          </Link>

          <m.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
          >
            <Eyebrow className="mt-8">{study.category}</Eyebrow>
            <h1 className="mt-3 max-w-[16ch] text-page-title text-text md:text-display">
              {study.title}
            </h1>
            <p className="mt-5 max-w-160 text-body-large text-text-secondary">
              {study.description}
            </p>
          </m.div>

          <m.div
            className="mt-10 md:mt-14"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
          >
            <CaseMedia src={study.image} alt={`${study.title} visual`} title={study.title} />
          </m.div>

          {(study.challenge || study.solution) && (
            <div className="mt-14 grid gap-10 border-t border-border pt-12 md:mt-16 md:grid-cols-2 md:gap-14 md:pt-16">
              {study.challenge ? (
                <section>
                  <h2 className="text-title text-text">Challenge</h2>
                  <p className="mt-4 text-body text-text-secondary">{study.challenge}</p>
                </section>
              ) : null}
              {study.solution ? (
                <section>
                  <h2 className="text-title text-text">Solution</h2>
                  <p className="mt-4 text-body text-text-secondary">{study.solution}</p>
                </section>
              ) : null}
            </div>
          )}

          <section className="mt-12 border-t border-border pt-10 md:mt-16 md:pt-12">
            <Eyebrow as="h2">Services</Eyebrow>
            <ul className="mt-5 flex flex-wrap gap-2">
              {study.services.map((service) => (
                <li
                  key={service}
                  className={cn(
                    'rounded-pill border border-border bg-surface px-3.5 py-1.5',
                    'text-[0.78rem] font-semibold text-text',
                  )}
                >
                  {service}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-14 md:mt-16">
            <Link
              to={workPageContent.ctaTo}
              className="inline-flex min-h-(--button-height-desktop) items-center rounded-pill bg-brand px-7 text-body-small font-semibold text-text-inverse no-underline shadow-lg transition-colors hover:bg-brand-hover"
            >
              {workPageContent.ctaLabel}
              <span aria-hidden="true" className="ms-2">
                →
              </span>
            </Link>
          </div>
        </Container>
      </main>
    </LazyMotion>
  )
}
