import { m, useTransform, type MotionValue } from 'framer-motion'

const blue = '#0A8FD8'
const orange = '#F66C2A'

type CareDeviceProps = {
  progress: MotionValue<number>
  cinematic: boolean
}

export function CareDevice({ progress, cinematic }: CareDeviceProps) {
  const y = useTransform(progress, [0, 0.26], cinematic ? [-120, 0] : [0, 0])
  const scale = useTransform(progress, [0, 0.26, 1], cinematic ? [0.86, 1, 1.04] : [1, 1, 1])
  const app = useTransform(progress, [0, 0.14], cinematic ? [0.55, 1] : [1, 1])
  const layers = useTransform(progress, [0.28, 0.48], cinematic ? [0, 1] : [1, 1])
  const layerY = useTransform(progress, [0.28, 1], cinematic ? [28, -12] : [0, 0])
  const ecosystem = useTransform(progress, [0.56, 0.8], cinematic ? [0, 1] : [1, 1])
  const draw = useTransform(progress, [0.56, 0.84], cinematic ? [0, 1] : [1, 1])

  return (
    <m.div className="relative mx-auto h-[34rem] w-full max-w-[34rem]" style={{ y, scale }} aria-hidden="true">
      <svg viewBox="0 0 560 640" className="absolute inset-0 h-full w-full overflow-visible">
        <m.g style={{ opacity: ecosystem }}>
          <m.path
            d="M120 180C180 150 230 210 278 250"
            fill="none"
            stroke={blue}
            strokeWidth="1.2"
            strokeLinecap="round"
            style={{ pathLength: draw }}
          />
          <m.path
            d="M150 430C210 400 250 360 286 330"
            fill="none"
            stroke={orange}
            strokeWidth="1.2"
            strokeLinecap="round"
            style={{ pathLength: draw }}
          />
          <m.path
            d="M430 160C390 200 360 240 332 270"
            fill="none"
            stroke={blue}
            strokeWidth="1.2"
            strokeLinecap="round"
            style={{ pathLength: draw }}
          />
          <circle cx="112" cy="168" r="4" fill={blue} />
          <circle cx="142" cy="444" r="4" fill={orange} />
          <circle cx="438" cy="150" r="4" fill={blue} />
        </m.g>
      </svg>
      <m.div
        className="absolute top-[16%] left-[4%] w-40 rounded-lg border border-border-strong bg-surface px-3 py-2.5 shadow-sm"
        style={{ opacity: layers, y: layerY }}
      >
        <p className="text-caption text-text">Provider workflow</p>
        <span className="mt-2 block h-1 w-16 rounded-full bg-[#0A8FD8]/70" />
      </m.div>
      <m.div
        className="absolute top-[58%] left-[2%] w-44 rounded-lg border border-border-strong bg-surface px-3 py-2.5 shadow-sm"
        style={{ opacity: layers, y: layerY }}
      >
        <p className="text-caption text-text">Healthcare platform</p>
        <span className="mt-2 block h-1 w-20 rounded-full bg-[#0A8FD8]/40" />
      </m.div>
      <m.div
        className="absolute top-[12%] right-[6%] rounded-lg border border-[#F66C2A]/40 bg-surface px-3 py-2 shadow-sm"
        style={{ opacity: layers, y: layerY }}
      >
        <p className="text-caption text-text">AI intelligence</p>
        <span className="mt-2 block size-1.5 rounded-full bg-[#F66C2A]" />
      </m.div>
      <m.div
        className="absolute top-1/2 left-1/2 w-[15.5rem] -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: app }}
      >
        <div className="rounded-[1.75rem] border border-border-strong bg-surface p-2 shadow-sm">
          <div className="overflow-hidden rounded-[1.35rem] bg-bg-subtle">
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <span className="h-1 w-10 rounded-full bg-border-strong" />
              <span className="size-1.5 rounded-full bg-[#F66C2A]" />
            </div>
            <div className="px-4 pb-4">
              <p className="text-caption text-text-muted">Today</p>
              <p className="mt-1 text-[1.05rem] font-medium tracking-[-0.02em] text-text">Morning care</p>
              <div className="mt-4 rounded-lg bg-surface px-3 py-3">
                <p className="text-caption text-text">Visit with your clinician</p>
                <span className="mt-2 block h-1 w-24 rounded-full bg-[#0A8FD8]" />
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
                  <span className="text-caption text-text">Labs</span>
                  <span className="h-1 w-8 rounded-full bg-[#0A8FD8]/50" />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
                  <span className="text-caption text-text">Messages</span>
                  <span className="h-1 w-6 rounded-full bg-[#0A8FD8]/35" />
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-[#F66C2A]/35 bg-surface px-3 py-2">
                <p className="text-caption text-text">AI summary ready</p>
              </div>
            </div>
          </div>
        </div>
      </m.div>
    </m.div>
  )
}
