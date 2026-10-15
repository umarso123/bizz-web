import { useRef, useState } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { homeContent } from '@/content/home.ts'

type Person = (typeof homeContent.members.people)[number]

function MemberCard({
  person,
  selected,
  onSelect,
  cardRef,
}: {
  person: Person
  selected: boolean
  onSelect: () => void
  cardRef: (node: HTMLElement | null) => void
}) {
  const [open, setOpen] = useState(false)
  const revealed = open || selected

  return (
    <article
      ref={cardRef}
      className="members-card"
      data-cover={person.id}
      data-open={revealed ? 'true' : 'false'}
    >
      <button
        type="button"
        className="members-hit"
        aria-expanded={revealed}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setOpen(true)
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setOpen(false)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(event) => {
          onSelect()
          if (event.nativeEvent instanceof PointerEvent && event.nativeEvent.pointerType === 'mouse') return
          if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
          setOpen((value) => !value)
        }}
      >
        <div className="members-stage">
          <img
            className="members-photo"
            src={person.photo}
            alt={person.alt}
            draggable={false}
          />
          <span className="members-pill">{person.role}</span>
          <div className="members-cast" aria-hidden="true" />
          <div className="members-sheet">
            <p className="members-name">{person.name}</p>
            <p className="members-role">{person.role}</p>
            {person.page ? <p className="members-page">{person.page}</p> : null}
          </div>
        </div>
      </button>
    </article>
  )
}

export function Members() {
  const copy = homeContent.members
  const people = copy.people
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  function show(index: number) {
    const person = people[index]
    if (!person) return
    setActiveId(person.id)
    cardRefs.current[index]?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }

  function step(direction: -1 | 1) {
    const current = people.findIndex((person) => person.id === activeId)
    const next =
      current === -1
        ? direction === 1
          ? 0
          : people.length - 1
        : (current + direction + people.length) % people.length
    show(next)
  }

  return (
    <section id="members" className="section-y bg-page-white" aria-labelledby="members-title">
      <Container variant="wide" className="w-full">
        <div className="flex items-center justify-between gap-4">
          <h2 id="members-title" className="members-title text-section-title">
            {copy.title}
          </h2>
          <div className="flex shrink-0 gap-2" role="group" aria-label="Team members">
            <button type="button" className="members-step" aria-label="Previous team member" onClick={() => step(-1)}>
              <span aria-hidden="true">&lt;</span>
            </button>
            <button type="button" className="members-step" aria-label="Next team member" onClick={() => step(1)}>
              <span aria-hidden="true">&gt;</span>
            </button>
          </div>
        </div>
        <p className="mt-4 max-w-[36rem] text-body text-text-secondary">{copy.body}</p>
        <div className="members-row grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((person, index) => (
            <MemberCard
              key={person.id}
              person={person}
              selected={person.id === activeId}
              onSelect={() => setActiveId(person.id)}
              cardRef={(node) => {
                cardRefs.current[index] = node
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
