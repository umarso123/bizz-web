import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn.ts'

type ContainerElement = 'div' | 'section' | 'main' | 'header' | 'article' | 'footer'
type ContainerVariant = 'page' | 'wide' | 'reading'

type ContainerProps = {
  as?: ContainerElement
  variant?: ContainerVariant
  className?: string
  children: ReactNode
} & Omit<ComponentProps<'div'>, 'className' | 'children'>

const variantClass: Record<ContainerVariant, string> = {
  page: 'container-page',
  wide: 'container-wide',
  reading: 'container-reading',
}

export function Container({
  as = 'div',
  variant = 'page',
  className,
  children,
  ...props
}: ContainerProps) {
  const Tag = as
  return (
    <Tag className={cn(variantClass[variant], className)} {...props}>
      {children}
    </Tag>
  )
}
