import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { careersCopy, heroFragments } from '@/content/careers.ts'
import { cn } from '@/lib/cn.ts'
import { useMagnetic, usePointerParallax } from '@/sections/careers/useCareerMotion.ts'

const ease = [0.2, 0, 0, 1] as const

type FragmentSpec = {
  label: (typeof heroFragments)[number]
  left: string
  top: string
  depth: number
  accent?: boolean
  rotate: number
  size: 'sm' | 'md' | 'lg'
}

const fragments: FragmentSpec[] = [
  { label: 'DESIGN', left: '8%', top: '18%', depth: 28, rotate: -6, size: 'md' },
  { label: 'ENGINEERING', left: '72%', top: '14%', depth: 40, accent: true, rotate: 5, size: 'md' },
  { label: 'AI', left: '18%', top: '62%', depth: 18, rotate: 8, size: 'sm', accent: true },
  { label: 'HEALTHCARE', left: '58%', top: '58%', depth: 34, rotate: -4, size: 'lg' },
  { label: 'PRODUCT', left: '78%', top: '42%', depth: 22, rotate: 3, size: 'sm' },
  { label: 'IMPACT', left: '38%', top: '28%', depth: 46, accent: true, rotate: -8, size: 'md' },
]

const orbs = [
  { left: '12%', top: '40%', size: 9, accent: false, depth: 16 },
  { left: '86%', top: '28%', size: 6, accent: true, depth: 30 },
  { left: '48%', top: '72%', size: 7, accent: false, depth: 24 },
  { left: '64%', top: '20%', size: 4, accent: true, depth: 12 },
  { left: '30%', top: '78%', size: 5, accent: false, depth: 36 },
]

function MagneticCta({
  children,
  to,
  variant = 'primary',
}: {
  children: ReactNode
  to: string
  variant?: 'primary' | 'brand' | 'secondary'
}) {
  const reduced = useReducedMotion() === true
  const magnetic = useMagnetic({ strength: 0.22, disabled: reduced })

  return (
    <m.div
      ref={magnetic.ref as React.RefObject<HTMLDivElement>}
      style={{ x: magnetic.x, y: magnetic.y }}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      className="inline-flex"
    >
      <Button to={to} size="lg" variant={variant}>
        {children}
      </Button>
    </m.div>
  )
}

function FloatingFragment({
  fragment,
  pointerX,
  pointerY,
  scrollY,
  index,
  reduced,
}: {
  fragment: FragmentSpec
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  scrollY: MotionValue<number>
  index: number
  reduced: boolean
}) {
  const px = useTransform(pointerX, [-1, 1], [-fragment.depth, fragment.depth])
  const py = useTransform(pointerY, [-1, 1], [-fragment.depth * 0.7, fragment.depth * 0.7])
  const scrollShiftX = useTransform(scrollY, [0, 1], [0, (index % 2 === 0 ? -1 : 1) * (80 + index * 28)])
  const scrollShiftY = useTransform(scrollY, [0, 1], [0, 40 + index * 36])
  const scrollRotate = useTransform(scrollY, [0, 1], [fragment.rotate, fragment.rotate + (index % 2 === 0 ? 12 : -14)])
  const opacity = useTransform(scrollY, [0, 0.55, 0.85], [1, 0.85, 0.15])
  const x = useTransform([px, scrollShiftX], ([a, b]) => (a as number) + (b as number))
  const y = useTransform([py, scrollShiftY], ([a, b]) => (a as number) + (b as number))

  const sizeClass =
    fragment.size === 'lg'
      ? 'px-5 py-3 text-xs'
      : fragment.size === 'md'
        ? 'px-4 py-2.5 text-xs'
        : 'px-3 py-2 text-xs'

  return (
    <m.div
      className={cn(
        'pointer-events-none absolute hidden select-none rounded-md border font-medium uppercase md:block',
        sizeClass,
        fragment.accent
          ? 'border-accent/50 bg-accent-soft text-text'
          : 'border-brand/25 bg-brand-soft text-brand',
      )}
      style={{
        left: fragment.left,
        top: fragment.top,
        x: reduced ? 0 : x,
        y: reduced ? 0 : y,
        rotate: reduced ? fragment.rotate : scrollRotate,
        opacity: reduced ? 1 : opacity,
      }}
      animate={
        reduced
          ? undefined
          : {
              y: [0, index % 2 === 0 ? -10 : 12, 0],
              rotate: [fragment.rotate, fragment.rotate + (index % 2 === 0 ? 2 : -2), fragment.rotate],
            }
      }
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 7 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }
      }
    >
      {fragment.label}
    </m.div>
  )
}

