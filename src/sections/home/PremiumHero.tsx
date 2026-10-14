import { m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Button } from '@/components/ui/Button.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { premiumHome } from '@/content/premium-home.ts'
import { HelixStrand, type HelixPointer } from '@/sections/home/HelixStrand.tsx'

const ease = [0.22, 1, 0.36, 1] as const

const strandDots = Array.from({ length: 46 }, (_, index) => {
  const u = index / 45
  const y = 36 + u * 728
  const turn = u * Math.PI * 5.2
  const radius = 86 + Math.sin(u * 9) * 8
  return {
    y,
    a: 200 + Math.cos(turn) * radius,
    b: 200 + Math.cos(turn + Math.PI) * radius,
    gold: index % 7 === 0,
  }
})

function StrandMark() {
  return (
    <svg viewBox="0 0 400 800" className="h-[min(78vh,40rem)] w-auto max-w-full" aria-hidden="true">
      {strandDots.map((dot, index) =>
        index % 8 === 0 ? (
          <line
            key={`rung-${dot.y}`}
            x1={dot.a}
            x2={dot.b}
            y1={dot.y}
            y2={dot.y}
            stroke="#f5c84c"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ) : null,
      )}
      {strandDots.map((dot) => (
        <g key={dot.y}>
          <circle cx={dot.a} cy={dot.y} r={dot.gold ? 7 : 5.5} fill={dot.gold ? '#f5c84c' : '#2f5bea'} />
          <circle cx={dot.b} cy={dot.y} r="4.5" fill="#1a2f8a" opacity="0.85" />
        </g>
      ))}
    </svg>
  )
}

export function PremiumHero() {
  const reduced = useReducedMotion() === true
  const copy = premiumHome.hero
  const sectionRef = useRef<HTMLElement>(null)
  const pointer = useRef<HelixPointer>({ x: 0, y: 0 })
  const scroll = useRef(0)
  const [inView, setInView] = useState(true)
  const [strandLive, setStrandLive] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.08 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    let frame = 0
    const measure = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const next = -rect.top / Math.max(rect.height, 1)
      scroll.current = Math.min(Math.max(next, 0), 1)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1
  }

  return (
    <section
      ref={sectionRef}
      className="hero-fold relative -mt-(--header-clearance) flex min-h-dvh flex-col bg-page-white pt-(--header-clearance)"
      aria-labelledby="premium-hero-title"
      onPointerMove={onPointerMove}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden h-full w-[52%] overflow-hidden md:block" aria-hidden="true">
        <div className="flex h-full items-center justify-center pe-[6%]">
          <div className={strandLive ? 'hidden' : 'block'}>
            <StrandMark />
          </div>
          <div className="absolute inset-0">
            <HelixStrand
              pointer={pointer}
              scroll={scroll}
              reduced={reduced}
              active={inView}
              onReady={() => setStrandLive(true)}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-(--page-gutter) pb-3 md:pb-4">
        <div className="flex h-[calc(100dvh-var(--header-clearance)-3.9rem)] flex-col justify-center overflow-hidden py-6 lg:py-8">
          <m.div
            className="mt-[3px] max-w-[40rem]"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <Eyebrow>{copy.badge}</Eyebrow>
            <h1 id="premium-hero-title" className="mt-2 text-text">
              {copy.titleLead}{' '}
              <span className="lg:block">
                {copy.titleMove} <em>{copy.titleItalic}</em>
              </span>{' '}
              <span className="lg:block">
                {copy.titleBridge} <em className="text-brand">{copy.titleAccent}</em>
              </span>
            </h1>
            <p className="mt-2 max-w-[30rem] text-body text-text-secondary">{copy.body}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button to={copy.primaryTo} variant="brand">
                {copy.primaryCta}
              </Button>
              <Button to={copy.secondaryTo} variant="accent">
                {copy.secondaryCta}
              </Button>
            </div>
          </m.div>
        </div>

        <article className="hero-milestone rounded-[1.75rem] border border-white/80 bg-white/62 px-5 py-4 shadow-[0_1px_0_rgb(255_255_255/0.85)_inset,0_18px_48px_rgb(13_18_31/0.08)] backdrop-blur-xl sm:px-7 sm:py-4 lg:px-9 lg:py-5">
          <p className="inline-flex items-center rounded-full border border-border bg-white/80 px-3 py-1 text-[0.68rem] font-medium tracking-[0.08em] text-text-secondary">
            {copy.milestone.label}
          </p>
          <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <h2 className="text-text">
              {copy.milestone.title[0]}
              <br />
              {copy.milestone.title[1]}
            </h2>
            <p className="max-w-[28rem] text-body-small text-pretty text-text-secondary lg:max-w-[22rem] lg:text-body">
              {copy.milestone.body}
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}
