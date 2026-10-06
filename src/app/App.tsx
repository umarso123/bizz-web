import { AppRouter } from '@/app/router.tsx'
import { SmoothScroll } from '@/components/motion/SmoothScroll.tsx'

export function App() {
  return (
    <SmoothScroll>
      <AppRouter />
    </SmoothScroll>
  )
}
