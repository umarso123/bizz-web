import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, type CSSProperties } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { careersCopy, cultureThemes } from '@/content/careers.ts'
import { cn } from '@/lib/cn.ts'
import { useTilt } from '@/sections/careers/useCareerMotion.ts'

const positions = [
  { left: '8%', top: '18%' },
  { left: '62%', top: '10%' },
  { left: '74%', top: '48%' },
  { left: '18%', top: '62%' },
  { left: '48%', top: '72%' },
  { left: '42%', top: '34%' },
]

export function CultureStory() {
  const reduced = useReducedMotion() === true
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const centerY = useTransform(scrollYProgress, [0, 1], [30, -30])
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 40])
  const outerY = useTransform(scrollYProgress, [0, 1], [-20, 20])
  const outerRotate = useTransform(scrollYProgress, [0, 1], [0, -25])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-page-brand py-24 md:py-36"
      aria-labelledby="culture-title"
    >
      <Container variant="page" className="relative w-full">
        <div className="max-w-[34rem]">
          <Eyebrow>
            {careersCopy.culture.eyebrow}
          </Eyebrow>
          <h2
            id="culture-title"
            className="mt-4 text-[clamp(2rem,1.3rem+2vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.025em] text-text"
          >
            {careersCopy.culture.headline}
          </h2>
        </div>

        <div className="relative mt-16 min-h-[34rem] md:mt-20 md:min-h-[40rem]">
          <m.div
            className="absolute top-1/2 left-1/2 hidden h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/20 md:block"
            aria-hidden="true"
            style={{ y: reduced ? 0 : centerY, rotate: reduced ? 0 : ringRotate }}
          />
          <m.div
            className="absolute top-1/2 left-1/2 hidden h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgb(246_108_42_/0.18)] md:block"
            aria-hidden="true"
            style={{ y: reduced ? 0 : outerY, rotate: reduced ? 0 : outerRotate }}
          />
          <div className="absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 text-center md:block">
            <Eyebrow>Bizaffix</Eyebrow>
            <p className="mt-2 max-w-[12rem] text-body-small text-text-secondary">
              People, craft, and healthcare impact in one studio.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 md:contents">
            {cultureThemes.map((theme, index) => (
              <CultureObject
                key={theme.id}
                label={theme.label}
                detail={theme.detail}
                left={positions[index]?.left ?? '50%'}
                top={positions[index]?.top ?? '50%'}
                index={index}
                progress={scrollYProgress}
                reduced={reduced}
              />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

function CultureObject({
  label,
  detail,
  left,
  top,
  index,
  progress,
  reduced,
}: {
  label: string
  detail: string
  left: string
  top: string
  index: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reduced: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const tilt = useTilt({ max: 3.5, disabled: reduced })
  const driftY = useTransform(progress, [0, 1], [index % 2 === 0 ? 40 : -30, index % 2 === 0 ? -50 : 40])
  const driftX = useTransform(progress, [0, 1], [index % 2 === 0 ? -20 : 24, index % 2 === 0 ? 30 : -28])

  return (
    <li
      className="relative md:absolute md:top-(--culture-top) md:left-(--culture-left) md:w-[15rem]"
      style={
        {
          '--culture-left': left,
          '--culture-top': top,
        } as CSSProperties
      }
    >
      <m.button
        type="button"
        ref={tilt.ref as React.RefObject<HTMLButtonElement>}
        className={cn(
          'group w-full origin-center rounded-xl border px-5 py-4 text-left transition-colors',
          'border-border bg-surface/90 backdrop-blur-sm',
          'hover:border-brand/35 hover:bg-brand-subtle/80',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        )}
        style={{
          x: reduced ? 0 : driftX,
          y: reduced ? 0 : driftY,
          rotateX: reduced ? 0 : tilt.rotateX,
          rotateY: reduced ? 0 : tilt.rotateY,
          scale: hovered && !reduced ? 1.04 : 1,
          z: hovered ? 20 : 1,
          transformPerspective: 800,
        }}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={() => {
          tilt.onPointerLeave()
          setHovered(false)
        }}
        onPointerEnter={() => setHovered(true)}
        animate={
          reduced
            ? undefined
            : {
                y: [0, index % 2 === 0 ? -6 : 8, 0],
              }
        }
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 6 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <span
          aria-hidden="true"
          className={cn(
            'mb-3 block h-0.5 w-8 rounded-full transition-colors',
            index % 2 === 0 ? 'bg-brand' : 'bg-[#F66C2A]',
          )}
        />
        <span className="block text-[1.05rem] leading-snug font-semibold tracking-[-0.02em] text-text">
          {label}
        </span>
        <span
          className={cn(
            'mt-2 block text-body-small text-text-secondary transition-opacity duration-300',
            'md:opacity-70 md:group-hover:opacity-100 md:group-focus-visible:opacity-100',
          )}
        >
          {detail}
        </span>
      </m.button>
    </li>
  )
}
