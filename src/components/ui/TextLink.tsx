import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/cn.ts'
import { omitKeys } from '@/lib/omit.ts'

type TextLinkTone = 'ink' | 'brand' | 'inverse'

type TextLinkShared = {
  trailingIcon?: ReactNode
  tone?: TextLinkTone
  /** Inside running text: drop the button-height tap box. */
  inline?: boolean
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

const toneClass: Record<TextLinkTone, string> = {
  ink: 'text-text decoration-brand/45 hover:text-text hover:decoration-brand',
  brand: 'text-brand-hover decoration-brand/45 hover:text-brand-active hover:decoration-brand-active',
  inverse: 'text-text-inverse decoration-white/40 hover:text-text-inverse hover:decoration-accent',
}

/**
 * Underlined text link; the underline thickens on hover. No arrow glyphs.
 * `cn` joins classes without merging, so size changes go through props, not className.
 */
function textLinkClassName(tone: TextLinkTone, inline: boolean, className?: string) {
  return cn(
    'max-w-full items-center gap-1.5 text-body-small font-semibold underline decoration-[1.5px] underline-offset-[0.3em] transition-[color,text-decoration-color,text-decoration-thickness] duration-(--duration-standard) ease-standard hover:decoration-[2.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    inline ? 'inline' : 'inline-flex min-h-(--button-height)',
    toneClass[tone],
    className,
  )
}

const sharedKeys = ['trailingIcon', 'tone', 'inline', 'className', 'children'] as const

export function TextLink(props: TextLinkProps) {
  const { trailingIcon, tone = 'ink', inline = false, className, children } = props
  const classes = textLinkClassName(tone, inline, className)
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
