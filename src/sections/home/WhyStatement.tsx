import type { CSSProperties } from 'react'
import { PaperSection } from '@/components/paper/kit.tsx'
import { whyBizaffix } from '@/data/home.ts'
import { useScrollProgress } from '@/hooks/useScrollProgress.ts'

/**
 * 02: one sentence across the full width. As the page scrolls, each word floats
 * up out of a faint ghost into full ink, one after another (styles: .ph-scrub).
 */
export function WhyStatement() {
  const ref = useScrollProgress<HTMLParagraphElement>()
  const words = whyBizaffix.statement.split(' ')

  return (
    <PaperSection tone="white" grid={false} crop={false} labelledBy="why-title" containerClassName="max-w-none">
      <p id="why-title" className="ph-label text-[var(--ph-blue)]">
        {whyBizaffix.label}
      </p>
      <p ref={ref} className="ph-statement ph-scrub mt-8" style={{ '--n': words.length } as CSSProperties}>
        <span className="sr-only">{whyBizaffix.statement}</span>
        <span aria-hidden="true">
          {words.map((word, index) => (
            <span key={`${word}-${index}`}>
              <span className="ph-scrub-word" style={{ '--i': index } as CSSProperties}>
                {word}
              </span>
              {index < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </span>
      </p>
    </PaperSection>
  )
}
