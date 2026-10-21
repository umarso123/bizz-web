import { useLenis } from 'lenis/react'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useContactScroll() {
  const lenis = useLenis()
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  return useCallback(
    (id: string, offset = -112, immediate = false) => {
      const target = document.getElementById(id)
      if (!target) return
      if (lenis && !reduced) {
        lenis.scrollTo(target, { offset, duration: immediate ? 0 : 1.15, immediate })
        return
      }
      const top = target.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top, behavior: reduced || immediate ? 'auto' : 'smooth' })
    },
    [lenis, reduced],
  )
}

/**
 * Brings the note form into view and puts the cursor in the first field,
 * once the scroll has settled.
 */
export function useJumpToNote() {
  const scroll = useContactScroll()
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return useCallback(() => {
    scroll('project-note-title', -128)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(
      () => {
        document.getElementById('contact-name')?.focus({ preventScroll: true })
      },
      reduced ? 0 : 720,
    )
  }, [scroll, reduced])
}
