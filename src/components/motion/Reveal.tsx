import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn.ts'

/*
 * Scroll reveals without a motion library: CSS transitions (base.css, .reveal)
 * switched on by one shared IntersectionObserver. Works on every page.
 */

type Variant = 'rise' | 'fade' | 'clip' | 'draw' | 'panel'

const callbacks = new Map<Element, () => void>()
let observer: IntersectionObserver | null = null

function observe(element: Element, onEnter: () => void) {
  if (typeof IntersectionObserver === 'undefined') {
    onEnter()
    return () => {}
  }
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        callbacks.get(entry.target)?.()
        callbacks.delete(entry.target)
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  )
  callbacks.set(element, onEnter)
  observer.observe(element)
  return () => {
    callbacks.delete(element)
    observer?.unobserve(element)
  }
}

/** Becomes true once the element has been seen; never goes back. */
export function useRevealed<T extends Element>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || seen) return
    return observe(element, () => setSeen(true))
  }, [seen])

  return [ref, seen] as const
}

type RevealTag = 'div' | 'span' | 'li' | 'p' | 'figure' | 'article' | 'section' | 'ul' | 'ol'

type RevealProps = {
  as?: RevealTag
  variant?: Variant
  /** Delay in milliseconds, for staggering siblings. */
  delay?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
} & Record<`aria-${string}`, string | boolean | undefined>

export function Reveal({ as = 'div', variant = 'rise', delay = 0, className, style, children, ...rest }: RevealProps) {
  const [ref, seen] = useRevealed<HTMLElement>()
  return createElement(
    as,
    {
      ...rest,
      ref,
      className: cn('reveal', className),
      'data-variant': variant,
      'data-inview': seen ? 'true' : 'false',
      style: { ...style, '--reveal-delay': `${delay}ms` } as CSSProperties,
    },
    children,
  )
}

/**
 * Whole lines rising out of a mask, 80 ms apart. Lines are given explicitly so
 * the breaks stay balanced at every width.
 */
export function RevealLines({ lines, delay = 0, stagger = 80, className }: { lines: ReactNode[]; delay?: number; stagger?: number; className?: string }) {
  const [ref, seen] = useRevealed<HTMLSpanElement>()
  return (
    <span ref={ref} data-inview={seen ? 'true' : 'false'} className={cn('block', className)}>
      {lines.map((line, index) => (
        <span key={index} className="reveal-line">
          <span style={{ '--reveal-delay': `${delay + index * stagger}ms` } as CSSProperties}>{line}</span>
        </span>
      ))}
    </span>
  )
}

/** A number that counts up from 0 once it comes into view. */
export function CountUp({ value, duration = 1400, className }: { value: number; duration?: number; className?: string }) {
  const [ref, seen] = useRevealed<HTMLSpanElement>()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!seen) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setShown(Math.round(value * eased))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [seen, value, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)} aria-label={String(value)}>
      {shown}
    </span>
  )
}

type RevealTextProps = {
  text: string
  /** Delay before the first word, in milliseconds. */
  delay?: number
  /** Gap between words, in milliseconds. */
  stagger?: number
  className?: string
}

/**
 * Words rise out of a mask, one after another. Screen readers get the plain
 * sentence; the split words are hidden from them.
 */
export function RevealText({ text, delay = 0, stagger = 45, className }: RevealTextProps) {
  const [ref, seen] = useRevealed<HTMLSpanElement>()
  const words = text.split(' ')
  return (
    <span ref={ref} data-inview={seen ? 'true' : 'false'} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word}-${index}`}>
            <span className="reveal-word">
              <span style={{ '--reveal-delay': `${delay + index * stagger}ms` } as CSSProperties}>{word}</span>
            </span>
            {index < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </span>
  )
}
