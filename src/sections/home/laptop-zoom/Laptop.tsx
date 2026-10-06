import { m, useTransform, type MotionValue } from 'framer-motion'
import { HealthcareProductUI } from '@/sections/home/laptop-zoom/HealthcareProductUI.tsx'

type LaptopProps = {
  screenRef?: React.RefObject<HTMLDivElement | null>
  /** 1 = full bezel visible, 0 = bezel gone */
  bezelOpacity: MotionValue<number>
  baseOpacity: MotionValue<number>
  /** px corner radius for screen */
  screenRadius: MotionValue<number>
  living?: boolean
  className?: string
}

/**
 * CSS/HTML laptop — `.screen-content` is independently transformable for zoom takeover.
 */
export function Laptop({
  screenRef,
  bezelOpacity,
  baseOpacity,
  screenRadius,
  living = true,
  className,
}: LaptopProps) {
  const bezelPad = useTransform(bezelOpacity, [0, 1], ['0.15%', '1.9%'])
  const notchOpacity = bezelOpacity

  return (
    <div className={className} style={{ perspective: '1200px' }}>
      <div className="laptop relative w-full" style={{ transformStyle: 'preserve-3d' }}>
        <div className="laptop-screen relative mx-auto w-[92%]">
          <m.div
            className="screen-bezel relative overflow-hidden border border-[#2A3540] bg-[#1A222A] shadow-[0_22px_55px_rgb(23_33_43_/_0.24)]"
            style={{
              borderRadius: screenRadius,
              padding: bezelPad,
            }}
          >
            <m.div
              className="mx-auto mb-[1%] h-[3px] w-[11%] rounded-full bg-[#3A4652]"
              style={{ opacity: notchOpacity }}
            />
            <div
              ref={screenRef}
              className="screen-content relative aspect-[16/10] w-full overflow-hidden bg-white"
              style={{ borderRadius: 4 }}
            >
              <HealthcareProductUI living={living} />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(125deg, rgb(255 255 255 / 0.16), transparent 40%, transparent 60%, rgb(10 143 216 / 0.05))',
                }}
                aria-hidden="true"
              />
            </div>
          </m.div>
        </div>

        <m.div
          className="relative z-[1] mx-auto -mt-px h-[5px] w-[94%] rounded-sm bg-gradient-to-b from-[#3A4652] to-[#1A222A]"
          style={{ opacity: baseOpacity }}
        />

        <m.div className="laptop-base relative mx-auto w-full" style={{ opacity: baseOpacity }}>
          <div className="h-[11px] w-full rounded-b-[11px] bg-gradient-to-b from-[#2A3540] via-[#1C252E] to-[#12181F] shadow-[0_14px_30px_rgb(23_33_43_/_0.22)]" />
          <div className="absolute inset-x-[20%] top-[3px] h-[2px] rounded-full bg-[#0A8FD8]/30" />
        </m.div>
      </div>
    </div>
  )
}
