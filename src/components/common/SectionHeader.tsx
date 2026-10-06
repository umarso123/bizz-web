import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { cn } from '@/lib/cn.ts'

type SectionHeaderAlign = 'left' | 'center'
type SectionHeaderWidth = 'full' | 'reading'
type SectionHeaderTitle = 'h1' | 'h2' | 'h3'

type SectionHeaderProps = {
  eyebrow?: ReactNode
  eyebrowTone?: 'default' | 'brand'
  title: ReactNode
  titleAs?: SectionHeaderTitle
  titleId?: string
  description?: ReactNode
  align?: SectionHeaderAlign
  width?: SectionHeaderWidth
  action?: ReactNode
  className?: string
}

export function SectionHeader({
  eyebrow,
  eyebrowTone = 'default',
  title,
  titleAs = 'h2',
  titleId,
  description,
  align = 'left',
  width = 'full',
  action,
  className,
}: SectionHeaderProps) {
  const TitleTag = titleAs
  const centered = align === 'center'
  const capped = centered || width === 'reading'

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        centered && 'items-center text-center',
        !centered && action ? 'sm:flex-row sm:items-end sm:justify-between' : undefined,
        className,
      )}
    >
      <div className={cn('flex min-w-0 flex-col gap-3', capped && 'max-w-reading', centered && 'items-center')}>
        {eyebrow ? (
          typeof eyebrow === 'string' || typeof eyebrow === 'number' ? (
            <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>
          ) : (
            eyebrow
          )
        ) : null}
        <TitleTag id={titleId}>{title}</TitleTag>
        {description ? <p className="measure text-text-secondary">{description}</p> : null}
      </div>
      {action ? <div className={cn('shrink-0', centered && 'flex justify-center')}>{action}</div> : null}
    </div>
  )
}
