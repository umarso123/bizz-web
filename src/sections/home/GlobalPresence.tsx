import type { CSSProperties } from 'react'
import { Reveal, RevealLines, useRevealed } from '@/components/motion/Reveal.tsx'
import { PaperLink, PaperSection } from '@/components/paper/kit.tsx'
import { PaperPin, usePaperGrain } from '@/components/paper/paper.tsx'
import { TornEdge } from '@/components/paper/TornEdge.tsx'
import { premiumHome } from '@/content/premium-home.ts'
import { presence } from '@/content/presence.ts'
import { projectToMap, worldDots } from '@/content/world-dots.ts'
import { paperInk } from '@/lib/paper-theme.ts'

const lines = premiumHome.copy.presenceLines
const places = presence.locations.map((place) => ({ ...place, at: projectToMap(place.lat, place.lon) }))

/** The route line between consecutive locations: a shallow arc above the map. */
function routeD() {
  let d = ''
  for (let i = 1; i < places.length; i++) {
    const a = places[i - 1].at
    const b = places[i].at
    const lift = Math.abs(b.x - a.x) * 0.22
    d += `M${a.x} ${a.y}Q${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - lift} ${b.x} ${b.y}`
  }
  return d
}

/** The dotted world, printed on a cream sheet pinned to the panel, with a pin in every city. */
function PresenceMap() {
  const grain = usePaperGrain()
  const [ref, seen] = useRevealed<HTMLDivElement>()

  return (
    <div ref={ref} data-inview={seen ? 'true' : 'false'} className="ph-paper ph-paper-cream ph-grain ph-grain-light p-3 md:p-5" style={{ '--ph-grain': grain } as CSSProperties}>
      <p className="ph-label mb-3 text-[var(--ph-grey)]">Fig. 10 — Presence</p>

      <div className="relative" style={{ aspectRatio: `${worldDots.width} / ${worldDots.height}` }}>
        <svg viewBox={`0 0 ${worldDots.width} ${worldDots.height}`} className="absolute inset-0 size-full" aria-hidden="true">
          <path d={worldDots.d} stroke={paperInk.navy} strokeOpacity="0.28" strokeWidth="5.2" strokeLinecap="round" fill="none" />
          {/* The route line: brand blue, drawn once when the map arrives */}
          <path
            d={routeD()}
            pathLength={1}
            className="reveal-stroke"
            stroke={paperInk.blue}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1"
            fill="none"
            style={{ '--reveal-delay': '300ms' } as CSSProperties}
          />
        </svg>

        {places.map((place) => {
          const left = `${(place.at.x / worldDots.width) * 100}%`
          const top = `${(place.at.y / worldDots.height) * 100}%`
          return (
            <div key={place.id}>
              {/* A live ring where the pin goes in */}
              <span
                aria-hidden="true"
                className="ph-live absolute size-2.5 -translate-x-1/2 -translate-y-1/2"
                style={{ left, top, color: place.hq ? paperInk.yellow : paperInk.blue }}
              />
              <PaperPin
                color={place.hq ? paperInk.yellow : paperInk.blue}
                className="z-10 h-10 w-5 md:h-12 md:w-6"
                style={{ left, top }}
              />
              <span
                className="ph-label absolute z-10 mt-2 -translate-x-1/2 bg-[var(--ph-navy)] px-1.5 py-0.5 whitespace-nowrap text-white"
                style={{ left, top }}
              >
                {place.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Where Bizaffix is: a dark panel with the dotted world printed on cream, one
 * pin per city (the headquarters in yellow), the route line between them, and a
 * spec card per location.
 */
export function GlobalPresence() {
  return (
    <PaperSection
      tone="night"
      grid={false}
      labelledBy="presence-title"
      // The tear comes after the container, so the bottom padding goes on the container, above it
        className="pb-0 md:pb-0 lg:pb-0"
        containerClassName="pb-8 md:pb-10 lg:pb-12"
      after={<TornEdge seed={31} pin="left" under={paperInk.yellow} />}
    >
      <div className="grid grid-cols-12 gap-6 lg:items-center">
        <div className="col-span-12 lg:col-span-5">
          <h2 id="presence-title" className="ph-h2 text-white">
            <span className="sr-only">{lines.join(' ')}</span>
            <span aria-hidden="true">
              <RevealLines
                stagger={100}
                lines={[
                  lines[0],
                  lines[1],
                  <span key="accent" className="ph-mark">
                    {lines[2]}
                  </span>,
                ]}
              />
            </span>
          </h2>

          {/* A spec card per location */}
          <ul className="mt-10 grid gap-6 sm:grid-cols-2" aria-label="Locations">
            {places.map((place, index) => (
              <Reveal as="li" key={place.id} variant="fade" delay={120 + index * 90} className="border-t border-white/25 pt-4">
                <h3 className="ph-h3 text-white">{place.label}</h3>
                <p className="ph-body mt-1 text-white/80">
                  {place.city === place.label ? place.region : `${place.city}, ${place.region}`}
                </p>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={300} className="mt-8">
            <PaperLink bookCall className="text-white">
              {presence.cta}
            </PaperLink>
          </Reveal>
        </div>

        <Reveal variant="rise" delay={150} className="col-span-12 mt-10 lg:col-span-7 lg:mt-0">
          <PresenceMap />
        </Reveal>
      </div>
    </PaperSection>
  )
}
