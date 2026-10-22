import { useState, type CSSProperties } from 'react'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { CropMarks, PaperPin, usePaperGrain } from '@/components/paper/paper.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { homeContent } from '@/content/home.ts'
import { cn } from '@/lib/cn.ts'
import { WorkStill } from '@/sections/work/WorkStill.tsx'

type WhoWeWorkWithProps = {
  /** The highlighted industry; lifted so both halves of the centre tear agree. */
  active?: number
  onActive?: (index: number) => void
  /** A visual copy (the right half of the centre tear): no ids, hidden from assistive tech, inert. */
  decorative?: boolean
  className?: string
}

/**
 * Industries as a directory board on a cream sheet with a faint blue grid:
 * healthcare at the top, the others below. Pointing at a row (or focusing it)
 * brings up the product shot for that industry, printed and pinned.
 */
export function WhoWeWorkWith({ active: activeProp, onActive, decorative = false, className }: WhoWeWorkWithProps) {
  const copy = homeContent.whoWeWorkWith
  const [ownActive, setOwnActive] = useState(0)
  const active = activeProp ?? ownActive
  const setActive = (index: number) => {
    setOwnActive(index)
    onActive?.(index)
  }
  const current = copy.groups[active] ?? copy.groups[0]
  const grain = usePaperGrain()

  return (
    <section
      id={decorative ? undefined : 'industries'}
      aria-labelledby={decorative ? undefined : 'industries-title'}
      aria-hidden={decorative || undefined}
      inert={decorative || undefined}
      className={cn('relative flex flex-col bg-[var(--ph-cream)] text-[var(--ph-navy)]', className)}
    >
      <div aria-hidden="true" className="ph-grid-blue absolute inset-0" />
      <div aria-hidden="true" className="ph-grain ph-grain-light absolute inset-0" style={{ '--ph-grain': grain } as CSSProperties} />

      <div className="ph-container pt-[calc(var(--header-clearance)+0.5rem)] pb-10 md:pb-14 [@media(681px<=height<=820px)]:pb-6 [@media(height<=680px)]:pt-[calc(var(--header-clearance)-0.75rem)] [@media(height<=680px)]:pb-4">
        <div className="relative py-6 md:py-8 [@media(681px<=height<=820px)]:py-4 [@media(height<=680px)]:py-3">
          <CropMarks className="-inset-x-3 hidden text-[var(--ph-navy)] md:block" />

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-5">
              <h2 id={decorative ? undefined : 'industries-title'} className="ph-h2 [@media(681px<=height<=820px)]:text-[length:clamp(2rem,6vh,3.5rem)] [@media(height<=680px)]:text-[length:clamp(1.75rem,5.4vh,2.75rem)]">
                <RevealLines lines={['Healthcare leads.', 'The same craft travels.']} stagger={100} />
              </h2>
              <Reveal delay={160}>
                <p className="ph-lead mt-6 text-[var(--ph-grey)] [@media(height<=960px)]:text-[1.0625rem] [@media(height<=960px)]:mt-4 [@media(height<=680px)]:mt-3 [@media(height<=680px)]:text-[0.9375rem]">{copy.body}</p>
              </Reveal>

              <ul className="mt-7 [@media(681px<=height<=820px)]:mt-5 [@media(height<=680px)]:mt-3 border-t border-[var(--ph-border)]" aria-label={decorative ? undefined : 'Industries'}>
                {copy.groups.map((group, index) => {
                  const shown = index === active
                  return (
                    <li key={group.id} className="border-b border-[var(--ph-border)]">
                      <button
                        type="button"
                        tabIndex={decorative ? -1 : undefined}
                        aria-pressed={shown}
                        onPointerEnter={(event) => {
                          if (event.pointerType === 'mouse') setActive(index)
                        }}
                        onFocus={() => setActive(index)}
                        onClick={() => setActive(index)}
                        className="group grid w-full grid-cols-[3.5rem_1.25rem_1fr_auto] items-center gap-3 py-3.5 text-left [@media(681px<=height<=960px)]:py-2.5 [@media(height<=680px)]:py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ph-blue)] md:py-4"
                      >
                        <span className="ph-label text-[var(--ph-grey)]">IND-0{index + 1}</span>
                        <HexMark variant={shown ? 'active' : 'station'} size={16} />
                        <span
                          className={cn(
                            'ph-h3 transition-colors duration-300',
                            shown ? 'text-[var(--ph-navy)]' : 'text-[var(--ph-grey)] group-hover:text-[var(--ph-navy)]',
                          )}
                        >
                          {group.title}
                        </span>
                        {index === 0 ? <span className="ph-label text-[var(--ph-blue)]">Lead industry</span> : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* The product shot, printed and pinned. From lg up, so the sheet fits one screen before it tears. */}
            <figure className="relative col-span-7 hidden lg:block">
              <div className="ph-card relative h-[min(46vh,30rem)] rounded-[3px] bg-white p-5 md:rotate-[0.8deg]">
                <PaperPin className="top-[24px] left-1/2" />
                <div className="relative h-full overflow-hidden rounded-[2px] bg-[var(--ph-light-blue)]">
                  {copy.groups.map((group, index) => {
                    const shown = index === active
                    const fade = cn(
                      'absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none',
                      shown ? 'opacity-100' : 'pointer-events-none opacity-0',
                    )
                    if (!group.image) {
                      return (
                        <div key={group.id} className={fade} aria-hidden={shown ? undefined : true}>
                          <WorkStill slug={group.id} />
                        </div>
                      )
                    }
                    return (
                      <img
                        key={group.id}
                        src={group.image}
                        alt={shown && !decorative ? group.alt : ''}
                        aria-hidden={shown ? undefined : true}
                        className={cn(fade, 'h-full w-full object-contain p-6')}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    )
                  })}
                </div>
                <figcaption className="ph-label mt-3 flex justify-between text-[var(--ph-grey)]">
                  <span>{current.title}</span>
                  <span>Fig. 0{active + 1}</span>
                </figcaption>
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
