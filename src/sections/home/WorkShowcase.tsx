import { m, useReducedMotion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { homeContent } from '@/content/home.ts'
import { cn } from '@/lib/cn.ts'

type Shot = {
  src: string | null
  alt: string
}

function ScreenFill({
  shot,
  className,
  placeholderLabel,
}: {
  shot: Shot
  className?: string
  placeholderLabel: string
}) {
  if (shot.src) {
    return (
      <img
        src={shot.src}
        alt={shot.alt}
        className={cn('h-full w-full object-contain object-center', className)}
        loading="lazy"
        decoding="async"
      />
    )
  }

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-2 bg-page-brand',
        className,
      )}
      aria-label={shot.alt}
    >
      <span className="rounded-full border border-dashed border-[#0A8FD8]/35 px-3 py-1 text-[0.65rem] font-medium tracking-[0.04em] text-[#087BB9]">
        {placeholderLabel}
      </span>
    </div>
  )
}

function BrowserFrame({ shot }: { shot: Shot }) {
  return (
    <div className="overflow-hidden rounded-[1.15rem] border border-white/80 bg-white shadow-[0_28px_60px_-28px_rgb(23_33_43_/_0.35)] ring-1 ring-[#0A8FD8]/10">
      <div className="flex h-9 items-center gap-2 border-b border-[#E8EEF2] bg-[#F8FAFC] px-3.5">
        <span className="size-2 rounded-full bg-[#FF5F57]" />
        <span className="size-2 rounded-full bg-[#FEBC2E]" />
        <span className="size-2 rounded-full bg-[#28C840]" />
        <div className="ml-2 h-4 flex-1 rounded-full bg-[#EEF3F6]" />
      </div>
      <div className="aspect-[16/10] w-full">
        <ScreenFill shot={shot} placeholderLabel="Desktop screenshot" />
      </div>
    </div>
  )
}

function PhoneFrame({
  shot,
  className,
  style,
}: {
  shot: Shot
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[1.85rem] border-[3px] border-[#17212B] bg-[#17212B] shadow-[0_24px_48px_-20px_rgb(23_33_43_/_0.45)]',
        className,
      )}
      style={style}
    >
      <div className="absolute top-2 left-1/2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black" />
      <div className="aspect-[9/19.2] w-full overflow-hidden rounded-[1.55rem] bg-white">
        <ScreenFill shot={shot} placeholderLabel="Mobile screenshot" />
      </div>
    </div>
  )
}

function AccentChip({
  label,
  className,
  tone,
}: {
  label: string
  className?: string
  tone: 'blue' | 'orange' | 'ink'
}) {
  const tones = {
    blue: 'bg-[#0A8FD8] text-white',
    orange: 'bg-[#F66C2A] text-white',
    ink: 'bg-[#17212B] text-white',
  } as const

  return (
    <span
      className={cn(
        'inline-block rotate-[-6deg] rounded-[0.85rem] px-3 py-1.5 text-[0.62rem] font-bold tracking-[0.06em] uppercase shadow-md',
        tones[tone],
        className,
      )}
    >
      {label}
    </span>
  )
}

export function WorkShowcase() {
  const reduced = useReducedMotion() === true
  const copy = homeContent.work
  const shots = copy.shots

  return (
    <section
      id="work"
      className="bg-page-white py-14 md:py-20"
      aria-labelledby="work-title"
    >
      <Container variant="wide" className="w-full">
        <div className="flex items-stretch gap-3 md:gap-5">
          <div className="hidden shrink-0 items-center sm:flex">
            <Eyebrow
              as="h2"
              id="work-title"
              className="origin-center rotate-180 [writing-mode:vertical-rl]"
            >
              {copy.label}
            </Eyebrow>
          </div>

          <m.div
            className="relative min-h-[28rem] flex-1 overflow-hidden rounded-[1.75rem] bg-page-brand md:min-h-[34rem] md:rounded-[2.25rem] lg:min-h-[38rem]"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eyebrow className="absolute top-5 left-5 z-30 sm:hidden">{copy.label}</Eyebrow>

            {/* Desktop / laptop screen — back layer */}
            <m.div
              className="absolute top-[12%] right-[6%] left-[18%] z-10 md:top-[10%] md:right-[10%] md:left-[22%] lg:left-[24%]"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.08, duration: 0.55 }}
            >
              <BrowserFrame shot={shots.desktop} />
            </m.div>

            {/* Left phone — tilted */}
            <m.div
              className="absolute bottom-[6%] left-[4%] z-20 w-[38%] max-w-[11.5rem] sm:left-[6%] sm:w-[32%] md:bottom-[8%] md:left-[8%] md:max-w-[13.5rem] lg:max-w-[15rem]"
              initial={reduced ? false : { opacity: 0, y: 32, rotate: -14 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0, rotate: -9 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.16, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <PhoneFrame shot={shots.phoneLeft} />
              <AccentChip
                label={copy.chips[0]}
                tone="blue"
                className="absolute -bottom-2 -left-2 z-30 md:-bottom-3 md:-left-3"
              />
            </m.div>

            {/* Right phone — upright */}
            <m.div
              className="absolute right-[18%] bottom-[10%] z-20 w-[34%] max-w-[10rem] sm:right-[22%] sm:w-[28%] md:right-[24%] md:bottom-[12%] md:max-w-[12rem] lg:max-w-[13.5rem]"
              initial={reduced ? false : { opacity: 0, y: 36 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.22, duration: 0.55 }}
            >
              <PhoneFrame shot={shots.phoneRight} />
              <AccentChip
                label={copy.chips[1]}
                tone="orange"
                className="absolute -top-3 -right-4 z-30 rotate-[8deg]"
              />
              <AccentChip
                label={copy.chips[2]}
                tone="ink"
                className="absolute top-[38%] -right-8 z-30 hidden rotate-[12deg] sm:inline-block"
              />
            </m.div>

            {/* Right accent cards — image slots */}
            <m.div
              className="absolute top-[14%] right-[3%] z-20 hidden w-[22%] max-w-[11rem] flex-col gap-3 lg:flex"
              initial={reduced ? false : { opacity: 0, x: 24 }}
              whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28, duration: 0.5 }}
            >
              <div className="overflow-hidden rounded-2xl bg-[#0A8FD8] p-3 shadow-lg">
                <p className="text-[0.7rem] leading-snug font-semibold text-white">
                  {copy.cardTitle}
                </p>
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/70 bg-white shadow-lg">
                <ScreenFill shot={shots.card} placeholderLabel="Project image" />
              </div>
            </m.div>
          </m.div>
        </div>
      </Container>
    </section>
  )
}
