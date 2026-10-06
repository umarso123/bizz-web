import { m } from 'framer-motion'
import { productVisual } from '@/sections/home/laptop-zoom/config.ts'

/**
 * Conceptual digital-health UI — placeholder only.
 * Replace by setting productVisual.mode = "image" and productVisual.image.
 */
export function HealthcareProductUI({ living = true }: { living?: boolean }) {
  if (productVisual.mode === 'image' && productVisual.image) {
    return (
      <img
        src={productVisual.image}
        alt="Digital product interface"
        className="h-full w-full object-cover object-top"
        draggable={false}
      />
    )
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#F8FAFC] text-[#17212B]">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#E4E9ED] bg-white px-3 py-2 md:px-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-[2px] rounded-full bg-[#F66C2A]" />
          <span className="text-[0.55rem] font-semibold tracking-[-0.02em] md:text-[0.65rem]">
            Care workspace
          </span>
        </div>
        <div className="flex gap-1.5">
          <span className="size-1.5 rounded-full bg-[#0A8FD8]/40" />
          <span className="size-1.5 rounded-full bg-[#F66C2A]/50" />
          <span className="size-1.5 rounded-full bg-[#CBD4DB]" />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[0.28fr_1fr] gap-0">
        {/* Nav */}
        <aside className="border-r border-[#E4E9ED] bg-white px-2 py-2.5 md:px-3 md:py-3">
          <p className="text-[0.45rem] font-semibold tracking-[0.08em] text-[#67737E] uppercase md:text-[0.5rem]">
            Navigate
          </p>
          <ul className="mt-2 space-y-1">
            {['Overview', 'Care plan', 'Activity', 'Providers'].map((item, i) => (
              <li
                key={item}
                className={`rounded-md px-1.5 py-1 text-[0.5rem] font-medium md:text-[0.58rem] ${
                  i === 0 ? 'bg-[#EAF6FC] text-[#087BB9]' : 'text-[#4B5965]'
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <div className="min-h-0 overflow-hidden p-2 md:p-3">
          <div className="mb-2 flex items-end justify-between gap-2">
            <div>
              <p className="text-[0.45rem] font-semibold tracking-[0.06em] text-[#0A8FD8] uppercase md:text-[0.5rem]">
                Patient overview
              </p>
              <p className="mt-0.5 text-[0.7rem] font-semibold tracking-[-0.02em] md:text-[0.85rem]">
                Care summary
              </p>
            </div>
            <span className="rounded-full bg-[#EDF8F2] px-1.5 py-0.5 text-[0.45rem] font-semibold text-[#247F5A] md:text-[0.5rem]">
              Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 md:gap-2">
            <Panel title="Upcoming appointment" delay={0} living={living}>
              <div className="mt-1 h-1.5 w-3/5 rounded-full bg-[#0A8FD8]/25" />
              <div className="mt-1 h-1.5 w-2/5 rounded-full bg-[#E4E9ED]" />
            </Panel>
            <Panel title="Care plan" delay={0.15} living={living}>
              <div className="mt-1.5 flex gap-1">
                <span className="h-4 flex-1 rounded bg-[#EAF6FC]" />
                <span className="h-4 flex-1 rounded bg-[#FFF4EE]" />
                <span className="h-4 flex-1 rounded bg-[#EAF6FC]" />
              </div>
            </Panel>
            <Panel title="Recent activity" delay={0.25} living={living}>
              <div className="mt-1 space-y-1">
                <div className="h-1 w-full rounded-full bg-[#E4E9ED]" />
                <div className="h-1 w-4/5 rounded-full bg-[#E4E9ED]" />
                <div className="h-1 w-3/5 rounded-full bg-[#F66C2A]/30" />
              </div>
            </Panel>
            <Panel title="Connected provider" delay={0.35} living={living}>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="size-4 rounded-full bg-[#0A8FD8]/20" />
                <div className="flex-1">
                  <div className="h-1.5 w-3/4 rounded-full bg-[#CBD4DB]" />
                  <div className="mt-1 h-1 w-1/2 rounded-full bg-[#E4E9ED]" />
                </div>
              </div>
            </Panel>
          </div>

          {/* Tiny chart */}
          <div className="mt-2 rounded-lg border border-[#E4E9ED] bg-white p-2">
            <p className="text-[0.45rem] font-semibold text-[#67737E] md:text-[0.5rem]">Health information</p>
            <svg viewBox="0 0 200 36" className="mt-1 h-7 w-full" aria-hidden="true">
              <m.path
                d="M0 28 C 20 26, 30 18, 45 20 S 70 30, 90 16 S 120 8, 140 18 S 170 28, 200 12"
                fill="none"
                stroke="#0A8FD8"
                strokeWidth="1.6"
                strokeLinecap="round"
                animate={living ? { pathLength: [0.7, 1, 0.7] } : undefined}
                transition={living ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : undefined}
              />
              <m.path
                d="M0 30 C 25 28, 40 24, 60 26 S 95 20, 120 22 S 160 14, 200 20"
                fill="none"
                stroke="#F66C2A"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity={0.7}
                animate={living ? { pathLength: [0.6, 1, 0.6] } : undefined}
                transition={
                  living ? { duration: 5, delay: 0.4, repeat: Infinity, ease: 'easeInOut' } : undefined
                }
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

function Panel({
  title,
  children,
  delay,
  living,
}: {
  title: string
  children: React.ReactNode
  delay: number
  living: boolean
}) {
  return (
    <m.div
      className="rounded-lg border border-[#E4E9ED] bg-white p-1.5 md:p-2"
      animate={living ? { y: [0, -1.5, 0] } : undefined}
      transition={living ? { duration: 3.6, delay, repeat: Infinity, ease: 'easeInOut' } : undefined}
    >
      <p className="text-[0.45rem] font-semibold text-[#4B5965] md:text-[0.52rem]">{title}</p>
      {children}
    </m.div>
  )
}
