import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn.ts'

/**
 * Moves its content a few pixels against the scroll, so large visuals feel
 * set slightly behind the page. Needs a LazyMotion ancestor (the homepage has one).
 */
export function Parallax({ children, amount = 36, className }: { children: ReactNode; amount?: number; className?: string }) {
  const reduced = useReducedMotion() === true
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <m.div className="h-full w-full" style={reduced ? undefined : { y }}>
        {children}
      </m.div>
    </div>
  )
}
