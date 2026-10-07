import { useEffect, useRef } from 'react'

export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      const x = event.clientX - (rect.left + rect.width / 2)
      const y = event.clientY - (rect.top + rect.height / 2)
      const reach = Math.max(rect.width, rect.height) * 0.85
      if (Math.hypot(x, y) > reach) {
        node.style.transform = 'translate3d(0, 0, 0)'
        return
      }
      node.style.transform = `translate3d(${(x * strength).toFixed(2)}px, ${(y * strength).toFixed(2)}px, 0)`
    }

    const onLeave = () => {
      node.style.transform = 'translate3d(0, 0, 0)'
    }

    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerleave', onLeave)
    return () => {
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
      node.style.transform = ''
    }
  }, [strength])

  return ref
}
