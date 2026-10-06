import { m, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router'
import { useState } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { careersCopy, jobPostings } from '@/content/careers.ts'
import { cn } from '@/lib/cn.ts'
import type { JobPosting } from '@/types/careers.ts'
import { Reveal } from '@/sections/home/Reveal.tsx'

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3.5 9h11M10 4.5L14.5 9 10 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function JobRow({
  job,
  index,
  hoveredIndex,
  setHoveredIndex,
  reduced,
}: {
  job: JobPosting
  index: number
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
  reduced: boolean
}) {
  const isHovered = hoveredIndex === index
  const neighbor =
    hoveredIndex !== null && hoveredIndex !== index
      ? Math.abs(hoveredIndex - index) === 1
      : false

  return (
    <m.li
      className="relative"
      onPointerEnter={() => setHoveredIndex(index)}
      onPointerLeave={() => setHoveredIndex(null)}
      animate={
        reduced
          ? undefined
          : {
              y: isHovered ? -4 : neighbor ? 3 : 0,
              scale: isHovered ? 1.01 : 1,
            }
      }
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
    >
      <Link
        to={`/careers/${job.slug}`}
        className={cn(
          'group relative grid items-center gap-4 border-b border-border-subtle py-8 no-underline transition-colors md:grid-cols-[4.5rem_minmax(0,1fr)_auto] md:gap-8 md:py-10',
          'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus',
        )}
      >
        <m.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-1rem] inset-y-2 -z-10 rounded-xl opacity-0 md:inset-x-[-1.5rem]"
          animate={{
            opacity: isHovered && !reduced ? 1 : 0,
            backgroundColor: isHovered ? 'rgb(234 246 252 / 0.9)' : 'transparent',
          }}
          transition={{ duration: 0.25 }}
        />
        <m.span
          aria-hidden="true"
          className="absolute top-1/2 left-0 h-10 w-[3px] -translate-y-1/2 rounded-full"
          animate={{
            scaleY: isHovered ? 1 : 0.35,
            backgroundColor: isHovered
              ? index % 2 === 0
                ? '#0A8FD8'
                : '#F66C2A'
              : 'transparent',
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        />

        <p className="text-caption text-text-muted">{String(index + 1).padStart(2, '0')}</p>

        <div className="min-w-0">
          <h3 className="text-[clamp(1.5rem,1.15rem+1vw,2.15rem)] leading-[1.15] font-semibold tracking-[-0.025em] text-text">
            {job.title}
          </h3>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-body-small text-text-secondary">
            <span>{job.department}</span>
            <span aria-hidden="true" className="text-border-strong">
              ·
            </span>
            <span>{job.location}</span>
            <span aria-hidden="true" className="text-border-strong">
              ·
            </span>
            <span>{job.employmentType}</span>
          </p>
        </div>

        <m.span
          className="inline-flex items-center gap-2 text-body-small font-semibold text-brand-hover"
          animate={reduced ? undefined : { x: isHovered ? 6 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          View role
          <ArrowIcon />
        </m.span>
      </Link>
    </m.li>
  )
}

export function JobList() {
  const reduced = useReducedMotion() === true
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const hasPlaceholders = jobPostings.some((job) => job.status === 'placeholder')

  return (
    <section
      id="open-positions"
      className="scroll-mt-28 bg-page-white py-24 md:py-32"
      aria-labelledby="open-positions-title"
    >
      <Container variant="page" className="w-full">
        <Reveal className="max-w-[40rem]">
          <Eyebrow tone="brand" className="uppercase tracking-[0.14em]">
            {careersCopy.jobs.eyebrow}
          </Eyebrow>
          <h2
            id="open-positions-title"
            className="mt-4 text-[clamp(2rem,1.3rem+2vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.025em] text-text"
          >
            {careersCopy.jobs.headline}
          </h2>
          <p className="mt-5 text-body-large text-text-secondary">{careersCopy.jobs.body}</p>
          {hasPlaceholders ? (
            <p className="mt-4 text-body-small text-text-muted">{careersCopy.jobs.placeholderNote}</p>
          ) : null}
        </Reveal>

        <ul className="mt-14 border-t border-border-subtle">
          {jobPostings.map((job, index) => (
            <JobRow
              key={job.id}
              job={job}
              index={index}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              reduced={reduced}
            />
          ))}
        </ul>
      </Container>
    </section>
  )
}
