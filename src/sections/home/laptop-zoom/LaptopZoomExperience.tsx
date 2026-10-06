import {
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Link } from 'react-router'
import { useRef } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { useMediaQuery } from '@/sections/home/homeJourney.ts'
import { BackgroundAtmosphere } from '@/sections/home/laptop-zoom/BackgroundAtmosphere.tsx'
import { laptopZoomCopy } from '@/sections/home/laptop-zoom/config.ts'
import { HealthcareProductUI } from '@/sections/home/laptop-zoom/HealthcareProductUI.tsx'
import { WorkspaceScene } from '@/sections/home/laptop-zoom/WorkspaceScene.tsx'

/**
 * Scroll-driven laptop zoom → sharp HTML care UI fills the viewport.
 * No illustration; no empty post-zoom dead zone.
 */
export function LaptopZoomExperience() {
  const reduced = useReducedMotion() === true
  const desktop = useMediaQuery('(min-width: 1024px)')
  const tablet = useMediaQuery('(min-width: 768px)')

  if (reduced) return <ReducedLaptopZoom />
  if (!desktop) return <MobileLaptopZoom dense={tablet} />
  return <DesktopLaptopZoom />
}

function DesktopLaptopZoom() {
  const ref = useRef<HTMLElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const p = useSpring(scrollYProgress, { stiffness: 52, damping: 28, mass: 0.4 })

  const pointerRawX = useMotionValue(0)
  const pointerRawY = useMotionValue(0)
  const pointerX = useSpring(pointerRawX, { stiffness: 90, damping: 22 })
  const pointerY = useSpring(pointerRawY, { stiffness: 90, damping: 22 })

  const copyOpacity = useTransform(p, [0, 0.1, 0.28], [1, 1, 0])
  const copyY = useTransform(p, [0, 0.28], [0, -20])

  const sceneScale = useTransform(p, [0, 0.18, 0.4, 0.62], [1, 1.08, 1.7, 2.85])
  const sceneX = useTransform(p, [0, 0.25, 0.55], ['8%', '2%', '0%'])
  const sceneY = useTransform(p, [0, 0.3, 0.6], ['4%', '0%', '-6%'])

  const bezelOpacity = useTransform(p, [0.42, 0.62], [1, 0])
  const baseOpacity = useTransform(p, [0.38, 0.58], [1, 0])
  const deskOpacity = useTransform(p, [0.35, 0.55], [1, 0])
  const screenRadius = useTransform(p, [0.48, 0.72], [14, 0])

  const tiltFactor = useTransform(p, [0, 0.45, 0.65], [1, 0.3, 0])
  const rotateX = useTransform([pointerY, tiltFactor], ([y, t]: number[]) => (y / 50) * 2.5 * t)
  const rotateY = useTransform([pointerX, tiltFactor], ([x, t]: number[]) => (x / 50) * 2.5 * t)

  const fullscreenOpacity = useTransform(p, [0.58, 0.72], [0, 1])
  const sceneOpacity = useTransform(p, [0.62, 0.78], [1, 0])

  return (
    <section
      id="what-we-build"
      ref={ref}
      className="relative h-[280vh] overflow-x-clip bg-page-brand"
      aria-labelledby="laptop-zoom-title"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        pointerRawX.set(e.clientX - r.left - r.width / 2)
        pointerRawY.set(e.clientY - r.top - r.height / 2)
      }}
      onPointerLeave={() => {
        pointerRawX.set(0)
        pointerRawY.set(0)
      }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <BackgroundAtmosphere
          progress={p}
          reduced={false}
          pointerX={pointerX}
          pointerY={pointerY}
        />

        <m.div
          className="pointer-events-none absolute inset-y-0 left-0 z-20 flex w-[min(18rem,30%)] items-start sticky-section"
          style={{ opacity: copyOpacity, y: copyY }}
        >
          <Container variant="page" className="pointer-events-auto w-full pt-8">
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-[#0A8FD8] uppercase">
              {laptopZoomCopy.eyebrow}
            </p>
            <h2
              id="laptop-zoom-title"
              className="mt-3 max-w-[10ch] text-[clamp(2rem,1.3rem+2vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-[#17212B]"
            >
              {laptopZoomCopy.title}
            </h2>
          </Container>
        </m.div>

        <m.div
          className="absolute inset-0 z-10 flex items-center justify-center pt-(--header-clearance)"
          style={{ opacity: sceneOpacity }}
        >
          <m.div
            className="relative w-[min(58vw,38rem)] origin-center"
            style={{
              scale: sceneScale,
              x: sceneX,
              y: sceneY,
              rotateX,
              rotateY,
              transformPerspective: 1400,
            }}
          >
            <WorkspaceScene
              screenRef={screenRef}
              bezelOpacity={bezelOpacity}
              baseOpacity={baseOpacity}
              screenRadius={screenRadius}
              deskOpacity={deskOpacity}
              living
              className="relative"
            />
          </m.div>
        </m.div>

        <m.div
          className="absolute inset-0 z-30 overflow-hidden bg-white"
          style={{ opacity: fullscreenOpacity }}
        >
          <div className="h-full w-full overflow-auto">
            <HealthcareProductUI living />
          </div>
        </m.div>

        <div className="sr-only">
          <p>
            Conceptual digital health interface showing patient overview, upcoming appointment, care
            plan, recent activity, connected provider, and health information.
          </p>
        </div>
      </div>
    </section>
  )
}

