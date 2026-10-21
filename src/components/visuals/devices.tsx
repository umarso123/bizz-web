import type { ReactNode } from 'react'
import { HEX_POINTS } from '@/components/ui/HexMark.tsx'
import { cn } from '@/lib/cn.ts'

/*
 * Building blocks for the product visuals: a stage that fits any frame, device
 * bezels, and a few UI parts. Everything inside the composition is sized in
 * cqw (percent of the composition's width), so a visual scales like a picture.
 */

type StageTone = 'ward' | 'night'

type ShotStageProps = {
  /** What the picture shows, for screen readers. */
  label: string
  tone?: StageTone
  /** Composition shape. The composition is contained inside the frame. */
  aspect?: 'wide' | 'square'
  children: ReactNode
}

/**
 * Fills a positioned frame (absolute inset-0) and centres a fixed-shape
 * composition inside it, like an image with object-fit: contain.
 */
export function ShotStage({ label, tone = 'ward', aspect = 'wide', children }: ShotStageProps) {
  const night = tone === 'night'
  return (
    <div
      role="img"
      aria-label={`Illustration: ${label}`}
      className={cn(
        'absolute inset-0 flex items-center justify-center overflow-hidden [container-type:size]',
        night ? 'bg-transparent' : 'bg-bg-subtle',
      )}
    >
      {!night ? (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_100%_0%,rgb(47_91_234/0.1),transparent_65%)]"
          />
          <div aria-hidden="true" className="floor-grid absolute inset-0" />
        </>
      ) : null}
      <div
        className={cn(
          '@container relative',
          aspect === 'wide' ? 'aspect-[16/11] w-[min(92cqw,133cqh)]' : 'aspect-square w-[min(88cqw,88cqh)]',
        )}
      >
        {children}
      </div>
      <span
        aria-hidden="true"
        className={cn(
          'absolute right-3 bottom-2.5 text-[0.6875rem] leading-none',
          night ? 'text-text-inverse-muted/70' : 'text-text-muted',
        )}
      >
        Illustration
      </span>
    </div>
  )
}

const deviceShadow = 'shadow-[0_2.4cqw_5cqw_-2cqw_rgb(13_18_31/0.45)]'

export function Laptop({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('absolute', className)}>
      <div className={cn('rounded-[1.4cqw] bg-surface-dark p-[0.75cqw]', deviceShadow)}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.45cqw] bg-surface">{children}</div>
      </div>
      <div className="relative -mx-[5%] h-[1.3cqw] rounded-t-[0.2cqw] rounded-b-[1.4cqw] bg-[linear-gradient(to_bottom,var(--color-border-subtle),var(--color-border-strong))] shadow-[0_1.4cqw_2cqw_-1cqw_rgb(13_18_31/0.3)]">
        <span className="absolute top-0 left-1/2 h-[0.45cqw] w-[14%] -translate-x-1/2 rounded-b-[0.5cqw] bg-border-strong" />
      </div>
    </div>
  )
}

export function Tablet({
  className,
  wide = false,
  children,
}: {
  className?: string
  /** 16:10 landscape instead of 4:3. */
  wide?: boolean
  children: ReactNode
}) {
  return (
    <div className={cn('absolute rounded-[2cqw] bg-surface-dark p-[0.95cqw]', deviceShadow, className)}>
      <div className={cn('relative overflow-hidden rounded-[1cqw] bg-surface', wide ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
        {children}
      </div>
    </div>
  )
}

export function Phone({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('absolute rounded-[3.2cqw] bg-surface-dark p-[0.7cqw]', deviceShadow, className)}>
      <div className="relative aspect-[9/19] overflow-hidden rounded-[2.5cqw] bg-surface">
        {children}
        <span className="absolute top-[0.9cqw] left-1/2 h-[1.3cqw] w-[32%] -translate-x-1/2 rounded-full bg-surface-dark" />
      </div>
    </div>
  )
}

/* ------------------------------- UI parts -------------------------------- */

/**
 * Type steps for screen content, in cqw of the composition. Sized so a tablet
 * at 80% of the composition reads like a real app at that size.
 */
export const ui = {
  xs: 'text-[length:1.05cqw] leading-[1.25]',
  sm: 'text-[length:1.25cqw] leading-[1.3]',
  md: 'text-[length:1.5cqw] leading-[1.25]',
  lg: 'text-[length:1.9cqw] leading-[1.15]',
  xl: 'text-[length:2.5cqw] leading-[1.05]',
  panel: 'rounded-[0.8cqw] border border-border-subtle bg-surface',
} as const

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-brand-soft font-semibold text-brand-hover',
        className,
      )}
    >
      {initials}
    </span>
  )
}

type ChipTone = 'success' | 'warning' | 'brand' | 'accent' | 'neutral'

