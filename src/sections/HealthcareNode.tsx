import { m, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import { ecosystemPoint } from '@/sections/ecosystemGeometry.ts'

const blue = '#0A8FD8'
const orange = '#F66C2A'
const ease = [0.2, 0, 0, 1] as const

type HealthcareNodeProps = {
  phase: MotionValue<number>
  angle: number
  orbit: number
  accent?: boolean
  label?: string
  reveal?: number
}

export function HealthcareNode({ phase, angle, orbit, accent = false, label, reveal = 0 }: HealthcareNodeProps) {
  const reduced = useReducedMotion() === true
  const cx = useTransform(phase, (value) => ecosystemPoint(angle, orbit, value).x)
  const cy = useTransform(phase, (value) => ecosystemPoint(angle, orbit, value).y)
  const labelOpacity = useTransform(phase, [0.16, 0.28, 0.5, 0.64], [0, 1, 1, 0])
  const side = Math.cos(angle) >= 0 ? 1 : -1
  const color = accent ? orange : blue

  return (
    <m.g style={{ x: cx, y: cy }}>
      {accent ? (
        <m.circle
          r={11}
          fill="none"
          stroke={orange}
          strokeWidth={1}
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? { opacity: 0.45 } : { opacity: [0.2, 0.55, 0.2] }}
          transition={reduced ? { duration: 0 } : { duration: 3.6, delay: 0.8 + reveal, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : null}
      <m.circle
        r={accent ? 5 : 3.5}
        fill={color}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.45 + reveal, ease }}
      />
      {label ? (
        <m.text
          x={side > 0 ? 12 : -12}
          y={4}
          textAnchor={side > 0 ? 'start' : 'end'}
          fill="#17212B"
          fontSize={label.length > 12 ? 11 : 12}
          fontWeight={500}
          style={{ opacity: labelOpacity }}
        >
          {label}
        </m.text>
      ) : null}
    </m.g>
  )
}
