import type { CSSProperties, Ref } from 'react'
import { markFlood } from '@/data/home.ts'
import { cn } from '@/lib/cn.ts'

type EmptyTestSectionProps = {
  /**
   * 'overlay': a full-viewport layer inside the melt's pin, revealed under the
   * liquid's crest. 'flow': an ordinary section in the page (reduced motion).
   */
  variant: 'overlay' | 'flow'
  ref?: Ref<HTMLElement>
  headingRef?: Ref<HTMLHeadingElement>
  textRef?: Ref<HTMLParagraphElement>
  className?: string
  style?: CSSProperties
}

/**
 * The screen the mark's liquid floods into. Its background is --liquid (set by
 * BrandMark from the melt frames), so the screen stays one flat colour when the
 * pin lets go and MarkConcepts carries on below.
 *
 * BrandMark reveals headingRef and textRef as the crest passes them, so both
 * must stay. In overlay mode the layer ignores the pointer: keep it free of links.
 * Ink: white only at display size (3.1:1 on the cyan), navy for everything smaller.
 */
export function EmptyTestSection({ variant, ref, headingRef, textRef, className, style }: EmptyTestSectionProps) {
  return (
    <section
      ref={ref}
      aria-labelledby="mark-flood-title"
      className={cn('flex min-h-svh items-center text-[var(--ph-navy)]', variant === 'overlay' && 'pointer-events-none', className)}
      style={{ backgroundColor: 'var(--liquid)', ...style }}
    >
      {/* Not .ph-container: it is positioned, and the reveal measures offsets from this section. */}
      <div className="mx-auto w-full max-w-[calc(1200px+2*clamp(20px,5vw,96px))] px-[clamp(20px,5vw,96px)]">
        <div className="grid grid-cols-12 gap-6 lg:items-end">
          <h2 ref={headingRef} id="mark-flood-title" className="col-span-12 lg:col-span-8">
            <span className="ph-label block text-[var(--ph-navy)]">{markFlood.label}</span>
            <span className="ph-flood-title mt-6 block text-white">{markFlood.title}</span>
          </h2>
          <p ref={textRef} className="ph-lead col-span-12 text-[var(--ph-navy)] lg:col-span-4">
            {markFlood.body}
          </p>
        </div>
      </div>
    </section>
  )
}

export default EmptyTestSection
