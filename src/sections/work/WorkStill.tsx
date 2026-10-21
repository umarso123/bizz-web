import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { CareWorkspaceShot, CdsShot, EhrShot, HieShot, InteropShot, TelemedicineShot } from '@/components/visuals/HealthShots.tsx'
import { FintechShot, FitnessShot } from '@/components/visuals/IndustryShots.tsx'
import { AnalysisScene, DesignScene, ResearchScene, TestingScene, UnderstandingScene } from '@/components/visuals/StepScenes.tsx'
import type { CaseStudy } from '@/content/work.ts'
import { cn } from '@/lib/cn.ts'

/**
 * Title link for a study card. The ::before stretches the link over the whole
 * card (the card needs `relative group`), so each card is one link named by its title.
 */
export const studyTitleLinkClass =
  'text-text no-underline decoration-brand decoration-2 underline-offset-[0.18em] before:absolute before:inset-0 group-hover:underline hover:text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand'

/** Industry with its zone marker, then the study's focus. */
export function StudyLabel({ study, inverse = false }: { study: CaseStudy; inverse?: boolean }) {
  const lead = study.industry === 'Healthcare'
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-eyebrow">
      <span className={cn('inline-flex items-center gap-2', inverse ? 'text-text-inverse' : 'text-text')}>
        <HexMark
          variant={lead ? (inverse ? 'active' : 'solid') : 'outline'}
          size={10}
          className={lead ? undefined : inverse ? 'text-text-inverse-muted' : 'text-text-muted'}
        />
        {study.industry}
      </span>
      <span className={inverse ? 'text-text-inverse-muted' : 'text-text-secondary'}>{study.category}</span>
    </p>
  )
}

/** Gallery card: media well, label, title. The whole card is one link. */
export function StudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="group relative">
      <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-bg-subtle">
        <StudyMedia slug={study.slug} image={study.image} alt="" />
      </div>
      <div className="mt-6">
        <StudyLabel study={study} />
        <h3 className="mt-3 text-title text-text">
          <Link to={`/work/${study.slug}`} className={studyTitleLinkClass}>
            {study.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-2 max-w-[34rem] text-body-small text-text-secondary">{study.summary}</p>
      </div>
    </article>
  )
}

type StudyMediaProps = {
  slug: string
  image: string | null
  /** Empty string when a nearby heading already names the study. */
  alt: string
  priority?: boolean
  fit?: 'cover' | 'contain'
  className?: string
}

/**
 * The media for a study inside a positioned frame: the published board when
 * there is one, otherwise a quiet product still drawn from the theme.
 */
export function StudyMedia({ slug, image, alt, priority = false, fit = 'cover', className }: StudyMediaProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (!image || failed) return <WorkStill slug={slug} />

  return (
    <img
      src={image}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={cn(
        'absolute inset-0 h-full w-full transition-opacity duration-500 motion-reduce:transition-none',
        fit === 'cover' ? 'object-cover object-center' : 'object-contain',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  )
}

/**
 * Product visuals for studies without a published board. Healthcare, fintech and
 * fitness get full product scenes; the rest keep a quiet drawn still.
 */
export function WorkStill({ slug }: { slug: string }) {
  switch (slug) {
    case 'clinical-decision-support':
      return <CdsShot />
    case 'telemedicine':
      return <TelemedicineShot />
    case 'health-information-exchange':
      return <HieShot />
    case 'electronic-health-records':
      return <EhrShot />
    case 'integration-interoperability':
      return <InteropShot />
    case 'healthcare':
      return <CareWorkspaceShot />
    case 'step-understanding':
      return <UnderstandingScene />
    case 'step-research':
      return <ResearchScene />
    case 'step-analysis':
      return <AnalysisScene />
    case 'step-design':
      return <DesignScene />
    case 'step-testing':
      return <TestingScene />
    case 'optimized-strength':
    case 'fitness':
      return <FitnessShot />
    case 'fintech':
    case 'bank-alfalah':
      return <FintechShot />
    case 'educational':
    case 'poised-journey-academy':
    case 'traino-ai':
      return <EducationStill />
    case 'ecommerce':
      return <CommerceStill />
    default:
      return <CareWorkspaceShot />
  }
}

function Stage({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-bg-subtle bg-[radial-gradient(ellipse_70%_60%_at_100%_0%,rgb(47_91_234/0.1),transparent_65%)]"
    >
      {/* Floor-plan grid: the same field as the page tops */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(13_18_31/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(13_18_31/0.04)_1px,transparent_1px)] bg-size-[2.5rem_2.5rem]" />
      {children}
    </div>
  )
}

function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('absolute rounded-lg border border-border bg-surface', className)}>{children}</div>
}

function EducationStill() {
  return (
    <Stage>
      <Panel className="top-[12%] right-[8%] bottom-[12%] left-[8%] p-5">
        <div className="h-3 w-24 rounded-full bg-brand" />
        <div className="mt-5 h-2.5 w-3/4 rounded-full bg-text/10" />
        <div className="mt-3 h-2.5 w-1/2 rounded-full bg-text/8" />
        <div className="mt-7 grid grid-cols-3 gap-2">
          <div className="h-14 rounded-md bg-brand-soft" />
          <div className="h-14 rounded-md bg-brand-subtle" />
          <div className="h-14 rounded-md bg-bg-muted" />
        </div>
      </Panel>
    </Stage>
  )
}

function CommerceStill() {
  return (
    <Stage>
      <div className="absolute top-[12%] right-[8%] bottom-[14%] left-[8%] grid grid-cols-[1.2fr_0.8fr] gap-3">
        <div className="rounded-lg bg-brand" />
        <div className="grid gap-3">
          <div className="rounded-lg bg-brand-soft" />
          <div className="rounded-lg border border-border bg-surface p-3">
            <div className="h-2 w-12 rounded-full bg-text/12" />
            <div className="mt-3 h-2 w-20 rounded-full bg-accent" />
          </div>
        </div>
      </div>
    </Stage>
  )
}
