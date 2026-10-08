import { contactIntro, studioAddress, studioEmail, studioPhone, studioSocial } from '@/content/contact.ts'
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
          <ul className="mt-10 grid gap-3 text-body text-text">
            <li>{studioAddress}</li>
            <li>
              <a href={`mailto:${studioEmail}`} className="text-text no-underline hover:text-brand">
                {studioEmail}
              </a>
            </li>
            <li>
              <a href={studioPhone.href} className="text-text no-underline hover:text-brand">
                {studioPhone.label}
              </a>
            </li>
            <li className="flex flex-wrap gap-x-6 gap-y-2">
              {studioSocial.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-text no-underline hover:text-brand"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {item.label}
                </a>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
