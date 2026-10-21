import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { useEffect, useLayoutEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { bookCall, bookCallButtonProps } from '@/app/navigation.ts'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { PageHero } from '@/components/layout/PageHero.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { caseStudyFaqs, getCaseStudy, workPageContent, type CaseStudy } from '@/content/work.ts'
import { cn } from '@/lib/cn.ts'
import { StudyCard, StudyMedia } from '@/sections/work/WorkStill.tsx'

const ease = [0.22, 1, 0.36, 1] as const

type Chapter = { id: string; title: string; body: string }

/** Only the parts of the story the record actually has. Nothing is padded out. */
function chaptersFor(study: CaseStudy): Chapter[] {
  const chapters: Chapter[] = [{ id: 'overview', title: 'Overview', body: study.description }]
  if (study.challenge) chapters.push({ id: 'challenge', title: 'The challenge', body: study.challenge })
  if (study.solution) chapters.push({ id: 'approach', title: 'Our approach', body: study.solution })
  return chapters
}

/** Same industry first, then healthcare, then everything else. */
function relatedStudies(study: CaseStudy): CaseStudy[] {
  const others: CaseStudy[] = workPageContent.studies.filter((item) => item.slug !== study.slug)
  const same = others.filter((item) => item.industry === study.industry)
  const healthcare = others.filter((item) => item.industry === 'Healthcare' && item.industry !== study.industry)
  const rest = others.filter((item) => item.industry !== study.industry && item.industry !== 'Healthcare')
  return [...same, ...healthcare, ...rest].slice(0, 3)
}

function setMetaDescription(content: string) {
  let meta = document.querySelector('meta[name="description"]')
  const created = !meta
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    document.head.appendChild(meta)
  }
  const previous = created ? null : meta.getAttribute('content')
  meta.setAttribute('content', content)
  return () => {
    if (created) meta.remove()
    else if (previous == null) meta.removeAttribute('content')
    else meta.setAttribute('content', previous)
  }
}

/** Which chapter is in the reading band, for the "you are here" station. */
function useActiveChapter(ids: readonly string[]) {
  const key = ids.join('|')
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const nodes = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null)
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const first = visible[0]
        if (first) setActive(first.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [key])

  return active
}

