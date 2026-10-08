import { useLayoutEffect, useState } from 'react'
import type { ContactIntent } from '@/content/contact.ts'
import { ContactClosing } from '@/sections/contact/ContactClosing.tsx'
import { ContactForm } from '@/sections/contact/ContactForm.tsx'
import { ContactHero } from '@/sections/contact/ContactHero.tsx'
import { ContactOptions } from '@/sections/contact/ContactOptions.tsx'

export function ContactPage() {
  const [intent, setIntent] = useState<ContactIntent | null>(null)

  useLayoutEffect(() => {
    const previousTitle = document.title
    document.title = 'Contact · Bizaffix'
    const root = document.documentElement
    const previousPad = root.style.scrollPaddingTop
    root.style.scrollPaddingTop = '6.5rem'

    return () => {
      document.title = previousTitle
      delete root.dataset.headerTone
      root.style.scrollPaddingTop = previousPad
    }
  }, [])

  return (
    <main id="contact" className="relative overflow-x-clip bg-page-white">
      <ContactHero />
      <ContactOptions intent={intent} onIntent={setIntent} />
      <ContactForm intent={intent} onIntent={setIntent} />
      <ContactClosing onIntent={setIntent} />
    </main>
  )
}
