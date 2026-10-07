import { useEffect, useRef, useState } from 'react'
import { contactIntents, type ContactIntent } from '@/content/contact.ts'
import { contactLive } from '@/sections/contact/contactLive.ts'
import { contactFrame, contactInset } from '@/sections/contact/contactLayout.ts'
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

  useEffect(() => {
    contactLive.chosenOption = intent ? contactIntents.findIndex((item) => item.id === intent) : null
  }, [intent])

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
    <section data-scene="options" className="bg-page-white pt-[clamp(1.5rem,5vh,3.5rem)] pb-[clamp(4.5rem,12vh,8rem)]">
      <div className={contactFrame}>
        <div className={contactInset}>
          <h2 className="max-w-[14ch] text-[clamp(2rem,4vw,3.15rem)] leading-[1.05] font-semibold tracking-[-0.035em]">
            Begin anywhere.
          </h2>
          <div className="mt-12 max-w-[46rem]" data-filament="options">
            {contactIntents.map((item, index) => {
              const selected = intent === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  data-filament="option"
                  className="group flex w-full cursor-pointer flex-col items-start gap-2 border-b border-border py-7 text-left sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                  onClick={() => choose(item.id)}
                  onFocus={() => {
                    contactLive.hoverOption = index
                  }}
                  onBlur={() => {
                    if (contactLive.hoverOption === index) contactLive.hoverOption = null
                  }}
                  onPointerEnter={() => {
                    contactLive.hoverOption = index
                  }}
                  onPointerLeave={() => {
                    if (contactLive.hoverOption === index) contactLive.hoverOption = null
                  }}
                >
                  <span className="text-[clamp(1.7rem,3vw,2.65rem)] leading-none font-semibold tracking-[-0.035em] text-text transition-transform duration-300 ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2">
                    {item.label}
                  </span>
                  <span className={cn('text-body-small', selected ? 'text-(--signal)' : 'text-text-secondary')}>
                    {item.note}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
