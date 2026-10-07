import { contactIntro } from '@/content/contact.ts'
import { contactFrame, contactInset } from '@/sections/contact/contactLayout.ts'
import { StaticMeridian } from '@/sections/contact/ContactVisual.tsx'

export function ContactHero() {
  return (
    <section data-scene="hero" className="atmosphere-hero relative -mt-(--header-clearance) min-h-svh overflow-hidden">

      <div className="relative z-20 flex min-h-svh flex-col justify-end pt-(--header-clearance) pb-[30vh]">
        <div className={contactFrame}>
          <div className={contactInset}>
            <h1
              data-filament="hero"
              className="max-w-[11ch] text-[clamp(2.65rem,6.4vw,5.6rem)] leading-[0.96] font-semibold tracking-[-0.045em] text-text"
              style={{ textWrap: 'wrap' }}
            >
              {contactIntro.titleLead}
              <br />
              <span className="text-brand">{contactIntro.titleRest}</span>
            </h1>
            <div className="motion-safe:hidden">
              <StaticMeridian />
            </div>
            <p className="mt-24 max-w-[34rem] text-[1.125rem] leading-[1.6] text-text-secondary motion-reduce:mt-8">
              {contactIntro.dek}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
