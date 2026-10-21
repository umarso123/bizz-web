import { LazyMotion, domAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import { bookCallButtonProps } from '@/app/navigation.ts'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { PageHero } from '@/components/layout/PageHero.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { healthcareIntro, healthcareSolutions } from '@/content/healthcare.ts'
import { servicesPage } from '@/content/services.ts'
import { getCaseStudy } from '@/content/work.ts'
import { cn } from '@/lib/cn.ts'
import { HeroRouteMap } from '@/sections/home/HeroRouteMap.tsx'
import { HowWeWork } from '@/sections/home/HowWeWork.tsx'
import { StudyMedia } from '@/sections/work/WorkStill.tsx'

const anchorFor = (id: string) => `solution-${id}`

/** Which solution is in view, for the "On this route" index. */
function useActiveSolution() {
  const [active, setActive] = useState<string>(healthcareSolutions[0].id)

  useEffect(() => {
    const targets = healthcareSolutions
      .map((item) => document.getElementById(anchorFor(item.id)))
      .filter((node): node is HTMLElement => Boolean(node))
    if (targets.length === 0 || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(visible.target.id.replace('solution-', ''))
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    targets.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return active
}

function RouteIndex({ active }: { active: string }) {
  return (
    <nav aria-label="Healthcare solutions on this page" className="lg:sticky lg:top-28">
      <p className="text-eyebrow text-text-muted">On this route</p>
      <ol className="relative mt-5 grid gap-1">
        <span aria-hidden="true" className="absolute top-4 bottom-4 left-[0.6875rem] w-1 -translate-x-1/2 rounded-full bg-brand" />
        {healthcareSolutions.map((item) => {
          const current = item.id === active
          return (
            <li key={item.id} className="relative">
              <a
                href={`#${anchorFor(item.id)}`}
                aria-current={current ? 'location' : undefined}
                className={cn(
                  'flex items-center gap-4 rounded-lg py-2 text-body-small font-semibold no-underline transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                  current ? 'text-text' : 'text-text-secondary',
                )}
              >
                <HexMark variant={current ? 'active' : 'station'} size={22} className="relative z-10" />
                {item.station}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function HealthcarePage() {
  const active = useActiveSolution()

  useEffect(() => {
    const previous = document.title
    document.title = 'Healthcare | Bizaffix'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <main className="studio-page">
        <PageHero
          zone="Healthcare"
          meta={`${healthcareSolutions.length} solutions`}
          title={healthcareIntro.title}
          titleId="healthcare-title"
          intro={healthcareIntro.body}
          actions={
            <>
              <Button size="lg" variant="primary" {...bookCallButtonProps()}>
                Book a call
              </Button>
              <Button size="lg" variant="secondary" href="#solutions">
                Explore the solutions
              </Button>
            </>
          }
          aside={
            <div className="mx-auto w-full max-w-[600px]">
              <HeroRouteMap />
            </div>
          }
        />

        {/* The five solutions, in full */}
        <section id="solutions" className="section-y bg-page-white" aria-labelledby="solutions-title">
          <Container variant="wide" className="w-full">
            <SectionHeader
              eyebrow="Solutions"
              meta={`${healthcareSolutions.length} solutions`}
              title="Five ways we connect care."
              titleId="solutions-title"
              description="From the decision at the bedside to the data moving between systems, each solution is built around the workflow it serves."
            />

            <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-8">
              <div className="hidden lg:col-span-3 lg:block">
                <RouteIndex active={active} />
              </div>

              <div className="lg:col-span-8 lg:col-start-5">
                {healthcareSolutions.map((item) => {
                  const study = getCaseStudy(item.slug)
                  return (
                    <article
                      key={item.id}
                      id={anchorFor(item.id)}
                      className="scroll-mt-28 border-t border-border py-12 first:border-t-0 first:pt-0 md:py-16"
                      aria-labelledby={`${anchorFor(item.id)}-title`}
                    >
                      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-bg-subtle">
                        <StudyMedia slug={item.slug} image={study?.image ?? null} alt="" />
                      </div>
                      <div className="mt-8 grid gap-6 md:grid-cols-8 md:gap-8">
                        <div className="md:col-span-3">
                          <p className="flex items-center gap-2 text-eyebrow text-text-secondary">
                            <HexMark variant="solid" size={10} />
                            {item.station}
                          </p>
                          <h3 id={`${anchorFor(item.id)}-title`} className="mt-3 text-title text-text">
                            {item.title}
                          </h3>
                        </div>
                        <div className="md:col-span-5">
                          <p className="text-body-large text-text-secondary">{item.body}</p>
                          <TextLink to={`/work/${item.slug}`} className="mt-3">
                            View Case Study
                          </TextLink>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </Container>
        </section>

        {/* The platforms these solutions ship on */}
        <section className="section-y bg-bg-subtle" aria-labelledby="healthcare-platforms-title">
          <Container variant="wide" className="w-full">
            <SectionHeader
              eyebrow="Services"
              meta={`${servicesPage.services.length} services`}
              title="Built across mobile, web, and cloud."
              titleId="healthcare-platforms-title"
              description="Custom mobile applications, websites, designs, and branding for healthcare, delivered by one team from idea to reality."
              action={<TextLink to="/services">View all services</TextLink>}
            />
            <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 md:mt-16">
              {servicesPage.groups.map((group) => (
                <li key={group.id} className="bg-surface p-7 sm:p-8">
                  <p className="text-title text-text">{group.label}</p>
                  <p className="mt-3 text-body-small text-text-secondary">
                    {group.services
                      .map((id) => servicesPage.services.find((service) => service.id === id)?.title)
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <HowWeWork />
      </main>
    </LazyMotion>
  )
}
