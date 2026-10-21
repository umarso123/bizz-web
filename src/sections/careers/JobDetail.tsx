import { Link } from 'react-router'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { PageHero } from '@/components/layout/PageHero.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { careersCopy, jobPostings } from '@/content/careers.ts'
import { roleCount } from '@/sections/careers/careerData.ts'
import { RoleDirectory } from '@/sections/careers/CareerBoard.tsx'
import { RoleApply } from '@/sections/careers/RoleApply.tsx'
import type { JobPosting } from '@/types/careers.ts'

/** The zone label links back, so the wayfinding rule doubles as a breadcrumb. */
export function CareersZoneLink() {
  return (
    <Link
      to="/careers"
      className="text-text no-underline decoration-brand underline-offset-[0.3em] hover:text-text hover:underline"
    >
      Careers
    </Link>
  )
}

function RoleFacts({ job }: { job: JobPosting }) {
  const facts = [
    { label: 'Team', value: job.department },
    { label: 'Location', value: job.location },
    { label: 'Type', value: job.employmentType },
    { label: 'Experience', value: job.experience },
  ]

  return (
    <div className="rounded-xl border border-border bg-surface/90 p-6 backdrop-blur-sm sm:p-7">
      <p className="text-eyebrow text-text-muted">Role details</p>
      <dl className="mt-4 border-t border-border">
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-baseline justify-between gap-6 border-b border-border py-3.5">
            <dt className="text-body-small text-text-secondary">{fact.label}</dt>
            <dd className="text-right text-body-small font-medium text-text">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function DetailList({ title, items }: { title: string; items: readonly string[] }) {
  if (items.length === 0) return null
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-title text-text">{title}</h2>
      <ul className="mt-6 grid gap-4">
        {items.map((item) => (
          <li key={item} className="flex gap-4 text-body text-text-secondary">
            <HexMark variant="solid" size={10} className="mt-[0.5em]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * A single role: spec sheet up top, the brief in a reading column,
 * and the application beside it (sticky when the screen is tall enough to hold it).
 */
export function JobDetail({ job }: { job: JobPosting }) {
  const others = jobPostings.filter((item) => item.id !== job.id)

  return (
    <main className="studio-page bg-page-white text-text">
      <PageHero
        zone={<CareersZoneLink />}
        meta={`${job.department}, ${job.location}`}
        title={job.title}
        titleId="job-title"
        intro={job.description}
        actions={
          <>
            <Button href="#apply" variant="primary" size="lg">
              Apply for this role
            </Button>
            <TextLink to="/careers#open-positions">All open positions</TextLink>
          </>
        }
        aside={<RoleFacts job={job} />}
      />

      <section className="section-y bg-page-white" aria-label="About the role">
        <Container variant="wide" className="w-full">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
            <div className="flex max-w-[47.5rem] flex-col gap-14 lg:col-span-7">
              {job.status === 'placeholder' ? (
                <p className="rounded-lg bg-warning-soft px-4 py-3 text-body-small text-warning">
                  {careersCopy.jobs.placeholderNote}
                </p>
              ) : null}
              <DetailList title="What you’ll do" items={job.responsibilities} />
              <DetailList title="What you’ll bring" items={job.requirements} />
              <DetailList title="Nice to have" items={job.niceToHave} />
            </div>

            <div className="lg:col-span-5">
              <div
                id="apply"
                className="scroll-mt-28 [@media(min-width:64rem)_and_(min-height:48rem)]:sticky [@media(min-width:64rem)_and_(min-height:48rem)]:top-[calc(var(--header-clearance)+1.5rem)]"
              >
                <RoleApply key={job.id} job={job} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {others.length > 0 ? (
        <section className="section-y border-t border-border-subtle bg-page-white" aria-labelledby="other-roles-title">
          <Container variant="wide" className="w-full">
            <SectionHeader
              eyebrow={careersCopy.jobs.eyebrow}
              meta={roleCount(jobPostings.length)}
              title="Other open roles"
              titleId="other-roles-title"
              action={<TextLink to="/careers#open-positions">All open positions</TextLink>}
            />
            <RoleDirectory jobs={others} className="mt-12 md:mt-16" />
          </Container>
        </section>
      ) : null}
    </main>
  )
}
