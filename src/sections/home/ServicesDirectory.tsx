import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperLink, PaperSection } from '@/components/paper/kit.tsx'
import { servicesHome, type ServiceIcon } from '@/data/services-home.ts'

/** Line icons that draw themselves in when the card arrives (stroke reveal). */
const iconPaths: Record<ServiceIcon, string[]> = {
  mobile: ['M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5Z', 'M10.5 18.5h3'],
  web: ['M3.5 5.5h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z', 'M2.5 9.5h19', 'M5.5 7.5h.01M7.5 7.5h.01'],
  cloud: ['M7 18.5a4.5 4.5 0 0 1-.4-9 6 6 0 0 1 11.6 1.6A3.75 3.75 0 0 1 17.5 18.5Z'],
}

function GroupIcon({ id }: { id: ServiceIcon }) {
  return (
    <span className="grid size-12 place-items-center rounded-[2px] bg-[var(--ph-blue)] text-white">
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {iconPaths[id].map((d, index) => (
          <path key={index} d={d} pathLength={1} className="reveal-stroke" style={{ '--reveal-delay': `${200 + index * 150}ms` } as CSSProperties} />
        ))}
      </svg>
    </span>
  )
}

/**
 * 07: "Build your project." The services grouped the way clients buy them.
 * On desktop the three cards share one subgrid, so headers, summaries, each
 * service row and the tag line sit on the same lines across all three cards
 * and the cards come out equal height. All copy lives in data/services-home.ts.
 */
export function ServicesDirectory() {
  const { title, lead, link, groups, technologies } = servicesHome
  const maxRows = Math.max(...groups.map((group) => group.rows.length))
  // icon/count, title, summary, one track per service row, tags
  const cardRows = 3 + maxRows + 1
  const subgrid = 'lg:grid lg:grid-rows-subgrid lg:row-span-[var(--span)]'

  return (
    <PaperSection tone="white" id="services" labelledBy="services-directory-title">
      <div className="grid grid-cols-12 gap-6">
        <h2 id="services-directory-title" className="ph-h2 col-span-12 lg:col-span-5">
          <RevealLines lines={[title]} />
        </h2>
        <Reveal variant="fade" className="col-span-12 lg:col-span-6 lg:col-start-7">
          <p className="ph-lead text-[var(--ph-grey)]">{lead}</p>
          <PaperLink to={link.href} className="mt-6">
            {link.label}
          </PaperLink>
        </Reveal>
      </div>

      <ul className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-y-0">
        {groups.map((group, index) => (
          <Reveal as="li" key={group.id} delay={index * 90} className={`flex ${subgrid}`} style={{ '--span': cardRows } as CSSProperties}>
            <article
              className={`ph-paper flex w-full flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 ${subgrid} lg:gap-0`}
              style={{ '--span': cardRows } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-4">
                <GroupIcon id={group.id} />
                <span className="ph-label text-[var(--ph-grey)]">
                  {group.rows.length} {group.rows.length === 1 ? 'service' : 'services'}
                </span>
              </div>
              <h3 className="ph-h3 mt-6 text-[length:clamp(1.5rem,1.2rem+0.9vw,2rem)]">{group.label}</h3>
              <p className="ph-body mt-3 text-[var(--ph-grey)]">{group.summary}</p>

              <ul
                className={`mt-6 border-t border-[var(--ph-border)] ${subgrid} lg:content-start`}
                style={{ '--span': maxRows } as CSSProperties}
              >
                {group.rows.map((row) => (
                  <li key={row.href} className="border-b border-[var(--ph-border)]">
                    <Link
                      to={row.href}
                      className="group/row flex h-full min-h-11 items-center justify-between gap-4 py-4 text-[var(--ph-navy)] no-underline hover:text-[var(--ph-blue)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ph-blue)]"
                    >
                      <span>
                        <span className="block font-medium">{row.title}</span>
                        <span className="ph-body mt-0.5 block text-[0.9375rem] text-[var(--ph-grey)]">{row.line}</span>
                      </span>
                      <span aria-hidden="true" className="transition-transform duration-300 group-hover/row:translate-x-1">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {group.tags.length > 0 ? (
                <ul className="mt-auto flex flex-wrap content-end gap-2 pt-6 lg:self-end" aria-label="Technologies">
                  {group.tags.map((tag) => (
                    <li key={tag} className="ph-label rounded-[2px] border border-[var(--ph-border)] px-2 py-1 text-[var(--ph-navy)]">
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : (
                <span aria-hidden="true" className="hidden lg:block" />
              )}
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal variant="fade" className="ph-label mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[var(--ph-grey)]">
        <p>{technologies.label}:</p>
        <p className="text-[var(--ph-navy)]">{technologies.items.join(' · ')}</p>
      </Reveal>
    </PaperSection>
  )
}
