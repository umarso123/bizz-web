import { useEffect } from 'react'
import { bookCall, bookCallButtonProps } from '@/app/navigation.ts'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { PageHero } from '@/components/layout/PageHero.tsx'
import { CountUp, Reveal, RevealText } from '@/components/motion/Reveal.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { HexMonogram } from '@/components/ui/HexMonogram.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { Wayfinder } from '@/components/ui/Wayfinder.tsx'
import { aboutPage } from '@/content/about.ts'
import { studioAddress } from '@/content/contact.ts'
import { homeContent } from '@/content/home.ts'
import { servicesPage } from '@/content/services.ts'

const copy = aboutPage
const people = homeContent.members.people
const services = servicesPage.services
const otherIndustries = homeContent.industries.filter((industry) => industry !== 'Healthcare')

/** Route rows share one geometry so the line meets every station centre. */
const routeRow = 'relative flex items-start gap-4 py-3'
const routeStation = 'relative z-10 flex h-[1.7rem] w-7 shrink-0 items-center justify-center'
const routeSegment = 'absolute top-[1.6rem] left-3 h-full w-1 rounded-full bg-brand'

export function AboutPage() {
  useEffect(() => {
    const previous = document.title
    document.title = 'About | Bizaffix'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <main className="studio-page">
      <PageHero
        zone={copy.hero.zone}
        meta={studioAddress}
        title={copy.hero.title}
        titleId="about-title"
        intro={copy.hero.intro}
        actions={
          <>
            <Button {...bookCallButtonProps()} size="lg">
              {bookCall.label}
            </Button>
            <p className="text-body-small text-text-secondary">
              {copy.hero.workPrompt}{' '}
              <TextLink to="/work" inline>
                {copy.hero.workLink}
              </TextLink>
            </p>
          </>
        }
      />

      {/* What's Bizaffix: the welcome, set as a statement */}
      <section className="section-y bg-page-white" aria-labelledby="about-story-title">
        <Container variant="wide" className="w-full">
          <h2 id="about-story-title" className="sr-only">
            {copy.story.label}
          </h2>
          <div aria-hidden="true">
            <Wayfinder label={copy.story.label} />
          </div>
          <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-8">
            <p className="text-[length:clamp(1.625rem,1.1rem_+_1.75vw,2.75rem)] leading-[1.14] font-medium tracking-[-0.022em] text-text [font-stretch:90%] lg:col-span-10">
              {copy.story.statement}
            </p>
            <div className="flex flex-col gap-5 lg:col-span-5 lg:col-start-7">
              <p className="text-body-large text-text-secondary">{copy.story.relationships}</p>
              <p className="text-body text-text-secondary">{copy.story.closing}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Our impact: the old site's own figures, on the deep brand panel */}
      <section className="section-y bg-surface-brand-deep text-text-inverse" aria-labelledby="about-impact-title">
        <Container variant="wide" className="w-full">
          <Wayfinder label={copy.impact.label} meta={copy.impact.meta} inverse />
          <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <h2 id="about-impact-title" className="text-section-title text-text-inverse">
                <RevealText text={copy.impact.title} />
              </h2>
              <Reveal delay={200}>
                <p className="mt-6 text-body-large text-text-inverse-muted">{copy.impact.body}</p>
                <p className="mt-4 text-body text-text-inverse">{copy.impact.closing}</p>
              </Reveal>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:col-span-6 lg:col-start-7 lg:self-end">
              {copy.impact.numbers.map((item, index) => (
                <Reveal key={item.label} delay={index * 100} className="flex flex-col-reverse border-t border-white/20 pt-5">
                  <dt className="mt-3 text-body-small font-semibold text-text-inverse">{item.label}</dt>
                  <dd className="text-[length:clamp(3rem,2rem+3vw,5rem)] leading-none font-semibold tracking-[-0.03em] text-accent tabular-nums [font-stretch:84%]">
                    <CountUp value={item.value} />
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Industries: healthcare is the lead line, the others follow */}
      <section className="section-y bg-bg-subtle" aria-labelledby="about-industries-title">
        <Container variant="wide" className="w-full">
          <SectionHeader
            eyebrow={copy.industries.label}
            meta={`${homeContent.industries.length} industries`}
            title={copy.industries.title}
            titleId="about-industries-title"
            description={copy.industries.body}
            action={
              <Button to={copy.industries.ctaTo} variant="primary">
                {copy.industries.cta}
              </Button>
            }
          />

          <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-8">
            <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 lg:col-span-7">
              <ol aria-label="Healthcare solutions">
                <li className={routeRow}>
                  <span aria-hidden="true" className={routeSegment} />
                  <span className={routeStation}>
                    <HexMark variant="active" size={28} />
                  </span>
                  <div>
                    <p className="text-title text-text">Healthcare</p>
                    <p className="mt-1 text-caption text-text-muted">{copy.industries.leadCaption}</p>
                  </div>
                </li>
                {copy.industries.healthcareOffers.map((offer, index) => (
                  <li key={offer} className={routeRow}>
                    {index < copy.industries.healthcareOffers.length - 1 ? (
                      <span aria-hidden="true" className={routeSegment} />
                    ) : null}
                    <span className={routeStation}>
                      <HexMark variant="station" size={12} />
                    </span>
                    <span className="text-body text-text">{offer}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-eyebrow text-text-muted">{copy.industries.alsoLabel}</p>
              <ul className="mt-4 border-t border-border">
                {otherIndustries.map((industry) => (
                  <li key={industry} className="flex items-center gap-3 border-b border-border py-4">
                    <HexMark variant="outline" size={12} className="text-text-muted" />
                    <span className="text-card-title text-text">{industry}</span>
                  </li>
                ))}
              </ul>
              <TextLink to="/work" className="mt-3">
                {copy.industries.workLink}
              </TextLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Services, with the tools and project types beside them */}
      <section className="section-y bg-page-white" aria-labelledby="about-services-title">
        <Container variant="wide" className="w-full">
          <SectionHeader
            eyebrow={copy.services.label}
            meta={`${services.length} services`}
            title={copy.services.title}
            titleId="about-services-title"
            description={copy.services.body}
            action={<TextLink to="/services">{copy.services.cta}</TextLink>}
          />

          <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-8">
            <ul className="border-t border-border lg:col-span-7">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="grid gap-2 border-b border-border py-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-8"
                >
                  <h3 className="text-card-title text-text">{service.title}</h3>
                  <p className="text-body-small text-text-secondary">{service.body}</p>
                </li>
              ))}
            </ul>

            <dl className="grid content-start gap-10 lg:col-span-4 lg:col-start-9">
              <div>
                <dt className="text-eyebrow text-text-muted">{copy.services.technologiesLabel}</dt>
                <dd className="mt-3 text-body-large text-text">{copy.services.technologies.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-eyebrow text-text-muted">{copy.services.projectTypesLabel}</dt>
                <dd className="mt-3 text-body-large text-text">{copy.services.projectTypes.join(', ')}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      {/* Values: five principles, numbered */}
      <section className="section-y bg-bg-subtle" aria-labelledby="about-values-title">
        <Container variant="wide" className="w-full">
          <SectionHeader
            eyebrow={copy.values.label}
            meta={`${copy.values.items.length} values`}
            title={copy.values.title}
            titleId="about-values-title"
            description={copy.values.body}
          />

          <ol className="mt-14 border-t border-border md:mt-20">
            {copy.values.items.map((value, index) => (
              <Reveal
                as="li"
                key={value.title}
                delay={index * 60}
                className="grid gap-3 border-b border-border py-8 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <span className="text-caption text-text-muted tabular-nums md:col-span-1">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-title text-text md:col-span-4">{value.title}</h3>
                <p className="max-w-[36rem] text-body text-text-secondary md:col-span-6 md:col-start-7">{value.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Process: a real sequence, drawn as a route */}
      <section className="section-y bg-page-white" aria-labelledby="about-process-title">
        <Container variant="wide" className="w-full">
          <SectionHeader
            eyebrow={copy.process.label}
            meta={`${copy.process.steps.length} steps`}
            title={copy.process.title}
            titleId="about-process-title"
            description={copy.process.body}
          />

          <ol className="mt-14 grid md:mt-20 md:grid-cols-5">
            {copy.process.steps.map((step, index) => {
              const last = index === copy.process.steps.length - 1
              return (
                <li
                  key={step.title}
                  className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-5 pb-10 last:pb-0 md:block md:pr-8 md:pb-0"
                >
                  {!last ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-6 bottom-0 left-2.5 w-1 rounded-full bg-brand md:top-2.5 md:right-0 md:bottom-auto md:left-6 md:h-1 md:w-auto"
                    />
                  ) : null}
                  <HexMark variant={index === 0 ? 'active' : 'station'} size={24} className="relative z-10" />
                  <div className="md:mt-8">
                    <p className="text-caption text-text-muted tabular-nums">{String(index + 1).padStart(2, '0')}</p>
                    <h3 className="mt-2 text-title text-text">{step.title}</h3>
                    <p className="mt-3 max-w-[16rem] text-body-small text-text-secondary">{step.body}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </Container>
      </section>

      {/* Team: monograms stand in until real portraits are supplied */}
      <section className="section-y bg-bg-subtle" aria-labelledby="about-team-title">
        <Container variant="wide" className="w-full">
          <SectionHeader
            eyebrow={copy.team.label}
            meta={`${people.length} people`}
            title={copy.team.title}
            titleId="about-team-title"
            description={copy.team.body}
            action={<TextLink to={copy.team.careersTo}>{copy.team.careersLink}</TextLink>}
          />

          <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
            {people.map((person) => (
              <li key={person.id} className="flex flex-col gap-5 border-t border-border pt-6">
                <HexMonogram name={person.name} />
                <div>
                  <p className="text-card-title text-text">{person.name}</p>
                  <p className="mt-1.5 text-body-small text-text-secondary">{person.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  )
}
