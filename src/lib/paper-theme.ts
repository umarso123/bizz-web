/**
 * "Engineered on paper": the homepage and footer palette and type, in one place.
 * Only brand colours; see the homepage brief in docs/design-system.md.
 */
export const paperInk = {
  blue: '#234ED1',
  /** Only for subtle animated strokes. */
  stroke: '#2563EB',
  cyan: '#009BDF',
  navy: '#0D121F',
  grey: '#5A6472',
  border: '#DDE3EC',
  white: '#FFFFFF',
  lightBlue: '#E7EDFC',
  periwinkle: '#B3C5FA',
  cream: '#FFFCF0',
  yellow: '#FDE36E',
  night: '#14245F',
  /** Paper shadows: navy, like the footer's flaps. */
  shadow: '#0A1A3A',
} as const

/** Dazzed; Instrument Sans (already loaded) stands in until the Dazzed files are added. */
export const paperFont = "'Bizaffix Dazzed', 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
