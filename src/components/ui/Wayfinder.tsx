import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion/Reveal.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { cn } from '@/lib/cn.ts'

type WayfinderProps = {
  /** Zone name, in sentence case. Matches the nav label where there is one. */
  label: ReactNode
  /** Optional fact about the zone, shown at the far end of the rule. */
  meta?: ReactNode
  inverse?: boolean
  /** Draw the rule in once on load. Use for the page-top marker only. */
  draw?: boolean
  as?: 'p' | 'div'
  className?: string
}

/**
 * Zone marker for a major section: hexagon, label, a rule to the edge, meta.
 * Doubles as the section divider. Use it only where a visitor might navigate.
 */
export function Wayfinder({ label, meta, inverse = false, draw = false, as = 'p', className }: WayfinderProps) {
  const Tag = as
  return (
    <Tag
      className={cn(
        'flex items-center gap-3 text-eyebrow',
        inverse ? 'text-text-inverse' : 'text-text',
        className,
      )}
    >
      <HexMark variant={inverse ? 'active' : 'solid'} size={12} />
      <span className="shrink-0">{label}</span>
      {/* The rule draws itself in when the zone comes into view */}
      <Reveal
        as="span"
        variant="draw"
        delay={draw ? 200 : 100}
        aria-hidden="true"
        className={cn('h-px min-w-6 flex-1', inverse ? 'bg-border-inverse' : 'bg-border')}
      />
      {meta ? (
        <span className={cn('shrink-0 tabular-nums', inverse ? 'text-text-inverse-muted' : 'text-text-secondary')}>
          {meta}
        </span>
      ) : null}
    </Tag>
  )
}
