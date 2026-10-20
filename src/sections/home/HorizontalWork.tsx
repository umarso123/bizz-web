import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mockups } from '@/content/mockups.ts'

gsap.registerPlugin(ScrollTrigger)

/* -------------------------------------------------------------------------- */
/*                               DESIGN TOKENS                                */
/* -------------------------------------------------------------------------- */

const FONT_HEADING = "'Inter Tight', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
const FONT_MONO = "'JetBrains Mono', 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

/**
 * Hold duration at the end of the pinned section, expressed as a fraction of viewport height.
 * 0.8 = ~80vh of vertical scroll dwell while the Services panel stays pinned and fixed.
 */
export const HOLD_VH = 0.8

/* -------------------------------------------------------------------------- */
/*                               TYPES & DATA                                 */
/* -------------------------------------------------------------------------- */

export interface ProjectItem {
  id: string
  number: string
  title: string
  category: string
  description: string
  image: string
  alt?: string
  link?: string
  verticalOffset?: 'top' | 'lower'
}

/**
 * Real project data from Bizaffix portfolio (content/featured-projects.ts & work.ts)
 */
export const defaultProjects: ProjectItem[] = [
  {
    id: 'traino-ai',
    number: '01',
    title: 'Traino.ai',
    category: 'Education · AI LMS',
    description: 'An AI-powered LMS built to optimize training knowledge retention and workforce learning.',
    image: mockups.trainoLaptop,
    alt: 'Traino.ai dashboard on laptop',
    link: '/work/traino-ai',
    verticalOffset: 'top',
  },
  {
    id: 'clinical-decision-support',
    number: '02',
    title: 'Clinical Decision Support',
    category: 'Digital Health · CDS',
    description: 'Custom healthcare experiences spanning clinical workflows, care access, and connected data.',
    image: mockups.healthcare,
    alt: 'Clinical Decision Support interface on tablet',
    link: '/work/clinical-decision-support',
    verticalOffset: 'lower', // ~90px lower down
  },
  {
    id: 'poised-journey-academy',
    number: '03',
    title: 'The Poised Journey Academy',
    category: 'Education · Homeschooling',
    description: 'A learning platform that helps families plan, personalize, document, and manage homeschool journeys.',
    image: mockups.poisedDevicesPills,
    alt: 'Poised Journey Academy on laptop and tablets',
    link: '/work/poised-journey-academy',
    verticalOffset: 'top',
  },
  {
    id: 'optimized-strength',
    number: '04',
    title: 'Optimized Strength',
    category: 'Fitness · Connected Health',
    description: 'A consolidated, intuitive fitness product designed for lasting adherence and progress.',
    image: mockups.optimizedStrengthIcon,
    alt: 'Optimized Strength application preview',
    link: '/work/optimized-strength',
    verticalOffset: 'lower',
  },
]

export const projects = defaultProjects

/* -------------------------------------------------------------------------- */
/*                              FIT-TEXT HOOK                                 */
/* -------------------------------------------------------------------------- */

interface UseFitTextOptions {
  words: string[]
  containerRef: React.RefObject<HTMLElement | null>
  fontFamily: string
  lineHeight?: number
  paddingInlinePercent?: number
  maxFontSize?: number
  minFontSize?: number
}

function useFitText({
  words,
  containerRef,
  fontFamily,
  lineHeight = 0.82,
  paddingInlinePercent = 0.16, // side padding allowance
  maxFontSize = 240,
  minFontSize = 40,
}: UseFitTextOptions) {
  const [fontSize, setFontSize] = useState<number>(130)

  useEffect(() => {
    const longestWord = words.reduce((a, b) => (b.length > a.length ? b : a), '')

    const recalculate = () => {
      const container = containerRef.current
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Available width: panel is 100vw minus horizontal padding
      const availableWidth = container
        ? Math.max(280, container.clientWidth * (1 - paddingInlinePercent))
        : viewportWidth * (1 - paddingInlinePercent)

      // Available height: starting below the floating navbar clearance (~110px) + bottom breathing room
      const navbarClearance = 120
      const availableHeight = Math.max(260, viewportHeight - navbarClearance - 90)

      // Measure longest word width at reference 100px font-size
      let wordWidthAt100 = 680
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.font = `500 100px ${fontFamily}`
        wordWidthAt100 = ctx.measureText(longestWord).width
        // Negative letter-spacing adjustment (-0.06em)
        wordWidthAt100 = Math.max(100, wordWidthAt100 - longestWord.length * 5)
      }

      // 1. Font size bounded by panel width (so "DEVELOPMENT" NEVER breaks or wraps)
      const fontSizeForWidth = (availableWidth / wordWidthAt100) * 100

      // 2. Font size bounded by panel height (so all 4 lines are fully visible at once)
      const fontSizeForHeight = availableHeight / (words.length * lineHeight)

      // Take the safe minimum with 6% cushion
      const optimal = Math.floor(Math.min(fontSizeForWidth, fontSizeForHeight) * 0.94)
      const clamped = Math.min(maxFontSize, Math.max(minFontSize, optimal))

      setFontSize(clamped)
    }

    recalculate()

    window.addEventListener('resize', recalculate)
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(recalculate)
    }

    return () => {
      window.removeEventListener('resize', recalculate)
    }
  }, [words, containerRef, fontFamily, lineHeight, paddingInlinePercent, maxFontSize, minFontSize])

  return fontSize
}