function MobileLaptopZoom({ dense }: { dense: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 28 })
  const zero = useMotionValue(0)

  const copyOpacity = useTransform(p, [0, 0.15, 0.3], [1, 1, 0])
  const sceneScale = useTransform(p, [0, 0.25, 0.55], [1, 1.12, 2.2])
  const bezelOpacity = useTransform(p, [0.4, 0.65], [1, 0])
  const baseOpacity = useTransform(p, [0.35, 0.6], [1, 0])
  const deskOpacity = useTransform(p, [0.32, 0.58], [1, 0])
  const screenRadius = useTransform(p, [0.5, 0.75], [12, 0])
  const fullscreenOpacity = useTransform(p, [0.62, 0.78], [0, 1])
  const sceneOpacity = useTransform(p, [0.68, 0.82], [1, 0])

  return (
    <section
      id="what-we-build"
      ref={ref}
      className="relative h-[260vh] overflow-x-clip bg-page-brand"
      aria-labelledby="laptop-zoom-title"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden sticky-section">
        <BackgroundAtmosphere progress={p} reduced={false} pointerX={zero} pointerY={zero} />

        <m.div className="relative z-20 px-(--page-gutter)" style={{ opacity: copyOpacity }}>
          <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-[#0A8FD8] uppercase">
            {laptopZoomCopy.eyebrow}
          </p>
          <h2
            id="laptop-zoom-title"
            className="mt-2 max-w-[10ch] text-[clamp(1.75rem,1.2rem+1.4vw,2.25rem)] font-semibold tracking-[-0.03em] text-[#17212B]"
          >
            {laptopZoomCopy.title}
          </h2>
        </m.div>

        <m.div
          className="relative z-10 mx-auto mt-6 w-[min(90vw,26rem)]"
          style={{ scale: sceneScale, opacity: sceneOpacity }}
        >
          <WorkspaceScene
            bezelOpacity={bezelOpacity}
            baseOpacity={baseOpacity}
            screenRadius={screenRadius}
            deskOpacity={deskOpacity}
            living={dense}
            className="relative"
          />
        </m.div>

        <m.div className="absolute inset-0 z-30 bg-white" style={{ opacity: fullscreenOpacity }}>
          <HealthcareProductUI living={false} />
        </m.div>
      </div>
    </section>
  )
}

function ReducedLaptopZoom() {
  const one = useMotionValue(1)
  const radius = useMotionValue(12)

  return (
    <section
      id="what-we-build"
      className="relative overflow-hidden bg-page-brand section-y"
      aria-labelledby="laptop-zoom-title"
    >
      <Container variant="page" className="relative z-10 w-full">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-[#0A8FD8] uppercase">
              {laptopZoomCopy.eyebrow}
            </p>
            <h2
              id="laptop-zoom-title"
              className="mt-3 max-w-[10ch] text-section-title text-[#17212B]"
            >
              {laptopZoomCopy.title}
            </h2>
            <Link
              to={laptopZoomCopy.ctaTo}
              className="mt-5 inline-flex text-body-small font-semibold text-[#087BB9] underline underline-offset-[0.22em]"
            >
              {laptopZoomCopy.cta} →
            </Link>
          </div>
          <WorkspaceScene
            bezelOpacity={one}
            baseOpacity={one}
            screenRadius={radius}
            deskOpacity={one}
            living={false}
            className="relative mx-auto w-full max-w-[28rem]"
          />
        </div>
      </Container>
    </section>
  )
}
