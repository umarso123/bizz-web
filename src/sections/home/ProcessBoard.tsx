import { Check } from 'lucide-react'
import { useState } from 'react'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperSection } from '@/components/paper/kit.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { process } from '@/data/home.ts'

/** Which part of the board each step lights up (same order as process.steps). */
const zones = ['research', 'brand', 'colour', 'wireframe', 'ui', 'signoff'] as const
type Zone = (typeof zones)[number]

const swatches = ['#234ED1', '#14245F', '#B3C5FA', '#FDE36E', '#FFFCF0'] as const

/** An illustrative design board (not client work): it shows what each step produces. */
function Board({ zone }: { zone: Zone }) {
  const { board } = process
  const lit = (name: Zone) => ({ 'data-lit': zone === name })
  return (
    <div className="ph-board" aria-hidden="true">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="ph-label ms-3 text-white/70">{board.title}</span>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-[1.2fr_1fr] md:p-6">
        <div className="grid content-start gap-4">
          <div className="ph-zone" {...lit('research')}>
            <p className="ph-label text-white/60">Research</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {board.research.map((quote, index) => (
                <p key={quote} className="ph-sticky" style={{ rotate: `${[-0.4, 0.3, -0.2][index]}deg` }}>
                  {quote}
                </p>
              ))}
            </div>
            <p className="mt-3 inline-flex items-center gap-2 text-[0.75rem] text-white/70">
              <span className="grid size-5 place-items-center rounded-full bg-[var(--ph-periwinkle)] text-[0.625rem] font-semibold text-[var(--ph-navy)]">S</span>
              {board.persona}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="ph-zone" {...lit('brand')}>
              <p className="ph-label text-white/60">Brand</p>
              <p className="mt-3 inline-flex items-center gap-2 text-[1.25rem] font-medium text-white">
                <HexMark variant="solid" size={22} />
                {board.brandName}
              </p>
            </div>
            <div className="ph-zone" {...lit('colour')}>
              <p className="ph-label text-white/60">Colour &amp; type</p>
              <div className="mt-3 flex items-center gap-1.5">
                {swatches.map((color) => (
                  <span key={color} className="size-5 rounded-full border border-white/20" style={{ background: color }} />
                ))}
                <span className="ms-auto text-[1.5rem] leading-none font-medium text-white">Aa</span>
              </div>
            </div>
          </div>
          <div className="ph-zone" {...lit('wireframe')}>
            <p className="ph-label text-white/60">Wireframes</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((frame) => (
                <div key={frame} className="grid gap-1.5 rounded-[3px] border border-dashed border-white/25 p-2">
                  <span className="h-6 rounded-[2px] bg-white/10" />
                  <span className="h-1.5 w-3/4 rounded-full bg-white/15" />
                  <span className="h-1.5 w-1/2 rounded-full bg-white/15" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ph-zone flex flex-col" {...lit('ui')}>
          <p className="ph-label text-white/60">Home · mobile</p>
          <div className="mt-3 flex flex-1 flex-col gap-2 rounded-[10px] bg-[var(--ph-cream)] p-3 text-[var(--ph-navy)]">
            <div className="rounded-[6px] bg-[var(--ph-blue)] p-3 text-white">
              <p className="text-[1rem] leading-tight font-medium">{board.screenTitle}</p>
              <p className="mt-1 text-[0.6875rem] text-white/80">{board.screenBody}</p>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-2">
              <span className="min-h-16 rounded-[6px] bg-[var(--ph-yellow)]" />
              <span className="min-h-16 rounded-[6px] bg-[var(--ph-periwinkle)]" />
            </div>
            <span className="rounded-[6px] bg-[var(--ph-navy)] py-2 text-center text-[0.75rem] font-medium text-white">{board.screenCta}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center px-4 pb-5">
        <p className="ph-zone ph-signoff inline-flex items-center gap-2 text-[0.8125rem] text-white" {...lit('signoff')}>
          <span className="grid size-5 place-items-center rounded-full bg-[var(--ph-yellow)] text-[var(--ph-navy)]">
            <Check className="size-3" strokeWidth={3} />
          </span>
          {board.signedOff}
        </p>
      </div>
    </div>
  )
}

/** 08: the design process as a checklist; pointing at a step lights up what it produces. */
export function ProcessBoard() {
  const [step, setStep] = useState(0)
  return (
    <PaperSection tone="cream" grid={false} id="process" labelledBy="process-title">
      <div className="grid grid-cols-12 gap-6 lg:items-center lg:gap-x-16">
        <div className="col-span-12 lg:col-span-5">
          <p className="ph-label text-[var(--ph-blue)]">{process.label}</p>
          <h2 id="process-title" className="ph-h2 mt-6">
            <RevealLines lines={[...process.titleLines]} />
          </h2>
          <ol className="mt-10 border-t border-[var(--ph-border)]">
            {process.steps.map((label, index) => (
              <Reveal as="li" key={label} delay={index * 70} className="border-b border-[var(--ph-border)]">
                <button
                  type="button"
                  aria-pressed={step === index}
                  onClick={() => setStep(index)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') setStep(index)
                  }}
                  onFocus={() => setStep(index)}
                  className="ph-step flex min-h-12 w-full items-center gap-4 py-3 text-left"
                  data-active={step === index}
                >
                  <span className="ph-step-tick">
                    <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                  </span>
                  <span className="ph-body font-medium">{label}</span>
                  <span className="ph-label ms-auto text-[var(--ph-grey)]">{String(index + 1).padStart(2, '0')}</span>
                </button>
              </Reveal>
            ))}
          </ol>
        </div>
        <Reveal variant="rise" delay={150} className="col-span-12 lg:col-span-7">
          <Board zone={zones[step]} />
        </Reveal>
      </div>
    </PaperSection>
  )
}
