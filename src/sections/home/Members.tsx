import { useState } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { homeContent } from '@/content/home.ts'

type Person = (typeof homeContent.members.people)[number]

function MemberCard({ person }: { person: Person }) {
  const [open, setOpen] = useState(false)

  return (
    <article className="members-card" data-open={open ? 'true' : 'false'}>
      <button
        type="button"
        className="members-hit"
        aria-expanded={open}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setOpen(true)
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setOpen(false)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(event) => {
          if (event.nativeEvent instanceof PointerEvent && event.nativeEvent.pointerType === 'mouse') return
          if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
          setOpen((value) => !value)
        }}
      >
        <div className="members-stage">
          <div className="members-identity">
            <img
              className="members-photo"
              src={person.photo}
              alt={person.alt}
              draggable={false}
            />
            <div className="members-identity-copy">
              <p className="members-identity-name">{person.name}</p>
              <p className="members-identity-detail">{person.detail}</p>
            </div>
          </div>
          <div className="members-sheet">
            <p className="members-name">{person.name}</p>
            <p className="members-role">{person.role}</p>
            <p className="members-page">{person.page}</p>
          </div>
        </div>
      </button>
    </article>
  )
}

export function Members() {
  const copy = homeContent.members

  return (
    <section id="members" className="section-y bg-page-white" aria-labelledby="members-title">
      <Container variant="wide" className="w-full">
        <h2 id="members-title" className="max-w-[12ch] text-section-title text-text">
          {copy.title}
        </h2>
        <p className="mt-4 max-w-[36rem] text-body text-text-secondary">{copy.body}</p>
        <div className="members-row">
          {copy.people.map((person) => (
            <MemberCard key={person.id} person={person} />
          ))}
        </div>
      </Container>
    </section>
  )
}
