import { googleBookingUrl } from '@/content/booking.ts'

/**
 * Primary nav. Healthcare leads; every item is a real page.
 */
export type NavItem = {
  label: string
  to: string
}

export const primaryNavigation = [
  { label: 'Healthcare', to: '/healthcare' },
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
] as const satisfies readonly NavItem[]

/** Footer groups. Labels match the nav so a zone is always called the same thing. */
export const footerNavigation = {
  explore: [
    { label: 'Home', to: '/' },
    { label: 'Healthcare', to: '/healthcare' },
    { label: 'Services', to: '/services' },
    { label: 'Work', to: '/work' },
  ],
  company: [
    { label: 'About', to: '/about' },
    { label: 'Insights', to: '/insights' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/contact' },
  ],
} as const satisfies Record<string, readonly NavItem[]>

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
