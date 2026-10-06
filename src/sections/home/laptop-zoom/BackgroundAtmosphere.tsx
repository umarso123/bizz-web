import { m, useTransform, type MotionValue } from 'framer-motion'

/**
 * Soft atmosphere + orange continuity line that later enters the product story.
 */
export function BackgroundAtmosphere({
  progress,
  reduced,
  pointerX,
}: {
  progress: MotionValue<number>
  reduced: boolean
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
}) {
  const lineDraw = useTransform(progress, [0, 0.4, 0.75, 1], reduced ? [1, 1, 1, 1] : [0.35, 0.7, 1, 0.85])
  const lineY = useTransform(progress, [0, 0.55, 0.9], reduced ? [0, 0, 0] : [0, -40, -120])
  const decorX = useTransform(pointerX, (v) => v * 0.35)

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <m.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ y: lineY }}
      >
        <defs>
          <linearGradient id="lz-orange-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F66C2A" stopOpacity="0" />
            <stop offset="30%" stopColor="#F66C2A" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#F66C2A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F66C2A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lz-blue-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0A8FD8" stopOpacity="0" />
            <stop offset="45%" stopColor="#0A8FD8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0A8FD8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <m.path
          d="M-80 620 C 220 500, 480 720, 780 560 S 1180 400, 1560 520"
          fill="none"
          stroke="url(#lz-orange-line)"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ pathLength: lineDraw, x: decorX }}
        />
        <m.path
          d="M-40 560 C 260 460, 520 640, 820 500 S 1220 360, 1540 460"
          fill="none"
          stroke="url(#lz-blue-line)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity={0.7}
          style={{ pathLength: lineDraw }}
        />
        {[
          [220, 540],
          [480, 600],
          [760, 520],
          [1040, 460],
          [1280, 500],
        ].map(([cx, cy], i) => (
          <m.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={2.5}
            fill={i % 2 === 0 ? '#F66C2A' : '#0A8FD8'}
            animate={reduced ? undefined : { opacity: [0.35, 0.9, 0.35] }}
            transition={
              reduced ? undefined : { duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        ))}
      </m.svg>
    </div>
  )
}
