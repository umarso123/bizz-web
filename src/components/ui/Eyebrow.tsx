import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn.ts'

type EyebrowElement = 'p' | 'span' | 'div' | 'h2'
type EyebrowTone = 'default' | 'brand'

type EyebrowProps = {
  as?: EyebrowElement
  tone?: EyebrowTone
  /** Same type, white, for eyebrows sitting on a dark surface. */
  inverse?: boolean
  className?: string
  children: ReactNode
} & Omit<ComponentProps<'p'>, 'className' | 'children'>

export function Eyebrow({
  as = 'p',
  tone: _tone,
  inverse = false,
  className,
  children,
  ...props
}: EyebrowProps) {
  void _tone
  const Tag = as
  return (
    <Tag className={cn('text-eyebrow', inverse ? 'text-white' : 'text-brand', className)} {...props}>
      {children}
    </Tag>
  )
}
