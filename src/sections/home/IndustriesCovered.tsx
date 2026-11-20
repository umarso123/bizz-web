import { useState } from 'react'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperSection } from '@/components/paper/kit.tsx'
import { industries } from '@/data/home.ts'

/**
 * 07: the industries as a list; choosing one swaps the product shot beside it.
 * Pointer hover previews, click or keyboard selects (a radio-like tab list).
 */
export function IndustriesCovered() {
  const { label, titleLines, tagline, items } = industries
  const [active, setActive] = useState(items[1]?.id ?? items[0].id)
  const current = items.find((item) => item.id === active) ?? items[0]

  return (
    <PaperSection tone="white" grid={false} labelledBy="industries-title">
      <div className="grid grid-cols-12 gap-6 lg:gap-x-16">
        <div className="col-span-12 flex flex-col lg:col-span-5">
          <p className="ph-label text-[var(--ph-blue)]">{label}</p>
          <h2 id="industries-title" className="ph-h2 mt-6">
            <RevealLines lines={[...titleLines]} />
          </h2>

          <div role="tablist" aria-label="Industries" aria-orientation="vertical" className="mt-12 border-t border-[var(--ph-border)]">
            {items.map((item) => {
              const selected = item.id === active
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`industry-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls="industry-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(item.id)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') setActive(item.id)
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
                    event.preventDefault()
                    const index = items.findIndex((entry) => entry.id === active)
                    const next = items[(index + (event.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length]
                    setActive(next.id)
                    document.getElementById(`industry-tab-${next.id}`)?.focus()
                  }}
                  className="ph-industry group flex min-h-16 w-full items-center justify-between gap-6 border-b border-[var(--ph-border)] text-left"
                  data-selected={selected}
                >
                  <span className="ph-industry-name">{item.name}</span>
                  <span className="ph-label text-[var(--ph-blue)]">{item.number}</span>
                </button>
              )
            })}
          </div>

          <p className="ph-body mt-10 text-[var(--ph-grey)]">
            {tagline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        <Reveal variant="clip" className="col-span-12 lg:col-span-7">
          <div id="industry-panel" role="tabpanel" aria-labelledby={`industry-tab-${current.id}`} className="ph-soft-card flex h-full flex-col p-4 md:p-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-[var(--ph-light-blue)]">
              {items.map((item) => (
                <img
                  key={item.id}
                  src={item.image.src}
                  alt={item.id === current.id ? item.image.alt : ''}
                  aria-hidden={item.id !== current.id}
                  loading="lazy"
                  className="ph-industry-shot absolute inset-0 h-full w-full object-contain p-6"
                  data-active={item.id === current.id}
                />
              ))}
            </div>
            <div className="mt-4 flex min-h-11 flex-wrap items-center justify-between gap-3">
              <p className="ph-label text-[var(--ph-grey)]">
                {current.number} · {current.name}
              </p>
              {current.chips.length > 0 ? (
                <ul className="flex flex-wrap gap-2" aria-label={`${current.name} focus areas`}>
                  {current.chips.map((chip) => (
                    <li key={chip} className="ph-label rounded-[3px] border border-[var(--ph-border)] px-2.5 py-1.5 text-[var(--ph-navy)]">
                      {chip}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </PaperSection>
  )
}
