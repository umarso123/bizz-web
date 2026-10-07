import { useLenis } from 'lenis/react'
import { useCallback, useState } from 'react'

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
