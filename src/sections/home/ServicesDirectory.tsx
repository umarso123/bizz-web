import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperLink, PaperSection } from '@/components/paper/kit.tsx'
import { premiumHome } from '@/content/premium-home.ts'
import { servicesPage } from '@/content/services.ts'

/** Line icons that draw themselves in when the card arrives (stroke reveal). */
function GroupIcon({ id }: { id: string }) {
  const shapes: Record<string, string[]> = {
    mobile: ['M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5Z', 'M10.5 18.5h3'],
    web: ['M3.5 5.5h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z', 'M2.5 9.5h19', 'M5.5 7.5h.01M7.5 7.5h.01'],
    cloud: ['M7 18.5a4.5 4.5 0 0 1-.4-9 6 6 0 0 1 11.6 1.6A3.75 3.75 0 0 1 17.5 18.5Z'],
  }
  return (
    <span className="grid size-12 place-items-center rounded-[2px] bg-[var(--ph-blue)] text-white">
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {(shapes[id] ?? shapes.web).map((d, index) => (
          <path key={index} d={d} pathLength={1} className="reveal-stroke" style={{ '--reveal-delay': `${200 + index * 150}ms` } as CSSProperties} />
        ))}
      </svg>
    </span>
  )
}

/**
 * 07 — The six services, grouped the way clients buy them: Mobile, Web, Cloud.
 * Three flat sheets (no pins here; pins are kept for the page's hero moments),
 * each with what the group covers, its services, and the technologies it names.
 */
export function ServicesDirectory() {
  const { groups, services, technologies } = servicesPage
  const copy = premiumHome.copy
  const byId = new Map(services.map((service) => [service.id, service] as const))

  return (
    <PaperSection tone="white" id="services" labelledBy="services-directory-title">
      <div className="grid grid-cols-12 gap-6">
        <h2 id="services-directory-title" className="ph-h2 col-span-12 lg:col-span-5">
          <RevealLines lines={[servicesPage.hero.title]} />
        </h2>
        <Reveal variant="fade" className="col-span-12 lg:col-span-6 lg:col-start-7">
          <p className="ph-lead text-[var(--ph-grey)]">{copy.servicesLead}</p>
          <PaperLink to="/services" className="mt-6">
            View all services
          </PaperLink>
        </Reveal>
      </div>

      <ul className="mt-16 grid gap-6 lg:grid-cols-3">
        {groups.map((group, index) => {
          const meta = copy.serviceGroups[group.id]
          return (
            <Reveal as="li" key={group.id} delay={index * 90} className="flex">
              <article className="ph-paper flex w-full flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                <div className="flex items-start justify-between gap-4">
                  <GroupIcon id={group.id} />
                  <span className="ph-label text-[var(--ph-grey)]">
                    {group.services.length} {group.services.length === 1 ? 'service' : 'services'}
                  </span>
                </div>
                <h3 className="ph-h3 mt-6 text-[length:clamp(1.5rem,1.2rem+0.9vw,2rem)]">{group.label}</h3>
                {meta ? <p className="ph-body mt-3 text-[var(--ph-grey)]">{meta.summary}</p> : null}

                <ul className="mt-6 border-t border-[var(--ph-border)]">
                  {group.services.map((id) => {
                    const service = byId.get(id)
                    if (!service) return null
                    return (
                      <li key={id} className="border-b border-[var(--ph-border)]">
                        <Link
                          to={`/services#${service.slug}`}
                          className="group/row flex items-center justify-between gap-4 py-4 text-[var(--ph-navy)] no-underline hover:text-[var(--ph-blue)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ph-blue)]"
                        >
                          <span>
                            <span className="block font-medium">{service.title}</span>
                            <span className="ph-body mt-0.5 block text-[0.9375rem] text-[var(--ph-grey)]">{copy.serviceLines[id] ?? service.body}</span>
                          </span>
                          <span aria-hidden="true" className="transition-transform duration-300 group-hover/row:translate-x-1">
                            →
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>

                {meta && meta.tech.length > 0 ? (
                  <ul className="mt-auto flex flex-wrap gap-2 pt-6" aria-label="Technologies">
                    {meta.tech.map((tag) => (
                      <li key={tag} className="ph-label rounded-[2px] border border-[var(--ph-border)] px-2 py-1 text-[var(--ph-navy)]">
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
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
