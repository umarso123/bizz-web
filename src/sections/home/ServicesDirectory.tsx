import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperLink, PaperSection } from '@/components/paper/kit.tsx'
import { PaperPin } from '@/components/paper/paper.tsx'
import { servicesPage } from '@/content/services.ts'

/** Line icons that draw themselves in when the card arrives (stroke reveal). */
function GroupIcon({ id }: { id: string }) {
  const shapes: Record<string, string[]> = {
    mobile: ['M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5Z', 'M10.5 18.5h3'],
    web: ['M3.5 5.5h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z', 'M2.5 9.5h19', 'M5.5 7.5h.01M7.5 7.5h.01'],
    cloud: ['M7 18.5a4.5 4.5 0 0 1-.4-9 6 6 0 0 1 11.6 1.6A3.75 3.75 0 0 1 17.5 18.5Z'],
  }
  return (
    <span className="grid size-11 place-items-center rounded-[2px] border border-[var(--ph-border)] text-[var(--ph-blue)]">
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {(shapes[id] ?? shapes.web).map((d, index) => (
          <path key={index} d={d} pathLength={1} className="reveal-stroke" style={{ '--reveal-delay': `${200 + index * 150}ms` } as CSSProperties} />
        ))}
      </svg>
    </span>
  )
}

/**
 * Technologies from the legacy list, only where the service names them outright.
 * Everything else shows just its platform; the full stack is listed under the grid.
 */
const namedTech: Record<string, string[]> = {
  android: ['Kotlin'],
  flutter: ['Flutter'],
  web: ['HTML'],
}

/** A slight, fixed tilt per card. */
const ROT = ['-1deg', '0.8deg', '-0.5deg', '1.2deg', '-1.4deg', '0.6deg']

/**
 * 07 — The six services as pinned spec cards (SVC-01 to SVC-06), equal heights,
 * each with its platform and named technologies as tags at the bottom.
 */
export function ServicesDirectory() {
  const { groups, services, technologies } = servicesPage
  const groupOf = new Map(groups.flatMap((group) => group.services.map((id) => [id, group] as const)))

  return (
    <PaperSection tone="white" id="services" labelledBy="services-directory-title">
      <div className="grid grid-cols-12 gap-6">
        <h2 id="services-directory-title" className="ph-h2 col-span-12 lg:col-span-5">
          <RevealLines lines={[servicesPage.hero.title]} />
        </h2>
        <Reveal variant="fade" className="col-span-12 lg:col-span-6 lg:col-start-7">
          <p className="ph-lead text-[var(--ph-grey)]">Propel your business to new heights and unlock its true potential today.</p>
          <PaperLink to="/services" className="mt-6">
            View all services
          </PaperLink>
        </Reveal>
      </div>

      <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const group = groupOf.get(service.id)
          const tags = [group?.label.toUpperCase().replace(' APPS', '') ?? '', ...(namedTech[service.id] ?? [])].filter(Boolean)
          return (
            <Reveal as="li" key={service.id} delay={(index % 3) * 90} className="flex">
              <article
                className="ph-paper ph-tilt flex w-full flex-col pt-10 md:pt-10"
                style={{ '--rot': ROT[index % ROT.length] } as CSSProperties}
              >
                <PaperPin className="top-[22px] left-1/2" />
                <div className="flex items-start justify-between gap-4">
                  <GroupIcon id={group?.id ?? 'web'} />
                  <span className="ph-label text-[var(--ph-grey)]">SVC-0{index + 1}</span>
                </div>
                <h3 className="ph-h3 mt-6">
                  <Link
                    to={`/services#${service.slug}`}
                    className="text-[var(--ph-navy)] no-underline after:absolute after:inset-0 hover:text-[var(--ph-navy)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ph-blue)]"
                  >
                    {service.title}
                  </Link>
                </h3>
                <p className="ph-body mt-3 text-[var(--ph-grey)]">{service.body}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-6" aria-label="Tags">
                  {tags.map((tag) => (
                    <li key={tag} className="ph-label rounded-[2px] border border-[var(--ph-border)] px-2 py-1 text-[var(--ph-navy)]">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          )
        })}
      </ul>

      <Reveal variant="fade" className="ph-label mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[var(--ph-grey)]">
        <p>{technologies.eyebrow}:</p>
        <p className="text-[var(--ph-navy)]">{technologies.items.join(' · ')}</p>
      </Reveal>
    </PaperSection>
  )
}
