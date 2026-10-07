import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/cn.ts'
import { omitKeys } from '@/lib/omit.ts'

type ButtonVariant = 'primary' | 'brand' | 'secondary' | 'subtle' | 'ghost'
type ButtonSize = 'md' | 'lg'

type ButtonShared = {
  variant?: ButtonVariant
  size?: ButtonSize
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  loading?: boolean
  disabled?: boolean
  className?: string
  children: ReactNode
}

type ButtonAsButton = ButtonShared &
  Omit<ComponentProps<'button'>, keyof ButtonShared> & {
    href?: never
    to?: never
  }

type ButtonAsAnchor = ButtonShared &
  Omit<ComponentProps<'a'>, keyof ButtonShared | 'href'> & {
    href: string
    to?: never
  }

type ButtonAsRoute = ButtonShared &
  Omit<ComponentProps<typeof Link>, keyof ButtonShared | 'to'> & {
    to: string
    href?: never
  }

export type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsRoute

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-button-primary text-text-inverse hover:bg-button-primary-hover active:bg-button-primary-active',
  brand:
    'bg-button-brand text-text-inverse shadow-md hover:bg-button-brand-hover active:bg-brand-active',
  secondary:
    'border border-border bg-surface text-text hover:border-border-strong hover:bg-bg-subtle active:bg-bg-muted',
  subtle: 'bg-bg-subtle text-text hover:bg-bg-muted active:bg-bg-muted',
  ghost: 'bg-transparent text-text hover:bg-bg-subtle active:bg-bg-muted',
}

const sizeClass: Record<ButtonSize, string> = {
  md: 'min-h-(--button-height) min-w-(--button-height) px-(--button-padding-inline)',
  lg: 'min-h-(--button-height-desktop) min-w-(--button-height-desktop) px-6',
}

function buttonClassName(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn(
    'inline-flex max-w-full shrink-0 items-center justify-center gap-2 rounded-button text-center text-body-small font-semibold no-underline transition-colors duration-(--duration-standard) ease-standard disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60 data-loading:opacity-70',
    variantClass[variant],
    sizeClass[size],
    className,
  )
}

const sharedKeys = [
  'variant',
  'size',
  'leadingIcon',
  'trailingIcon',
  'loading',
  'disabled',
  'className',
  'children',
] as const

function ButtonContent({
  leadingIcon,
  trailingIcon,
  children,
}: Pick<ButtonShared, 'leadingIcon' | 'trailingIcon' | 'children'>) {
  return (
    <>
      {leadingIcon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {leadingIcon}
        </span>
      ) : null}
      <span>{children}</span>
      {trailingIcon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {trailingIcon}
        </span>
      ) : null}
    </>
  )
}

function isRouteButton(props: ButtonProps): props is ButtonAsRoute {
  return 'to' in props && typeof props.to === 'string'
}

function isAnchorButton(props: ButtonProps): props is ButtonAsAnchor {
  return 'href' in props && typeof props.href === 'string'
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    leadingIcon,
    trailingIcon,
    loading = false,
    disabled = false,
    className,
    children,
  } = props
  const isDisabled = disabled || loading
  const classes = buttonClassName(variant, size, className)
  const content = (
    <ButtonContent leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
      {children}
    </ButtonContent>
  )

  if (isRouteButton(props)) {
    const linkProps = omitKeys(props, sharedKeys)
    return (
      <Link
        {...linkProps}
        className={classes}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        data-loading={loading ? '' : undefined}
        tabIndex={isDisabled ? -1 : linkProps.tabIndex}
        onClick={(event) => {
          if (isDisabled) event.preventDefault()
          linkProps.onClick?.(event)
        }}
      >
        {content}
      </Link>
    )
  }

  if (isAnchorButton(props)) {
    const anchorProps = omitKeys(props, sharedKeys)
    const safeRel = anchorProps.target === '_blank' && !anchorProps.rel ? 'noreferrer noopener' : anchorProps.rel
    return (
      <a
        {...anchorProps}
        href={isDisabled ? undefined : anchorProps.href}
        rel={safeRel}
        className={classes}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        data-loading={loading ? '' : undefined}
        tabIndex={isDisabled ? -1 : anchorProps.tabIndex}
        onClick={(event) => {
          if (isDisabled) event.preventDefault()
          anchorProps.onClick?.(event)
        }}
      >
        {content}
      </a>
    )
  }

  const buttonProps = omitKeys(props, sharedKeys)
  const buttonType =
    buttonProps.type === 'submit' || buttonProps.type === 'reset' ? buttonProps.type : 'button'
  return (
    <button
      {...buttonProps}
      type={buttonType}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
    >
      {content}
    </button>
  )
}
