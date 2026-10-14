import { useEffect, useRef, useState } from 'react'
import { contactIntents, type ContactIntent } from '@/content/contact.ts'
import { contactFrame } from '@/sections/contact/contactLayout.ts'
import { useContactScroll } from '@/sections/contact/useContactScroll.ts'
import { cn } from '@/lib/cn.ts'

export function ContactOptions({
  intent,
  onIntent,
}: {
  intent: ContactIntent | null
  onIntent: (intent: ContactIntent) => void
}) {
  const scroll = useContactScroll()
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const timer = useRef(0)

  useEffect(
    () => () => {
      window.clearTimeout(timer.current)
    },
    [],
  )

  function choose(next: ContactIntent) {
    onIntent(next)
    scroll('project-note')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      document.getElementById('contact-name')?.focus({ preventScroll: true })
    }, reduced ? 0 : 680)
  }

  return (
    <section data-scene="options" className="bg-page-brand pt-[clamp(1.5rem,5vh,3.5rem)] pb-[clamp(2.5rem,6vh,4rem)]">
      <div className={contactFrame}>
        <h2 className="max-w-[14ch] text-3xl font-medium sm:text-4xl">
          Begin anywhere.
        </h2>
        <div className="mt-10 grid max-w-[52rem] gap-3 sm:grid-cols-2">
          {contactIntents.map((item) => {
            const selected = intent === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                className={cn(
                  'cursor-pointer rounded-2xl border px-6 py-6 text-left transition-colors',
                  selected
                    ? 'border-brand bg-surface shadow-card'
                    : 'border-transparent bg-white/55 hover:border-border hover:bg-surface',
                )}
                onClick={() => choose(item.id)}
              >
                <span className="block text-xl font-medium text-text sm:text-2xl">
                  {item.label}
                </span>
                <span className={cn('mt-3 block text-body-small', selected ? 'text-brand' : 'text-text-secondary')}>
                  {item.note}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
