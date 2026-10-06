import { m, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const ease = [0.2, 0, 0, 1] as const

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion() === true

  return (
    <m.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : delay, ease }}
    >
      {children}
    </m.div>
  )
}
