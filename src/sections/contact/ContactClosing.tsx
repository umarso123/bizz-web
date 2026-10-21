import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { contactClose, type ContactIntent } from '@/content/contact.ts'
import { ContactBookCall } from '@/sections/contact/ContactBookCall.tsx'

/**
 * A quiet last stop. The site-wide closing banner is not shown on Contact,
 * so this offers the two next moves without repeating it.
 */
export function ContactClosing({ onIntent }: { onIntent: (intent: ContactIntent) => void }) {
  return (
    <section className="bg-page-white section-y" aria-labelledby="contact-close-title">
      <Container variant="wide" className="w-full">
        <div aria-hidden="true" className="mb-10 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-border" />
          <HexMark variant="station" size={16} />
          <span className="h-px w-16 bg-border" />
        </div>
        <SectionHeader
          align="center"
          titleId="contact-close-title"
          title={contactClose.title}
          description={contactClose.body}
          action={
            <>
              <ContactBookCall onIntent={onIntent} />
              <TextLink to={contactClose.secondaryTo}>{contactClose.secondary}</TextLink>
            </>
          }
        />
      </Container>
    </section>
  )
}
