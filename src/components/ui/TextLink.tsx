import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/cn.ts'
import { omitKeys } from '@/lib/omit.ts'

type TextLinkShared = {
  trailingIcon?: ReactNode
  className?: string
  children: ReactNode
}

type TextLinkAsAnchor = TextLinkShared &
  Omit<ComponentProps<'a'>, keyof TextLinkShared | 'href'> & {
    href: string
    to?: never
  }

type TextLinkAsRoute = TextLinkShared &
  Omit<ComponentProps<typeof Link>, keyof TextLinkShared | 'to'> & {
    to: string
    href?: never
  }

export type TextLinkProps = TextLinkAsAnchor | TextLinkAsRoute

function textLinkClassName(className?: string) {
  return cn(
    'inline-flex min-h-(--button-height) max-w-full items-center gap-1 text-body-small font-semibold text-brand-hover underline decoration-current underline-offset-[0.22em] transition-colors duration-(--duration-standard) ease-standard hover:text-brand-active',
    className,
  )
}

const sharedKeys = ['trailingIcon', 'className', 'children'] as const

export function TextLink(props: TextLinkProps) {
  const { trailingIcon, className, children } = props
  const classes = textLinkClassName(className)
  const content = (
    <>
      <span>{children}</span>
      {trailingIcon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {trailingIcon}
        </span>
      ) : null}
    </>
  )

  if ('to' in props && props.to) {
    const linkProps = omitKeys(props, sharedKeys)
    return (
      <Link {...linkProps} className={classes}>
        {content}
      </Link>
    )
  }

  const anchorProps = omitKeys(props, sharedKeys)
  const safeRel = anchorProps.target === '_blank' && !anchorProps.rel ? 'noreferrer noopener' : anchorProps.rel
  return (
    <a {...anchorProps} rel={safeRel} className={classes}>
      {content}
    </a>
  )
}
