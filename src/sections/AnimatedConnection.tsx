import { m, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import { ecosystemCenter, ecosystemPoint } from '@/sections/ecosystemGeometry.ts'

const blue = '#0A8FD8'
const orange = '#F66C2A'

type AnimatedConnectionProps = {
  phase: MotionValue<number>
  angle: number
  orbit: number
  draw: MotionValue<number>
  accent?: boolean
}

export function AnimatedConnection({ phase, angle, orbit, draw, accent = false }: AnimatedConnectionProps) {
  const reduced = useReducedMotion() === true
  const d = useTransform(phase, (value) => {
    const { x, y } = ecosystemPoint(angle, orbit, value)
    const bend = (y - ecosystemCenter.y) * 0.12
    const midX = (ecosystemCenter.x + x) / 2 + bend
    const midY = (ecosystemCenter.y + y) / 2 - 16
    return `M${ecosystemCenter.x} ${ecosystemCenter.y} Q${midX} ${midY} ${x} ${y}`
  })
  const opacity = useTransform(phase, [0, 0.7, 1], [0.85, 0.7, 0.28])

  return (
    <g>
      <m.path
        d={d}
        fill="none"
        stroke={accent ? orange : blue}
        strokeWidth={accent ? 1.4 : 1.15}
        strokeLinecap="round"
        style={{ pathLength: draw, opacity }}
      />
      {accent && !reduced ? (
        <m.path
          d={d}
          fill="none"
          stroke={orange}
          strokeWidth={1.6}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="7 93"
          initial={false}
          animate={{ strokeDashoffset: [0, -100] }}
          transition={{ duration: 5.5, delay: 1.1, repeat: Infinity, ease: 'linear' }}
        />
      ) : null}
    </g>
  )
}
