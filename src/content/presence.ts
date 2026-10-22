/**
 * Global presence. Copy and locations from the old site's "Bizaffix's global
 * presence" section (content/legacy-site.md). Add a location here and the
 * homepage map, pins and cards pick it up; only add places Bizaffix is really in.
 */

export type PresenceLocation = {
  id: string
  /** Shown on the map and the card. */
  label: string
  city: string
  region: string
  lat: number
  lon: number
  /** The headquarters gets the one yellow pin. */
  hq?: boolean
}

export const presence = {
  eyebrow: 'Bizaffix’s global presence',
  title: 'Now extending to numerous cities throughout the world.',
  cta: 'Let’s talk',
  locations: [
    {
      id: 'texas',
      label: 'Texas',
      city: 'Austin',
      region: 'Texas, United States',
      lat: 30.27,
      lon: -97.74,
      hq: true,
    },
    {
      id: 'dubai',
      label: 'Dubai',
      city: 'Dubai',
      region: 'United Arab Emirates',
      lat: 25.2,
      lon: 55.27,
    },
  ] satisfies PresenceLocation[],
} as const
