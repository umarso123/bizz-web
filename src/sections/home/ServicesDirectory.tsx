import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { TintPanel } from '@/components/layout/TintPanel.tsx'
import { Reveal } from '@/components/motion/Reveal.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { servicesPage } from '@/content/services.ts'

/** Line icons that draw themselves in when the card arrives (stroke reveal). */
function GroupIcon({ id }: { id: string }) {
  const shapes: Record<string, string[]> = {
    mobile: ['M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5Z', 'M10.5 18.5h3'],
    web: ['M3.5 5.5h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z', 'M2.5 9.5h19', 'M5.5 7.5h.01M7.5 7.5h.01'],
    cloud: ['M7 18.5a4.5 4.5 0 0 1-.4-9 6 6 0 0 1 11.6 1.6A3.75 3.75 0 0 1 17.5 18.5Z'],
  }
  return (
    <span className="grid size-11 place-items-center rounded-[12px] bg-brand-soft text-brand transition-colors duration-500 group-hover/card:bg-brand group-hover/card:text-white">
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {(shapes[id] ?? shapes.web).map((d, index) => (
          <path key={index} d={d} pathLength={1} className="reveal-stroke" style={{ '--reveal-delay': `${200 + index * 150}ms` } as CSSProperties} />
        ))}
      </svg>
    </span>
  )
}

type Service = (typeof servicesPage.services)[number]

const byId = new Map<string, Service>(servicesPage.services.map((service) => [service.id, service]))

/**
 * The six services as one signboard, split by the platform they ship on.
 * Technologies fill the shortest column, so the board reads as one piece.
 */
export function ServicesDirectory() {
  const groups = servicesPage.groups
  const technologies = servicesPage.technologies

  return (
    <section id="services" className="relative py-2 md:py-3" aria-labelledby="services-directory-title">
      <TintPanel tint="lightblue">
        <div className="section-y md:px-8">
      <Container variant="wide" className="relative w-full">
        <SectionHeader
          eyebrow="Services"
          meta={`${servicesPage.services.length} services`}
          title={servicesPage.hero.title}
          titleId="services-directory-title"
          description="Propel your business to new heights and unlock its true potential today."
          action={<TextLink to="/services">View all services</TextLink>}
        />

        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3">
          {groups.map((group, groupIndex) => {
            const items = group.services
              .map((id) => byId.get(id))
              .filter((service): service is Service => Boolean(service))
            const last = groupIndex === groups.length - 1

            return (
              <Reveal
                key={group.id}
                delay={groupIndex * 110}
                className="group/card flex flex-col rounded-[20px] border border-border bg-white/90 p-6 backdrop-blur-sm transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-brand sm:p-7"
              >
                <GroupIcon id={group.id} />
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="text-[1.25rem] leading-tight font-semibold tracking-[-0.015em] text-text">{group.label}</h3>
                  <p className="text-caption text-text-muted tabular-nums">
                    {items.length} {items.length === 1 ? 'service' : 'services'}
                  </p>
                </div>

                <ul className="mt-6">
                  {items.map((service, itemIndex) => (
                    <Reveal as="li" key={service.id} delay={250 + groupIndex * 120 + itemIndex * 90} className="border-t border-border-subtle py-5 first:border-t-0 first:pt-0">
                      <Link
                        to={`/services#${service.slug}`}
                        className="group inline-block text-[1.125rem] leading-snug font-semibold text-text no-underline hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        <span className="underline decoration-transparent decoration-[1.5px] underline-offset-[0.25em] transition-[text-decoration-color] duration-200 group-hover:decoration-brand">
                          {service.title}
                        </span>
                      </Link>
                      <p className="mt-1.5 max-w-[30rem] text-[0.95rem] leading-[1.55] text-text-secondary">{service.body}</p>
                    </Reveal>
                  ))}
                </ul>

                {last ? (
                  <div className="mt-auto border-t border-border-subtle pt-6">
                    <p className="text-eyebrow text-text-muted">{technologies.eyebrow}</p>
                    <ul className="mt-3 flex flex-wrap gap-2" aria-label={technologies.eyebrow}>
                      {technologies.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-pill border border-border px-3 py-1 text-caption font-medium text-text"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Reveal>
            )
          })}
        </div>
      </Container>
        </div>
      </TintPanel>
    </section>
  )
}
