import { Reveal, RevealText } from '@/components/motion/Reveal.tsx'
import { BookCallLink } from '@/components/ui/BookCallLink.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { studioEmail } from '@/content/contact.ts'

/**
 * The destination at the end of every page: the route runs from Idea to Reality,
 * and reaching for Book a call fills it in.
 */
export function ConnectBanner() {
  return (
    <section className="py-2 md:py-3" aria-labelledby="connect-title">
      <div className="px-3 md:px-5">
        <Reveal variant="panel" className="group/route relative mx-auto max-w-[1360px] overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#234ED1,#14245F)] px-6 pt-16 pb-10 text-white sm:px-10 md:rounded-[32px] md:px-16 md:pt-24 md:pb-14">
          {/* Soft yellow glow, breathing in the top-right corner */}
          <div aria-hidden="true" className="glow-breathe pointer-events-none absolute -top-40 -right-32 size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(253_227_110/0.26),rgb(253_227_110/0.08)_40%,transparent_62%)] mix-blend-screen" />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <h2 id="connect-title" className="max-w-[14ch] text-section-title text-white">
                <RevealText text="Want to collaborate?" delay={200} />
              </h2>
              <p className="mt-5 max-w-[30rem] text-body-large text-white/75">
                Reach out to us. Let’s connect, and take your idea all the way to reality.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:col-span-5 lg:justify-end">
              <BookCallLink className="inline-flex min-h-(--button-height-desktop) items-center justify-center rounded-button bg-accent px-7 text-[1rem] font-semibold text-text no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-white hover:text-text focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent">
                Book a call
              </BookCallLink>
              <TextLink href={`mailto:${studioEmail}`} tone="inverse">
                {studioEmail}
              </TextLink>
            </div>
          </div>

          {/* From idea to reality */}
          <div className="relative mt-12 flex items-center gap-3 text-caption md:mt-16 md:gap-4" aria-hidden="true">
            <span className="inline-flex shrink-0 items-center gap-2 text-text-inverse-muted">
              <span className="size-3 rounded-full border-[2.5px] border-text-inverse bg-surface-brand-deep" />
              Idea
            </span>
            <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/25">
              <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-accent transition-transform duration-700 ease-standard group-has-[a:hover]/route:scale-x-100 group-has-[a:focus-visible]/route:scale-x-100" />
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 text-text-inverse">
              <HexMark variant="active" size={16} />
              Reality
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
