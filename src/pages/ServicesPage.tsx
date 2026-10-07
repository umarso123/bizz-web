import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { bookCall } from '@/app/navigation.ts'
import { Container } from '@/components/layout/Container.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { servicesPage } from '@/content/services.ts'
import { cn } from '@/lib/cn.ts'
import { Reveal } from '@/sections/home/Reveal.tsx'

const ease = [0.2, 0, 0, 1] as const

function ServiceRow({
  service,
  index,
  hovered,
  setHovered,
  reduced,
}: {
  service: (typeof servicesPage.services)[number]
  index: number
  hovered: number | null
  setHovered: (index: number | null) => void
  reduced: boolean
}) {
  const isHovered = hovered === index
  const neighbor = hovered !== null && hovered !== index && Math.abs(hovered - index) === 1

  return (
    <m.li
      onPointerEnter={() => setHovered(index)}
      onPointerLeave={() => setHovered(null)}
      animate={
        reduced
          ? undefined
          : {
              y: isHovered ? -3 : neighbor ? 2 : 0,
              scale: isHovered ? 1.01 : 1,
            }
      }
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
    >
      <article
        id={service.slug}
        className="group relative grid scroll-mt-28 gap-4 border-b border-border-subtle py-10 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,26rem)] md:items-baseline md:gap-10 md:py-12"
      >
        <m.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-1rem] inset-y-2 -z-10 rounded-xl md:inset-x-[-1.5rem]"
          animate={{
            opacity: isHovered && !reduced ? 1 : 0,
            backgroundColor: isHovered ? 'rgb(232 238 252 / 0.9)' : 'transparent',
          }}
          transition={{ duration: 0.25 }}
        />
        <m.span
          aria-hidden="true"
          className="absolute top-1/2 left-0 h-10 w-[3px] -translate-y-1/2 rounded-full"
          animate={{
            scaleY: isHovered ? 1 : 0.3,
            opacity: isHovered ? 1 : 0,
            backgroundColor: isHovered
              ? index % 2 === 0
                ? '#2f5bea'
                : '#f5c84c'
              : 'transparent',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        />
        <p className="text-caption text-text-muted">0{index + 1}</p>
        <h2 className="text-[clamp(1.5rem,1.15rem+1vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.025em] text-text">
          {service.title}
        </h2>
        <p className="text-body text-text-secondary">{service.body}</p>
      </article>
    </m.li>
  )
}

export function ServicesPage() {
  const reduced = useReducedMotion() === true
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Services · Bizaffix'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <main>
        <section className="atmosphere-hero -mt-(--header-clearance) pt-[calc(var(--header-clearance)+2.5rem)] pb-20 md:pt-[calc(var(--header-clearance)+3.5rem)] md:pb-28">
          <Container variant="page" className="relative w-full">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-20">
              <div>
                <m.div
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.55, ease }}
                >
                  <Eyebrow tone="brand">{servicesPage.hero.eyebrow}</Eyebrow>
                </m.div>
                <m.h1
                  className="mt-4 max-w-[12ch] text-[clamp(2.5rem,1.5rem+2.8vw,4.25rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-text"
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.08, ease }}
                >
                  {servicesPage.hero.title.slice(0, servicesPage.hero.title.lastIndexOf(' '))}{' '}
                  <span className="text-brand">
                    {servicesPage.hero.title.slice(servicesPage.hero.title.lastIndexOf(' ') + 1)}
                  </span>
                </m.h1>
                <m.p
                  className="mt-6 max-w-[38rem] text-body-large text-text-secondary"
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.16, ease }}
                >
                  {servicesPage.hero.body}
                </m.p>
                <m.div
                  className="mt-8"
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.24, ease }}
                >
                  <Button to={bookCall.to} size="lg" variant="brand">
                    {bookCall.label}
                  </Button>
                </m.div>
              </div>
              <Reveal delay={0.1}>
                <Eyebrow>From idea to reality</Eyebrow>
                <p className="mt-4 text-title text-text">{servicesPage.intro.title}</p>
                <p className="mt-4 text-body text-text-secondary">{servicesPage.intro.body}</p>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="bg-page-white py-20 md:py-28" aria-labelledby="services-list-title">
          <Container variant="page" className="w-full">
            <Reveal className="max-w-[36rem]">
              <Eyebrow tone="brand">What we offer</Eyebrow>
              <h2 id="services-list-title" className="mt-4 text-section-title text-text">
                Six practices. One studio.
              </h2>
            </Reveal>
            <ul className="mt-12 border-t border-border-subtle">
              {servicesPage.services.map((service, index) => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  index={index}
                  hovered={hovered}
                  setHovered={setHovered}
                  reduced={reduced}
                />
              ))}
            </ul>
          </Container>
        </section>

        <section className="bg-page-brand py-20 md:py-28" aria-labelledby="process-title">
          <Container variant="page" className="w-full">
            <Reveal className="max-w-[36rem]">
              <Eyebrow tone="brand">{servicesPage.process.eyebrow}</Eyebrow>
              <h2 id="process-title" className="mt-4 text-section-title text-text">
                {servicesPage.process.title}
              </h2>
            </Reveal>
            <ol className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {servicesPage.process.stages.map((stage, index) => (
                <li key={stage.number}>
                  <Reveal delay={index * 0.04}>
                    <p className="text-[clamp(2.25rem,1.8rem+1.2vw,3.25rem)] leading-none font-medium tracking-[-0.03em] text-brand">
                      {stage.number}
                    </p>
                    <h3 className="mt-4 text-title text-text">{stage.title}</h3>
                    <p className="mt-3 max-w-[28rem] text-body text-text-secondary">{stage.body}</p>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'mt-6 block h-px origin-left bg-brand',
                        index % 2 === 0 ? 'w-16' : 'w-24',
                      )}
                    />
                  </Reveal>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section className="bg-page-white py-16 md:py-20" aria-labelledby="tech-title">
          <Container variant="page" className="w-full">
            <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[28rem]">
                <Eyebrow>{servicesPage.technologies.eyebrow}</Eyebrow>
                <h2 id="tech-title" className="mt-3 text-title text-text">
                  {servicesPage.technologies.title}
                </h2>
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {servicesPage.technologies.items.map((name) => (
                  <li key={name} className="text-body text-text-secondary">
                    {name}
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </section>

        <section className="bg-page-brand py-20 md:py-28" aria-labelledby="industries-title">
          <Container variant="page" className="w-full">
            <Reveal className="max-w-[36rem]">
              <Eyebrow tone="brand">{servicesPage.industries.eyebrow}</Eyebrow>
              <h2 id="industries-title" className="mt-4 text-section-title text-text">
                {servicesPage.industries.title}
              </h2>
            </Reveal>
            <ul className="mt-12 flex flex-wrap gap-3">
              {servicesPage.industries.items.map((industry, index) => (
                <Reveal key={industry} delay={index * 0.04}>
                  <li
                    className={cn(
                      'rounded-md border px-5 py-3 text-body font-semibold',
                      industry === 'Healthcare'
                        ? 'border-brand/30 bg-brand-subtle text-brand-hover'
                        : 'border-border bg-surface text-text',
                    )}
                  >
                    {industry}
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal className="mt-8">
              <Button to="/healthcare" variant="secondary">
                Explore healthcare
              </Button>
            </Reveal>
          </Container>
        </section>

        <section className="bg-page-dark py-24 text-text-inverse md:py-32" aria-labelledby="services-cta-title">
          <Container variant="page" className="relative w-full">
            <Reveal className="max-w-[42rem]">
              <h2
                id="services-cta-title"
                className="text-[clamp(2.25rem,1.3rem+2.4vw,3.5rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-text-inverse"
              >
                {servicesPage.cta.title}
              </h2>
              <p className="mt-5 max-w-[36rem] text-body-large text-text-inverse/80">
                {servicesPage.cta.body}
              </p>
              <div className="mt-8">
                <Button to={bookCall.to} size="lg" variant="brand">
                  {bookCall.label}
                </Button>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
    </LazyMotion>
  )
}
