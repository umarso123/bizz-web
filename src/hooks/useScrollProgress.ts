import { useEffect, useRef } from 'react'

type Options = {
  /** Viewport fraction where progress starts (element top), 0 at the top, 1 at the bottom. */
  start?: number
  /** Viewport fraction the element's bottom must reach for progress to hit 1. */
  end?: number
}

/**
 * Scroll progress of an element through the viewport, written to `--p` (0 to 1)
 * on the element itself, so CSS can do the rest. Progress follows the scroll
 * both ways and never holds the page. Reduced motion jumps straight to 1.
 */
export function useScrollProgress<T extends HTMLElement>({ start = 0.9, end = 0.45 }: Options = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.style.setProperty('--p', '1')
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const box = element.getBoundingClientRect()
      const vh = window.innerHeight
      const from = vh * start
      const to = vh * end - box.height
      const p = Math.min(1, Math.max(0, (from - box.top) / (from - to)))
      element.style.setProperty('--p', p.toFixed(4))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [start, end])

  return ref
}
