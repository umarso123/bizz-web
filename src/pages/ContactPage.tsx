import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { signalColor, type ContactIntent } from '@/content/contact.ts'
import { resetContactLive } from '@/sections/contact/contactLive.ts'
import { ContactClosing } from '@/sections/contact/ContactClosing.tsx'
import { ContactForm } from '@/sections/contact/ContactForm.tsx'
import { ContactHero } from '@/sections/contact/ContactHero.tsx'
import { ContactOptions } from '@/sections/contact/ContactOptions.tsx'
import { ContactVisual } from '@/sections/contact/ContactVisual.tsx'

export function ContactPage() {
  const rootRef = useRef<HTMLElement>(null)
  const [intent, setIntent] = useState<ContactIntent | null>(null)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useLayoutEffect(() => {
    const previousTitle = document.title
    document.title = 'Contact · Bizaffix'
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)

    const root = document.documentElement
    const previousPad = root.style.scrollPaddingTop
    root.style.scrollPaddingTop = '6.5rem'

    return () => {
      document.title = previousTitle
      media.removeEventListener('change', onChange)
      delete root.dataset.headerTone
      root.style.scrollPaddingTop = previousPad
      resetContactLive()
    }
  }, [])

  return (
    <main
      ref={rootRef}
      id="contact"
      className="relative overflow-x-clip bg-page-white"
      style={{ '--signal': signalColor } as CSSProperties}
    >
      {reduced ? null : <ContactVisual rootRef={rootRef} />}
      <ContactHero />
      <ContactOptions intent={intent} onIntent={setIntent} />
      <ContactForm intent={intent} onIntent={setIntent} />
      <ContactClosing onIntent={setIntent} />
    </main>
  )
}
