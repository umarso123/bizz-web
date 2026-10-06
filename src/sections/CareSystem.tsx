import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { Container } from '@/components/layout/Container.tsx'

const notes = [
  {
    title: 'Healthcare',
    body: 'Custom mobile apps, websites, designs, and branding for care.',
    dot: '#0A8FD8',
    place: 'top-[16%] left-0',
  },
  {
    title: 'Mobile & web',
    body: 'Android, iOS, Flutter, and web products built for the business.',
    dot: '#0A8FD8',
    place: 'top-[14%] right-0',
  },
  {
    title: 'Industries',
    body: 'Educational, Fintech, Fitness, and eCommerce beside healthcare.',
    dot: '#087BB9',
    place: 'bottom-[14%] left-[6%]',
  },
  {
    title: 'Relationships',
    body: 'Not just lines of code — your vision is our inspiration.',
    dot: '#F66C2A',
    place: 'right-[2%] bottom-[16%]',
  },
] as const

function Phone() {
  return (
    <div className="relative h-[17.5rem] w-[8.75rem] rounded-[1.6rem] border border-[#0A8FD8]/45 bg-white shadow-sm">
      <div className="absolute top-2 left-1/2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-[#0A8FD8]/30" />
      <div className="flex h-full flex-col justify-end gap-2 px-3 pt-8 pb-4">
        <div className="h-7 rounded-md border border-[#0A8FD8]/35" />
        <div className="h-7 rounded-md border border-[#F66C2A]/70" />
        <div className="h-14 rounded-md bg-[#0A8FD8]/10" />
      </div>
    </div>
  )
}

function OrbitNote({
  note,
  index,
  progress,
  reduced,
}: {
  note: (typeof notes)[number]
  index: number
  progress: MotionValue<number>
  reduced: boolean
}) {
  const start = 0.4 + index * 0.08
  const opacity = useTransform(progress, [start, Math.min(start + 0.18, 1)], reduced ? [1, 1] : [0, 1])
  const y = useTransform(progress, [start, Math.min(start + 0.18, 1)], reduced ? [0, 0] : [12, 0])

  return (
    <m.div className={`absolute hidden w-52 lg:block ${note.place}`} style={{ opacity, y }}>
      <Note note={note} />
    </m.div>
  )
}

function Note({ note }: { note: (typeof notes)[number] }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-border bg-white">
        <span className="size-2.5 rounded-full" style={{ backgroundColor: note.dot }} />
      </span>
      <div>
        <p className="text-[0.9375rem] font-medium text-text">{note.title}</p>
        <p className="mt-1 text-[0.8125rem] leading-5 text-text-secondary">{note.body}</p>
      </div>
    </div>
  )
}

export function CareSystem() {
  const reduced = useReducedMotion() === true
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  })
  const phoneY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-260, 0])
  const phoneScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0.76, 1])
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.18, 1], reduced ? [1, 1, 1] : [0, 1, 1])
  const ringScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0.92, 1])

  return (
    <LazyMotion features={domAnimation}>
      <section ref={sectionRef} className="relative overflow-x-clip bg-page-white py-16 lg:py-28">
        <Container variant="page" className="w-full">
          <div className="relative mx-auto min-h-[28rem] w-full max-w-[68rem] lg:min-h-[42rem]">
            <div className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
              <m.div style={{ scale: ringScale }} className="relative size-[18rem] sm:size-[26rem] lg:size-[34rem]">
                <div className="absolute inset-0 rounded-full bg-page-brand" />
                <div className="absolute inset-[11%] rounded-full bg-[#E7F5FC]" />
                <div className="absolute inset-[22%] rounded-full border-8 border-[#0A8FD8]/80" />
                <div className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F66C2A]" />
                <p className="pointer-events-none absolute top-[15%] left-1/2 -translate-x-1/2 text-[0.8125rem] font-medium text-text">
                  Bizaffix
                </p>
                <div className="absolute inset-0 grid place-items-center" style={{ zIndex: 2 }}>
                  <m.div style={{ y: phoneY, scale: phoneScale, opacity: phoneOpacity }}>
                    <Phone />
                  </m.div>
                </div>
              </m.div>
            </div>

            {notes.map((note, index) => (
              <OrbitNote key={note.title} note={note} index={index} progress={scrollYProgress} reduced={reduced} />
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:hidden">
            {notes.map((note) => (
              <Note key={note.title} note={note} />
            ))}
          </div>
        </Container>
      </section>
    </LazyMotion>
  )
}
