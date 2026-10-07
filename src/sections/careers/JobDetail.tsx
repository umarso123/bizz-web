import { m, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router'
import { Container } from '@/components/layout/Container.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import type { JobPosting } from '@/types/careers.ts'
import { Reveal } from '@/sections/home/Reveal.tsx'
import { useMagnetic } from '@/sections/careers/useCareerMotion.ts'

function BackArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M12.5 8H3.5M7 3.5L3.5 8 7 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MagneticApply({ href, label }: { href: string; label: string }) {
  const reduced = useReducedMotion() === true
  const magnetic = useMagnetic({ strength: 0.2, disabled: reduced })

  return (
    <m.div
      ref={magnetic.ref as React.RefObject<HTMLDivElement>}
      style={{ x: magnetic.x, y: magnetic.y }}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      className="inline-flex w-full sm:w-auto"
    >
      <Button href={href} size="lg" className="w-full sm:w-auto">
        {label}
      </Button>
    </m.div>
  )
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-12 md:mt-14">
      <h2 className="text-title text-text">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-body text-text-secondary">
            <span
              aria-hidden="true"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function JobDetail({ job }: { job: JobPosting }) {
  const reduced = useReducedMotion() === true

  return (
    <main className="bg-page-white">
      <section className="border-b border-border-subtle bg-page-brand pt-10 pb-16 md:pt-14 md:pb-20">
        <Container variant="page" className="w-full">
          <Reveal>
            <Link
              to="/careers#open-positions"
              className="inline-flex items-center gap-2 text-body-small font-semibold text-text-secondary no-underline hover:text-text"
            >
              <BackArrow />
              All positions
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-16">
            <div>
              <Reveal>
                <Eyebrow>
                  {job.department}
                </Eyebrow>
                <h1 className="mt-4 text-[clamp(2.25rem,1.4rem+2.4vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-text">
                  {job.title}
                </h1>
                <p className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-body text-text-secondary">
                  <span>{job.location}</span>
                  <span aria-hidden="true" className="text-border-strong">
                    ·
                  </span>
                  <span>{job.employmentType}</span>
                  <span aria-hidden="true" className="text-border-strong">
                    ·
                  </span>
                  <span>{job.experience}</span>
                </p>
                {job.status === 'placeholder' ? (
                  <p className="mt-4 text-body-small text-text-muted">
                    Example role listing. Replace with a live opening when available.
                  </p>
                ) : null}
              </Reveal>
            </div>

            <aside className="lg:sticky lg:top-28">
              <m.div
                className="rounded-xl border border-border bg-surface p-5 shadow-sm"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.15 }}
              >
                <p className="text-body-small text-text-secondary">
                  Ready to join the conversation?
                </p>
                <div className="mt-4">
                  <MagneticApply href={job.applyUrl} label="Apply for this role" />
                </div>
              </m.div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container variant="reading" className="w-full">
          <Reveal>
            <h2 className="text-title text-text">Overview</h2>
            <p className="mt-5 text-body-large text-text-secondary">{job.description}</p>
          </Reveal>

          <Reveal delay={0.06}>
            <DetailList title="Responsibilities" items={job.responsibilities} />
          </Reveal>
          <Reveal delay={0.08}>
            <DetailList title="What you'll bring" items={job.requirements} />
          </Reveal>
          <Reveal delay={0.1}>
            <DetailList title="Nice to have" items={job.niceToHave} />
          </Reveal>

          <Reveal className="mt-16 border-t border-border-subtle pt-10 md:hidden">
            <MagneticApply href={job.applyUrl} label="Apply for this role" />
          </Reveal>
        </Container>
      </section>
    </main>
  )
}
