import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn.ts'

type SurfaceElement = 'div' | 'article' | 'section' | 'aside'
type SurfaceVariant = 'plain' | 'bordered' | 'subtle' | 'raised'

type SurfaceProps = {
  as?: SurfaceElement
  variant?: SurfaceVariant
  className?: string
  children: ReactNode
} & Omit<ComponentProps<'div'>, 'className' | 'children'>

const variantClass: Record<SurfaceVariant, string> = {
  plain: 'bg-transparent',
  bordered: 'rounded-lg border border-border bg-surface',
  subtle: 'rounded-lg bg-bg-subtle',
  raised: 'rounded-lg border border-border bg-surface shadow-xs',
}

export function Surface({
  as = 'div',
  variant = 'bordered',
  className,
  children,
  ...props
}: SurfaceProps) {
  const Tag = as
  return (
    <Tag className={cn(variantClass[variant], className)} {...props}>
      {children}
    </Tag>
  )
}
