import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router'
import { featuredProjectsContent, type FeaturedProject } from '@/content/featured-projects.ts'

const showcase = [
  featuredProjectsContent.projects[1],
  featuredProjectsContent.projects[2],
  featuredProjectsContent.projects[3],
  featuredProjectsContent.projects[7],
  featuredProjectsContent.projects[0],
]

function CardFace({ project }: { project: FeaturedProject }) {
  return (
    <article className="rounded-2xl border border-border/80 bg-white p-3 shadow-[0_16px_36px_rgb(13_18_31/0.12),0_10px_0_-4px_#fff,0_11px_0_-3px_rgb(226_220_210)] sm:p-4">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-brand-soft p-6 sm:p-8">
        <img
          src={project.image}
          alt={project.alt}
          className="max-h-full max-w-full scale-[0.85] object-contain"
          draggable={false}
        />
      </div>
      <div className="mt-3 flex h-8 items-center justify-between gap-3">
        <h3 className="project-showcase-title text-text">{project.name}</h3>
        <span className="shrink-0 rounded-full border border-border bg-page-white px-2.5 py-0.5 text-[0.68rem] font-medium whitespace-nowrap text-text-secondary">
          {project.category}
        </span>
      </div>
      <Link
        to={project.href}
        className="mt-2 inline-flex items-center gap-1 text-[0.75rem] font-semibold text-brand no-underline hover:text-brand-hover"
      >
        {featuredProjectsContent.caseStudyLabel}
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}

function FlyingCard({
  project,
  index,
  total,
  progress,
}: {
  project: FeaturedProject
  index: number
  total: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const segments = Math.max(total - 1, 1)
  const start = index / segments
  const end = (index + 1) / segments
  const last = index === total - 1
  const span = end - start
  const y = useTransform(progress, last ? [0, 1] : [start, end], last ? ['0%', '0%'] : ['0%', '-120%'])
  const opacity = useTransform(
    progress,
    last ? [0, 1] : [start, start + span * 0.12, start + span * 0.38],
    last ? [1, 1] : [1, 1, 0],
  )

  return (
    <m.div style={{ y, opacity, zIndex: total - index }} className="col-start-1 row-start-1">
      <CardFace project={project} />
    </m.div>
  )
}

function ViewAllProjects({ className = '' }: { className?: string }) {
  return (
    <Link
      to={featuredProjectsContent.viewAllTo}
      className={`text-[0.95rem] font-medium text-text no-underline underline-offset-4 hover:text-brand hover:underline ${className}`}
    >
      {featuredProjectsContent.viewAllLabel}
    </Link>
  )
}

function ShowcaseHeading() {
  return (
    <h2 id="featured-projects-title" className="text-center text-text">
      {featuredProjectsContent.title}
    </h2>
  )
}

function CardDeck({ reduced }: { reduced: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const pile = (
    <div className="mx-auto grid w-full max-w-[19rem] overflow-hidden py-3">
      {showcase.map((project, index) =>
        reduced ? (
          <CardFace key={project.id} project={project} />
        ) : (
          <FlyingCard
            key={project.id}
            project={project}
            index={index}
            total={showcase.length}
            progress={scrollYProgress}
          />
        ),
      )}
    </div>
  )

  if (reduced) {
    return (
      <div className="relative px-(--page-gutter) pt-16 pb-20">
        <ShowcaseHeading />
        <div className="mx-auto mt-8 flex w-full max-w-[19rem] flex-col gap-5">
          {showcase.map((project) => (
            <CardFace key={project.id} project={project} />
          ))}
        </div>
        <ViewAllProjects className="absolute right-(--page-gutter) bottom-8" />
      </div>
    )
  }

  return (
    <div ref={trackRef} className="relative" style={{ height: `${showcase.length * 100}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center px-(--page-gutter) pt-(--header-clearance)">
        <ShowcaseHeading />
        <div className="mt-8">{pile}</div>
        <ViewAllProjects className="absolute right-(--page-gutter) bottom-8" />
      </div>
    </div>
  )
}

export function ProjectShowcase() {
  const reduced = useReducedMotion() === true

  return (
    <section
      id="featured-projects"
      className="project-showcase relative scroll-mt-24 bg-page-white"
      aria-labelledby="featured-projects-title"
    >
      <CardDeck reduced={reduced} />
    </section>
  )
}
