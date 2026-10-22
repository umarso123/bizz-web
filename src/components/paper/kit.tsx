import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import { CropMarks, usePaperGrain } from '@/components/paper/paper.tsx'
import { BookCallLink } from '@/components/ui/BookCallLink.tsx'
import { cn } from '@/lib/cn.ts'

/*
 * The homepage's shared pieces: a sheet (section) and the two
 * buttons. Tokens live in styles/paper-home.css (ph-container, ph-pad, ph-h2…).
 */

export type SheetTone = 'blue' | 'night' | 'yellow' | 'white' | 'cream' | 'periwinkle'

type ToneStyle = {
  sheet: string
  /** Secondary text that still passes AA on this sheet. */
  muted: string
  rule: string
  grid: string
  grainLight: boolean
  /** Primary button tone: blue on light sheets, navy on blue and yellow ones. */
  button: 'blue' | 'navy'
}

export const tones: Record<SheetTone, ToneStyle> = {
  blue: { sheet: 'bg-[var(--ph-blue)] text-white', muted: 'text-white/85', rule: 'border-white/25', grid: 'ph-grid-inverse', grainLight: false, button: 'navy' },
  night: { sheet: 'bg-[var(--ph-night)] text-white', muted: 'text-white/80', rule: 'border-white/20', grid: 'ph-grid-inverse', grainLight: false, button: 'blue' },
  yellow: { sheet: 'bg-[var(--ph-yellow)] text-[var(--ph-navy)]', muted: 'text-[rgb(13_18_31/0.8)]', rule: 'border-[rgb(13_18_31/0.2)]', grid: 'ph-grid-navy', grainLight: true, button: 'navy' },
  white: { sheet: 'bg-white text-[var(--ph-navy)]', muted: 'text-[var(--ph-grey)]', rule: 'border-[var(--ph-border)]', grid: 'ph-grid', grainLight: true, button: 'blue' },
  cream: { sheet: 'bg-[var(--ph-cream)] text-[var(--ph-navy)]', muted: 'text-[var(--ph-grey)]', rule: 'border-[var(--ph-border)]', grid: 'ph-grid-blue', grainLight: true, button: 'blue' },
  periwinkle: { sheet: 'bg-[var(--ph-periwinkle)] text-[var(--ph-navy)]', muted: 'text-[rgb(13_18_31/0.8)]', rule: 'border-[rgb(13_18_31/0.18)]', grid: 'ph-grid-navy', grainLight: true, button: 'navy' },
}

type PaperSectionProps = {
  tone: SheetTone
  id?: string
  labelledBy?: string
  /** Faint technical grid on the sheet. */
  grid?: boolean
  crop?: boolean
  /** Extra classes on the section (padding overrides, layout). */
  className?: string
  /** Classes on the inner container. */
  containerClassName?: string
  /** Rendered after the container, full bleed (a torn edge). */
  after?: ReactNode
  children: ReactNode
}

/** A full-width sheet: colour, grid, grain, crop marks, and the one container. */
export function PaperSection({ tone, id, labelledBy, grid = true, crop = true, className, containerClassName, after, children }: PaperSectionProps) {
  const t = tones[tone]
  const grain = usePaperGrain()
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('ph-pad relative', t.sheet, className)}>
      {grid ? <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', t.grid)} /> : null}
      <div
        aria-hidden="true"
        className={cn('ph-grain pointer-events-none absolute inset-0', t.grainLight && 'ph-grain-light')}
        style={{ '--ph-grain': grain } as CSSProperties}
      />
      <div className={cn('ph-container', containerClassName)}>
        {crop ? <CropMarks className="inset-x-[calc(clamp(20px,5vw,96px)-12px)] -inset-y-6 hidden md:block" /> : null}
        {children}
      </div>
      {after}
    </section>
  )
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn('size-4 shrink-0', className)} aria-hidden="true">
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const buttonTone = {
  blue: 'bg-[var(--ph-blue,#234ED1)] hover:bg-[#1c41b5] focus-visible:outline-[#0D121F]',
  navy: 'bg-[#0D121F] hover:bg-[#1a2233] focus-visible:outline-white',
} as const

const buttonBase =
  'ph-torn-btn inline-flex h-12 items-center gap-3 pe-6 text-[1rem] font-medium tracking-[-0.01em] whitespace-nowrap text-white no-underline transition-[background-color,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [--ph-torn-pad:1.5rem] hover:-translate-y-px hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 md:h-14'

type PaperButtonProps = {
  tone?: 'blue' | 'navy'
  /** A route; omit to make it the Book a call button. */
  to?: string
  className?: string
  children: ReactNode
}

/** The primary button: a paper sheet with a torn left edge. Blue, or navy on blue and yellow sheets. */
export function PaperButton({ tone = 'blue', to, className, children }: PaperButtonProps) {
  const classes = cn(buttonBase, buttonTone[tone], className)
  const content = (
    <>
      {children}
      <Arrow />
    </>
  )
  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    )
  }
  return <BookCallLink className={classes}>{content}</BookCallLink>
}

type PaperLinkProps = {
  to?: string
  href?: string
  /** Goes wherever Book a call goes (the booking page, or /contact). */
  bookCall?: boolean
  className?: string
  children: ReactNode
}

/** The secondary button: text, an arrow, and an underline that draws in. */
export function PaperLink({ to, href, bookCall, className, children }: PaperLinkProps) {
  const classes = cn('ph-link text-[1rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current', className)
  const content = (
    <>
      {children}
      <Arrow />
    </>
  )
  if (bookCall) return <BookCallLink className={classes}>{content}</BookCallLink>
  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    )
  }
  return (
    <a href={href} className={classes}>
      {content}
    </a>
  )
}
