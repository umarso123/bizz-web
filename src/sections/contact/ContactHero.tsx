import { contactIntro } from '@/content/contact.ts'
import { contactFrame } from '@/sections/contact/contactLayout.ts'

export function ContactHero() {
  return (
    <section data-scene="hero" className="atmosphere-hero relative -mt-(--header-clearance) overflow-hidden">
      <div className="relative flex min-h-[78svh] flex-col justify-end pt-(--header-clearance) pb-[clamp(3.5rem,10vh,6.5rem)]">
        <div className={contactFrame}>
          <h1
            className="max-w-[11ch] text-[clamp(2.65rem,6.4vw,5.6rem)] leading-[0.96] font-semibold tracking-[-0.045em] text-text"
            style={{ textWrap: 'wrap' }}
          >
            {contactIntro.titleLead}
            <br />
            <span className="text-brand">{contactIntro.titleRest}</span>
          </h1>
          <p className="mt-8 max-w-[34rem] text-[1.125rem] leading-[1.6] text-text-secondary">
            {contactIntro.dek}
          </p>
        </div>
      </div>
    </section>
  )
}
