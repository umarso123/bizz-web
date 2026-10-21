import { Link } from 'react-router'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { careersCopy, jobPostings } from '@/content/careers.ts'
import { cn } from '@/lib/cn.ts'
import {
  ALL_TEAMS,
  careerTeams,
  hasExampleRoles,
  roleCount,
  rolesForTeam,
} from '@/sections/careers/careerData.ts'
import type { JobPosting } from '@/types/careers.ts'

/**
 * One line on the directory board. The role title is the link; the whole row
 * is its hit area. Columns on wide screens, one comma-separated line on phones.
 */
function RoleRow({ job }: { job: JobPosting }) {
  return (
    <li className="group relative border-b border-border transition-colors duration-(--duration-standard) ease-standard hover:bg-bg-subtle has-[a:focus-visible]:bg-bg-subtle has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand">
      <div className="grid gap-x-6 gap-y-2 py-6 md:grid-cols-12 md:items-center md:px-4 md:py-7">
        <h3 className="text-title md:col-span-5">
          <Link
            to={`/careers/${job.slug}`}
            className="text-text no-underline outline-none after:absolute after:inset-0 after:content-[''] hover:text-text"
          >
            {job.title}
          </Link>
        </h3>
        <p className="flex flex-wrap text-body-small text-text-secondary md:contents">
          <span className="md:col-span-2 md:text-text">
            {job.department}
            <span className="md:hidden">,&nbsp;</span>
          </span>
          <span className="md:col-span-2">
            {job.location}
            <span className="md:hidden">,&nbsp;</span>
          </span>
          <span className="md:col-span-2">
            {job.employmentType}
            <span className="md:hidden">,&nbsp;</span>
            <span className="md:block md:text-text-muted">{job.experience}</span>
          </span>
        </p>
        <span aria-hidden="true" className="hidden md:col-span-1 md:flex md:justify-end">
          <HexMark
            variant="station"
            size={20}
            className="transition-transform duration-300 ease-standard group-hover:rotate-90 [&_polygon]:transition-colors group-hover:[&_polygon]:fill-accent"
          />
        </span>
      </div>
    </li>
  )
}

/** The open-roles board: column labels, then one row per role. */
export function RoleDirectory({ jobs, className }: { jobs: readonly JobPosting[]; className?: string }) {
  return (
    <div className={className}>
      <div
        aria-hidden="true"
        className="hidden grid-cols-12 gap-x-6 px-4 pb-3 text-caption text-text-muted md:grid"
      >
        <span className="col-span-5">Role</span>
        <span className="col-span-2">Team</span>
        <span className="col-span-2">Location</span>
        <span className="col-span-2">Type</span>
      </div>
      <ul className="border-t border-border">
        {jobs.map((job) => (
          <RoleRow key={job.id} job={job} />
        ))}
      </ul>
    </div>
  )
}

type CareerBoardProps = {
  team: string
  onTeamChange: (team: string) => void
}

/**
 * Open positions: team filters as pills over the directory board.
 * The selected team is owned by the page so the hero directory can set it too.
 */
export function CareerBoard({ team, onTeamChange }: CareerBoardProps) {
  const visible = rolesForTeam(team)
  const filtered = team !== ALL_TEAMS
  const total = jobPostings.length

  return (
    <section
      id="open-positions"
      className="scroll-mt-28 section-y bg-page-white"
      aria-labelledby="open-positions-title"
    >
      <Container variant="wide" className="w-full">
        <SectionHeader
          eyebrow={careersCopy.jobs.eyebrow}
          meta={filtered ? `${visible.length} of ${roleCount(total)}` : roleCount(total)}
          title={careersCopy.jobs.headline}
          titleId="open-positions-title"
          description={careersCopy.jobs.body}
        />

        <div className="mt-12 flex flex-wrap gap-2 md:mt-16" role="group" aria-label="Filter roles by team">
          {[ALL_TEAMS, ...careerTeams].map((item) => {
            const on = item === team
            return (
              <button
                key={item}
                type="button"
                aria-pressed={on}
                onClick={() => onTeamChange(item)}
                className={cn(
                  'inline-flex min-h-10 items-center gap-2 rounded-pill border px-4 text-body-small font-medium transition-colors duration-(--duration-standard) ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                  on
                    ? 'border-button-primary bg-button-primary text-text-inverse'
                    : 'border-border-strong text-text hover:border-text/50 hover:bg-bg-subtle',
                )}
              >
                {item === ALL_TEAMS ? 'All teams' : item}
                <span className={cn('tabular-nums', on ? 'text-text-inverse-muted' : 'text-text-muted')}>
                  {rolesForTeam(item).length}
                </span>
              </button>
            )
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {filtered ? `Showing ${roleCount(visible.length)} in ${team}` : `Showing all ${roleCount(total)}`}
        </p>

        {visible.length > 0 ? (
          <RoleDirectory jobs={visible} className="mt-8 md:mt-10" />
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-border-strong p-10 text-center md:mt-10">
            <p className="text-body text-text-secondary">No open roles in this team right now.</p>
            <Button variant="secondary" className="mt-5" onClick={() => onTeamChange(ALL_TEAMS)}>
              Show all teams
            </Button>
          </div>
        )}

        {hasExampleRoles ? (
          <p className="mt-6 text-body-small text-text-muted">{careersCopy.jobs.placeholderNote}</p>
        ) : null}
      </Container>
    </section>
  )
}
