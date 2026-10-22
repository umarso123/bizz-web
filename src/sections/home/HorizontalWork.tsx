import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Arrow, PaperLink } from '@/components/paper/kit.tsx'
import { PaperPin } from '@/components/paper/paper.tsx'
import { mockups } from '@/content/mockups.ts'
import { cn } from '@/lib/cn.ts'
import { paperFont } from '@/lib/paper-theme.ts'
import { WorkStill } from '@/sections/work/WorkStill.tsx'

gsap.registerPlugin(ScrollTrigger)

/* -------------------------------------------------------------------------- */
/*                               DESIGN TOKENS                                */
/* -------------------------------------------------------------------------- */

/** House face, spelled out for canvas text measuring (canvas can't read CSS vars). */
const FONT_HEADING = paperFont

/** Left edge of the homepage container, for panels that start at the viewport edge. */
const EDGE = 'ps-[max(clamp(20px,5vw,96px),calc((100vw-1440px)/2+clamp(20px,5vw,96px)))]'
const EDGE_LEFT = 'left-[max(clamp(20px,5vw,96px),calc((100vw-1440px)/2+clamp(20px,5vw,96px)))]'

/** Each print sits a little off-square. */
const CARD_ROT = ['-1.2deg', '0.9deg', '-0.6deg', '1.1deg']

/** Legacy project types (content/legacy-site.md). */
const PROJECT_TYPES = ['Website', 'Logo', 'UI/UX', 'Product', 'Dashboard'] as const

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
  /** null: no published board, so the card shows the drawn product still. */
  image: string | null
  alt?: string
  link?: string
  verticalOffset?: 'top' | 'lower'
}

/**
 * Real project data from Bizaffix portfolio (content/featured-projects.ts & work.ts)
 */
