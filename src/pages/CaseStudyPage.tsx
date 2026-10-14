import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Container } from '@/components/layout/Container.tsx'
import { featuredProjectsContent } from '@/content/featured-projects.ts'
import { servicesPage } from '@/content/services.ts'
import { caseStudyFaqs, getCaseStudy, workPageContent, type CaseStudy } from '@/content/work.ts'
import { cn } from '@/lib/cn.ts'

const ease = [0.22, 1, 0.36, 1] as const

const notes = {
  duration: 'Duration is not published for this study.',
  toolsLead: 'The tools used on this study are not published.',
  narrative: 'This part of the study is not published yet.',
  visual: 'Additional project visual — not published yet.',
} as const

function relatedStudies(slug: string): CaseStudy[] {
  const featured = featuredProjectsContent.projects
    .map((project) => getCaseStudy(project.href.replace(/^\/work\//, '')))
    .filter((study): study is CaseStudy => study != null && study.slug !== slug)

  if (featured.length > 0) return featured.slice(0, 4)
  return workPageContent.studies.filter((study) => study.slug !== slug).slice(0, 4)
}

const riseCss = `
@keyframes case-rise {
  from { transform: translateY(110%); }
  to { transform: translateY(0); }
}
.case-rise {
  animation: case-rise 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  .case-rise { animation: none; transform: none; }
}
`

function ClipText({
  children,
  className,
  immediate = false,
}: {
  children: ReactNode
  className?: string
  immediate?: boolean
}) {
  const reduced = useReducedMotion() === true
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(immediate || reduced)

  useEffect(() => {
    if (immediate || reduced) return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [immediate, reduced])

  return (
    <span ref={ref} className="block overflow-hidden pb-[0.12em]">
      <span
        className={cn(
          'block',
          className,
          reduced ? undefined : shown ? 'case-rise' : 'translate-y-[110%]',
        )}
      >
        {children}
      </span>
    </span>
  )
}

function VisualFrame({
  src,
  alt,
  placeholder,
  priority = false,
}: {
  src: string | null
  alt: string
  placeholder: string
  priority?: boolean
}) {
  const reduced = useReducedMotion() === true
  const [failed, setFailed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['5%', '-5%'])
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.045, 1])

  return (
    <div
      ref={ref}
      className="relative aspect-16/10 overflow-hidden rounded-[1.5rem] bg-page-dark ring-1 ring-black/10 md:rounded-[2rem]"
    >
      {src && !failed ? (
        <m.img
          src={src}
          alt={alt}
          style={{ y, scale }}
          className="absolute -inset-[6%] h-[112%] w-[112%] max-w-none object-cover"
          onError={() => setFailed(true)}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <div className="flex aspect-4/3 items-center justify-center border border-dashed border-black/15 px-8 text-center md:aspect-video">
          <p className="max-w-sm text-body text-text-secondary">{placeholder}</p>
        </div>
      )}
    </div>
  )
}

function MetaBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-eyebrow text-text-muted">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function FaqList() {
  const [open, setOpen] = useState(0)
  const reduced = useReducedMotion() === true

  return (
    <div className="border-t border-border">
      {caseStudyFaqs.map((item, index) => {
        const expanded = open === index
        return (
          <div key={item.question} className="border-b border-border">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? -1 : index)}
            >
              <span className="text-base font-medium text-text md:text-xl">
                {item.question}
              </span>
              <span aria-hidden="true" className="text-2xl font-medium text-brand">
                {expanded ? '×' : '+'}
              </span>
            </button>
            <m.div
              initial={false}
              animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.35, ease }}
              className="overflow-hidden"
            >
              <p className="max-w-3xl pb-6 text-body text-text-secondary">{item.answer}</p>
            </m.div>
          </div>
        )
      })}
    </div>
  )
}

function HeroVisual({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() === true
  return (
    <m.div
      className="mt-8 md:mt-10"
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.12, ease }}
    >
      {children}
    </m.div>
  )
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

