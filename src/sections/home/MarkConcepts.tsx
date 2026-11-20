import { ArrowRight, Boxes, CodeXml, Earth, PenTool, Plus, type LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { TornEdge } from '@/components/paper/TornEdge.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { markConcepts, type ConceptIcon, type MarkConcept } from '@/data/home.ts'
import { useScrollProgress } from '@/hooks/useScrollProgress.ts'
import { paperInk } from '@/lib/paper-theme.ts'

const icons: Record<Exclude<ConceptIcon, 'mark'>, LucideIcon> = {
  product: Boxes,
  design: PenTool,
  engineering: CodeXml,
  domain: Earth,
}

/** The illustrated tile that sits on the route, set into the headline. */
function Tile({ icon }: { icon: ConceptIcon }) {
  const Icon = icon === 'mark' ? null : icons[icon]
  return (
    <span className="ph-route-tile" data-mark={icon === 'mark' || undefined} aria-hidden="true">
      {Icon ? <Icon className="size-[46%] stroke-[1.5]" /> : <HexMark variant="solid" size={44} />}
      <span className="ph-route-badge">
        <Plus className="size-3" strokeWidth={3} />
      </span>
    </span>
  )
}

/** One station: spec label, big word, the tile on the route, and a paper card that links on. */
function Station({ concept, index, last }: { concept: MarkConcept; index: number; last?: boolean }) {
  // Words alternate sides of the route; the card takes the other side.
  const side = index % 2 === 0 ? 'left' : 'right'
  return (
    <li className="ph-route-row" data-side={side} data-last={last || undefined} style={{ '--i': index } as CSSProperties}>
      <Reveal className="ph-route-word">
        <p className="ph-label text-[var(--ph-grey)]">
          {concept.code} — {concept.word}
        </p>
        <h3 className="ph-route-title mt-3">{concept.word}</h3>
      </Reveal>

      <Reveal variant="fade" delay={120} className="ph-route-stop">
        <Tile icon={concept.icon} />
      </Reveal>

      <Reveal delay={200} className="ph-route-note">
        <Link to={concept.href} className="ph-route-card group" style={{ '--rot': index % 2 === 0 ? '-0.4deg' : '0.4deg' } as CSSProperties}>
          <span>{concept.line}</span>
          <ArrowRight aria-hidden="true" className="size-5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </li>
  )
}

/**
 * Straight after the mark's flood. The liquid settles into a cream sheet, and a
 * route runs down through four stations (Product, Design, Engineering, Domain)
 * to the mark itself. The route fills in blue as the page scrolls; each station
 * is a spec label, a big word, a tile on the route and a paper card that links on.
 * Styles: .ph-route* in home-sections.css.
 */
export function MarkConcepts({ style }: { style?: CSSProperties }) {
  const routeRef = useScrollProgress<HTMLOListElement>({ start: 0.75, end: 0.6 })
  const { code, title, rows, destination } = markConcepts

  return (
    <section aria-labelledby="mark-concepts-title" className="relative overflow-hidden bg-[var(--ph-cream)] text-[var(--ph-navy)]" style={style}>
      {/* The flood's liquid settling as a wave onto the cream */}
      <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-[clamp(48px,7vw,110px)] w-full">
        <path
          d="M0 0H1440V58C1320 96 1210 104 1080 82C930 56 820 30 660 52C510 72 420 112 270 100C160 92 70 66 0 74Z"
          style={{ fill: 'var(--liquid, var(--ph-cyan))' }}
        />
      </svg>
      <div aria-hidden="true" className="ph-grid-blue pointer-events-none absolute inset-x-0 top-[clamp(48px,7vw,110px)] bottom-0" />

      <div className="ph-container relative pt-16 pb-[clamp(160px,18vw,260px)] md:pt-24">
        <p className="ph-label text-[var(--ph-blue)]">{code} — Field notes</p>
        <h2 id="mark-concepts-title" className="ph-h2 mt-4 max-w-[16ch]">
          <RevealLines lines={[title]} />
        </h2>

        {/* Each stop draws its stretch of road; --p (scroll) fills them in order */}
        <ol ref={routeRef} className="ph-route mt-16 md:mt-24" style={{ '--n': rows.length + 1 } as CSSProperties}>
          {rows.map((concept, index) => (
            <Station key={concept.code} concept={concept} index={index} />
          ))}
          <Station concept={destination} index={rows.length} last />
        </ol>
      </div>

      {/* Into the white services sheet: a tear from a centre pin */}
      <TornEdge seed={23} pin="center" under={paperInk.white} />
    </section>
  )
}

export default MarkConcepts
