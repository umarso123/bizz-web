import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useParams } from 'react-router'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { PageHero } from '@/components/layout/PageHero.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { careersCopy, cultureThemes, jobPostings, workStages } from '@/content/careers.ts'
import { cn } from '@/lib/cn.ts'
import { JobDetailPage } from '@/pages/JobDetailPage.tsx'
import { CareerBoard } from '@/sections/careers/CareerBoard.tsx'
import {
  ALL_TEAMS,
  careerTeams,
  openRoleCount,
  roleCount,
  rolesForTeam,
} from '@/sections/careers/careerData.ts'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Hero aside: a directory sign. Each team is a station; choosing one
 * filters the board below and takes you there.
 */
function TeamDirectory({ onPick }: { onPick: (team: string) => void }) {
  const rows = [...careerTeams, ALL_TEAMS]

  return (
    <nav
      aria-label={careersCopy.hero.directoryTitle}
      className="rounded-xl border border-border bg-surface/90 p-6 backdrop-blur-sm sm:p-7"
    >
      <p className="text-eyebrow text-text-muted">{careersCopy.hero.directoryTitle}</p>
      <ul className="mt-4 border-t border-border">
        {rows.map((team) => {
          const all = team === ALL_TEAMS
          return (
            <li key={team} className="border-b border-border">
              <a
                href="#open-positions"
                onClick={() => onPick(team)}
                className="group flex items-center gap-4 py-4 text-text no-underline hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <HexMark
                  variant={all ? 'solid' : 'station'}
                  size={18}
                  className="transition-transform duration-300 ease-standard group-hover:rotate-90 [&_polygon]:transition-colors group-hover:[&_polygon]:fill-accent"
                />
                <span className={cn('flex-1', all ? 'text-body font-semibold' : 'text-card-title')}>
                  {all ? careersCopy.hero.primaryCta : team}
                </span>
                <span className="text-body-small tabular-nums text-text-secondary">
                  {roleCount(rolesForTeam(team).length)}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Remote. Flexible. Impact. Three signs, all readable at once. */
function Pillars() {
  const copy = careersCopy.pillars

  return (
    <section className="section-y bg-page-white" aria-labelledby="career-pillars-title">
      <Container variant="wide" className="w-full">
        <SectionHeader title={copy.title} titleId="career-pillars-title" />
        <ul className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-0">
          {copy.items.map((item, index) => (
            <li
              key={item.id}
              className={cn(
                'border-t border-border pt-6 md:pt-8',
                index > 0 && 'md:border-l md:pl-8',
                index < copy.items.length - 1 && 'md:pr-8',
              )}
            >
              <h3 className="text-section-title text-text">{item.label}</h3>
              <p className="mt-4 max-w-[30ch] text-body text-text-secondary">{item.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/** How we show up: the studio's own line, then the six habits as a directory. */
function Culture() {
  return (
    <section className="section-y bg-bg-subtle" aria-labelledby="careers-culture-title">
      <Container variant="wide" className="w-full">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 id="careers-culture-title" className="max-w-[12ch] text-section-title text-text">
              {careersCopy.culture.headline}
            </h2>
            <p className="mt-6 max-w-[34rem] text-body-large text-text-secondary">{careersCopy.why.body}</p>
            <p className="mt-10 max-w-[30rem] border-l-[3px] border-accent pl-5 text-title text-text">
              {careersCopy.culture.quote}
            </p>
          </div>

          <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {cultureThemes.map((theme) => (
              <div key={theme.id} className="border-t border-border-strong pt-5">
                <dt className="text-card-title text-text">{theme.label}</dt>
                <dd className="mt-2 text-body text-text-secondary">{theme.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}

/**
 * The five legacy steps as a route: stations you can select, the line filled
 * up to the one you are on, and that step's detail underneath.
 */
function CareerProcess() {
  const reduced = useReducedMotion() === true
  const [active, setActive] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const last = workStages.length - 1
  const stage = workStages[active] ?? workStages[0]

  function select(index: number, moveFocus = false) {
    const next = Math.min(last, Math.max(0, index))
    setActive(next)
    if (moveFocus) tabRefs.current[next]?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const targets: Partial<Record<string, number>> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: last,
    }
    const next = targets[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next, true)
  }

  if (!stage) return null

  return (
    <section id="how-we-work" className="scroll-mt-28 section-y bg-page-white" aria-labelledby="how-we-work-title">
      <Container variant="wide" className="w-full">
        <SectionHeader
          eyebrow={careersCopy.process.headline}
          meta={`${workStages.length} steps`}
          title={careersCopy.process.title}
          titleId="how-we-work-title"
          description={careersCopy.process.body}
        />

        <div role="tablist" aria-label="Project steps" className="mt-14 grid md:mt-20 md:grid-cols-5">
          {workStages.map((item, index) => {
            const on = index === active
            const passed = index < active
            return (
              <div key={item.id} role="presentation" className="relative">
                {index < last ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-[2.375rem] bottom-[-0.625rem] left-2.5 w-1 rounded-full transition-colors duration-500 ease-standard',
                      'md:top-2.5 md:bottom-auto md:left-[calc(50%+1.125rem)] md:h-1 md:w-[calc(100%-2.25rem)]',
                      passed ? 'bg-brand' : 'bg-border',
                    )}
                  />
                ) : null}
                <button
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  type="button"
                  role="tab"
                  id={`step-tab-${item.id}`}
                  aria-selected={on}
                  aria-controls="step-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className="group flex w-full items-start gap-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:flex-col md:items-center md:gap-4 md:py-0 md:text-center"
                >
                  <HexMark
                    variant={on ? 'active' : passed ? 'solid' : 'station'}
                    size={24}
                    className="relative transition-transform duration-300 ease-standard group-hover:scale-110"
                  />
                  <span>
                    <span className="block text-caption tabular-nums text-text-muted">{item.number}</span>
                    <span
                      className={cn(
                        'mt-0.5 block text-card-title transition-colors',
                        on ? 'text-text' : 'text-text-secondary group-hover:text-text',
                      )}
                    >
                      {item.title}
                    </span>
                  </span>
                </button>
              </div>
            )
          })}
        </div>

        <div
          id="step-panel"
          role="tabpanel"
          aria-labelledby={`step-tab-${stage.id}`}
          className="mt-10 rounded-xl bg-bg-subtle p-6 md:mt-14 md:p-10"
        >
          <m.div
            key={stage.id}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease }}
            className="grid gap-4 md:grid-cols-12 md:gap-8"
          >
            <div className="md:col-span-5">
              <p className="text-caption tabular-nums text-text-muted">
                Step {active + 1} of {workStages.length}
              </p>
              <h3 className="mt-2 text-title text-text">{stage.title}</h3>
            </div>
            <p className="max-w-[38rem] text-body-large text-text-secondary md:col-span-6 md:col-start-7">
              {stage.body}
            </p>
          </m.div>
        </div>
      </Container>
    </section>
  )
}

function CareersIndex() {
  const [team, setTeam] = useState<string>(ALL_TEAMS)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Careers | Bizaffix'
    return () => {
      document.title = previousTitle
    }
  }, [])

  /*
   * Arriving from another page at /careers#open-positions: the layout scrolls to
   * the top on route change, so wait for that, then go to the anchor.
   * Same-page hash links are handled by the smooth scroller.
   */
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' })
    }, 120)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <main className="studio-page bg-page-white text-text">
        <PageHero
          zone={careersCopy.hero.eyebrow}
          meta={openRoleCount(jobPostings.length)}
          title={careersCopy.hero.headline}
          titleId="careers-title"
          intro={careersCopy.hero.body}
          actions={
            <>
              <Button href="#open-positions" variant="primary" size="lg">
                {careersCopy.hero.primaryCta}
              </Button>
              <Button href="#how-we-work" variant="secondary" size="lg">
                {careersCopy.process.headline}
              </Button>
            </>
          }
          aside={<TeamDirectory onPick={setTeam} />}
        />
        <Pillars />
        <Culture />
        <CareerProcess />
        <CareerBoard team={team} onTeamChange={setTeam} />
      </main>
    </LazyMotion>
  )
}

/** /careers is the index; /careers/:slug is one role. */
export function CareersPage() {
  const { slug } = useParams()
  if (slug) return <JobDetailPage />
  return <CareersIndex />
}

export default CareersPage
