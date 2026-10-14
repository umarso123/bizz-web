import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { careersCopy, gallerySlots } from '@/content/careers.ts'
import { cn } from '@/lib/cn.ts'
import { useTilt } from '@/sections/careers/useCareerMotion.ts'
import { Reveal } from '@/sections/home/Reveal.tsx'

const layoutClass: Record<(typeof gallerySlots)[number]['aspect'], string> = {
  large: 'md:col-span-2 md:row-span-2 min-h-[18rem] md:min-h-[28rem]',
  wide: 'md:col-span-2 min-h-[12rem] md:min-h-[14rem]',
  tall: 'min-h-[16rem] md:min-h-[22rem]',
  square: 'min-h-[12rem] md:min-h-[14rem]',
}

function GalleryCell({
  label,
  aspect,
  index,
  progress,
  reduced,
}: {
  label: string
  aspect: (typeof gallerySlots)[number]['aspect']
  index: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reduced: boolean
}) {
  const tilt = useTilt({ max: 3, disabled: reduced })
  const y = useTransform(
    progress,
    [0, 1],
    [index % 2 === 0 ? 48 : 24, index % 2 === 0 ? -60 : -28],
  )
  const rotate = useTransform(progress, [0, 0.4, 1], [index % 2 === 0 ? -2.5 : 2, 0, index % 2 === 0 ? 1.5 : -1])

  return (
    <m.figure
      ref={tilt.ref as React.RefObject<HTMLElement>}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border-subtle',
        index % 2 === 0 ? 'bg-page-brand' : 'bg-page-white',
        layoutClass[aspect],
      )}
      style={{
        y: reduced ? 0 : y,
        rotate: reduced ? 0 : rotate,
        rotateX: reduced ? 0 : tilt.rotateX,
        rotateY: reduced ? 0 : tilt.rotateY,
        transformPerspective: 900,
      }}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <figcaption className="absolute inset-x-0 bottom-0 p-5">
        <span className="inline-flex rounded-md bg-surface/85 px-3 py-1.5 text-caption text-text-secondary backdrop-blur-sm">
          {label}
        </span>
      </figcaption>
    </m.figure>
  )
}

export function LifeAtBizaffix() {
  const reduced = useReducedMotion() === true
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  return (
    <section
      ref={ref}
      id="life-at-bizaffix"
      className="scroll-mt-28 overflow-hidden bg-page-brand py-24 md:py-32"
      aria-labelledby="life-title"
    >
      <Container variant="page" className="w-full">
        <Reveal className="max-w-[38rem]">
          <Eyebrow>
            {careersCopy.life.eyebrow}
          </Eyebrow>
          <h2
            id="life-title"
            className="mt-4 text-3xl font-medium sm:text-4xl text-text"
          >
            {careersCopy.life.headline}
          </h2>
          <p className="mt-5 text-body-large text-text-secondary">{careersCopy.life.body}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
          {gallerySlots.map((slot, index) => (
            <GalleryCell
              key={slot.id}
              label={slot.label}
              aspect={slot.aspect}
              index={index}
              progress={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
