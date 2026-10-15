import { googleBookingUrl } from '@/content/booking.ts'

/**
 * Primary nav — matches the premium homepage structure.
 */
export type NavItem = {
  label: string
  to: string
}

export const primaryNavigation = [
  { label: 'Services', to: '/#services' },
  { label: 'Work', to: '/work' },
  { label: 'Approach', to: '/#how-we-work' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
] as const satisfies readonly NavItem[]

export const bookCall = {
  label: 'Book a call',
} as const

export type BookCallTarget =
  | { kind: 'external'; href: string }
  | { kind: 'internal'; to: '/contact' }

/** Prefer Google Appointment Schedule; fall back to contact until configured. */
export function getBookCallTarget(): BookCallTarget {
  if (googleBookingUrl) {
    return { kind: 'external', href: googleBookingUrl }
  }
  return { kind: 'internal', to: '/contact' }
}

/** Spread onto `Button` — uses `href` for Google booking, `to` for /contact fallback. */
export function bookCallButtonProps():
  | { href: string; target: '_blank'; rel: 'noreferrer noopener' }
  | { to: '/contact' } {
  const target = getBookCallTarget()
  if (target.kind === 'external') {
    return { href: target.href, target: '_blank', rel: 'noreferrer noopener' }
  }
  return { to: target.to }
}
