import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperButton, PaperLink, PaperSection, tones } from '@/components/paper/kit.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { studioEmail } from '@/content/contact.ts'

/**
 * 11 — The homepage's closing call (other pages keep ConnectBanner): a yellow
 * sheet with navy type, a strip of blue tape on its corner, and the navy
 * primary button. The footer's blue sheet starts straight below it.
 * Copy from ConnectBanner (content/legacy-site.md, Calls to action).
 */
export function PaperConnect() {
  const t = tones.yellow

  return (
    <div className="paper-home group/route">
      <PaperSection tone="yellow" labelledBy="paper-connect-title">
        {/* A strip of blue tape across the top-right corner */}
        <span
          aria-hidden="true"
          className="absolute -top-14 right-4 h-7 w-28 md:right-[calc(clamp(20px,5vw,96px)-28px)] rotate-[24deg] bg-[rgb(35_78_209/0.82)] shadow-[0_2px_4px_rgb(10_26_58/0.25)] md:-top-[7.5rem] md:h-9 md:w-44"
        />

        <div className="grid grid-cols-12 gap-6 lg:items-end">
          <div className="col-span-12 lg:col-span-7">
            <h2 id="paper-connect-title" className="ph-h2">
              <RevealLines lines={['Want to collaborate?']} />
            </h2>
            <Reveal delay={160}>
              <p className="ph-lead mt-6">Reach out to us. Let’s connect, and take your idea all the way to reality.</p>
            </Reveal>
          </div>

          <Reveal delay={260} className="col-span-12 flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-5 lg:justify-end">
            <PaperButton tone={t.button}>Book a call</PaperButton>
            <PaperLink href={`mailto:${studioEmail}`}>{studioEmail}</PaperLink>
          </Reveal>
        </div>

        {/* From idea to reality */}
        <div className="mt-16 flex items-center gap-4" aria-hidden="true">
          <span className="ph-label inline-flex shrink-0 items-center gap-2">
            <span className="size-3 rounded-full border-[2.5px] border-[var(--ph-navy)]" />
            Idea
          </span>
          <span className="relative h-[2px] flex-1 overflow-hidden bg-[rgb(13_18_31/0.2)]">
            <span className="absolute inset-0 origin-left scale-x-0 bg-[var(--ph-navy)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-has-[a:hover]/route:scale-x-100 group-has-[a:focus-visible]/route:scale-x-100" />
          </span>
          <span className="ph-label inline-flex shrink-0 items-center gap-2">
            <HexMark variant="solid" size={16} />
            Reality
          </span>
        </div>
      </PaperSection>
    </div>
  )
}