const chipTone: Record<ChipTone, string> = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  brand: 'bg-brand-soft text-brand-hover',
  accent: 'bg-accent-soft text-text',
  neutral: 'bg-bg-muted text-text-secondary',
}

export function Chip({ tone = 'neutral', className, children }: { tone?: ChipTone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-[0.35cqw] rounded-full px-[0.65cqw] py-[0.22cqw] font-semibold whitespace-nowrap',
        ui.xs,
        chipTone[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/** The bottom tab bar of a phone app. Put it last in a flex column screen. */
export function TabBar({
  items,
  active = 0,
  dark = false,
}: {
  items: readonly { label: string; icon: IconName }[]
  active?: number
  dark?: boolean
}) {
  return (
    <div
      className={cn(
        '-mx-[1.2cqw] mt-auto -mb-[1.2cqw] flex justify-around border-t px-[0.6cqw] pt-[0.7cqw] pb-[1.1cqw]',
        dark ? 'border-white/10 bg-surface-dark' : 'border-border-subtle bg-surface',
      )}
    >
      {items.map((item, index) => {
        const current = index === active
        return (
          <span
            key={item.label}
            className={cn(
              'flex flex-col items-center gap-[0.25cqw] text-[length:0.85cqw] leading-none',
              current ? (dark ? 'text-accent' : 'text-brand') : dark ? 'text-text-inverse-muted' : 'text-text-muted',
            )}
          >
            <Icon name={item.icon} className="size-[1.6cqw]" />
            {item.label}
          </span>
        )
      })}
    </div>
  )
}

/** A small line chart. Values run 0 (bottom) to 1 (top). */
export function Spark({ values, className, tone = 'brand' }: { values: number[]; className?: string; tone?: 'brand' | 'accent' }) {
  const points = values
    .map((value, index) => `${((index / (values.length - 1)) * 100).toFixed(1)},${((1 - value) * 28 + 1).toFixed(1)}`)
    .join(' ')
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={cn('block w-full', className)} aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={tone === 'brand' ? 'var(--color-brand)' : 'var(--color-accent-deep)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** The station hexagon at any size, for markers inside screens. */
export function Hex({ className, tone = 'brand' }: { className?: string; tone?: 'brand' | 'accent' | 'station' }) {
  const fill = tone === 'brand' ? 'var(--color-brand)' : tone === 'accent' ? 'var(--color-accent)' : 'var(--color-surface)'
  return (
    <svg viewBox="0 0 24 24" className={cn('shrink-0', className)} aria-hidden="true">
      <polygon
        points={HEX_POINTS}
        fill={fill}
        stroke={tone === 'brand' ? 'var(--color-brand)' : 'var(--color-text)'}
        strokeWidth={tone === 'brand' ? 0 : 2.6}
        strokeLinejoin="round"
      />
    </svg>
  )
}

type IconName =
  | 'check'
  | 'lock'
  | 'mic'
  | 'camera'
  | 'chat'
  | 'end'
  | 'bell'
  | 'search'
  | 'arrow'
  | 'home'
  | 'calendar'
  | 'user'
  | 'card'
  | 'chart'
  | 'bolt'

const iconPaths: Record<IconName, ReactNode> = {
  check: <path d="M5 12.5 9.5 17 19 7.5" />,
  lock: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3.5" width="6" height="11" rx="3" />
      <path d="M6 11.5a6 6 0 0 0 12 0M12 17.5v3" />
    </>
  ),
  camera: (
    <>
      <rect x="3.5" y="7" width="12" height="10" rx="2" />
      <path d="m15.5 11 5-3v8l-5-3" />
    </>
  ),
  chat: <path d="M5 6.5h14v9H10l-4 3v-3H5z" />,
  end: <path d="M4 14.5c4.5-4 11.5-4 16 0l-2 2.5-3-1.2v-2.3a10 10 0 0 0-6 0v2.3l-3 1.2z" />,
  bell: <path d="M7 16.5V11a5 5 0 0 1 10 0v5.5l1.5 1.5h-13zM10.5 20h3" />,
  search: (
    <>
      <circle cx="11" cy="11" r="5.5" />
      <path d="m15.5 15.5 4 4" />
    </>
  ),
  arrow: <path d="M6 12h12M13 7l5 5-5 5" />,
  home: <path d="M4.5 11 12 4.5l7.5 6.5V19a1 1 0 0 1-1 1h-4v-5h-5v5h-4a1 1 0 0 1-1-1z" />,
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="2" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 19.5a7 7 0 0 1 14 0" />
    </>
  ),
  card: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M3.5 10h17" />
    </>
  ),
  chart: <path d="M5 19V11M10 19V6M15 19v-5M20 19V9" />,
  bolt: <path d="M13 3.5 6 13.5h5.5L10.5 20.5 18 10h-5.5z" />,
}

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  )
}