/* -------------------------------------------------------------------------- */
/*                               FIXED HEADER                                 */
/* -------------------------------------------------------------------------- */

export interface FixedHeaderProps {
  logo?: ReactNode
  onMenuClick?: () => void
  onTalkClick?: () => void
  isMuted?: boolean
  onToggleSound?: () => void
}

export function FixedHeader({
  logo,
  onMenuClick,
  onTalkClick,
  isMuted = true,
  onToggleSound,
}: FixedHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 md:py-6 pointer-events-none select-none">
      <div className="pointer-events-auto flex items-center">
        {logo ?? (
          <a
            href="/"
            className="flex items-center gap-2.5 text-[var(--color-text)] no-underline transition-opacity hover:opacity-80"
            aria-label="Bizaffix Home"
          >
            <svg
              className="w-7 h-7 text-[var(--color-brand)] shrink-0"
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16 2L3 28h26L16 2zm0 7.8L23.4 24H8.6L16 9.8z" />
              <polygon points="16,13 11,23 21,23" />
            </svg>
            <span
              className="text-[20px] md:text-[22px] font-bold tracking-[-0.04em] uppercase text-[var(--color-text)]"
              style={{ fontFamily: FONT_HEADING }}
            >
              BIZAFFIX<sup>®</sup>
            </span>
          </a>
        )}
      </div>

      <div className="pointer-events-auto flex items-center gap-2.5 md:gap-3.5">
        <button
          type="button"
          onClick={onToggleSound}
          className="group relative flex size-11 items-center justify-center rounded-full bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-border)] hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] cursor-pointer"
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          title={isMuted ? 'Play sound' : 'Mute sound'}
        >
          {isMuted ? (
            <svg
              className="w-4 h-4 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-[var(--color-brand)] animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={onTalkClick}
          className="flex h-[42px] md:h-[46px] items-center justify-center rounded-full bg-[var(--color-button-primary)] px-6 text-[12px] md:text-[13px] font-semibold tracking-wider text-[var(--color-text-inverse)] uppercase transition-all hover:bg-[var(--color-button-primary-hover)] hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] cursor-pointer"
          style={{ fontFamily: FONT_HEADING }}
        >
          LET&apos;S TALK
        </button>

        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-[42px] md:h-[46px] items-center justify-center gap-1.5 rounded-full border border-[var(--color-border-strong)] bg-transparent px-5 text-[12px] md:text-[13px] font-semibold tracking-wider text-[var(--color-text)] uppercase transition-all hover:bg-black/5 active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] cursor-pointer"
          style={{ fontFamily: FONT_HEADING }}
        >
          <span>MENU</span>
          <span className="text-[14px] leading-none font-bold">=</span>
        </button>
      </div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*                            SERVICES SECTION                                */
/* -------------------------------------------------------------------------- */

export interface ServicesSectionProps {
  className?: string
  id?: string
}

export function ServicesSection({ className = '', id = 'our-services' }: ServicesSectionProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const services = ['A.I.', 'DESIGN', 'DEVELOPMENT', 'BRANDING']
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  const dynamicFontSize = useFitText({
    words: services,
    containerRef: panelRef,
    fontFamily: FONT_HEADING,
    lineHeight: 0.82,
    paddingInlinePercent: 0.16,
    maxFontSize: 240,
    minFontSize: 36,
  })

  return (
    <section
      ref={panelRef}
      id={id}
      className={`relative w-screen min-w-[100vw] h-screen bg-white shrink-0 flex flex-col justify-center px-[8vw] z-10 select-none pt-[calc(var(--header-clearance,5.75rem)+1.5rem)] pb-8 ${className}`}
      aria-label="Our Services"
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Top-left small uppercase label below navbar */}
      <div className="mb-4 md:mb-6">
        <p
          className="inline-flex items-center gap-2 font-mono text-[13px] md:text-[15px] tracking-[0.1em] text-[var(--color-text-secondary)] uppercase"
          style={{ fontFamily: FONT_MONO }}
        >
          <span className="inline-block size-2 rounded-full bg-[var(--color-accent)]" />
          OUR SERVICES
        </p>
      </div>

      {/* Giant stacked words in tight grotesk with Masked Reveal & Interactive Hover Dimming */}
      <div className="flex flex-col justify-center">
        {services.map((service, index) => {
          const isHovered = hoveredService === index
          const isDimmed = hoveredService !== null && !isHovered
          const isAI = service === 'A.I.'

          return (
            <div key={service} className="overflow-hidden py-0.5">
              <span
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
                className={`service-word inline-block font-normal leading-[0.82] tracking-[-0.06em] uppercase cursor-pointer transition-all duration-300 ${
                  isHovered
                    ? '!text-[var(--color-brand)] !opacity-100 translate-x-3 md:translate-x-4'
                    : isDimmed
                    ? '!opacity-25 blur-[0.5px] text-[var(--color-text)]'
                    : 'text-[var(--color-text)]'
                }`}
                style={{
                  fontSize: `${dynamicFontSize}px`,
                  fontFamily: FONT_HEADING,
                  whiteSpace: 'nowrap',
                  wordBreak: 'keep-all',
                  overflowWrap: 'normal',
                  hyphens: 'none',
                  display: 'inline-block',
                }}
              >
                {isAI ? (
                  <>
                    A<span className="text-[var(--color-accent)]">.</span>I
                    <span className="text-[var(--color-accent)]">.</span>
                  </>
                ) : (
                  service
                )}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                          MAIN HORIZONTAL WORK                              */
/* -------------------------------------------------------------------------- */

export interface HorizontalWorkProps {
  projects?: ProjectItem[]
  showHeader?: boolean
  logo?: ReactNode
  className?: string
  viewAllLink?: string
}

export function HorizontalWork({
  projects: projectList = defaultProjects,
  showHeader = false, // false by default inside site layout to avoid overlapping navbar
  logo,
  className = '',
  viewAllLink = '/work',
}: HorizontalWorkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const introHeadingRef = useRef<HTMLHeadingElement>(null)

  const [isMuted, setIsMuted] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeCardIndex, setActiveCardIndex] = useState(1)

  // Custom "View" cursor pill over cards (disabled on touch)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isCursorVisible, setIsCursorVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches)
    }
  }, [])

  const handleCardMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return
    setCursorPos({ x: e.clientX, y: e.clientY })
  }

  const handleCardMouseEnter = () => {
    if (isTouchDevice) return
    setIsCursorVisible(true)
  }

  const handleCardMouseLeave = () => {
    setIsCursorVisible(false)
  }

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Responsive ScrollTrigger using gsap.matchMedia
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      // Precise distance calculations:
      // 1. Horizontal distance needed to translate track until Services panel is 100% visible
      const getHorizontalDistance = () => track.scrollWidth - window.innerWidth
      // 2. Hold distance during which Services panel stays pinned and fixed on screen
      const getHoldDistance = () => window.innerHeight * HOLD_VH
      // 3. Total scroll distance for the ScrollTrigger
      const getTotalScrollDistance = () => getHorizontalDistance() + getHoldDistance()

      const horizontalDist = getHorizontalDistance()
      const holdDist = getHoldDistance()

      // Single scrubbed GSAP timeline with two distinct segments:
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
      })

      // ===================================================================
      // SEGMENT 1: Horizontal travel (translateX tween, ease: "none")
      // ===================================================================
      tl.to(track, {
        x: () => -getHorizontalDistance(),
        ease: 'none',
        duration: horizontalDist,
      })

      // Add label "servicesVisible" at the exact moment the Services panel finishes arriving
      tl.addLabel('servicesVisible')

      // ===================================================================
      // SEGMENT 2: Hold segment (extra scroll distance of HOLD_VH ~ 80vh)
      // The Services panel stays pinned and fully visible while words highlight sequentially:
      // Word 0 (A.I.) -> Word 1 (DESIGN) -> Word 2 (DEVELOPMENT) -> Word 3 (BRANDING) -> all normal
      // ===================================================================
      const serviceWordElements = track.querySelectorAll<HTMLElement>('.service-word')

      if (serviceWordElements.length === 4 && !prefersReducedMotion) {
        const step = holdDist / 5

        // Step 1: Word 0 ("A.I.") highlights in brand color, others dim to ~35%
        tl.to(
          serviceWordElements[0],
          { color: 'var(--color-brand)', opacity: 1, x: 14, duration: step * 0.7, ease: 'power1.inOut' },
          'servicesVisible',
        )
        tl.to(
          [serviceWordElements[1], serviceWordElements[2], serviceWordElements[3]],
          { opacity: 0.35, color: 'var(--color-text)', x: 0, duration: step * 0.7, ease: 'power1.inOut' },
          'servicesVisible',
        )

        // Step 2: Word 1 ("DESIGN") highlights
        tl.to(
          serviceWordElements[1],
          { color: 'var(--color-brand)', opacity: 1, x: 14, duration: step * 0.7, ease: 'power1.inOut' },
          `servicesVisible+=${step}`,
        )
        tl.to(
          [serviceWordElements[0], serviceWordElements[2], serviceWordElements[3]],
          { opacity: 0.35, color: 'var(--color-text)', x: 0, duration: step * 0.7, ease: 'power1.inOut' },
          `servicesVisible+=${step}`,
        )

        // Step 3: Word 2 ("DEVELOPMENT") highlights
        tl.to(
          serviceWordElements[2],
          { color: 'var(--color-brand)', opacity: 1, x: 14, duration: step * 0.7, ease: 'power1.inOut' },
          `servicesVisible+=${step * 2}`,
        )
        tl.to(
          [serviceWordElements[0], serviceWordElements[1], serviceWordElements[3]],
          { opacity: 0.35, color: 'var(--color-text)', x: 0, duration: step * 0.7, ease: 'power1.inOut' },
          `servicesVisible+=${step * 2}`,
        )

        // Step 4: Word 3 ("BRANDING") highlights
        tl.to(
          serviceWordElements[3],
          { color: 'var(--color-brand)', opacity: 1, x: 14, duration: step * 0.7, ease: 'power1.inOut' },
          `servicesVisible+=${step * 3}`,
        )
        tl.to(
          [serviceWordElements[0], serviceWordElements[1], serviceWordElements[2]],
          { opacity: 0.35, color: 'var(--color-text)', x: 0, duration: step * 0.7, ease: 'power1.inOut' },
          `servicesVisible+=${step * 3}`,
        )

        // Step 5: Final state returns all words to normal before pin releases
        tl.to(
          serviceWordElements,
          { opacity: 1, color: 'var(--color-text)', x: 0, duration: step * 0.8, ease: 'power1.inOut' },
          `servicesVisible+=${step * 4}`,
        )
      } else {
        // Fallback or reduced motion: hold position without word motion
        tl.to({}, { duration: holdDist }, 'servicesVisible')
      }

      // Ensure the timeline matches total length exactly
      tl.to({}, { duration: 0.01 }, `servicesVisible+=${holdDist}`)

      // Pinned ScrollTrigger with soft snap to "servicesVisible" within ±4%
      const trigger = ScrollTrigger.create({
        trigger: container,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        start: 'top top',
        end: () => `+=${getTotalScrollDistance()}`,
        animation: tl,
        snap: {
          snapTo: (value: number) => {
            const total = getTotalScrollDistance()
            const svProgress = total > 0 ? getHorizontalDistance() / total : 1
            const threshold = 0.04 // within ±4%
            if (Math.abs(value - svProgress) <= threshold) {
              return svProgress
            }
            return value // everywhere else scrolling stays completely free
          },
          duration: { min: 0.3, max: 0.6 },
          ease: 'power2.inOut',
          delay: 0.15, // small delay so it doesn't fight active scrolling
        },
        onUpdate: (self) => {
          const total = getTotalScrollDistance()
          const svProgress = total > 0 ? getHorizontalDistance() / total : 1

          // Progress line and counter reflect only the horizontal segment:
          // complete at "servicesVisible" and stay complete during the hold
          const horizontalProgress = Math.min(1, Math.max(0, self.progress / svProgress))
          setScrollProgress(horizontalProgress)

          const totalCards = projectList.length
          const current = Math.min(totalCards, Math.max(1, Math.ceil(horizontalProgress * (totalCards + 0.5))))
          setActiveCardIndex(current)
        },
      })

      // Intro heading reveal on enter
      if (!prefersReducedMotion && introHeadingRef.current) {
        const lines = introHeadingRef.current.querySelectorAll('.intro-line')
        gsap.fromTo(
          lines,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          },
        )
      }

      // Dual-layer subtle parallax driven by containerAnimation!
      if (!prefersReducedMotion) {
        const cardPanels = track.querySelectorAll('.project-card-panel')
        cardPanels.forEach((cardPanel, index) => {
          const cardParallaxWrap = cardPanel.querySelector('.card-parallax-wrap')
          const imgMover = cardPanel.querySelector('.card-img-mover')
          const isOffset = index % 2 === 1

          if (cardParallaxWrap) {
            gsap.fromTo(
              cardParallaxWrap,
              { y: isOffset ? 28 : -28 },
              {
                y: isOffset ? -28 : 28,
                ease: 'none',
                scrollTrigger: {
                  trigger: cardPanel,
                  containerAnimation: tl,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              },
            )
          }

          if (imgMover) {
            gsap.fromTo(
              imgMover,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: 'none',
                scrollTrigger: {
                  trigger: cardPanel,
                  containerAnimation: tl,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              },
            )
          }
        })
      }

      return () => {
        trigger.kill()
        tl.kill()
      }
    })

    // Refresh ScrollTrigger after images and fonts load
    const images = track.querySelectorAll('img')
    let loaded = 0
    const total = images.length
    if (total === 0) {
      ScrollTrigger.refresh()
    } else {
      images.forEach((img) => {
        if (img.complete) {
          loaded++
          if (loaded === total) ScrollTrigger.refresh()
        } else {
          img.addEventListener(
            'load',
            () => {
              loaded++
              if (loaded === total) ScrollTrigger.refresh()
            },
            { once: true },
          )
        }
      })
    }

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh()
      })
    }

    return () => {
      mm.revert()
    }
  }, [projectList.length])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        backgroundColor: 'var(--color-page-white, #fbf7f2)',
        backgroundImage: `
          radial-gradient(ellipse 65% 50% at 88% 12%, rgb(47 91 234 / 0.07), transparent 70%),
          radial-gradient(ellipse 45% 40% at 12% 88%, rgb(245 200 76 / 0.05), transparent 60%),
          linear-gradient(180deg, var(--color-page-white, #fbf7f2) 0%, var(--color-brand-soft, #e8eefc) 65%, var(--color-bg-subtle, #f7f1ea) 100%)
        `,
        fontFamily: FONT_HEADING,
      }}
    >
      {/* Optional Standalone Header */}
      {showHeader && (
        <FixedHeader
          logo={logo}
          isMuted={isMuted}
          onToggleSound={() => setIsMuted((prev) => !prev)}
        />
      )}

      {/* Custom "View" Cursor Pill for Cards */}
      {!isTouchDevice && isCursorVisible && (
        <div
          className="fixed pointer-events-none z-50 rounded-full bg-[var(--color-brand)] px-3.5 py-1 text-[11px] font-mono font-semibold tracking-wider text-white uppercase shadow-lg -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out select-none"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            fontFamily: FONT_MONO,
          }}
        >
          View
        </div>
      )}

      {/* Horizontal Flex Track (Pinned on Desktop, Native Scroll on Mobile) */}
      <div
        ref={trackRef}
        className="flex h-screen w-max will-change-transform md:flex-row flex-col md:h-screen h-auto md:w-max w-full"
      >
        {/* ================================================================= */}
        {/* 1. INTRO PANEL (~45vw)                                            */}
        {/* ================================================================= */}
        <section
          className="relative flex h-screen w-screen md:w-[44vw] md:min-w-[40vw] md:max-w-[48vw] shrink-0 flex-col justify-between pt-[calc(var(--header-clearance,5.75rem)+1.5rem)] pb-12 px-[6vw] border-b md:border-b-0 md:border-r border-[var(--color-border)]/60"
          aria-label="Selected Work Introduction"
        >
          {/* Top Label */}
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--color-brand)]" />
            <span
              className="font-mono text-[12px] md:text-[13px] tracking-widest text-[var(--color-text-secondary)] uppercase"
              style={{ fontFamily: FONT_MONO }}
            >
              PORTFOLIO SHOWCASE
            </span>
          </div>

          {/* Heading with line-by-line reveal */}
          <div className="my-auto py-6">
            <h2
              ref={introHeadingRef}
              className="text-[clamp(54px,7.8vw,125px)] font-normal leading-[0.92] tracking-[-0.05em] text-[var(--color-text)]"
              style={{ fontFamily: FONT_HEADING }}
            >
              <span className="block overflow-hidden">
                <span className="intro-line inline-block">Selected work</span>
              </span>
              <span className="block overflow-hidden">
                <span className="intro-line inline-block">&amp; explorations</span>
              </span>
            </h2>

            {/* VIEW ALL PROJECTS → link */}
            <div className="mt-10 md:mt-14">
              <a
                href={viewAllLink}
                className="group relative inline-flex items-center justify-between w-[240px] md:w-[270px] border-b border-[var(--color-border-strong)] pb-1.5 font-mono text-[13px] md:text-[15px] tracking-[0.05em] text-[var(--color-text)] uppercase transition-colors hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] no-underline"
                style={{ fontFamily: FONT_MONO }}
              >
                <span>VIEW ALL PROJECTS</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2 text-[var(--color-brand)]">
                  →
                </span>
                <span className="absolute -bottom-[1px] left-0 w-full h-[1.5px] bg-[var(--color-brand)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            </div>
          </div>

          {/* Subtle Bottom Note */}
          <div className="text-[13px] text-[var(--color-text-muted)]">
            Explore recent digital health, education &amp; AI platforms.
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. PROJECT CARDS (Real projects, Staggered offsets, Full-width blurbs) */}
        {/* ================================================================= */}
        {projectList.map((project, index) => {
          const isLower = project.verticalOffset === 'lower' || index % 2 === 1

          return (
            <section
              key={project.id}
              className="project-card-panel relative flex h-screen w-screen md:w-[38vw] md:min-w-[36vw] md:max-w-[42vw] shrink-0 flex-col justify-center px-[5.5vw] pt-[calc(var(--header-clearance,5.75rem)+1.5rem)] pb-12 border-b md:border-b-0 md:border-r border-[var(--color-border)]/60"
              aria-label={project.title}
              onMouseMove={handleCardMouseMove}
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
            >
              {/* Entire Card is an Interactive Link */}
              <a
                href={project.link ?? `/work/${project.id}`}
                className="group block no-underline focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] rounded-xl"
              >
                {/* Staggered Vertical Offset container: card 1 top, card 2 ~90px lower, card 3 top */}
                <div
                  className={`w-full transition-transform duration-300 ${
                    isLower ? 'md:mt-[75px] lg:mt-[85px]' : 'md:mt-0'
                  }`}
                >
                  {/* GSAP Parallax Card Container */}
                  <div className="card-parallax-wrap">
                    {/* Card Image: Aspect ratio ~1.46:1, rounded 12px, overflow hidden, slight scale 1.05 -> 1 on hover */}
                    <div className="relative aspect-[1.46/1] w-full overflow-hidden rounded-[12px] bg-[var(--color-brand-soft)] shadow-[0_16px_36px_rgb(13_18_31/0.07)] border border-[var(--color-border)]/80">
                      {/* Inner Image Mover for Dual-Layer Parallax */}
                      <div className="card-img-mover absolute -inset-y-[10%] inset-x-0 w-full h-[120%] flex items-center justify-center p-6">
                        <img
                          src={project.image}
                          alt={project.alt ?? project.title}
                          loading="lazy"
                          className="h-full w-full object-contain transform-gpu scale-[1.04] transition-transform duration-700 ease-out group-hover:scale-100"
                        />
                      </div>
                    </div>

                    {/* Below Image Information */}
                    <div className="mt-5 md:mt-6">
                      {/* Title: 28-32px, weight 400, tracking -0.03em */}
                      <h3
                        className="text-[26px] md:text-[30px] font-normal tracking-[-0.03em] text-[var(--color-text)] leading-tight transition-colors group-hover:text-[var(--color-brand)]"
                        style={{ fontFamily: FONT_HEADING }}
                      >
                        {project.title}
                      </h3>

                      {/* Description: full width over 2 lines, no line-clamp truncation, not squeezed by link */}
                      <p
                        className="mt-2.5 text-[15px] md:text-[17px] text-[var(--color-text-secondary)] leading-[1.4] w-full"
                        style={{ fontFamily: FONT_HEADING }}
                      >
                        {project.description}
                      </p>

                      {/* Link Row Below Description: aligned cleanly across the bottom */}
                      <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-[var(--color-border)]/70">
                        <span
                          className="text-[12px] font-mono tracking-widest text-[var(--color-text-muted)] uppercase"
                          style={{ fontFamily: FONT_MONO }}
                        >
                          {project.category}
                        </span>

                        <div
                          className="relative inline-flex items-center gap-2 font-mono text-[12px] md:text-[13px] tracking-[0.05em] text-[var(--color-text)] uppercase group-hover:text-[var(--color-brand)] transition-colors"
                          style={{ fontFamily: FONT_MONO }}
                        >
                          <span>EXPLORE PROJECT</span>
                          <span className="transition-transform duration-300 group-hover:translate-x-1.5 text-[var(--color-brand)]">
                            →
                          </span>
                          <span className="absolute -bottom-[2px] left-0 w-full h-[1.5px] bg-[var(--color-brand)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </section>
          )
        })}

        {/* ================================================================= */}
        {/* 3. CLOSING PANEL (~38vw)                                          */}
        {/* ================================================================= */}
        <section
          className="relative flex h-screen w-screen md:w-[38vw] md:min-w-[36vw] md:max-w-[42vw] shrink-0 flex-col items-center justify-center text-center px-[5vw] pt-[calc(var(--header-clearance,5.75rem)+1.5rem)] pb-12 border-b md:border-b-0 md:border-r border-[var(--color-border)]/60"
          aria-label="Collection Summary"
        >
          <div className="max-w-[480px] flex flex-col items-center">
            {/* Centered statement text: ~40px, tight tracking */}
            <p
              className="text-[28px] sm:text-[34px] md:text-[38px] font-normal tracking-[-0.035em] text-[var(--color-text)] leading-[1.2]"
              style={{ fontFamily: FONT_HEADING }}
            >
              Discover our complete collection of digital experiences, brands, and platforms.
            </p>

            {/* VIEW ALL PROJECTS → link */}
            <div className="mt-8 md:mt-10">
              <a
                href={viewAllLink}
                className="group relative inline-flex items-center justify-between w-[230px] md:w-[260px] border-b border-[var(--color-border-strong)] pb-1.5 font-mono text-[13px] md:text-[15px] tracking-[0.05em] text-[var(--color-text)] uppercase transition-colors hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] no-underline"
                style={{ fontFamily: FONT_MONO }}
              >
                <span>VIEW ALL PROJECTS</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2 text-[var(--color-brand)]">
                  →
                </span>
                <span className="absolute -bottom-[1px] left-0 w-full h-[1.5px] bg-[var(--color-brand)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            </div>
          </div>

          {/* Thin 'X' cross mark sitting on the right divider line with brand accent color */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 hidden md:flex items-center justify-center pointer-events-none select-none text-[var(--color-accent)]"
            aria-hidden="true"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </svg>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. OUR SERVICES SECTION (Slides in horizontally from the right)    */}
        {/* ================================================================= */}
        <ServicesSection />
      </div>

      {/* =================================================================== */}
      {/* 5. BOTTOM BAR: ACTIVE CARD COUNTER + THIN PROGRESS LINE             */}
      {/* =================================================================== */}
      <div className="hidden md:flex absolute bottom-5 left-10 right-10 z-30 items-center justify-between pointer-events-none select-none">
        {/* "01 / 0N" Counter in Mono */}
        <div
          className="font-mono text-[12px] tracking-widest text-[var(--color-text-secondary)] font-medium"
          style={{ fontFamily: FONT_MONO }}
        >
          <span>{String(activeCardIndex).padStart(2, '0')}</span>
          <span className="mx-1 text-[var(--color-text-muted)]">/</span>
          <span className="text-[var(--color-text-muted)]">
            {String(projectList.length).padStart(2, '0')}
          </span>
        </div>

        {/* Thin Progress Track with Brand Accent Thumb */}
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[11px] tracking-wider text-[var(--color-text-muted)] uppercase"
            style={{ fontFamily: FONT_MONO }}
          >
            PROGRESS
          </span>
          <div className="w-[120px] h-[2px] bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-brand)] transition-all duration-75 ease-out rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HorizontalWork
