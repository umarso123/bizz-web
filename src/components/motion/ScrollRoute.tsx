import { useEffect, useRef } from 'react'

/**
 * A thin route-blue line across the top of the window that fills as you read
 * down the page. Decorative: the scrollbar already carries the information.
 */
export function ScrollRoute() {
  const bar = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame = 0
    // The scrollable length is cached and only re-read when the page resizes.
    // Reading scrollHeight inside the scroll handler forces a layout every frame.
    let max = 1
    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    }
    const update = () => {
      frame = 0
      const progress = Math.min(1, Math.max(0, window.scrollY / max))
      if (bar.current) bar.current.style.transform = `scaleX(${progress.toFixed(4)})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const ro = new ResizeObserver(() => {
      measure()
      onScroll()
    })
    ro.observe(document.body)
    measure()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <span aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <span ref={bar} className="block h-full origin-left scale-x-0 bg-brand will-change-transform" />
    </span>
  )
}
