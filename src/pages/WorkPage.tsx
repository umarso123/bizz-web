import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  getWorkIndexStudies,
  workBuiltContent,
  workIndustries,
  workPageContent,
  type CaseStudy,
  type WorkIndustry,
} from '@/content/work.ts'
import { cn } from '@/lib/cn.ts'

const ease = [0.22, 1, 0.36, 1] as const
const hoverSpring = { type: 'spring', stiffness: 260, damping: 22, mass: 0.6 } as const

type WorkFilter = 'All' | WorkIndustry

const filters: WorkFilter[] = ['All', ...workIndustries]

function ArrowMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Portfolio index on the paper field:
 * centered title, industry filters, large media cards, then a story band.
 */
export function WorkPage() {
  const reduced = useReducedMotion() === true
  const copy = workPageContent
  const [filter, setFilter] = useState<WorkFilter>('All')
  const studies = getWorkIndexStudies(filter)

  useEffect(() => {
    const previous = document.title
    document.title = 'Case studies · Bizaffix'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <main className="studio-page relative -mt-(--header-clearance) bg-page-white text-text">
        <section className="atmosphere-hero relative overflow-hidden pt-(--header-clearance)" aria-labelledby="work-title">

          <div className="relative z-10 mx-auto w-full max-w-[90rem] px-[clamp(1.5rem,4vw,4.5rem)] pt-14 pb-16 md:pt-20 md:pb-20">
            <m.div
              className="mx-auto max-w-3xl text-center"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease }}
            >
              <h1
                id="work-title"
                className="text-5xl font-medium sm:text-6xl"
              >
                {copy.title.slice(0, copy.title.lastIndexOf(' '))}{' '}
                <span className="text-brand">{copy.title.slice(copy.title.lastIndexOf(' ') + 1)}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[34rem] text-lg text-text-secondary">
                {copy.intro}
              </p>
            </m.div>

            <div
              role="group"
              aria-label={copy.filtersLabel}
              className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2 md:mt-12"
            >
              {filters.map((item) => {
                const selected = item === filter
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilter(item)}
                    className={cn(
                      'inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text',
                      selected
                        ? 'bg-brand text-text-inverse'
                        : 'border border-border bg-surface/80 text-text-secondary hover:bg-surface',
                    )}
                  >
                    {item}
                  </button>
                )
              })}
              <p className="sr-only" aria-live="polite">
                {studies.length === 1 ? '1 case study' : `${studies.length} case studies`}
              </p>
            </div>

            {studies.length === 0 ? (
              <p className="mt-16 text-center text-text-secondary">{copy.emptyLabel}</p>
            ) : (
              <ul className="mt-10 grid grid-cols-2 gap-3 md:mt-12 md:gap-4">
                {studies.map((study, index) => (
                  <li key={study.slug} className="min-w-0">
                    <StudyCard
                      study={study}
                      reduced={reduced}
                      number={String(index + 1).padStart(2, '0')}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="bg-page-white text-text" aria-labelledby="built-title">
          <div className="mx-auto w-full max-w-[90rem] px-[clamp(1.5rem,4vw,4.5rem)] py-16 md:py-24">
            <div>
              <h2
                id="built-title"
                className="max-w-[9em] text-4xl font-medium wrap-normal sm:text-5xl"
              >
                {workBuiltContent.title}
              </h2>
              <p className="mt-5 max-w-[36ch] text-body-large text-text-secondary wrap-normal">{workBuiltContent.lede}</p>
            </div>

            <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-[1.15fr_0.85fr] md:gap-5">
              {workBuiltContent.stories.map((story) => {
                const brand = story.tone === 'blue'
                return (
                  <li key={story.slug}>
                    <Link
                      to={`/work/${story.slug}`}
                      className={cn(
                        'group flex h-full min-h-[28rem] flex-col justify-between rounded-[1.75rem] p-7 no-underline outline-none md:min-h-[32rem] md:p-9',
                        'focus-visible:ring-2 focus-visible:ring-offset-2',
                        brand
                          ? 'bg-[linear-gradient(165deg,#3d6bf0_0%,#2f5bea_48%,#2549c9_100%)] text-text-inverse hover:text-text-inverse focus-visible:ring-text-inverse'
                          : 'bg-accent text-text hover:text-text focus-visible:ring-brand',
                      )}
                    >
                      <div className="flex justify-end">
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium',
                            brand ? 'bg-text-inverse/16 text-text-inverse' : 'bg-text/10 text-text',
                          )}
                        >
                          {story.industry}
                        </span>
                      </div>
                      <p className="max-w-[10ch] text-3xl font-medium sm:text-4xl">
                        {story.title}
                      </p>
                      <div className="flex items-end justify-between gap-6">
                        <p
                          className={cn(
                            'min-w-0 flex-1 text-base',
                            brand ? 'text-text-inverse/85' : 'text-text/75',
                          )}
                        >
                          {story.body}
                        </p>
                        <span
                          aria-hidden="true"
                          className={cn(
                            'grid size-11 shrink-0 place-items-center rounded-full transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none',
                            brand ? 'bg-accent text-text' : 'bg-brand text-text-inverse',
                          )}
                        >
                          <ArrowMark />
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </main>
    </LazyMotion>
  )
}

function StudyCard({
  study,
  reduced,
  number,
}: {
  study: CaseStudy
  reduced: boolean
  number: string
}) {
  const bannerTitle = study.bannerTitle ?? study.title

  return (
    <Link
      to={`/work/${study.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/8 bg-white text-text no-underline shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_24px_48px_rgba(14,14,14,0.04)] outline-none hover:text-text focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-white"
    >
      <div className="relative aspect-[2.15/1] overflow-hidden bg-page-dark">
        <StudyPhoto src={study.image} alt="" />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(13_18_31/0.45)_0%,rgb(13_18_31/0.12)_38%,rgb(13_18_31/0.08)_55%,rgb(13_18_31/0.55)_100%)]" />

        <div className="absolute top-3 right-3 left-3 z-10 sm:top-3.5 sm:right-4 sm:left-4">
          <p className="text-[0.6rem] font-semibold tracking-[0.12em] text-white/85 uppercase">
            Project {number}
          </p>
          <p className="mt-1 max-w-[16ch] text-sm font-semibold tracking-[-0.03em] text-white sm:text-base">
            {bannerTitle}
          </p>
        </div>

        <span className="absolute bottom-2.5 left-2.5 z-10 inline-flex max-w-[calc(100%-4.5rem)] items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[0.65rem] font-medium text-text backdrop-blur-md sm:bottom-3 sm:left-3 sm:text-xs">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand" />
          <span className="truncate">{study.category}</span>
        </span>
        <m.span
          aria-hidden="true"
          className="absolute right-2.5 bottom-2.5 z-10 grid size-9 place-items-center rounded-full bg-brand text-text-inverse shadow-[0_8px_20px_rgb(13_18_31/0.28)] sm:right-3 sm:bottom-3 sm:size-10"
          whileHover={reduced ? undefined : { x: 2, y: -2 }}
          transition={hoverSpring}
        >
          <ArrowMark />
        </m.span>
      </div>
      <div className="px-3.5 pt-3.5 pb-4 sm:px-5 sm:pt-4 sm:pb-5">
        <h2 className="text-base font-medium tracking-[-0.02em] text-text sm:text-xl">{study.title}</h2>
        <p className="mt-1.5 line-clamp-2 text-xs text-text-secondary sm:text-sm">{study.summary}</p>
      </div>
    </Link>
  )
}

function StudyPhoto({ src, alt }: { src: string | null; alt: string }) {
  const [visible, setVisible] = useState(false)

  if (!src) return null

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      onLoad={() => setVisible(true)}
      onError={() => setVisible(false)}
    />
  )
}
