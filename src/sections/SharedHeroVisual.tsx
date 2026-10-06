import { animate, m, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import { useEffect } from 'react'

const blue = '#0A8FD8'
const orange = '#F66C2A'
const center = { x: 320, y: 392 }
const ease = [0.2, 0, 0, 1] as const

const nodes = [
  { angle: -1.05, orbit: 168, accent: false },
  { angle: -0.15, orbit: 198, accent: true },
  { angle: 0.72, orbit: 156, accent: false },
  { angle: 1.05, orbit: 210, accent: false },
  { angle: 2.45, orbit: 176, accent: true },
  { angle: 3.45, orbit: 188, accent: false },
  { angle: 4.45, orbit: 150, accent: false },
  { angle: 5.35, orbit: 132, accent: true },
] as const

const layers = [
  { title: 'Provider workflow', place: 'top-[36%] left-[14%]' },
  { title: 'Connected data', place: 'top-[44%] right-[14%]' },
  { title: 'Patient experience', place: 'top-[66%] left-[20%]' },
] as const

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function mix(value: number, start: number, end: number, from: number, to: number) {
  if (value <= start) return from
  if (value >= end) return to
  return from + ((value - start) / (end - start)) * (to - from)
}

function nodePosition(angle: number, orbit: number, contract: number) {
  const outerX = Math.cos(angle) * orbit
  const outerY = Math.sin(angle) * orbit * 0.62
  const innerX = Math.cos(angle) * 108
  const innerY = Math.sin(angle) * 158
  return {
    x: center.x + outerX + (innerX - outerX) * contract,
    y: center.y + outerY + (innerY - outerY) * contract,
  }
}

function lineEnd(angle: number, phone: number) {
  return {
    x: center.x + Math.cos(angle) * (14 + phone * 62),
    y: center.y + Math.sin(angle) * (14 + phone * 124),
  }
}

function StoryLink({
  progress,
  draw,
  angle,
  orbit,
  accent,
}: {
  progress: MotionValue<number>
  draw: MotionValue<number>
  angle: number
  orbit: number
  accent: boolean
}) {
  const d = useTransform(progress, (value) => {
    const contract = clamp((value - 0.16) / 0.32)
    const phone = clamp((value - 0.3) / 0.28)
    const node = nodePosition(angle, orbit, contract)
    const end = lineEnd(angle, phone)
    const midX = (node.x + end.x) / 2 + (node.y - center.y) * 0.06
    const midY = (node.y + end.y) / 2 - 12
    return `M${node.x} ${node.y} Q${midX} ${midY} ${end.x} ${end.y}`
  })
  const opacity = useTransform(() => mix(progress.get(), 0, 1, 0.9, 0.4))

  return (
    <m.path
      d={d}
      fill="none"
      stroke={accent ? orange : blue}
      strokeWidth={accent ? 1.45 : 1.15}
      strokeLinecap="round"
      style={{ pathLength: draw, opacity }}
    />
  )
}

function StoryNode({
  progress,
  angle,
  orbit,
  accent,
}: {
  progress: MotionValue<number>
  angle: number
  orbit: number
  accent: boolean
}) {
  const cx = useTransform(progress, (value) => nodePosition(angle, orbit, clamp((value - 0.16) / 0.32)).x)
  const cy = useTransform(progress, (value) => nodePosition(angle, orbit, clamp((value - 0.16) / 0.32)).y)

  return (
    <m.g style={{ x: cx, y: cy }}>
      {accent ? <circle r={10} fill="none" stroke={orange} strokeWidth={1} opacity={0.45} /> : null}
      <circle r={accent ? 4.5 : 3.25} fill={accent ? orange : blue} />
    </m.g>
  )
}

function Device() {
  return (
    <div data-device="phone" className="relative h-[14.5rem] w-[7.25rem] rounded-[1.35rem] border border-[#0A8FD8]/55 bg-white shadow-sm">
      <div className="absolute top-2 left-1/2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-[#0A8FD8]/30" />
      <div className="flex h-full flex-col justify-end gap-2 px-3 pt-8 pb-4">
        <div className="h-6 rounded-md border border-[#0A8FD8]/35" />
        <div className="h-6 rounded-md border border-[#F66C2A]/70" />
        <div className="h-12 rounded-md bg-[#0A8FD8]/10" />
      </div>
    </div>
  )
}

type SharedHeroVisualProps = {
  progress: MotionValue<number>
}

export function SharedHeroVisual({ progress }: SharedHeroVisualProps) {
  const reduced = useReducedMotion() === true
  const draw = useMotionValue(reduced ? 1 : 0)
  const coreOpacity = useTransform(() => mix(progress.get(), 0.28, 0.48, 1, 0))
  const phoneOpacity = useTransform(() => mix(progress.get(), 0.28, 0.46, 0, 1))
  const phoneScale = useTransform(() => mix(progress.get(), 0.28, 0.52, 0.12, 1))
  const sceneY = useTransform(() => mix(progress.get(), 0.48, 0.78, 0, 28))
  const labelOpacity = useTransform(() => mix(progress.get(), 0.55, 0.74, 0, 1))

  useEffect(() => {
    if (reduced) return
    const controls = animate(draw, 1, { duration: 1.3, delay: 0.35, ease })
    return () => controls.stop()
  }, [draw, reduced])

  return (
    <div className="relative h-[28rem] w-full sm:h-[32rem] lg:h-[min(40rem,calc(100svh-8rem))]" aria-hidden="true">
      <div className="absolute inset-[12%] rounded-full bg-page-brand/40" />
      <m.div className="absolute inset-0" style={{ y: sceneY }}>
      <svg viewBox="0 0 640 780" className="absolute inset-0 h-full w-full overflow-visible">
        {nodes.map((node) => (
          <StoryLink
            key={`${node.angle}-link`}
            progress={progress}
            draw={draw}
            angle={node.angle}
            orbit={node.orbit}
            accent={node.accent}
          />
        ))}
        {nodes.map((node) => (
          <StoryNode
            key={`${node.angle}-node`}
            progress={progress}
            angle={node.angle}
            orbit={node.orbit}
            accent={node.accent}
          />
        ))}
        <m.g style={{ opacity: coreOpacity }}>
          <circle cx={center.x} cy={center.y} r={26} fill="rgb(246 108 42 / 0.14)" />
          <circle cx={center.x} cy={center.y} r={12} fill={orange} />
          <circle cx={center.x} cy={center.y} r={4} fill="white" />
        </m.g>
      </svg>
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <m.div style={{ scale: phoneScale, opacity: phoneOpacity }}>
          <Device />
        </m.div>
      </div>
      {layers.map((layer) => (
        <m.p
          key={layer.title}
          className={`absolute text-[0.8125rem] font-medium text-text ${layer.place}`}
          style={{ opacity: labelOpacity }}
        >
          {layer.title}
        </m.p>
      ))}
      </m.div>
    </div>
  )
}
