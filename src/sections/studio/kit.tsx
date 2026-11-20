import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import { BookCallLink } from '@/components/ui/BookCallLink.tsx'
import type { Sticker as StickerData } from '@/data/studio-home.ts'
import { cn } from '@/lib/cn.ts'

/*
 * The studio homepage's shared pieces: stickers, the pill button, the round
 * arrow, and display text split into characters. Styles: styles/studio-home.css.
 */

/** Two arrows in one: hovering the parent sends one out and brings the other in. */
export function ArrowPair() {
  const arrow = (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="sh-arrow">
      <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  return (
    <>
      {arrow}
      {arrow}
    </>
  )
}

export function RoundArrow({ size, className }: { size?: string; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('sh-round', className)} style={size ? ({ '--size': size } as CSSProperties) : undefined}>
      <ArrowPair />
    </span>
  )
}

type PillProps = {
  children: ReactNode
  /** A route; omit to make it the Book a call button. */
  to?: string
  tone?: 'ink' | 'light'
  size?: 'md' | 'lg'
  className?: string
}

/** The one primary button: a navy pill with a blue arrow disc on its end. */
export function PillButton({ children, to, tone = 'ink', size = 'md', className }: PillProps) {
  const props = {
    className: cn('sh-btn', className),
    'data-tone': tone === 'light' ? 'light' : undefined,
    'data-size': size === 'lg' ? 'lg' : undefined,
  }
  const content = (
    <>
      <span>{children}</span>
      <span aria-hidden="true" className="sh-btn-dot">
        <ArrowPair />
      </span>
    </>
  )
  if (to) {
    return (
      <Link to={to} {...props}>
        {content}
      </Link>
    )
  }
  return <BookCallLink {...props}>{content}</BookCallLink>
}

/** A rotated pill, absolutely placed in its frame. Decorative: the words are also said elsewhere or are flavour. */
export function Sticker({ sticker, className, style }: { sticker: StickerData; className?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      data-tone={sticker.tone}
      className={cn('sh-sticker', className)}
      style={{ ...sticker.at, '--r': `${sticker.rotate}deg`, ...style } as CSSProperties}
    >
      {sticker.text}
    </span>
  )
}

/**
 * Display text split into characters (aria-hidden; pass the readable text to the
 * parent). `mask` wraps each character in an overflow mask so it can rise in.
 */
export function SplitChars({ text, mask = false, className }: { text: string; mask?: boolean; className?: string }) {
  const words = text.split(' ')
  let n = 0
  return (
    <span aria-hidden="true" className={cn('sh-chars', className)}>
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch) => {
            const i = n++
            const style = { '--ci': i, '--cr': `${i % 2 ? 4 : -4}deg` } as CSSProperties
            return mask ? (
              <span key={i} className="sh-char-mask">
                <span className="sh-char" style={style}>
                  {ch}
                </span>
              </span>
            ) : (
              <span key={i} className="sh-char" style={style}>
                {ch}
              </span>
            )
          })}
          {wi < words.length - 1 ? <span className="inline-block w-[0.22em]" /> : null}
        </span>
      ))}
    </span>
  )
}

