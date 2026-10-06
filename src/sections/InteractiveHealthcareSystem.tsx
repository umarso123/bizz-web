import { animate, m, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { AnimatedConnection } from '@/sections/AnimatedConnection.tsx'
import { ecosystemCenter } from '@/sections/ecosystemGeometry.ts'
import { HealthcareNode } from '@/sections/HealthcareNode.tsx'

const blue = '#0A8FD8'
const orange = '#F66C2A'
const ease = [0.2, 0, 0, 1] as const

const states = ['Healthcare Intelligence', 'Digital Health Platform', 'Connected Care Experience'] as const
const lensTargets = [0.08, 0.4, 0.72] as const

const nodes = [
  { angle: -0.7, orbit: 176, label: 'FHIR', accent: false },
  { angle: 0.45, orbit: 194, label: 'Data', accent: false },
  { angle: 2.2, orbit: 220, label: 'Cloud', accent: true },
  { angle: 3.55, orbit: 184, label: 'Patient experience', accent: false },
  { angle: 1.25, orbit: 122, accent: true },
  { angle: 4.3, orbit: 134, accent: false },
  { angle: 2.85, orbit: 242, accent: false },
  { angle: 5.3, orbit: 104, accent: true },
] as const

const particles = [
  { left: '18%', top: '22%', delay: 0 },
  { left: '72%', top: '16%', delay: 0.4 },
  { left: '84%', top: '48%', delay: 0.8 },
  { left: '12%', top: '62%', delay: 0.2 },
  { left: '64%', top: '78%', delay: 0.6 },
  { left: '40%', top: '12%', delay: 1 },
  { left: '28%', top: '80%', delay: 0.3 },
  { left: '90%', top: '70%', delay: 0.9 },
] as const

type InteractiveHealthcareSystemProps = {
  progress: MotionValue<number>
}

export function InteractiveHealthcareSystem({ progress }: InteractiveHealthcareSystemProps) {
  const reduced = useReducedMotion() === true
  const lensPhase = useMotionValue<number>(lensTargets[0])
  const draw = useMotionValue(reduced ? 1 : 0)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const lensRef = useRef(0)
  const [active, setActive] = useState(0)

  const phase = useTransform(() => {
    const scroll = progress.get()
    const lens = lensPhase.get()
    if (scroll < 0.08) return lens
    return scroll
  })
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], reduced ? [0, 0] : [-8, 8]), {
    stiffness: 70,
    damping: 18,
  })
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], reduced ? [0, 0] : [6, -6]), {
    stiffness: 70,
    damping: 18,
  })
  const ringScale = useTransform(phase, [0, 1], [0.94, 1.16])
  const orbitOpacity = useTransform(phase, [0, 0.55, 0.9], [1, 0.85, 0.4])
  const platformOpacity = useTransform(phase, [0.26, 0.36, 0.5, 0.62], [0, 1, 1, 0])
  const careOpacity = useTransform(phase, [0.6, 0.74, 1], [0, 1, 1])
  const coreLabel = useTransform(phase, [0.16, 0.28, 0.5, 0.64], [0, 1, 1, 0])

  useMotionValueEvent(phase, 'change', (value) => {
    setActive(value < 0.28 ? 0 : value < 0.6 ? 1 : 2)
  })

  useEffect(() => {
    if (reduced) return
    const controls = animate(draw, 1, { duration: 1.35, delay: 0.4, ease })
    return () => controls.stop()
  }, [draw, reduced])

  function explore() {
    const next = (lensRef.current + 1) % states.length
    lensRef.current = next
    void animate(lensPhase, lensTargets[next], { duration: reduced ? 0 : 0.8, ease })
  }

  return (
    <button
      type="button"
      className="relative block w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left"
      aria-label={`${states[active]}. Show ${states[(active + 1) % states.length]}`}
      onClick={explore}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5)
        pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5)
      }}
      onMouseLeave={() => {
        pointerX.set(0)
        pointerY.set(0)
      }}
    >
      <m.div className="relative aspect-square w-full [perspective:1100px]" style={{ rotateX, rotateY }}>
        {particles.map((particle) => (
          <m.span
            key={`${particle.left}-${particle.top}`}
            className="absolute size-1 rounded-full bg-[#0A8FD8]"
            style={{ left: particle.left, top: particle.top }}
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? { opacity: 0.45 } : { opacity: [0.15, 0.55, 0.15], y: [0, -10, 0] }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 7 + particle.delay, delay: 0.9 + particle.delay, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        ))}
        <svg viewBox="0 0 640 760" className="absolute inset-0 h-full w-full overflow-visible">
          <m.g style={{ opacity: orbitOpacity, scale: ringScale, transformOrigin: '320px 368px' }}>
            <ellipse cx={ecosystemCenter.x} cy={ecosystemCenter.y} rx={148} ry={96} fill="none" stroke={blue} strokeWidth={1} opacity={0.28} />
            <ellipse cx={ecosystemCenter.x} cy={ecosystemCenter.y} rx={214} ry={140} fill="none" stroke={blue} strokeWidth={1} opacity={0.2} />
            <ellipse cx={ecosystemCenter.x} cy={ecosystemCenter.y} rx={276} ry={180} fill="none" stroke={blue} strokeWidth={1} opacity={0.14} />
          </m.g>
          {nodes.map((node) => (
            <AnimatedConnection
              key={`${node.angle}-${node.orbit}`}
              phase={phase}
              angle={node.angle}
              orbit={node.orbit}
              draw={draw}
              accent={'accent' in node && node.accent}
            />
          ))}
          <m.g style={{ opacity: platformOpacity }}>
            <rect x={168} y={250} width={304} height={236} rx={22} fill="rgb(10 143 216 / 0.04)" stroke={blue} strokeWidth={1} />
            <rect x={188} y={278} width={264} height={56} rx={12} fill="white" stroke={blue} strokeOpacity={0.45} />
            <rect x={188} y={348} width={264} height={56} rx={12} fill="white" stroke={blue} strokeOpacity={0.45} />
            <rect x={188} y={418} width={176} height={40} rx={12} fill="white" stroke={orange} strokeOpacity={0.7} />
          </m.g>
          <m.g style={{ opacity: careOpacity }}>
            <rect x={438} y={176} width={118} height={228} rx={26} fill="white" stroke={blue} strokeWidth={1.25} />
            <rect x={474} y={190} width={46} height={5} rx={2.5} fill={blue} opacity={0.35} />
            <rect x={132} y={246} width={248} height={40} rx={12} fill="white" stroke={blue} />
            <rect x={148} y={470} width={236} height={40} rx={12} fill="white" stroke={orange} />
            <text x={150} y={271} fill="#17212B" fontSize={12} fontWeight={500}>
              Provider workflow
            </text>
            <text x={166} y={495} fill="#17212B" fontSize={12} fontWeight={500}>
              Patient experience
            </text>
          </m.g>
          {nodes.map((node, index) => (
            <HealthcareNode
              key={`${node.angle}-${node.orbit}`}
              phase={phase}
              angle={node.angle}
              orbit={node.orbit}
              accent={'accent' in node && node.accent}
              label={'label' in node ? node.label : undefined}
              reveal={index * 0.06}
            />
          ))}
          <m.g
            initial={reduced ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.3, ease }}
            style={{ transformOrigin: '320px 368px' }}
          >
            <circle cx={ecosystemCenter.x} cy={ecosystemCenter.y} r={34} fill="rgb(246 108 42 / 0.12)" />
            <circle cx={ecosystemCenter.x} cy={ecosystemCenter.y} r={17} fill={orange} />
            <circle cx={ecosystemCenter.x} cy={ecosystemCenter.y} r={6} fill="white" />
            <m.text
              x={ecosystemCenter.x}
              y={ecosystemCenter.y - 40}
              textAnchor="middle"
              fill="#17212B"
              fontSize={12}
              fontWeight={500}
              style={{ opacity: coreLabel }}
            >
              AI
            </m.text>
          </m.g>
        </svg>
      </m.div>
      <span className="mt-3 flex items-center gap-3 text-caption text-text-muted" aria-live="polite">
        {states[active]}
        <span className="flex gap-1.5" aria-hidden="true">
          {states.map((name, index) => (
            <span key={name} className={index === active ? 'h-px w-5 bg-[#F66C2A]' : 'h-px w-5 bg-[#0A8FD8]/35'} />
          ))}
        </span>
      </span>
    </button>
  )
}