export const defaultProjects: ProjectItem[] = [
  {
    id: 'clinical-decision-support',
    number: '01',
    title: 'Clinical Decision Support',
    category: 'Digital health, CDS',
    description: 'Custom healthcare experiences spanning clinical workflows, care access, and connected data.',
    image: null,
    alt: 'Clinical decision support product still',
    link: '/work/clinical-decision-support',
    verticalOffset: 'top',
  },
  {
    id: 'traino-ai',
    number: '02',
    title: 'Traino.ai',
    category: 'Education, AI learning platform',
    description: 'An AI-powered LMS built to optimize training knowledge retention and workforce learning.',
    image: mockups.trainoLaptop,
    alt: 'Traino.ai dashboard on laptop',
    link: '/work/traino-ai',
    verticalOffset: 'lower', // ~90px lower down
  },
  {
    id: 'poised-journey-academy',
    number: '03',
    title: 'The Poised Journey Academy',
    category: 'Education, homeschooling',
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
    category: 'Fitness',
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
        // Match the rendered words: medium weight, normal width
        ctx.font = `500 100px ${fontFamily}`
        wordWidthAt100 = ctx.measureText(longestWord).width
        // Negative letter-spacing adjustment (-0.04em)
        wordWidthAt100 = Math.max(100, wordWidthAt100 - longestWord.length * 4)
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
/*                            SERVICES SECTION                                */
/* -------------------------------------------------------------------------- */

export interface ServicesSectionProps {
  className?: string
  id?: string
}

export function ServicesSection({ className = '', id = 'our-services' }: ServicesSectionProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const services = ['Healthcare', 'Design', 'Development', 'Branding']
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  const dynamicFontSize = useFitText({
    words: services,
    containerRef: panelRef,
    fontFamily: FONT_HEADING,
    lineHeight: 0.95,
    paddingInlinePercent: 0.16,
    maxFontSize: 200,
    minFontSize: 36,
  })

  return (
    <section
      ref={panelRef}
      id={id}
      className={cn(
        'relative z-10 flex h-screen w-screen min-w-[100vw] shrink-0 flex-col justify-center px-[8vw] pt-[calc(var(--header-clearance,5.75rem)+1.5rem)] pb-24 select-none',
        className,
      )}
      aria-label="What we do"
    >
      <p className="ph-label mb-6 text-white/80 md:mb-8">What we do</p>

      {/* Large stacked words; scroll highlights each in turn */}
      <div className="flex flex-col justify-center">
        {services.map((service, index) => {
          const isHovered = hoveredService === index
          const isDimmed = hoveredService !== null && !isHovered
          const isLead = index === 0

          return (
            <div key={service} className="overflow-hidden py-0.5">
              <span
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
                className={cn(
                  'service-word inline-block leading-[0.95] font-medium tracking-[-0.045em] whitespace-nowrap transition-[color,opacity] duration-300',
                  isHovered ? 'text-[var(--ph-yellow)]! opacity-100!' : isDimmed ? 'text-white opacity-30!' : 'text-white',
                )}
                style={{ fontSize: `${dynamicFontSize}px` }}
              >
                {service}
                {isLead ? <span className="text-[var(--ph-yellow)]">.</span> : null}
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
  className?: string
  viewAllLink?: string
}

export function HorizontalWork({
  projects: projectList = defaultProjects,
  className = '',
  viewAllLink = '/work',
}: HorizontalWorkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const introHeadingRef = useRef<HTMLHeadingElement>(null)

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
      // Word 0 (HEALTHCARE) -> Word 1 (DESIGN) -> Word 2 (DEVELOPMENT) -> Word 3 (BRANDING) -> all normal
      // ===================================================================
      const serviceWordElements = track.querySelectorAll<HTMLElement>('.service-word')

      if (serviceWordElements.length === 4 && !prefersReducedMotion) {
        const step = holdDist / 5

        // Step 1: Word 0 ("HEALTHCARE") highlights in brand color, others dim to ~35%
        tl.to(
          serviceWordElements[0],
          { color: '#FDE36E', opacity: 1, x: 14, duration: step * 0.7, ease: 'power1.inOut' },
          'servicesVisible',
        )
        tl.to(
          [serviceWordElements[1], serviceWordElements[2], serviceWordElements[3]],
          { opacity: 0.35, color: '#FFFFFF', x: 0, duration: step * 0.7, ease: 'power1.inOut' },
          'servicesVisible',
        )

        // Step 2: Word 1 ("DESIGN") highlights
        tl.to(
          serviceWordElements[1],
          { color: '#FDE36E', opacity: 1, x: 14, duration: step * 0.7, ease: 'power1.inOut' },
          `servicesVisible+=${step}`,
        )
        tl.to(
          [serviceWordElements[0], serviceWordElements[2], serviceWordElements[3]],
          { opacity: 0.35, color: '#FFFFFF', x: 0, duration: step * 0.7, ease: 'power1.inOut' },
          `servicesVisible+=${step}`,
        )

        // Step 3: Word 2 ("DEVELOPMENT") highlights
        tl.to(
          serviceWordElements[2],
          { color: '#FDE36E', opacity: 1, x: 14, duration: step * 0.7, ease: 'power1.inOut' },
          `servicesVisible+=${step * 2}`,
        )
        tl.to(
          [serviceWordElements[0], serviceWordElements[1], serviceWordElements[3]],
          { opacity: 0.35, color: '#FFFFFF', x: 0, duration: step * 0.7, ease: 'power1.inOut' },
          `servicesVisible+=${step * 2}`,
        )

        // Step 4: Word 3 ("BRANDING") highlights
        tl.to(
          serviceWordElements[3],
          { color: '#FDE36E', opacity: 1, x: 14, duration: step * 0.7, ease: 'power1.inOut' },
          `servicesVisible+=${step * 3}`,
        )
        tl.to(
          [serviceWordElements[0], serviceWordElements[1], serviceWordElements[2]],
          { opacity: 0.35, color: '#FFFFFF', x: 0, duration: step * 0.7, ease: 'power1.inOut' },
          `servicesVisible+=${step * 3}`,
        )

        // Step 5: Final state returns all words to normal before pin releases
        tl.to(
          serviceWordElements,
          { opacity: 1, color: '#FFFFFF', x: 0, duration: step * 0.8, ease: 'power1.inOut' },
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
      id="selected-work"
      className={cn('relative w-full overflow-hidden bg-[var(--ph-night)] text-white', className)}
    >

      {/* "View case study" label that follows the pointer over cards */}
      {!isTouchDevice && isCursorVisible && (
        <div
          aria-hidden="true"
          className="ph-label pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-[var(--ph-yellow)] px-3 py-1.5 text-[var(--ph-navy)] shadow-[0_6px_16px_rgb(10_26_58/0.35)] select-none"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
        >
          View case study
        </div>
      )}

      {/* Horizontal Flex Track (Pinned on Desktop, Native Scroll on Mobile) */}
      <div
        ref={trackRef}
        className="relative flex h-auto w-full flex-col will-change-transform md:h-screen md:w-max md:flex-row"
      >
        {/* 1. INTRO PANEL: starts on the same left edge as every other section */}
        <section
          className={cn(
            'relative flex w-screen shrink-0 flex-col justify-between gap-12 border-b border-white/15 pt-[calc(var(--header-clearance,5.75rem)+1.5rem)] pb-16 pe-[6vw] md:h-screen md:w-[44vw] md:min-w-[40vw] md:max-w-[48vw] md:border-r md:border-b-0 md:pb-24',
            EDGE,
          )}
          aria-labelledby="selected-work-title"
        >
          <div className="my-auto">
            <h2 id="selected-work-title" ref={introHeadingRef} className="ph-h2 text-white">
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="intro-line inline-block">Selected work</span>
              </span>
            </h2>
            <p className="ph-lead mt-6 text-white/85">Explored our projects yet? Have a look.</p>
            <PaperLink to={viewAllLink} className="mt-8 text-white">
              View all projects
            </PaperLink>
          </div>

          <p className="ph-label text-white/80">Digital health, education, and fitness products.</p>
        </section>

        {/* 2. PROJECT CARDS: cream prints, pinned and taped, slightly off-square */}
        {projectList.map((project, index) => {
          const isLower = project.verticalOffset === 'lower' || index % 2 === 1

          return (
            <section
              key={project.id}
              className="project-card-panel relative flex w-screen shrink-0 flex-col justify-center border-b border-white/15 px-[clamp(20px,5vw,96px)] pt-[calc(var(--header-clearance,5.75rem)+1.5rem)] pb-16 md:h-screen md:w-[38vw] md:min-w-[36vw] md:max-w-[42vw] md:border-r md:border-b-0 md:px-[3vw] md:pb-24"
              aria-label={project.title}
              onMouseMove={handleCardMouseMove}
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className={cn('w-full', isLower ? 'md:mt-12' : 'md:mt-0')}>
                <div className="card-parallax-wrap">
                  <Link
                    to={project.link ?? `/work/${project.id}`}
                    className="ph-paper ph-paper-cream ph-tilt group block p-4 text-[var(--ph-navy)] no-underline hover:text-[var(--ph-navy)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ph-yellow)] md:p-5"
                    style={{ '--rot': CARD_ROT[index % CARD_ROT.length] } as CSSProperties}
                  >
                    <PaperPin className="top-[20px] left-1/2" />
                    {/* A strip of tape over one corner */}
                    <span
                      aria-hidden="true"
                      className="absolute -top-2 -right-4 z-10 h-6 w-20 rotate-[32deg] bg-[rgb(253_227_110/0.85)] shadow-[0_1px_3px_rgb(10_26_58/0.25)]"
                    />
                    <div className="relative aspect-[1.46/1] w-full overflow-hidden rounded-[2px] border border-[var(--ph-border)] bg-white">
                      <div className="card-img-mover absolute inset-x-0 -inset-y-[10%] flex h-[120%] w-full items-center justify-center p-6">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.alt ?? project.title}
                            loading="lazy"
                            className="h-full w-full transform-gpu object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="absolute inset-0">
                            <WorkStill slug={project.id} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-1 pt-5 pb-2">
                      <p className="ph-label flex flex-wrap items-center gap-2 text-[var(--ph-grey)]">
                        <span>Case {project.number}</span>
                        <span className="bg-[var(--ph-yellow)] px-1.5 py-0.5 text-[var(--ph-navy)]">{project.category}</span>
                      </p>
                      <h3 className="ph-h3 mt-3">{project.title}</h3>
                      <p className="ph-body mt-2 text-[var(--ph-grey)]">{project.description}</p>
                      <span className="ph-link mt-4 text-[1rem] group-hover:bg-[length:100%_1.5px]">
                        View case study
                        <Arrow />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </section>
          )
        })}

        {/* 3. PROJECT TYPES: a compact paper spec list */}
        <section
          className="relative flex w-screen shrink-0 flex-col justify-center border-b border-white/15 px-[clamp(20px,5vw,96px)] pt-[calc(var(--header-clearance,5.75rem)+1.5rem)] pb-16 md:h-screen md:w-[34vw] md:min-w-[32vw] md:max-w-[38vw] md:border-r md:border-b-0 md:px-[3vw] md:pb-24"
          aria-labelledby="project-types-title"
        >
          <div className="ph-paper ph-paper-cream max-w-[26rem] text-[var(--ph-navy)]">
            <p className="ph-label text-[var(--ph-grey)]">Project types</p>
            <h3 id="project-types-title" className="ph-h3 mt-3">
              What we make
            </h3>
            <ul className="mt-6 border-t border-[var(--ph-border)]">
              {PROJECT_TYPES.map((type, index) => (
                <li key={type} className="grid grid-cols-[3.5rem_1fr] items-center border-b border-[var(--ph-border)] py-3">
                  <span className="ph-label text-[var(--ph-grey)]">PT-0{index + 1}</span>
                  <span className="ph-body">{type}</span>
                </li>
              ))}
            </ul>
            <PaperLink to={viewAllLink} className="mt-6">
              View all projects
            </PaperLink>
          </div>
        </section>

        {/* 4. WHAT WE DO (slides in from the right, then holds) */}
        <ServicesSection />
      </div>

      {/* 5. PROGRESS: below all content, 32px clear of the cards */}
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute right-[clamp(20px,5vw,96px)] bottom-6 z-30 hidden items-center gap-4 select-none md:flex', EDGE_LEFT)}
      >
        <p className="ph-label shrink-0 text-white/80">
          Project {activeCardIndex} of {projectList.length}
        </p>
        <div className="h-px flex-1 overflow-hidden bg-white/20">
          <div
            className="h-full bg-[var(--ph-yellow)] transition-[width] duration-75 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default HorizontalWork
