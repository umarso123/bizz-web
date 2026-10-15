import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router'
import { getBookCallTarget } from '@/app/navigation.ts'

type BookCallLinkProps = {
  className?: string
  children: ReactNode
  'aria-label'?: string
} & Omit<ComponentProps<'a'>, 'href' | 'children' | 'className' | 'aria-label'>

/**
 * Renders an external Google booking link when configured, otherwise routes to /contact.
 */
export function BookCallLink({ className, children, ...rest }: BookCallLinkProps) {
  const target = getBookCallTarget()

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

  return (
    <Link to={target.to} className={className} {...rest}>
      {children}
    </Link>
  )
}
