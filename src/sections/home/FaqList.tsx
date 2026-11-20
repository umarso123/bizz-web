import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperSection } from '@/components/paper/kit.tsx'
import { faqs } from '@/data/home.ts'

/** 09: an accordion; one answer open at a time, height animated with grid rows. */
export function FaqList() {
  const ids = useId()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <PaperSection tone="white" grid={false} id="faq" labelledBy="faq-title">
      <div className="grid grid-cols-12 gap-6 lg:gap-x-16">
        <h2 id="faq-title" className="ph-h2 col-span-12 lg:col-span-4">
          <RevealLines lines={[faqs.title]} />
        </h2>
        <ul className="col-span-12 border-t border-[var(--ph-border)] lg:col-span-8">
          {faqs.items.map((faq, index) => {
            const expanded = open === index
            return (
              <Reveal as="li" key={faq.question} delay={index * 70} className="border-b border-[var(--ph-border)]">
                <h3>
                  <button
                    type="button"
                    id={`${ids}-q${index}`}
                    aria-expanded={expanded}
                    aria-controls={`${ids}-a${index}`}
                    onClick={() => setOpen(expanded ? null : index)}
                    className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-[1.125rem] font-medium tracking-[-0.01em] hover:text-[var(--ph-blue)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ph-blue)]"
                  >
                    {faq.question}
                    <Plus aria-hidden="true" className={`size-5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${expanded ? 'rotate-45' : ''}`} />
                  </button>
                </h3>
                <div
                  id={`${ids}-a${index}`}
                  role="region"
                  aria-labelledby={`${ids}-q${index}`}
                  className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                  style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
                  inert={!expanded}
                >
                  <div className="overflow-hidden">
                    <p className="ph-body max-w-[62ch] pb-6 text-[var(--ph-grey)]">{faq.answer}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </PaperSection>
  )
}
