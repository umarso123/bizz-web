import type { ReactNode } from 'react'
import { Reveal, RevealText } from '@/components/motion/Reveal.tsx'
import { Wayfinder } from '@/components/ui/Wayfinder.tsx'
import { cn } from '@/lib/cn.ts'

type SectionHeaderAlign = 'left' | 'center'
type SectionHeaderWidth = 'full' | 'reading'
type SectionHeaderTitle = 'h1' | 'h2' | 'h3'

type SectionHeaderProps = {
  /** Zone name. Rendered as a Wayfinder rule above the title. */
  eyebrow?: ReactNode
  /** Kept for older call sites; every eyebrow now uses the Wayfinder style. */
  eyebrowTone?: 'default' | 'brand'
  /** Short fact at the end of the Wayfinder rule, e.g. "6 services". */
  meta?: ReactNode
  title: ReactNode
  titleAs?: SectionHeaderTitle
  titleId?: string
  description?: ReactNode
  align?: SectionHeaderAlign
  width?: SectionHeaderWidth
  action?: ReactNode
  inverse?: boolean
  className?: string
}

/**
 * The standard section intro on every page.
 * Left: zone rule, then the title (7 columns), with the description and action
 * set against it (columns 9–12). Center: a compact stack for closing moments.
 */
export function SectionHeader({
  eyebrow,
  eyebrowTone: _eyebrowTone,
  meta,
  title,
  titleAs = 'h2',
  titleId,
  description,
  align = 'left',
  width = 'full',
  action,
  inverse = false,
  className,
}: SectionHeaderProps) {
  void _eyebrowTone
  const TitleTag = titleAs
  const muted = inverse ? 'text-text-inverse-muted' : 'text-text-secondary'
  const ink = inverse ? 'text-text-inverse' : 'text-text'

  if (align === 'center') {
    return (
      <div className={cn('mx-auto flex max-w-[44rem] flex-col items-center gap-5 text-center', className)}>
        {eyebrow ? (
          <p className={cn('text-eyebrow', muted)}>{eyebrow}</p>
        ) : null}
        <TitleTag id={titleId} className={ink}>
          {title}
        </TitleTag>
        {description ? <p className={cn('max-w-[38rem] text-body-large', muted)}>{description}</p> : null}
        {action ? <div className="mt-2 flex flex-wrap justify-center gap-3">{action}</div> : null}
      </div>
    )
  }

  const reading = width === 'reading'

  return (
    <div className={cn('flex flex-col gap-8 md:gap-10', className)}>
      {eyebrow ? <Wayfinder label={eyebrow} meta={meta} inverse={inverse} /> : null}
      <div className={cn('grid gap-6 lg:items-start lg:gap-8', !reading && 'lg:grid-cols-12')}>
        <TitleTag id={titleId} className={cn('max-w-[18ch]', ink, !reading && 'lg:col-span-7')}>
          {typeof title === 'string' ? <RevealText text={title} /> : title}
        </TitleTag>
        {description || action ? (
          <Reveal delay={180} className={cn('flex flex-col gap-6', !reading && 'lg:col-span-4 lg:col-start-9 lg:pt-1.5')}>
            {description ? <p className={cn('max-w-[38rem] text-body-large', muted)}>{description}</p> : null}
            {action ? <div className="flex flex-wrap gap-3">{action}</div> : null}
          </Reveal>
        ) : null}
      </div>
    </div>
  )
}
