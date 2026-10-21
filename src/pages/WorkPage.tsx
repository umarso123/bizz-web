import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { PageHero } from '@/components/layout/PageHero.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import {
  workBuiltContent,
  workIndustries,
  workPageContent,
  type CaseStudy,
  type WorkIndustry,
} from '@/content/work.ts'
import { cn } from '@/lib/cn.ts'
import { StudyCard, StudyLabel, StudyMedia, studyTitleLinkClass } from '@/sections/work/WorkStill.tsx'

const ease = [0.22, 1, 0.36, 1] as const

type WorkFilter = 'All' | WorkIndustry

const filters: WorkFilter[] = ['All', ...workIndustries]

/** Every study, healthcare first. Studies without a published board show a product still. */
const allStudies: readonly CaseStudy[] = [
  ...workPageContent.studies.filter((study) => study.industry === 'Healthcare'),
  ...workPageContent.studies.filter((study) => study.industry !== 'Healthcare'),
]

function studiesFor(filter: WorkFilter) {
  return filter === 'All' ? allStudies : allStudies.filter((study) => study.industry === filter)
}

function studyCount(count: number) {
  return count === 1 ? '1 case study' : `${count} case studies`
}

function FeatureStudy({ study }: { study: CaseStudy }) {
  return (
    <article className="group relative">
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-bg-subtle sm:aspect-video lg:aspect-[2.2/1]">
        <StudyMedia slug={study.slug} image={study.image} alt="" priority />
      </div>
      <div className="mt-8 grid gap-6 md:mt-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <StudyLabel study={study} />
          <h3 className="mt-4 max-w-[18ch] text-section-title text-text">
            <Link to={`/work/${study.slug}`} className={studyTitleLinkClass}>
              {study.title}
            </Link>
          </h3>
        </div>
        <div className="flex flex-col items-start gap-5 lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="text-body-large text-text-secondary">{study.summary}</p>
          <span
            aria-hidden="true"
            className="text-body-small font-semibold text-text underline decoration-brand/45 decoration-[1.5px] underline-offset-[0.3em] transition-[text-decoration-color] duration-(--duration-standard) group-hover:decoration-brand"
          >
            View case study
          </span>
        </div>
      </div>
    </article>
  )
}

/**
 * Work index: the study gallery under a filterable page top,
 * then the two long-form stories on a quiet split board.
 */
export function WorkPage() {
  const reduced = useReducedMotion() === true
  const copy = workPageContent
  const [filter, setFilter] = useState<WorkFilter>('All')
  const studies = studiesFor(filter)
  const [feature, ...rest] = studies

  useEffect(() => {
    const previous = document.title
    document.title = 'Work | Bizaffix'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <main className="studio-page">
        <PageHero zone={copy.eyebrow} meta={studyCount(allStudies.length)} title={copy.title} intro={copy.intro}>
          <div role="group" aria-label={copy.filtersLabel} className="mt-12 flex flex-wrap gap-2 md:mt-16">
            {filters.map((item) => {
              const selected = item === filter
              const count = studiesFor(item).length
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(item)}
                  className={cn(
                    'inline-flex h-11 items-center gap-2.5 rounded-pill px-5 text-body-small font-medium transition-colors duration-(--duration-standard) ease-standard',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                    selected
                      ? 'bg-text text-text-inverse'
                      : 'border border-border bg-surface text-text hover:border-border-strong hover:bg-bg-subtle',
                  )}
                >
                  {item}
                  <span className={cn('tabular-nums', selected ? 'text-text-inverse-muted' : 'text-text-muted')}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </PageHero>

        <section className="bg-page-white section-y" aria-labelledby="work-gallery-title">
          <Container variant="wide" className="w-full">
            <h2 id="work-gallery-title" className="sr-only">
              {filter === 'All' ? 'All case studies' : `${filter} case studies`}
            </h2>
            <p className="sr-only" aria-live="polite">
              {studyCount(studies.length)}
            </p>

            {feature ? (
              <m.div
                key={filter}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease }}
              >
                <FeatureStudy study={feature} />
                {rest.length > 0 ? (
                  <ul className="mt-20 grid gap-x-8 gap-y-16 md:mt-28 md:grid-cols-2 md:gap-y-20">
                    {rest.map((study, index) => (
                      <li key={study.slug} className={cn(index % 2 === 1 && 'md:mt-24')}>
                        <StudyCard study={study} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </m.div>
            ) : (
              <p className="text-body-large text-text-secondary">{copy.emptyLabel}</p>
            )}
          </Container>
        </section>

        <section className="bg-bg-subtle section-y" aria-labelledby="built-title">
          <Container variant="wide" className="w-full">
            <SectionHeader title={workBuiltContent.title} titleId="built-title" description={workBuiltContent.lede} />
            <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:mt-20 md:grid-cols-2">
              {workBuiltContent.stories.map((story) => {
                const lead = story.industry === 'Healthcare'
                return (
                  <li key={story.slug} className="flex flex-col bg-surface p-8 md:p-12">
                    <p className="inline-flex items-center gap-2 text-eyebrow text-text">
                      <HexMark
                        variant={lead ? 'solid' : 'outline'}
                        size={10}
                        className={lead ? undefined : 'text-text-muted'}
                      />
                      {story.industry}
                    </p>
                    <h3 className="mt-6 text-title text-text">{story.title}</h3>
                    <p className="mt-4 max-w-[34rem] flex-1 text-body text-text-secondary">{story.body}</p>
                    <TextLink to={`/work/${story.slug}`} className="mt-6 self-start">
                      View case study
                    </TextLink>
                  </li>
                )
              })}
            </ul>
          </Container>
        </section>
      </main>
    </LazyMotion>
  )
}
