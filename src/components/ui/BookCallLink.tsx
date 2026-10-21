import type { ComponentProps, ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { getBookCallTarget } from '@/app/navigation.ts'

type BookCallLinkProps = {
  className?: string
  children: ReactNode
  'aria-label'?: string
} & Omit<ComponentProps<'a'>, 'href' | 'children' | 'className' | 'aria-label'>

/** The note form on /contact, where Book a call lands until a booking URL is set. */
const CONTACT_FORM_ANCHOR = '#project-note'

/**
 * Renders an external Google booking link when configured, otherwise routes to /contact.
 * Already on /contact, it scrolls to the form instead of linking to the same page.
 */
export function BookCallLink({ className, children, ...rest }: BookCallLinkProps) {
  const target = getBookCallTarget()
  const { pathname } = useLocation()

  if (target.kind === 'external') {
    return (
      <a
        href={target.href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
        {...rest}
      >
        {children}
      </a>
    )
  }

  if (pathname === target.to) {
    return (
      <a href={CONTACT_FORM_ANCHOR} className={className} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <Link to={target.to} className={className} {...rest}>
      {children}
    </Link>
  )
}
