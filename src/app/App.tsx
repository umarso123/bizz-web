import { AppRouter } from '@/app/router.tsx'
import { SmoothScroll } from '@/components/motion/SmoothScroll.tsx'
import { useEffect } from 'react'

export function App() {
  useEffect(() => {
    const loader = document.getElementById('initial-loader')

    if (!loader) {
      return
    }

    const exitTimer = window.setTimeout(() => {
      loader.classList.add('is-leaving')
    }, 650)
    const removeTimer = window.setTimeout(() => {
      loader.remove()
    }, 1000)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(removeTimer)
    }
  }, [])

  return (
    <SmoothScroll>
      <AppRouter />
    </SmoothScroll>
  )
}
