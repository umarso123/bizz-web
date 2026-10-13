import { useState, type ReactNode } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { homeContent } from '@/content/home.ts'
import { cn } from '@/lib/cn.ts'

type GroupId = (typeof homeContent.whoWeWorkWith.groups)[number]['id']

const icons: Record<GroupId, ReactNode> = {
  healthcare: (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 12h4l2.2-6 3.6 12L15 12h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  educational: (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" strokeLinejoin="round" />
      <path d="M7.5 11.8V16c0 1.2 2 2.5 4.5 2.5s4.5-1.3 4.5-2.5v-4.2" strokeLinecap="round" />
    </svg>
  ),
  fintech: (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" strokeLinecap="round" />
    </svg>
  ),
  fitness: (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M8 8v8M16 8v8M4.5 10v4M19.5 10v4M8 12h8" strokeLinecap="round" />
    </svg>
  ),
  ecommerce: (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6.5 8h11l-1 11h-9l-1-11Z" strokeLinejoin="round" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" strokeLinecap="round" />
    </svg>
  ),
}

export function WhoWeWorkWith() {
  const copy = homeContent.whoWeWorkWith
  const [active, setActive] = useState(0)
  const current = copy.groups[active] ?? copy.groups[0]

  return (
    <section id="who-we-work-with" className="section-y bg-bg-subtle" aria-labelledby="who-we-work-with-title">
      <Container variant="wide" className="w-full">
        <div>
          <h2 id="who-we-work-with-title" className="max-w-[16ch] text-section-title text-text">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-[36rem] text-body text-text-secondary">{copy.body}</p>
        </div>

        <div className="mt-8 grid items-stretch gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 min-h-72 overflow-hidden rounded-2xl bg-brand-soft shadow-card ring-1 ring-border-subtle lg:order-1 lg:h-full lg:min-h-0">
            {copy.groups.map((group, index) => {
              const shown = index === active
              return (
                <img
                  key={group.id}
                  src={group.image}
                  alt={shown ? group.alt : ''}
                  aria-hidden={shown ? undefined : true}
                  className={cn(
                    'absolute inset-0 h-full w-full object-contain p-4 transition-opacity duration-300 motion-reduce:transition-none sm:p-6',
                    shown ? 'opacity-100' : 'pointer-events-none opacity-0',
                  )}
                  draggable={false}
                />
              )
            })}
            <p className="absolute bottom-5 left-5 rounded-pill bg-surface px-3 py-1 text-caption text-text shadow-xs ring-1 ring-border">
              {current.device}
            </p>
          </div>

          <ul className="order-1 flex flex-col border-t border-border lg:order-2">
              {copy.groups.map((group, index) => {
                const shown = index === active
                return (
                  <li key={group.id} className="flex flex-1 border-b border-border">
                    <button
                      type="button"
                      className="flex h-full w-full items-center gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
                      aria-pressed={shown}
                      onPointerEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onClick={() => setActive(index)}
                    >
                      <span className="shrink-0 text-accent">
                        {icons[group.id]}
                      </span>
                      <span className={cn('text-title', shown ? 'text-text' : 'text-text-secondary')}>
                        {group.title}
                      </span>
                    </button>
                  </li>
                )
              })}
          </ul>
        </div>
        <p className="sr-only" aria-live="polite">
          {current.title}. {current.alt}
        </p>
      </Container>
    </section>
  )
}
