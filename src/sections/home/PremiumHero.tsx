import { m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Button } from '@/components/ui/Button.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { premiumHome } from '@/content/premium-home.ts'
import { HelixStrand, type HelixPointer } from '@/sections/home/HelixStrand.tsx'

const ease = [0.22, 1, 0.36, 1] as const

function ScrollMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2.5v9M7 11.5 3.5 8M7 11.5 10.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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
      className="hero-fold relative -mt-(--header-clearance) flex min-h-svh flex-col bg-page-white pt-(--header-clearance)"
      aria-labelledby="premium-hero-title"
      onPointerMove={onPointerMove}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden h-full w-[52%] overflow-hidden md:block" aria-hidden="true">
        <HelixStrand pointer={pointer} scroll={scroll} reduced={reduced} active={inView} />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-(--page-gutter) pb-3 md:pb-4">
        <div className="flex flex-1 flex-col justify-center py-3 lg:py-2">
          <m.div
            className="max-w-[40rem]"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <Eyebrow>{copy.badge}</Eyebrow>
            <h1 id="premium-hero-title" className="mt-3 text-text">
              {copy.titleLead}{' '}
              <span className="lg:block">
                {copy.titleMove} <em>{copy.titleItalic}</em>
              </span>{' '}
              <span className="lg:block">
                {copy.titleBridge} <em className="text-brand">{copy.titleAccent}</em>
              </span>
            </h1>
            <p className="mt-3 max-w-[30rem] text-body text-text-secondary">{copy.body}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button to={copy.primaryTo} variant="brand">
                {copy.primaryCta}
              </Button>
              <Button to={copy.secondaryTo} variant="accent">
                {copy.secondaryCta}
              </Button>
              <a
                href={copy.scrollTo}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-button-primary px-4 text-body-small font-semibold text-text-inverse no-underline transition-colors duration-(--duration-standard) ease-standard hover:bg-button-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
              >
                <ScrollMark />
                {copy.scrollCta}
              </a>
            </div>
          </m.div>
        </div>

        <div className="relative">
          <a
            href={copy.scrollTo}
            className="absolute right-0 -top-14 z-20 hidden h-11 items-center gap-2 rounded-full bg-button-primary px-4 text-body-small font-semibold text-text-inverse no-underline shadow-md transition-colors duration-(--duration-standard) ease-standard hover:bg-button-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:inline-flex"
          >
            <ScrollMark />
            {copy.scrollCta}
          </a>
          <article className="hero-milestone rounded-[1.75rem] border border-white/80 bg-white/62 px-5 py-4 shadow-[0_1px_0_rgb(255_255_255/0.85)_inset,0_18px_48px_rgb(13_18_31/0.08)] backdrop-blur-xl sm:px-7 sm:py-4 lg:px-9 lg:py-5">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div>
              <p className="inline-flex items-center rounded-full border border-border bg-white/80 px-3 py-1 text-[0.68rem] font-medium tracking-[0.08em] text-text-secondary">
                {copy.milestone.label}
              </p>
              <h2 className="mt-3 text-text">
                {copy.milestone.title[0]}
                <br />
                {copy.milestone.title[1]}
              </h2>
            </div>
            <p className="max-w-[28rem] text-body-small text-pretty text-text-secondary lg:max-w-[22rem] lg:text-body">
              {copy.milestone.body}
            </p>
          </div>
        </article>
        </div>
      </div>
    </section>
  )
}
