import type { MotionValue } from 'framer-motion'
import { Desk } from '@/sections/home/laptop-zoom/Desk.tsx'
import { Laptop } from '@/sections/home/laptop-zoom/Laptop.tsx'

type WorkspaceSceneProps = {
  screenRef?: React.RefObject<HTMLDivElement | null>
  bezelOpacity: MotionValue<number>
  baseOpacity: MotionValue<number>
  screenRadius: MotionValue<number>
  deskOpacity: MotionValue<number>
  living?: boolean
  className?: string
}

/**
 * Laptop + desk only — sharp HTML/CSS product UI, no illustration.
 */
export function WorkspaceScene({
  screenRef,
  bezelOpacity,
  baseOpacity,
  screenRadius,
  deskOpacity,
  living = true,
  className,
}: WorkspaceSceneProps) {
  return (
    <div className={className}>
      <div className="relative mx-auto w-full max-w-[40rem]">
        <div className="relative z-20">
          <Laptop
            screenRef={screenRef}
            bezelOpacity={bezelOpacity}
            baseOpacity={baseOpacity}
            screenRadius={screenRadius}
            living={living}
          />
        </div>

        <div className="relative z-10 -mt-px">
          <Desk opacity={deskOpacity} />
        </div>
      </div>
    </div>
  )
}
