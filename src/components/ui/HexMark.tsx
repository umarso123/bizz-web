import { cn } from '@/lib/cn.ts'

type HexVariant = 'station' | 'active' | 'solid' | 'outline' | 'inverse'

type HexMarkProps = {
  variant?: HexVariant
  /** Pixel size of the bounding box. */
  size?: number
  className?: string
}

/** Pointy-top hexagon in a 24×24 box, the shape of the Bizaffix mark. */
export const HEX_POINTS = '12,1.5 21.1,6.75 21.1,17.25 12,22.5 2.9,17.25 2.9,6.75'

const fill: Record<HexVariant, string> = {
  station: 'var(--color-surface)',
  active: 'var(--color-accent)',
  solid: 'var(--color-brand)',
  outline: 'transparent',
  inverse: 'var(--color-surface-brand-deep)',
}

const stroke: Record<HexVariant, string> = {
  station: 'var(--color-text)',
  active: 'var(--color-text)',
  solid: 'var(--color-brand)',
  outline: 'currentColor',
  inverse: 'var(--color-text-inverse)',
}

/**
 * The station marker: hexagons mark points on a route and zones on a page.
 */
export function HexMark({ variant = 'solid', size = 12, className }: HexMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points={HEX_POINTS}
        fill={fill[variant]}
        stroke={stroke[variant]}
        strokeWidth={variant === 'solid' ? 0 : 2.6}
        strokeLinejoin="round"
      />
    </svg>
  )
}
