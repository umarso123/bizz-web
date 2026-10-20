import { useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/* -------------------------------------------------------------------------- */
/*                               TYPES & DATA                                 */
/* -------------------------------------------------------------------------- */

export interface ProjectItem {
  id: string
  title: string
  description: string
  image: string
  alt?: string
  link?: string
  verticalOffset?: 'top' | 'lower'
}

export const defaultProjects: ProjectItem[] = [
  {
    id: 'myworker-ai',
    title: 'MyWorker AI',
    description: 'AI platform simplifying hiring, management, and workforce scaling.',
    image: '/images/projects/myworker-ai.jpg',
    alt: 'MyWorker AI platform preview',
    link: '#myworker-ai',
    verticalOffset: 'top',
  },
  {
    id: 'pulse-studio',
    title: 'Pulse Studio',
    description: 'A motion-led studio website showcasing artists, projects, and culture.',
    image: '/images/projects/pulse-studio.jpg',
    alt: 'Pulse Studio website preview',
    link: '#pulse-studio',
    verticalOffset: 'lower', // ~90px lower down
  },
  {
    id: 'loftloom',
    title: 'Loftloom',
    description: 'Seamless real estate platform for effortless property discovery.',
    image: '/images/projects/loftloom.jpg',
    alt: 'Loftloom real estate platform preview',
    link: '#loftloom',
    verticalOffset: 'top',
  },
]

// Alias for convenience / prompt specification
export const projects = defaultProjects

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
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10 md:py-7 pointer-events-none select-none">
      {/* Left: Brand Logo */}
      <div className="pointer-events-auto flex items-center">
        {logo ?? (
          <a
            href="/"
            className="flex items-center gap-2.5 text-black no-underline transition-opacity hover:opacity-80"
            aria-label="TRIONN Home"
          >
            {/* Geometric TRIONN monogram mark */}
            <svg
              className="w-7 h-7 text-black shrink-0"
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16 2L3 28h26L16 2zm0 7.8L23.4 24H8.6L16 9.8z" />
              <polygon points="16,13 11,23 21,23" />
            </svg>
            <span
              className="text-[20px] md:text-[22px] font-bold tracking-[-0.04em] uppercase text-black"
              style={{
                fontFamily:
                  "'Neue Montreal', 'Inter Tight', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              TRIONN<sup>®</sup>
            </span>
          </a>
        )}
      </div>

      {/* Right: Actions */}
      <div className="pointer-events-auto flex items-center gap-2.5 md:gap-3.5">
        {/* Round Sound Button */}
        <button
          type="button"
          onClick={onToggleSound}
          className="group relative flex size-11 md:size-12 items-center justify-center rounded-full bg-[#e6e6e6] text-[#333] transition-all hover:bg-[#dedede] hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-black cursor-pointer"
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          title={isMuted ? 'Play sound' : 'Mute sound'}
        >
          {isMuted ? (
            <svg
              className="w-4 h-4 text-[#555] transition-colors group-hover:text-black"
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
              className="w-4 h-4 text-black animate-pulse"
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

        {/* Black Pill: LET'S TALK */}
        <button
          type="button"
          onClick={onTalkClick}
          className="flex h-[44px] md:h-[48px] items-center justify-center rounded-[24px] bg-black px-6 text-[12px] md:text-[13px] font-semibold tracking-wider text-white uppercase transition-all hover:bg-[#222] hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-black cursor-pointer"
          style={{
            fontFamily:
              "'Neue Montreal', 'Inter Tight', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          LET&apos;S TALK
        </button>

        {/* Outlined Pill: MENU = */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-[44px] md:h-[48px] items-center justify-center gap-1.5 rounded-[24px] border border-black bg-transparent px-5 text-[12px] md:text-[13px] font-semibold tracking-wider text-black uppercase transition-all hover:bg-black/5 active:scale-95 focus-visible:outline-2 focus-visible:outline-black cursor-pointer"
          style={{
            fontFamily:
              "'Neue Montreal', 'Inter Tight', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
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
  const services = ['A.I.', 'DESIGN', 'DEVELOPMENT', 'BRANDING']

  return (
    <section
      id={id}
      className={`relative w-screen min-w-[100vw] h-screen bg-white shrink-0 flex flex-col justify-center px-[7vw] md:px-[9vw] z-10 select-none ${className}`}
      aria-label="Our Services"
    >
      {/* Top-left small uppercase label */}
      <p
        className="font-mono text-[14px] md:text-[18px] tracking-[0.08em] text-[#666] uppercase mb-4 md:mb-6"
        style={{
          fontFamily:
            "'JetBrains Mono', 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        OUR SERVICES
      </p>

      {/* Giant stacked words in tight grotesk */}
      <div className="flex flex-col">
        {services.map((service) => (
          <span
            key={service}
            className="font-normal text-[clamp(72px,15.5vw,250px)] leading-[0.82] tracking-[-0.06em] text-[#262626] transition-all duration-300 hover:text-black hover:translate-x-3 cursor-default"
            style={{
              fontFamily:
                "'Neue Montreal', 'Inter Tight', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            {service}
          </span>
        ))}
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
  showHeader = true,
  logo,
  className = '',
  viewAllLink = '#all-projects',
}: HorizontalWorkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    // 1. Setup smooth scrolling with Lenis if not already instantiated globally
    let lenis: Lenis | null = null
    const existingLenis = (window as unknown as { __lenis?: Lenis }).__lenis
    let tickHandler: ((time: number) => void) | null = null

    if (!existingLenis) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

      const onLenisScroll = () => {
        ScrollTrigger.update()
      }
      lenis.on('scroll', onLenisScroll)

      tickHandler = (time: number) => {
        lenis?.raf(time * 1000)
      }
      gsap.ticker.add(tickHandler)
      gsap.ticker.lagSmoothing(0)
    } else {
      existingLenis.on('scroll', ScrollTrigger.update)
    }

    // 2. Responsive ScrollTrigger using gsap.matchMedia
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      // Find the services panel width to calculate the exact end trigger
      const getServicesPanelWidth = () => {
        const servicesEl = track.querySelector<HTMLElement>('#our-services')
        return servicesEl ? servicesEl.offsetWidth : window.innerWidth
      }

      // Distance to translate track so Services panel is 100% in view
      const getScrollDistance = () => track.scrollWidth - window.innerWidth

      // Main scrub tween that translates track along X with ease: "none"
      const horizontalTween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
      })

      // Pinned ScrollTrigger with exact prompt specifications:
      // pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
      // end: () => "+=" + (track.scrollWidth - window.innerWidth + servicesPanelWidth)
      const trigger = ScrollTrigger.create({
        trigger: container,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        start: 'top top',
        end: () => `+=${getScrollDistance() + getServicesPanelWidth()}`,
        animation: horizontalTween,
      })

      // Dual-layer subtle parallax driven by containerAnimation!
      // Layer 1: Card container translates on Y
      // Layer 2: Inner image mover translates at a different speed
      const cardPanels = track.querySelectorAll('.project-card-panel')
      cardPanels.forEach((cardPanel, index) => {
        const cardParallaxWrap = cardPanel.querySelector('.card-parallax-wrap')
        const imgMover = cardPanel.querySelector('.card-img-mover')
        const isOffset = index % 2 === 1

        if (cardParallaxWrap) {
          gsap.fromTo(
            cardParallaxWrap,
            { y: isOffset ? 35 : -35 },
            {
              y: isOffset ? -35 : 35,
              ease: 'none',
              scrollTrigger: {
                trigger: cardPanel,
                containerAnimation: horizontalTween,
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
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: cardPanel,
                containerAnimation: horizontalTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        }
      })

      return () => {
        trigger.kill()
        horizontalTween.kill()
      }
    })

    // 3. Refresh ScrollTrigger after images load
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

    return () => {
      mm.revert()
      if (lenis) {
        if (tickHandler) gsap.ticker.remove(tickHandler)
        lenis.destroy()
        delete (window as unknown as { __lenis?: Lenis }).__lenis
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #ececec 65%, #d4d4d4 100%)',
      }}
    >
      {/* Fixed Header (above everything, z-index 50) */}
      {showHeader && (
        <FixedHeader
          logo={logo}
          isMuted={isMuted}
          onToggleSound={() => setIsMuted((prev) => !prev)}
        />
      )}

      {/* Horizontal Flex Track */}
      <div
        ref={trackRef}
        className="flex h-screen w-max will-change-transform md:flex-row flex-col md:h-screen h-auto md:w-max w-full"
      >
        {/* ================================================================= */}
        {/* 1. INTRO PANEL (~45vw)                                            */}
        {/* ================================================================= */}
        <section
          className="relative flex h-screen w-screen md:w-[45vw] md:min-w-[42vw] md:max-w-[48vw] shrink-0 flex-col justify-between py-[14vh] px-[6vw] border-b md:border-b-0 md:border-r border-[rgba(0,0,0,0.08)]"
          aria-label="Selected Work Introduction"
        >
          {/* Huge Heading: 2 lines, clamp(64px, 9vw, 150px), weight 400, letter-spacing -0.06em, line-height 0.9, color #3a3a3a */}
          <div className="my-auto">
            <h2
              className="text-[clamp(64px,9vw,150px)] font-normal leading-[0.9] tracking-[-0.06em] text-[#3a3a3a]"
              style={{
                fontFamily:
                  "'Neue Montreal', 'Inter Tight', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Selected work
              <br />
              &amp; explorations
            </h2>

            {/* VIEW ALL PROJECTS → link: monospace, uppercase, 14-16px, letter-spacing 0.05em, 1px bottom border, arrow right-aligned inside underline */}
            <div className="mt-12 md:mt-16">
              <a
                href={viewAllLink}
                className="group inline-flex items-center justify-between w-[240px] md:w-[280px] border-b border-[#3a3a3a] pb-1.5 font-mono text-[14px] md:text-[16px] tracking-[0.05em] text-[#3a3a3a] uppercase hover:text-black hover:border-black transition-colors"
                style={{
                  fontFamily:
                    "'JetBrains Mono', 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                <span>VIEW ALL PROJECTS</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. PROJECT CARDS (one panel each, ~38vw wide, side padding ~6vw)   */}
        {/* ================================================================= */}
        {projectList.map((project, index) => {
          const isLower = project.verticalOffset === 'lower' || index % 2 === 1

          return (
            <section
              key={project.id}
              className="project-card-panel relative flex h-screen w-screen md:w-[38vw] md:min-w-[36vw] md:max-w-[42vw] shrink-0 flex-col justify-center px-[6vw] border-b md:border-b-0 md:border-r border-[rgba(0,0,0,0.08)]"
              aria-label={project.title}
            >
              {/* Entire Card is a Link */}
              <a
                href={project.link ?? `#${project.id}`}
                className="group block no-underline focus-visible:outline-2 focus-visible:outline-black rounded-[12px]"
              >
                {/* Staggered Vertical Offset container: card 1 top, card 2 ~90px lower, card 3 top */}
                <div
                  className={`w-full transition-transform duration-300 ${
                    isLower ? 'md:mt-[90px]' : 'md:mt-0'
                  }`}
                >
                  {/* Parallax Card Container (translates slightly on Y via GSAP) */}
                  <div className="card-parallax-wrap">
                    {/* Card Image: aspect ratio ~1.46:1 (about 717x490), border-radius 12px, overflow hidden, object-fit cover, slight scale 1.05 -> 1 on hover */}
                    <div className="relative aspect-[1.46/1] w-full overflow-hidden rounded-[12px] bg-neutral-200 shadow-[0_20px_45px_rgb(0_0_0/0.07)]">
                      {/* Inner Image Mover (moves at different speed than card for dual-layer parallax) */}
                      <div className="card-img-mover absolute -inset-y-[12%] inset-x-0 w-full h-[124%]">
                        <img
                          src={project.image}
                          alt={project.alt ?? project.title}
                          loading="lazy"
                          className="h-full w-full object-cover transform-gpu scale-[1.05] transition-transform duration-700 ease-out group-hover:scale-100"
                        />
                      </div>
                    </div>

                    {/* Below Image Information */}
                    <div className="mt-5 md:mt-6">
                      {/* Title: 28-32px, weight 400, tracking -0.03em, #444 */}
                      <h3
                        className="text-[28px] md:text-[32px] font-normal tracking-[-0.03em] text-[#444] leading-tight transition-colors group-hover:text-black"
                        style={{
                          fontFamily:
                            "'Neue Montreal', 'Inter Tight', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
                        }}
                      >
                        {project.title}
                      </h3>

                      {/* 2-line Description (18-20px, #666) + Right-aligned EXPLORE PROJECT → mono link with underline */}
                      <div className="mt-2.5 flex items-end justify-between gap-4">
                        <p
                          className="text-[18px] md:text-[20px] text-[#666] leading-[1.3] max-w-[28ch] line-clamp-2"
                          style={{
                            fontFamily:
                              "'Neue Montreal', 'Inter Tight', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
                          }}
                        >
                          {project.description}
                        </p>

                        <div
                          className="shrink-0 flex items-center justify-between border-b border-[#444] pb-1 font-mono text-[13px] md:text-[14px] tracking-[0.05em] text-[#444] uppercase group-hover:border-black group-hover:text-black transition-colors w-[170px] md:w-[195px]"
                          style={{
                            fontFamily:
                              "'JetBrains Mono', 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          <span>EXPLORE PROJECT</span>
                          <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                            →
                          </span>
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
        {/* 3. CLOSING PANEL                                                  */}
        {/* ================================================================= */}
        <section
          className="relative flex h-screen w-screen md:w-[38vw] md:min-w-[36vw] md:max-w-[42vw] shrink-0 flex-col items-center justify-center text-center px-[5vw] border-b md:border-b-0 md:border-r border-[rgba(0,0,0,0.08)]"
          aria-label="Collection Summary"
        >
          <div className="max-w-[520px] flex flex-col items-center">
            {/* Centered text: ~40px, tight tracking, #444 */}
            <p
              className="text-[30px] sm:text-[36px] md:text-[40px] font-normal tracking-[-0.04em] text-[#444] leading-[1.18]"
              style={{
                fontFamily:
                  "'Neue Montreal', 'Inter Tight', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Discover our complete collection of digital experiences, brands, and platforms.
            </p>

            {/* VIEW ALL PROJECTS → link */}
            <div className="mt-8 md:mt-10">
              <a
                href={viewAllLink}
                className="group inline-flex items-center justify-between w-[230px] md:w-[260px] border-b border-[#3a3a3a] pb-1.5 font-mono text-[14px] md:text-[16px] tracking-[0.05em] text-[#3a3a3a] uppercase hover:text-black hover:border-black transition-colors"
                style={{
                  fontFamily:
                    "'JetBrains Mono', 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                <span>VIEW ALL PROJECTS</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Thin 'X' cross mark sitting on the right divider line */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 hidden md:flex items-center justify-center pointer-events-none select-none text-[#888]"
            aria-hidden="true"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <line x1="2" y1="2" x2="12" y2="12" />
              <line x1="12" y1="2" x2="2" y2="12" />
            </svg>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. OUR SERVICES SECTION (Slides in horizontally from the right)    */}
        {/* ================================================================= */}
        <ServicesSection />
      </div>
    </div>
  )
}

export default HorizontalWork
