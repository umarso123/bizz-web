import { useState } from 'react'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { Reveal } from '@/components/motion/Reveal.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { homeContent } from '@/content/home.ts'
import { cn } from '@/lib/cn.ts'
import { WorkStill } from '@/sections/work/WorkStill.tsx'

/**
 * Industries as a directory board: healthcare at the top, the others below.
 * Pointing at a row (or focusing it) brings up the product shot for that floor.
 */
export function WhoWeWorkWith() {
  const copy = homeContent.whoWeWorkWith
  const [active, setActive] = useState(0)
  const current = copy.groups[active] ?? copy.groups[0]

  return (
    <section id="industries" className="section-y relative" aria-labelledby="industries-title">
      <Container variant="wide" className="relative w-full">
        <SectionHeader
          eyebrow={copy.eyebrow}
          meta={`${copy.groups.length} industries`}
          title={copy.title}
          titleId="industries-title"
          description={copy.body}
        />

        <div className="mt-14 grid items-stretch gap-10 md:mt-20 lg:grid-cols-12 lg:gap-8">
          <ul className="border-t border-border lg:col-span-5" aria-label="Industries">
            {copy.groups.map((group, index) => {
              const shown = index === active
              const lead = index === 0
              return (
                <Reveal as="li" key={group.id} delay={index * 80} className="border-b border-border">
                  <button
                    type="button"
                    aria-pressed={shown}
                    onPointerEnter={(event) => {
                      if (event.pointerType === 'mouse') setActive(index)
                    }}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    className="group flex w-full items-center gap-5 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:py-6"
                  >
                    <HexMark variant={shown ? 'active' : 'station'} size={18} />
                    <span
                      className={cn(
                        'flex-1 text-title transition-colors duration-300',
                        shown ? 'text-text' : 'text-text-secondary group-hover:text-text',
                      )}
                    >
                      {group.title}
                    </span>
                    {lead ? <span className="text-caption text-brand-hover">Lead industry</span> : null}
                  </button>
                </Reveal>
              )
            })}
          </ul>

          <Reveal as="figure" variant="clip" delay={120} className="relative min-h-80 overflow-hidden rounded-2xl bg-bg-subtle lg:col-span-7 lg:min-h-0">
            {copy.groups.map((group, index) => {
              const shown = index === active
              const fade = cn(
                'absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none',
                shown ? 'opacity-100' : 'pointer-events-none opacity-0',
              )
              // No published board for this industry: a product visual drawn in the house style.
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
                  alt={shown ? group.alt : ''}
                  aria-hidden={shown ? undefined : true}
                  className={cn(fade, 'h-full w-full object-contain p-6 sm:p-10')}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              )
            })}
            <figcaption className="absolute bottom-5 left-5 rounded-pill bg-surface px-3.5 py-1.5 text-caption text-text shadow-sm">
              {current.title}
            </figcaption>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