/**
 * One case-study layout for every study.
 * Copy and images come from the study record. Missing facts stay labeled as unpublished.
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
    document.title = `${study.title} · Bizaffix`
    const restoreMeta = setMetaDescription(study.summary)
    return () => {
      document.title = previousTitle
      restoreMeta()
    }
  }, [study])

  if (!study) return <Navigate to="/work" replace />

  const frames = [
    ...(study.image ? [{ src: study.image, alt: `${study.title} visual` }] : []),
    ...(study.gallery ?? []),
  ]
  const [hero, ...rest] = frames
  const gallery = rest.length > 0 ? rest : [{ src: null as string | null, alt: notes.visual }]
  const statement = study.solution ?? study.summary
  const others = relatedStudies(study.slug)
  const tools = servicesPage.technologies.items.join(', ')

  return (
    <LazyMotion features={domAnimation}>
      <main className="studio-page bg-page-white text-text">
        <style>{riseCss}</style>
        <header className="bg-page-white text-text">
          <Container variant="wide" className="w-full pt-6 pb-10 md:pt-10 md:pb-14">
            <Link
              to="/work"
              className="inline-flex items-center gap-2 text-body-small font-semibold text-text-secondary no-underline transition-colors hover:text-text"
            >
              <span aria-hidden="true">←</span>
              {workPageContent.backLabel}
            </Link>

            <div className="mt-10 grid items-end gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.7fr)] lg:gap-16">
              <div>
                <m.p
                  className="inline-flex items-center gap-2 rounded-pill border border-border px-3 py-1 text-eyebrow text-text-secondary"
                  initial={false}
                >
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                  {study.category}
                </m.p>
                <h1 className="mt-5 max-w-[12ch] text-4xl font-medium text-text sm:text-5xl lg:text-6xl">
                  <ClipText immediate>{study.title}</ClipText>
                </h1>
              </div>
              <p className="max-w-sm text-xl font-medium text-text-secondary md:text-2xl lg:justify-self-end lg:pb-2 lg:text-right">
                {study.summary}
              </p>
            </div>

            <HeroVisual>
              <VisualFrame
                src={hero?.src ?? null}
                alt={hero?.alt ?? study.title}
                placeholder={`${study.title} visual — not published yet.`}
                priority
              />
            </HeroVisual>
          </Container>
        </header>

        <Container variant="wide" className="w-full py-16 md:py-24">
          <div className="grid gap-14 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:gap-20">
            <aside className="flex flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
              <MetaBlock label="Duration">
                <p className="text-body text-text-secondary">{notes.duration}</p>
              </MetaBlock>
              <MetaBlock label="Services">
                <ul className="flex flex-wrap gap-2">
                  {study.services.map((service) => (
                    <li
                      key={service}
                      className="rounded-pill bg-bg-subtle px-3.5 py-1.5 text-xs font-medium text-text"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </MetaBlock>
              <MetaBlock label="Tools">
                <p className="text-body text-text-secondary">{notes.toolsLead}</p>
                <p className="mt-3 text-body-small text-text-muted">
                  Studio technologies: {tools}.
                </p>
              </MetaBlock>
            </aside>

            <div className="min-w-0">
              <section>
                <h2 className="text-3xl font-medium sm:text-4xl lg:text-5xl">
                  <ClipText>Overview</ClipText>
                </h2>
                <p className="mt-6 max-w-3xl text-body-large text-text-secondary">{study.description}</p>
              </section>

              <section className="mt-20 border-t border-border pt-16 md:mt-28 md:pt-20">
                <p className="text-eyebrow text-accent-deep">01</p>
                <h2 className="mt-4 max-w-[14ch] text-3xl font-medium sm:text-4xl lg:text-5xl">
                  <ClipText>The challenge</ClipText>
                </h2>
                <p className="mt-8 max-w-3xl text-body-large text-text-secondary">
                  {study.challenge ?? notes.narrative}
                </p>
              </section>

              <section className="mt-20 border-t border-border pt-16 md:mt-28 md:pt-20">
                <p className="text-eyebrow text-accent-deep">02</p>
                <h2 className="mt-4 max-w-[14ch] text-3xl font-medium sm:text-4xl lg:text-5xl">
                  <ClipText>The solution</ClipText>
                </h2>
                <p className="mt-8 max-w-3xl text-body-large text-text-secondary">
                  {study.solution ?? notes.narrative}
                </p>
              </section>
            </div>
          </div>
        </Container>

        <section className="bg-page-dark py-16 text-text-inverse md:py-24" aria-label="Project visuals">
          <Container variant="wide" className="flex w-full flex-col gap-6 md:gap-8">
            {gallery.map((frame) => (
              <VisualFrame
                key={`${frame.alt}-${frame.src ?? 'placeholder'}`}
                src={frame.src}
                alt={frame.alt}
                placeholder={notes.visual}
              />
            ))}
          </Container>
        </section>

        <section className="bg-page-dark pb-8 text-text-inverse md:pb-12">
          <Container variant="wide" className="w-full border-t border-white/10 pt-16 md:pt-20">
            <p className="text-eyebrow text-white/50">Impact</p>
            <p className="mt-6 max-w-4xl text-2xl font-medium text-white md:text-3xl">
              {statement}
            </p>
          </Container>
        </section>

        <section className="bg-page-dark pb-20 text-text-inverse md:pb-28">
          <Container variant="wide" className="w-full pt-16 md:pt-20">
            <h2 className="text-3xl font-medium sm:text-4xl lg:text-5xl">
              <ClipText>More projects</ClipText>
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/work/${item.slug}`}
                    className="group block text-inherit no-underline outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <VisualFrame
                      src={item.image}
                      alt={`${item.title} visual`}
                      placeholder={`${item.title} visual — not published yet.`}
                    />
                    <p className="mt-4 text-eyebrow text-white/55">{item.category}</p>
                    <p className="mt-1 text-xl font-medium text-white md:text-2xl">{item.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="bg-page-white" aria-labelledby="case-faq-title">
          <Container variant="wide" className="w-full py-20 md:py-28">
            <h2
              id="case-faq-title"
              className="max-w-[16ch] text-3xl font-medium sm:text-4xl lg:text-5xl"
            >
              <ClipText>Frequently asked questions.</ClipText>
            </h2>
            <p className="mt-4 max-w-xl text-body text-text-secondary">
              How a study moves from the first conversation to something people can use.
            </p>
            <div className="mt-12">
              <FaqList />
            </div>
          </Container>
        </section>
      </main>
    </LazyMotion>
  )
}
