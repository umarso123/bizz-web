import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn.ts'

type EyebrowElement = 'p' | 'span' | 'div'
type EyebrowTone = 'default' | 'brand'

type EyebrowProps = {
  as?: EyebrowElement
  tone?: EyebrowTone
  className?: string
  children: ReactNode
} & Omit<ComponentProps<'p'>, 'className' | 'children'>

const toneClass: Record<EyebrowTone, string> = {
  default: 'text-text-muted',
  brand: 'text-brand-hover',
}

export function Eyebrow({
  as = 'p',
  tone = 'default',
  className,
  children,
  ...props
}: EyebrowProps) {
  const Tag = as
  return (
    <Tag className={cn('text-eyebrow', toneClass[tone], className)} {...props}>
      {children}
    </Tag>
  )
}
