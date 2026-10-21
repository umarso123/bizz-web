import { useEffect, useState } from 'react'
import { PageHero } from '@/components/layout/PageHero.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { contactForm, contactIntro, type ContactIntent } from '@/content/contact.ts'
import { ContactBookCall } from '@/sections/contact/ContactBookCall.tsx'
import { ContactClosing } from '@/sections/contact/ContactClosing.tsx'
import { ContactDirectory } from '@/sections/contact/ContactDirectory.tsx'
import { ContactForm } from '@/sections/contact/ContactForm.tsx'
import { useJumpToNote } from '@/sections/contact/useContactScroll.ts'

/**
 * Contact: the zone rule and direct details, the note form with its live
 * preview, then a quiet last stop.
 */
export function ContactPage() {
  const [intent, setIntent] = useState<ContactIntent | null>(null)
  const jumpToNote = useJumpToNote()

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Contact | Bizaffix'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <main id="contact" className="studio-page bg-page-white">
      <PageHero
        zone="Contact"
        titleId="contact-title"
        title={contactIntro.title}
        intro={contactIntro.dek}
        actions={
          <>
            <ContactBookCall onIntent={setIntent} />
            <Button variant="secondary" size="lg" onClick={jumpToNote}>
              {contactForm.zone}
            </Button>
          </>
        }
        aside={<ContactDirectory />}
      />
      <ContactForm intent={intent} onIntent={setIntent} />
      <ContactClosing onIntent={setIntent} />
    </main>
  )
}