function StudyFacts({ study }: { study: CaseStudy }) {
  return (
    <dl className="grid gap-6 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-1">
      <div>
        <dt className="text-eyebrow text-text-muted">Industry</dt>
        <dd className="mt-2 inline-flex items-center gap-2 text-body text-text">
          {study.industry === 'Healthcare' ? <HexMark variant="solid" size={10} /> : null}
          {study.industry}
        </dd>
      </div>
      <div>
        <dt className="text-eyebrow text-text-muted">Focus</dt>
        <dd className="mt-2 text-body text-text">{study.category}</dd>
      </div>
      <div className="sm:col-span-2 lg:col-span-1">
        <dt className="text-eyebrow text-text-muted">Services</dt>
        <dd className="mt-3">
          <ul className="flex flex-wrap gap-2">
            {study.services.map((service) => (
              <li key={service} className="rounded-pill border border-border px-3 py-1 text-caption text-text">
                {service}
              </li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  )
}

function ChapterRoute({ chapters, active }: { chapters: readonly Chapter[]; active: string }) {
  return (
    <nav aria-label="On this page" className="sticky top-32">
      <p className="text-eyebrow text-text-muted">On this page</p>
      <ol className="mt-5 border-l-2 border-border">
        {chapters.map((chapter) => {
          const current = chapter.id === active
          return (
            <li key={chapter.id} className="relative">
              <HexMark
                variant={current ? 'active' : 'station'}
                size={12}
                className="absolute top-1/2 -left-[7px] -translate-y-1/2"
              />
              <a
                href={`#${chapter.id}`}
                aria-current={current ? 'location' : undefined}
                className={cn(
                  'block py-2.5 pl-6 text-body-small no-underline transition-colors duration-(--duration-standard) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                  current ? 'font-semibold text-text hover:text-text' : 'text-text-secondary hover:text-text',
                )}
              >
                {chapter.title}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function PlusMark({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative grid size-9 shrink-0 place-items-center rounded-pill border transition-colors duration-(--duration-standard)',
        open ? 'border-text bg-text text-text-inverse' : 'border-border-strong text-text',
      )}
    >
      <span className="absolute h-[2px] w-3.5 rounded-full bg-current" />
      <span
        className={cn(
          'absolute h-3.5 w-[2px] rounded-full bg-current transition-transform duration-300 ease-standard',
          open && 'scale-y-0',
        )}
      />
    </span>
  )
}

function FaqList() {
  const reduced = useReducedMotion() === true
  const [open, setOpen] = useState(0)

  return (
    <ul className="border-t border-border">
      {caseStudyFaqs.map((item, index) => {
        const expanded = open === index
        const panelId = `case-faq-${index}`
        return (
          <li key={item.question} className="border-b border-border">
            <h3 className="text-card-title">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? -1 : index)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:py-7"
              >
                <span>{item.question}</span>
                <PlusMark open={expanded} />
              </button>
            </h3>
            <m.div
              id={panelId}
              initial={false}
              animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.35, ease }}
              className="overflow-hidden"
              aria-hidden={!expanded}
            >
              <p className="max-w-[40rem] pb-7 text-body text-text-secondary">{item.answer}</p>
            </m.div>
          </li>
        )
      })}
    </ul>
  )
}

function CaseStudyView({ study }: { study: CaseStudy }) {
  const chapters = chaptersFor(study)
  const active = useActiveChapter(chapters.map((chapter) => chapter.id))
  const frames = study.gallery ?? []
  const related = relatedStudies(study)

  return (
    <LazyMotion features={domAnimation}>
      <main className="studio-page">
        <PageHero
          zone={workPageContent.eyebrow}
          meta={study.industry}
          title={study.title}
          titleId="case-title"
          intro={study.summary}
          actions={
            <>
              <Button {...bookCallButtonProps()} size="lg" variant="primary">
                {bookCall.label}
              </Button>
              <TextLink to="/work">{workPageContent.backLabel}</TextLink>
            </>
          }
          aside={<StudyFacts study={study} />}
        >
          <div className="relative mt-14 aspect-4/3 overflow-hidden rounded-2xl bg-bg-subtle sm:aspect-video md:mt-20 lg:aspect-[2.2/1]">
            <StudyMedia slug={study.slug} image={study.image} alt={`${study.title} product visual`} priority />
          </div>
        </PageHero>

        <section className="bg-page-white section-y" aria-label={`${study.title} story`}>
          <Container variant="wide" className="w-full">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="hidden lg:col-span-3 lg:block">
                <ChapterRoute chapters={chapters} active={active} />
              </div>
              <div className="lg:col-span-8 lg:col-start-5">
                {chapters.map((chapter, index) => (
                  <section
                    key={chapter.id}
                    id={chapter.id}
                    aria-labelledby={`${chapter.id}-title`}
                    className={cn('scroll-mt-32', index > 0 && 'mt-16 border-t border-border pt-16 md:mt-24 md:pt-24')}
                  >
                    <h2 id={`${chapter.id}-title`} className="text-section-title text-text">
                      {chapter.title}
                    </h2>
                    <p className="mt-6 max-w-[40rem] text-body-large text-text-secondary md:mt-8">{chapter.body}</p>
                  </section>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {frames.length > 0 ? (
          <section className="bg-page-white pb-(--section-space)" aria-labelledby="visuals-title">
            <Container variant="wide" className="w-full">
              <div className="rounded-2xl bg-night-route p-4 sm:p-6 md:p-10">
                <h2 id="visuals-title" className="px-2 pt-4 pb-8 text-title text-text-inverse md:px-4 md:pt-6 md:pb-10">
                  Project visuals
                </h2>
                <ul className={cn('grid gap-4 md:gap-6', frames.length > 1 && 'md:grid-cols-2')}>
                  {frames.map((frame, index) => (
                    <li key={frame.src} className={cn(frames.length === 3 && index === 0 && 'md:col-span-2')}>
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-white/6">
                        <StudyMedia slug={study.slug} image={frame.src} alt={frame.alt} fit="contain" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </section>
        ) : null}

        <section className="bg-bg-subtle section-y" aria-labelledby="related-title">
          <Container variant="wide" className="w-full">
            <SectionHeader
              title="More case studies"
              titleId="related-title"
              action={<TextLink to="/work">All case studies</TextLink>}
            />
            <ul className="mt-14 grid gap-x-8 gap-y-14 md:mt-16 md:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <StudyCard study={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="bg-page-white section-y" aria-labelledby="case-faq-title">
          <Container variant="wide" className="w-full">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4">
                <h2 id="case-faq-title" className="max-w-[14ch] text-section-title text-text">
                  Frequently asked questions
                </h2>
                <p className="mt-5 max-w-[24rem] text-body text-text-secondary">
                  How a study moves from the first conversation to something people can use.
                </p>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <FaqList />
              </div>
            </div>
          </Container>
        </section>
      </main>
    </LazyMotion>
  )
}

/**
 * One case-study layout for every study. Copy and images come from the study
 * record; parts the record doesn't have are left out rather than padded.
 */
export function CaseStudyPage() {
  const { slug } = useParams()
  const study = slug ? getCaseStudy(slug) : undefined

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (!study) return
    const previousTitle = document.title
    document.title = `${study.title} | Bizaffix`
    const restoreMeta = setMetaDescription(study.summary)
    return () => {
      document.title = previousTitle
      restoreMeta()
    }
  }, [study])

  if (!study) return <Navigate to="/work" replace />

  return <CaseStudyView key={study.slug} study={study} />
}
