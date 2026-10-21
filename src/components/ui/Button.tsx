import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/cn.ts'
import { omitKeys } from '@/lib/omit.ts'

type ButtonVariant =
  | 'primary'
  | 'brand'
  | 'accent'
  | 'secondary'
  | 'subtle'
  | 'ghost'
  | 'inverse'
  | 'inverse-outline'
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

/** Flat pills. Depth belongs to floating things, not buttons. */
const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-button-primary text-text-inverse hover:bg-button-primary-hover hover:text-text-inverse active:bg-button-primary-active',
  brand:
    'bg-button-brand text-text-inverse hover:bg-button-brand-hover hover:text-text-inverse active:bg-brand-active',
  accent: 'bg-accent text-text hover:bg-accent-deep hover:text-text active:bg-accent-deep',
  secondary:
    'border border-border-strong bg-transparent text-text hover:border-text/50 hover:bg-bg-subtle hover:text-text active:bg-bg-muted',
  subtle: 'bg-bg-subtle text-text hover:bg-bg-muted hover:text-text active:bg-bg-muted',
  ghost: 'bg-transparent text-text hover:bg-bg-subtle hover:text-text active:bg-bg-muted',
  inverse: 'bg-surface text-text hover:bg-accent hover:text-text active:bg-accent-deep',
  'inverse-outline':
    'border border-white/30 bg-transparent text-text-inverse hover:border-white/70 hover:bg-white/8 hover:text-text-inverse',
}

const sizeClass: Record<ButtonSize, string> = {
  md: 'min-h-(--button-height) min-w-(--button-height) px-(--button-padding-inline) text-body-small',
  lg: 'min-h-(--button-height-desktop) min-w-(--button-height-desktop) px-7 text-[1rem]',
}

function buttonClassName(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn(
    'inline-flex max-w-full shrink-0 items-center justify-center gap-2 rounded-button text-center font-semibold tracking-[-0.005em] no-underline transition-[color,background-color,border-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgb(13_18_31/0.45)] active:translate-y-0 active:shadow-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60 data-loading:opacity-70',
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
  loading,
  children,
}: Pick<ButtonShared, 'leadingIcon' | 'trailingIcon' | 'loading' | 'children'>) {
  return (
    <>
      {loading ? (
        <span
          aria-hidden="true"
          className="inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : leadingIcon ? (
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
    <ButtonContent leadingIcon={leadingIcon} trailingIcon={trailingIcon} loading={loading}>
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
