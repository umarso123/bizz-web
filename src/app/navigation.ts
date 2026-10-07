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
  { label: 'Approach', to: '/#approach' },
  { label: 'Contact', to: '/contact' },
] as const satisfies readonly NavItem[]

export const bookCall = {
  label: 'Book a call',
  to: '/contact',
} as const
