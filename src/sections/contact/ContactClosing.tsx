import { useState } from 'react'
import { Link } from 'react-router'
import { contactClose, type ContactIntent } from '@/content/contact.ts'
import { contactFrame } from '@/sections/contact/contactLayout.ts'
import { useContactScroll } from '@/sections/contact/useContactScroll.ts'
import { useMagnetic } from '@/sections/contact/useMagnetic.ts'
import { cn } from '@/lib/cn.ts'

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="ms-2 size-3.5 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ContactClosing({ onIntent }: { onIntent: (intent: ContactIntent) => void }) {
  const scroll = useContactScroll()
  const magnetic = useMagnetic<HTMLButtonElement>()
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  return (
    <section className="bg-page-brand">
      <div id="contact-close" data-scene="close" className="scroll-mt-28 bg-page-brand text-text">
        <div className={cn(contactFrame, 'py-[clamp(4.5rem,12vh,8rem)]')}>
          <h2
            className="max-w-[11ch] text-4xl font-medium text-text sm:text-5xl lg:text-6xl"
            style={{ textWrap: 'wrap' }}
          >
            {contactClose.titleLead}
            <br />
            {contactClose.titleRest}
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
            <button
              ref={magnetic}
              type="button"
              className="group inline-flex min-h-(--button-height-desktop) cursor-pointer items-center rounded-full bg-button-primary px-7 text-body-small font-semibold text-text-inverse transition-[background-color,transform] duration-200 hover:bg-button-primary-hover"
              onClick={() => {
                onIntent('call')
                scroll('project-note')
                window.setTimeout(() => {
                  document.getElementById('contact-name')?.focus({ preventScroll: true })
                }, reduced ? 0 : 680)
              }}
            >
              {contactClose.cta}
              <Arrow />
            </button>
            <Link to={contactClose.secondaryTo} className="group relative text-base font-medium text-text no-underline">
              {contactClose.secondary}
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-brand motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
