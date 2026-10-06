/**
 * Primary nav — homepage sections that exist today, plus Careers.
 */
export type NavItem = {
  label: string
  to: string
}

export const primaryNavigation = [
  { label: 'Services', to: '/#services' },
  { label: 'Digital Health', to: '/#digital-health' },
  { label: 'Work', to: '/#featured-projects' },
  { label: 'Process', to: '/#how-we-work' },
  { label: 'Careers', to: '/careers' },
] as const satisfies readonly NavItem[]

export const bookCall = {
  label: 'Book a call',
  to: '/contact',
} as const
