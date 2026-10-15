import {
  LazyMotion,
  animate,
  domAnimation,
  m,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Container } from '@/components/layout/Container.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { TriadBand } from '@/components/ui/TriadBand.tsx'
import { careersCopy, cultureThemes, jobPostings } from '@/content/careers.ts'
import { homeContent } from '@/content/home.ts'
import { cn } from '@/lib/cn.ts'
import { CareerBoard } from '@/sections/careers/CareerBoard.tsx'

const houseSpring = { type: 'spring' as const, stiffness: 140, damping: 20, mass: 0.8 }
const hoverSpring = { type: 'spring' as const, stiffness: 260, damping: 22, mass: 0.6 }
const ease = [0.2, 0, 0, 1] as const

function CareerHero({ reduced }: { reduced: boolean }) {
  const preview = jobPostings.slice(0, 4)

  return (
    <section
      className="atmosphere-hero -mt-(--header-clearance) pt-[calc(var(--header-clearance)+2.5rem)] pb-16 md:pt-[calc(var(--header-clearance)+3.5rem)] md:pb-24"
      aria-labelledby="careers-hero-title"
    >
      <Container variant="page" className="relative w-full">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div>
            <m.p
              className="text-2xl font-medium tracking-[-0.03em] text-text sm:text-3xl"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.45, ease }}
            >
              Bizaffix
            </m.p>
            <m.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.05, ease }}
            >
              <Eyebrow className="mt-5">{careersCopy.hero.eyebrow}</Eyebrow>
            </m.div>
            <m.h1
              id="careers-hero-title"
              className="mt-4 max-w-[11ch] text-4xl font-medium text-text sm:text-5xl lg:text-6xl"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.1, ease }}
            >
              A good place to <span className="text-brand">work.</span>
            </m.h1>
            <m.p
              className="mt-6 max-w-[34rem] text-body-large text-text-secondary"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.18, ease }}
            >
              {careersCopy.hero.body}
            </m.p>
            <m.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.26, ease }}
            >
              <Button href="#open-positions" size="lg" variant="brand">
                {careersCopy.hero.primaryCta}
              </Button>
              <Button href="#how-we-work" size="lg" variant="secondary">
                {careersCopy.process.headline}
              </Button>
            </m.div>
            <m.dl
              className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.32, ease }}
            >
              <div>
                <dt className="text-caption text-text-muted">Roles</dt>
                <dd className="mt-1 text-title text-text">{jobPostings.length}</dd>
              </div>
              <div>
                <dt className="text-caption text-text-muted">Location</dt>
                <dd className="mt-1 text-title text-text">Remote</dd>
              </div>
              <div>
                <dt className="text-caption text-text-muted">Timing</dt>
                <dd className="mt-1 text-title text-text">Flexible</dd>
              </div>
            </m.dl>
          </div>

          <m.div
            className="relative"
            initial={reduced ? false : { opacity: 0, y: 20, clipPath: 'inset(8% 0 0 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
            transition={reduced ? { duration: 0 } : { ...houseSpring, delay: 0.12 }}
          >
            <div className="overflow-hidden rounded-[1.75rem] bg-page-dark p-6 text-text-inverse shadow-[0_24px_60px_rgb(47_91_234/0.18)] ring-1 ring-brand/20 md:p-8">
              <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-caption text-accent">Open now</p>
                  <p className="mt-2 text-3xl font-medium tracking-[-0.03em]">{jobPostings.length} roles</p>
                </div>
                <p className="text-body-small text-text-inverse-muted">Healthcare focus</p>
              </div>
              <ul className="mt-2">
                {preview.map((job, index) => (
                  <li key={job.id}>
                    <Link
                      to={`/careers/${job.slug}`}
                      className="flex items-baseline justify-between gap-4 border-b border-white/10 py-4 text-text-inverse no-underline transition-colors hover:text-accent"
                    >
                      <span className="min-w-0">
                        <span className="mr-3 text-caption text-brand">0{index + 1}</span>
                        <span className="text-title">{job.title}</span>
                      </span>
                      <span className="shrink-0 text-body-small text-text-inverse-muted">{job.department}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <a
                href="#open-positions"
                className="mt-6 inline-flex items-center gap-2 text-body text-accent no-underline"
              >
                See all openings
                <span aria-hidden="true">→</span>
              </a>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -bottom-4 -z-10 size-40 rounded-full bg-accent/50 blur-3xl md:size-52"
            />
          </m.div>
        </div>
      </Container>
    </section>
  )
}

function CareerProcess({ reduced }: { reduced: boolean }) {
  const stages = homeContent.process.stages
  const [active, setActive] = useState(0)
  const stage = stages[active]
  const progress = useSpring(0, { stiffness: 140, damping: 22, mass: 0.8 })

  useEffect(() => {
    progress.set(((active + 1) / stages.length) * 100)
  }, [active, progress, stages.length])

  const width = useTransform(progress, (value) => `${value}%`)

  return (
    <section
      id="how-we-work"
      className="scroll-mt-28 relative overflow-hidden bg-page-dark text-text-inverse"
      aria-labelledby="how-we-work-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 88% 12%, rgb(47 91 234 / 0.35), transparent 58%), radial-gradient(ellipse 40% 40% at 8% 90%, rgb(245 200 76 / 0.12), transparent 55%)',
        }}
      />

      <Container variant="wide" className="relative w-full py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Eyebrow inverse>{careersCopy.process.eyebrow}</Eyebrow>
            <h2 id="how-we-work-title" className="mt-4 text-section-title text-text-inverse">
              {homeContent.process.title}
            </h2>
            <p className="mt-5 max-w-[36rem] text-body-large text-text-inverse-muted">
              {homeContent.process.body}
            </p>

            <m.p
              key={stage.number}
              className="mt-14 text-[clamp(5rem,12vw,9rem)] leading-none font-medium tracking-[-0.06em] text-brand"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={houseSpring}
            >
              {stage.number}
            </m.p>
          </div>

          <div className="lg:col-span-7 lg:pt-16">
            <div className="mb-8 h-px w-full bg-white/10">
              <m.div className="h-px bg-accent" style={{ width }} />
            </div>

            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Project stages">
              {stages.map((item, index) => {
                const on = index === active
                return (
                  <button
                    key={item.number}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(index)}
                    className={cn(
                      'rounded-full px-4 py-2 text-body-small focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                      on ? 'bg-accent text-text' : 'bg-white/5 text-text-inverse-muted hover:bg-white/10',
                    )}
                  >
                    {item.title}
                  </button>
                )
              })}
            </div>

            <m.div
              key={stage.number + '-copy'}
              className="mt-10"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={houseSpring}
            >
              <h3 className="text-3xl font-medium text-text-inverse md:text-4xl">{stage.title}</h3>
              <p className="mt-4 max-w-[38rem] text-body-large text-text-inverse-muted">{stage.body}</p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {stage.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/15 px-3 py-1 text-body-small text-text-inverse-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </m.div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function CareerCulture({ reduced }: { reduced: boolean }) {
  const spans = [
    'md:col-span-7',
    'md:col-span-5',
    'md:col-span-5',
    'md:col-span-7',
    'md:col-span-4',
    'md:col-span-8',
  ]

  return (
    <section className="bg-page-white py-20 md:py-28" aria-labelledby="careers-culture-title">
      <Container variant="page" className="w-full">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>{careersCopy.culture.eyebrow}</Eyebrow>
            <h2 id="careers-culture-title" className="mt-4 text-section-title text-text">
              {careersCopy.culture.headline}
            </h2>
            <p className="mt-5 max-w-[34rem] text-title text-text">{careersCopy.why.headline}</p>
          </div>
          <p className="max-w-[28rem] text-body text-text-secondary lg:col-span-5">
            {careersCopy.life.body}
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
          {cultureThemes.map((theme, index) => (
            <m.li
              key={theme.id}
              className={cn(
                'rounded-[1.5rem] border border-border-subtle bg-surface p-6 md:min-h-48 md:p-8',
                spans[index],
              )}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...houseSpring, delay: reduced ? 0 : index * 0.04 }}
              whileHover={reduced ? undefined : { y: -4, transition: hoverSpring }}
            >
              <p className="text-caption text-brand">0{index + 1}</p>
              <p className="mt-6 text-2xl font-medium text-text">{theme.label}</p>
              <p className="mt-3 max-w-[36ch] text-body text-text-secondary">{theme.detail}</p>
            </m.li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function CareerWhyBand({ reduced }: { reduced: boolean }) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (reduced) {
      setShown(jobPostings.length)
      return
    }
    const controls = animate(0, jobPostings.length, {
      ...houseSpring,
      onUpdate: (latest) => setShown(Math.round(latest)),
    })
    return () => controls.stop()
  }, [reduced])

  return (
    <section className="bg-page-white py-16 md:py-20" aria-label="Why join">
      <Container variant="wide" className="w-full">
        <div className="grid items-center gap-10 rounded-[2rem] bg-brand px-7 py-10 text-text-inverse md:grid-cols-[1fr_auto] md:px-12 md:py-14">
          <div>
            <p className="text-eyebrow text-accent">{careersCopy.why.eyebrow}</p>
            <p className="mt-4 max-w-[28rem] text-section-title text-text-inverse">
              {careersCopy.why.body}
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-[clamp(4rem,10vw,7rem)] leading-none font-medium tracking-[-0.05em] text-accent">
              {shown}
            </p>
            <p className="mt-2 text-body text-text-inverse-muted">open roles waiting</p>
            <m.a
              href="#open-positions"
              className="mt-6 inline-flex items-center border-b border-accent pb-1 text-body text-text-inverse no-underline"
              whileHover={reduced ? undefined : { x: 6 }}
              transition={hoverSpring}
            >
              {careersCopy.hero.primaryCta}
            </m.a>
          </div>
        </div>
      </Container>
    </section>
  )
}

export function CareersPage() {
  const { slug } = useParams()
  const reduced = useReducedMotion() === true

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Careers · Bizaffix'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <main className="studio-page bg-page-white text-text">
        <CareerHero reduced={reduced} />
        <TriadBand
          id="career-pillars"
          title={careersCopy.pillars.title}
          listLabel={careersCopy.pillars.title}
          items={careersCopy.pillars.items}
        />
        <CareerProcess reduced={reduced} />
        <CareerCulture reduced={reduced} />
        <CareerWhyBand reduced={reduced} />
        <section className="border-t border-border-subtle bg-page-white pt-16 md:pt-24" aria-labelledby="open-roles-title">
          <Container variant="page" className="w-full">
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Eyebrow>{careersCopy.jobs.eyebrow}</Eyebrow>
                <h2 id="open-roles-title" className="mt-4 text-section-title text-text">
                  {careersCopy.jobs.headline}
                </h2>
              </div>
              <p className="text-body-large text-text-secondary lg:col-span-5 lg:pt-10">{careersCopy.jobs.body}</p>
            </div>
          </Container>
        </section>
        <CareerBoard activeSlug={slug} />
      </main>
    </LazyMotion>
  )
}

export default CareersPage
