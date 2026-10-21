import { HEX_POINTS } from '@/components/ui/HexMark.tsx'
import { cn } from '@/lib/cn.ts'

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return `${first}${last}`.toUpperCase()
}

type HexMonogramProps = {
  name: string
  className?: string
}

/**
 * Stand-in for a portrait until real photos arrive: the station hexagon with
 * the person's initials. Never use a stock photo for a named person.
 */
export function HexMonogram({ name, className }: HexMonogramProps) {
  return (
    <span className={cn('relative inline-grid size-[4.5rem] shrink-0 place-items-center', className)} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="absolute inset-0 size-full" focusable="false">
        <polygon
          points={HEX_POINTS}
          fill="var(--color-brand-soft)"
          stroke="var(--color-brand)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="relative text-[1.125rem] font-semibold tracking-[-0.01em] text-brand-hover [font-stretch:88%]">
        {initials(name)}
      </span>
    </span>
  )
}
