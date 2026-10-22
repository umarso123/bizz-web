import { useState, type CSSProperties } from 'react'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperLink, PaperSection } from '@/components/paper/kit.tsx'
import { homeContent } from '@/content/home.ts'
import { premiumHome } from '@/content/premium-home.ts'

type Person = (typeof homeContent.members.people)[number]

const ROT = ['-1.2deg', '0.9deg', '-0.6deg', '1.3deg']

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

/**
 * A portrait from public/images/team/<id>.webp (1:1). Until that file exists the
 * badge shows the person's initials.
 */
function Portrait({ person }: { person: Person }) {
  const [missing, setMissing] = useState(false)
  return (
    <div className="relative aspect-square overflow-hidden rounded-[2px] border border-[var(--ph-border)] bg-[var(--ph-light-blue)]">
      {missing ? (
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-[3.5rem] leading-none font-medium tracking-[-0.05em] text-[var(--ph-blue)]">
          {initials(person.name)}
        </span>
      ) : (
        <img
          src={`/images/team/${person.id}.webp`}
          alt={`Portrait of ${person.name}`}
          loading="lazy"
          decoding="async"
          onError={() => setMissing(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </div>
  )
}

/** 09 — The people behind the work, as paper ID badges. */
export function Members() {
  const copy = homeContent.members
  const people = copy.people

  return (
    // A plain white sheet, so the people read apart from the dark presence panel that follows
    <PaperSection tone="white" grid={false} id="members" labelledBy="members-title">
      <div className="grid grid-cols-12 gap-6">
        <h2 id="members-title" className="ph-h2 col-span-12 lg:col-span-5">
          <RevealLines lines={[copy.title]} />
        </h2>
        <Reveal variant="fade" className="col-span-12 lg:col-span-6 lg:col-start-7">
          <p className="ph-lead text-[var(--ph-grey)]">{premiumHome.copy.membersBody}</p>
          <PaperLink to="/careers" className="mt-6">
            Work with us
          </PaperLink>
        </Reveal>
      </div>

      <ul className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {people.map((person, index) => (
          <Reveal as="li" key={person.id} variant="fade" delay={index * 90} className="flex">
            <article className="ph-paper ph-paper-cream ph-tilt flex w-full flex-col p-4 md:p-5" style={{ '--rot': ROT[index % ROT.length] } as CSSProperties}>
              <Portrait person={person} />
              <h3 className="ph-h3 mt-4">{person.name}</h3>
              <p className="ph-label mt-2 text-[var(--ph-blue)]">{person.role}</p>
            </article>
          </Reveal>
        ))}
      </ul>
    </PaperSection>
  )
}
