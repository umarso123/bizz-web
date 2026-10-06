import { createElement, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn.ts'

type SectionElement = 'section' | 'div' | 'main' | 'article' | 'header' | 'footer'
type SectionBackground = 'white' | 'brand' | 'dark'
type SectionSpacing = 'default' | 'compact' | 'none'

type SectionProps = {
  as?: SectionElement
  background?: SectionBackground
  spacing?: SectionSpacing
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<'section'>, 'className' | 'children'>

const backgroundClass: Record<SectionBackground, string> = {
  white: 'bg-page-white',
  brand: 'bg-page-brand',
  dark: 'bg-page-dark',
}

const spacingClass: Record<SectionSpacing, string> = {
  default: 'section-y',
  compact: 'py-12 md:py-16 lg:py-20',
  none: '',
}

export function Section({
  as = 'section',
  background = 'white',
  spacing = 'default',
  className,
  children,
  ...props
}: SectionProps) {
  return createElement(
    as,
    {
      ...props,
      className: cn(backgroundClass[background], spacingClass[spacing], className),
    },
    children,
  )
}
