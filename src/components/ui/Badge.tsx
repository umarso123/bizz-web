import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn.ts'

type BadgeVariant = 'neutral' | 'brand' | 'success'

type BadgeProps = {
  variant?: BadgeVariant
  className?: string
  children: ReactNode
} & Omit<ComponentProps<'span'>, 'className' | 'children'>

const variantClass: Record<BadgeVariant, string> = {
  neutral: 'border-border bg-bg-subtle text-text',
  brand: 'border-transparent bg-brand-soft text-brand-hover',
  success: 'border-transparent bg-success-soft text-success',
}

export function Badge({ variant = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border px-3 py-1 text-caption font-semibold',
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