function FloatingOrb({
  orb,
  pointerX,
  pointerY,
  scrollY,
  index,
  reduced,
}: {
  orb: (typeof orbs)[number]
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  scrollY: MotionValue<number>
  index: number
  reduced: boolean
}) {
  const ox = useTransform(pointerX, [-1, 1], [-orb.depth, orb.depth])
  const oy = useTransform(pointerY, [-1, 1], [-orb.depth * 0.6, orb.depth * 0.6])
  const sy = useTransform(scrollY, [0, 1], [0, 60 + index * 20])
  const y = useTransform([oy, sy], ([a, b]) => (a as number) + (b as number))

  return (
    <m.span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute hidden rounded-full md:block',
        orb.accent ? 'bg-accent/80' : 'bg-brand/55',
      )}
      style={{
        left: orb.left,
        top: orb.top,
        width: orb.size,
        height: orb.size,
        x: reduced ? 0 : ox,
        y: reduced ? 0 : y,
      }}
      animate={reduced ? undefined : { scale: [1, 1.35, 1], opacity: [0.45, 0.9, 0.45] }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 4.5 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }
      }
    />
  )
}

function ConnectionLines({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const pathLength = useSpring(useTransform(progress, [0.15, 0.7], [0, 1]), {
    stiffness: 80,
    damping: 24,
  })
  const opacity = useTransform(progress, [0.1, 0.35, 0.75, 0.95], [0, 0.7, 0.55, 0])

  return (
    <m.svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ opacity: reduced ? 0.25 : opacity }}
    >
      <m.path
        d="M18 22 C 34 18, 42 36, 52 30 S 70 18, 82 24"
        fill="none"
        stroke="rgb(47 91 234 / 0.35)"
        strokeWidth="0.2"
        style={{ pathLength: reduced ? 1 : pathLength }}
      />
      <m.path
        d="M22 68 C 38 54, 48 62, 58 52 S 74 48, 84 42"
        fill="none"
        stroke="rgb(245 200 76 / 0.55)"
        strokeWidth="0.18"
        style={{ pathLength: reduced ? 1 : pathLength }}
      />
      <m.path
        d="M40 30 C 48 48, 36 58, 44 74"
        fill="none"
        stroke="rgb(47 91 234 / 0.22)"
        strokeWidth="0.16"
        style={{ pathLength: reduced ? 1 : pathLength }}
      />
    </m.svg>
  )
}

export function CareerHero() {
  const reduced = useReducedMotion() === true
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const pointer = usePointerParallax(reduced)
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45, 0.7], [1, 0.85, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.7], [0, -80])
  return (
    <section
      ref={sectionRef}
      className="atmosphere-hero relative -mt-(--header-clearance) h-[180vh] md:h-[220vh]"
      aria-labelledby="careers-hero-title"
    >
      <div className="sticky top-0 flex min-h-svh items-center overflow-hidden">
        <ConnectionLines progress={scrollYProgress} reduced={reduced} />

        {fragments.map((fragment, index) => (
          <FloatingFragment
            key={fragment.label}
            fragment={fragment}
            pointerX={pointer.x}
            pointerY={pointer.y}
            scrollY={scrollYProgress}
            index={index}
            reduced={reduced}
          />
        ))}

        {orbs.map((orb, index) => (
          <FloatingOrb
            key={`${orb.left}-${orb.top}`}
            orb={orb}
            pointerX={pointer.x}
            pointerY={pointer.y}
            scrollY={scrollYProgress}
            index={index}
            reduced={reduced}
          />
        ))}

        <Container variant="page" className="relative z-10 w-full py-28 md:py-32">
          <m.div
            className="mx-auto flex max-w-[46rem] flex-col items-center text-center"
            style={{ opacity: reduced ? 1 : contentOpacity, y: reduced ? 0 : contentY }}
          >
            <m.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.1, ease }}
            >
              <Eyebrow>
                {careersCopy.hero.eyebrow}
              </Eyebrow>
            </m.div>
            <m.h1
              id="careers-hero-title"
              className="mt-5 text-4xl font-medium text-text sm:text-5xl lg:text-6xl"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : 0.2, ease }}
            >
              {careersCopy.hero.headline.slice(0, careersCopy.hero.headline.lastIndexOf(' '))}{' '}
              <span className="text-brand">
                {careersCopy.hero.headline.slice(careersCopy.hero.headline.lastIndexOf(' ') + 1)}
              </span>
            </m.h1>
            <m.p
              className="mt-6 max-w-[36rem] text-body-large text-text-secondary"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.32, ease }}
            >
              {careersCopy.hero.body}
            </m.p>
            <m.div
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.44, ease }}
            >
              <MagneticCta to="/careers#open-positions" variant="brand">
                {careersCopy.hero.primaryCta}
              </MagneticCta>
              <MagneticCta to="/careers#life-at-bizaffix" variant="secondary">
                {careersCopy.hero.secondaryCta}
              </MagneticCta>
            </m.div>
          </m.div>
        </Container>
      </div>
    </section>
  )
}
