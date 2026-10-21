import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { bookCall, bookCallButtonProps } from '@/app/navigation.ts'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { PageHero } from '@/components/layout/PageHero.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { servicesPage } from '@/content/services.ts'
import { cn } from '@/lib/cn.ts'

type Service = (typeof servicesPage.services)[number]

const serviceById = new Map<string, Service>(
  servicesPage.services.map((service) => [service.id, service] as const),
)

function countLabel(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

function HeroMedia() {
  const reduced = useReducedMotion() === true
  // The night-route field shows until the video has a frame, never a black box.
  const [ready, setReady] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl bg-night-route">
      <video
        className={cn(
          'aspect-4/3 w-full object-cover transition-opacity duration-700 motion-reduce:transition-none',
          ready ? 'opacity-100' : 'opacity-0',
        )}
        src="/videos/facts/colleagues-presenting-healthcare.mp4"
        autoPlay={!reduced}
        muted
        loop
        playsInline
        controls={reduced}
        preload={reduced ? 'metadata' : 'auto'}
        onLoadedData={() => setReady(true)}
        aria-label="Colleagues presenting a healthcare product on a laptop"
      />
    </div>
  )
}

/** Healthcare first: the five solutions as stations on one route. */
function HealthcareBand() {
  const copy = servicesPage.healthcare

  return (
    <section id="healthcare" className="bg-page-white pt-8 md:pt-14" aria-labelledby="services-healthcare-title">
      <Container variant="wide" className="w-full">
        <div className="rounded-2xl bg-night-route px-6 pt-12 pb-4 text-text-inverse sm:px-10 md:px-14 md:pt-16">
          <SectionHeader
            inverse
            eyebrow={copy.eyebrow}
            meta={countLabel(copy.offers.length, 'solution')}
            title={copy.title}
            titleId="services-healthcare-title"
            description={copy.body}
            action={
              <Button to={copy.ctaTo} variant="inverse" size="lg">
                {copy.cta}
              </Button>
            }
          />

          <ul className="mt-14 grid sm:grid-cols-2 md:mt-20 lg:grid-cols-5">
            {copy.offers.map((offer, index) => (
              <li key={offer.title} className="relative border-t-2 border-brand pt-9 pr-6 pb-10">
                <HexMark
                  variant={index === 0 ? 'active' : 'station'}
                  size={18}
                  className="absolute -top-2.5 left-0"
                />
                <h3 className="text-card-title text-text-inverse">
                  <Link
                    to={offer.to}
                    className="text-text-inverse no-underline decoration-accent decoration-2 underline-offset-[0.25em] before:absolute before:inset-0 hover:text-text-inverse hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {offer.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-[22rem] text-body-small text-text-inverse-muted">{offer.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

/** The six services, grouped by the platform they ship on. */
function ServiceGroups() {
  return (
    <section className="bg-page-white section-y" aria-labelledby="services-list-title">
      <Container variant="wide" className="w-full">
        <SectionHeader
          title={servicesPage.intro.title}
          titleId="services-list-title"
          description={servicesPage.intro.body}
        />

        <div className="mt-14 md:mt-20">
          {servicesPage.groups.map((group) => (
            <div
              key={group.id}
              className="grid gap-8 border-t border-border py-10 md:py-14 lg:grid-cols-12 lg:gap-8"
            >
              <div className="lg:col-span-3">
                <h3 className="text-title text-text">{group.label}</h3>
                <p className="mt-2 text-caption text-text-muted tabular-nums">
                  {countLabel(group.services.length, 'service')}
                </p>
              </div>
              <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
                {group.services.map((id) => {
                  const service = serviceById.get(id)
                  if (!service) return null
                  return (
                    <li key={service.id}>
                      <article id={service.slug} className="scroll-mt-32">
                        <h4 className="text-card-title text-text">{service.title}</h4>
                        <p className="mt-3 max-w-[28rem] text-body text-text-secondary">{service.body}</p>
                      </article>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/** The five steps are a real sequence, so they sit on a route with numbered stations. */
function ProcessRoute() {
  const stages = servicesPage.process.stages

  return (
    <section className="bg-bg-subtle section-y" aria-labelledby="process-title">
      <Container variant="wide" className="w-full">
        <SectionHeader title={servicesPage.process.title} titleId="process-title" />

        <ol className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-5 lg:gap-0">
          {stages.map((stage, index) => (
            <li
              key={stage.number}
              className={cn(
                'relative pl-12 lg:pr-8 lg:pl-0',
                // The segment to the next station: down on small screens, across on wide ones.
                'before:absolute before:top-6 before:-bottom-12 before:left-[10.5px] before:w-[3px] before:bg-brand last:before:hidden',
                'lg:before:top-[10.5px] lg:before:right-0 lg:before:bottom-auto lg:before:left-6 lg:before:h-[3px] lg:before:w-auto',
              )}
            >
              <HexMark
                variant={index === 0 ? 'active' : 'station'}
                size={24}
                className="absolute top-0 left-0 lg:static lg:block"
              />
              <p className="text-caption text-text-muted tabular-nums lg:mt-6">{stage.number}</p>
              <h3 className="mt-2 text-title text-text">{stage.title}</h3>
              <p className="mt-3 max-w-[22rem] text-body-small text-text-secondary">{stage.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

/** Directory board: the tools the work uses, and the industries it serves. */
function Directory() {
  const { technologies, industries } = servicesPage

  return (
    <section className="bg-page-white section-y" aria-label="Technologies and industries">
      <Container variant="wide" className="w-full">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <h2 id="tech-title" className="max-w-[16ch] text-title text-text lg:col-span-4">
            {technologies.title}
          </h2>
          <ul className="grid grid-cols-2 border-t border-border sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            {technologies.items.map((name) => (
              <li key={name} className="border-b border-border py-5 pr-4 text-title text-text">
                {name}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 grid gap-10 md:mt-28 lg:grid-cols-12 lg:gap-8">
          <h2 id="industries-title" className="max-w-[16ch] text-title text-text lg:col-span-4">
            {industries.title}
          </h2>
          <ul className="border-t border-border lg:col-span-7 lg:col-start-6">
            {industries.items.map((industry) => {
              const lead = industry === 'Healthcare'
              return (
                <li
                  key={industry}
                  className="flex min-h-16 items-center justify-between gap-4 border-b border-border py-3"
                >
                  <span className={cn('flex items-center gap-3 text-card-title', lead ? 'text-text' : 'text-text-secondary')}>
                    <HexMark variant={lead ? 'active' : 'outline'} size={14} className={lead ? undefined : 'text-border-strong'} />
                    {industry}
                  </span>
                  {lead ? (
                    <TextLink to="/healthcare" inline>
                      {servicesPage.healthcare.cta}
                    </TextLink>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}

export function ServicesPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Services | Bizaffix'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <main className="studio-page">
      <PageHero
        zone={servicesPage.hero.eyebrow}
        meta={countLabel(servicesPage.services.length, 'service')}
        title={servicesPage.hero.title}
        intro={servicesPage.hero.body}
        actions={
          <>
            <Button {...bookCallButtonProps()} size="lg" variant="primary">
              {bookCall.label}
            </Button>
            <TextLink to="/healthcare">{servicesPage.healthcare.cta}</TextLink>
          </>
        }
        aside={<HeroMedia />}
      />
      <HealthcareBand />
      <ServiceGroups />
      <ProcessRoute />
      <Directory />
    </main>
  )
}
