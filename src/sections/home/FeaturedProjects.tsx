import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { Link } from 'react-router'
import { Container } from '@/components/layout/Container.tsx'
import {
  featuredProjectsContent,
  type FeaturedProject,
} from '@/content/featured-projects.ts'
import { useMediaQuery } from '@/sections/home/homeJourney.ts'
import { cn } from '@/lib/cn.ts'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PAPER = '#fbf7f2'
const ORANGE = '#F5C84C'
const LERP = 0.085
const BREATH_AMP = 0.004

type LayerPose = {
  y: number
  scale: number
  rotate: number
  opacity: number
  blur: number
  z: number
}

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** Map scroll focus → layered sheet poses (incoming from below). */
function poseForDelta(delta: number, index: number, depthSoft: boolean): LayerPose {
  if (delta > 0) {
    const enter = clamp(delta)
    const deep = depthSoft ? 0.55 : 1
    return {
      y: enter * 108,
      scale: 1 - enter * 0.07 * deep,
      rotate: enter * 2.4 * deep,
      opacity: 1 - enter * 0.18,
      blur: enter * (depthSoft ? 3 : 5.5),
      z: 40 + index,
    }
  }

  const exit = clamp(Math.abs(delta))
  const deep = depthSoft ? 0.5 : 1
  return {
    y: -exit * 12 * deep,
    scale: 1 - exit * 0.09 * deep,
    rotate: -exit * 1.15 * deep,
    opacity: 1 - exit * 0.42,
    blur: exit * (depthSoft ? 1.5 : 2.8),
    z: 20 + index,
  }
}

function ProjectImage({ project }: { project: FeaturedProject }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg-muted">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 28% 22%, rgb(255 255 255 / 0.7), transparent 52%),
            radial-gradient(ellipse at 78% 78%, rgb(186 206 255 / 0.55), transparent 48%),
            linear-gradient(145deg, #fff9f2 0%, #fbf7f2 48%, #efe8df 100%)
          `,
        }}
      />
      {!failed ? (
        <img
          src={project.image}
          alt={project.alt}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
      {failed || !loaded ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-semibold tracking-tighter text-text/80">
            {project.number}
          </p>
          <p className="text-[clamp(1.25rem,2.4vw,2rem)] leading-none font-semibold tracking-tight text-text">
            {project.name}
          </p>
          <p className="text-eyebrow text-brand">
            {project.category}
          </p>
        </div>
      ) : null}
    </div>
  )
}

function SectionChrome({
  title,
  viewAllLabel,
  viewAllTo,
  headerRef,
}: {
  title: string
  viewAllLabel: string
  viewAllTo: string
  headerRef?: RefObject<HTMLDivElement | null>
}) {
  return (
    <div ref={headerRef} className="flex items-end justify-between gap-6">
      <h2
        id="featured-projects-title"
        className="text-[clamp(1.85rem,1.15rem+2.2vw,3.15rem)] leading-none font-semibold tracking-tighter text-text"
      >
        {title}
      </h2>
      <Link
        to={viewAllTo}
        className="group inline-flex shrink-0 items-center gap-2.5 text-[0.92rem] font-medium text-text-secondary no-underline transition-colors hover:text-text"
      >
        <span className="hidden sm:inline">{viewAllLabel}</span>
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    </div>
  )
}

function Atmosphere() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 18% 12%, rgb(255 255 255 / 0.16), transparent 58%),
            radial-gradient(ellipse 55% 45% at 88% 78%, rgb(245 200 76 / 0.1), transparent 55%),
            radial-gradient(ellipse 40% 35% at 55% 48%, rgb(255 255 255 / 0.07), transparent 60%)
          `,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[16%] left-[5%] hidden h-px w-24 bg-text/15 lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[15.55%] left-[5%] hidden size-1.5 -translate-x-1/2 rounded-full lg:block"
        style={{ backgroundColor: ORANGE }}
      />
    </>
  )
}

function MobileFeatured({
  projects,
  copy,
}: {
  projects: readonly FeaturedProject[]
  copy: typeof featuredProjectsContent
}) {
  return (
    <section
      id="featured-projects"
      className="relative overflow-hidden rounded-t-[2rem] py-12 md:rounded-t-[2.75rem] md:py-16"
      style={{ backgroundColor: PAPER }}
      aria-labelledby="featured-projects-title"
    >
      <Atmosphere />
      <Container variant="wide" className="relative z-10 w-full">
        <SectionChrome
          title={copy.title}
          viewAllLabel={copy.viewAllLabel}
          viewAllTo={copy.viewAllTo}
        />
        <ul className="mt-8 space-y-10">
          {projects.map((project) => (
            <li key={project.id} className="relative">
              <div className="overflow-hidden rounded-[1.75rem] shadow-[0_28px_70px_rgb(6_50_90/0.32)] ring-1 ring-white/15">
                <div className="relative aspect-16/10 w-full">
                  <ProjectImage project={project} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-text">
                <span className="text-eyebrow text-brand">
                  {project.number}
                </span>
                <h3 className="text-[1.2rem] font-semibold tracking-tight">{project.name}</h3>
                <span className="text-[0.78rem] text-text-secondary">{project.category}</span>
              </div>
              <p className="mt-2 max-w-xl text-[0.95rem] leading-snug text-text-secondary">
                {project.description}
              </p>
              <Link
                to={project.href}
                className="mt-3 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-text no-underline"
              >
                {copy.caseStudyLabel}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function ReducedFeatured({
  projects,
  copy,
}: {
  projects: readonly FeaturedProject[]
  copy: typeof featuredProjectsContent
}) {
  return (
    <section
      id="featured-projects"
      className="relative overflow-hidden rounded-t-[2.5rem] py-14 md:rounded-t-[3.25rem] md:py-20"
      style={{ backgroundColor: PAPER }}
      aria-labelledby="featured-projects-title"
    >
      <Atmosphere />
      <Container variant="wide" className="relative z-10 w-full">
        <SectionChrome
          title={copy.title}
          viewAllLabel={copy.viewAllLabel}
          viewAllTo={copy.viewAllTo}
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {projects.map((project) => (
            <article key={project.id}>
              <div className="overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_rgb(6_50_90/0.28)] ring-1 ring-white/15">
                <div className="relative aspect-16/10">
                  <ProjectImage project={project} />
                </div>
              </div>
              <div className="mt-4 text-text">
                <p className="text-eyebrow text-brand">
                  {project.number} · {project.category}
                </p>
                <h3 className="mt-1 text-title">{project.name}</h3>
                <p className="mt-2 text-body-small text-text-secondary">{project.description}</p>
                <Link
                  to={project.href}
                  className="mt-3 inline-flex text-body-small font-semibold text-text no-underline"
                >
                  {copy.caseStudyLabel} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

/**
 * Immersive featured projects stage.
 * Tall scroll → sticky viewport → each next project enters from below.
 */
export function FeaturedProjects() {
  const reduced = useReducedMotion() === true
  const isMobile = useMediaQuery('(max-width: 767px)')
  const softDepth = useMediaQuery('(max-width: 1023px)')
  const copy = featuredProjectsContent
  const projects = copy.projects
  const count = projects.length

  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const layersRef = useRef<(HTMLElement | null)[]>([])
  const mediaRefs = useRef<(HTMLElement | null)[]>([])
  const counterRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<SVGSVGElement>(null)

  const [active, setActive] = useState(0)

  const targetProgress = useRef(0)
  const currentProgress = useRef(0)
  const activeIndex = useRef(0)
  const tilt = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const rafRef = useRef(0)
  const breath = useRef(0)

  const paint = useCallback(
    (focus: number, time: number) => {
      const depthSoft = softDepth
      breath.current = Math.sin(time * 0.0011) * BREATH_AMP

      layersRef.current.forEach((layer, i) => {
        if (!layer) return
        const pose = poseForDelta(i - focus, i, depthSoft)
        const isActive = Math.abs(i - focus) < 0.55
        const scale = pose.scale + (isActive ? breath.current : 0)

        gsap.set(layer, {
          yPercent: pose.y,
          scale,
          rotate: pose.rotate,
          opacity: pose.opacity,
          filter: pose.blur > 0.15 ? `blur(${pose.blur}px)` : 'none',
          zIndex: pose.z,
          force3D: true,
        })

        const media = mediaRefs.current[i]
        if (media && isActive) {
          gsap.set(media, {
            yPercent: (i - focus) * -1.8,
            scale: 1.04,
            force3D: true,
          })
        } else if (media) {
          gsap.set(media, { yPercent: 0, scale: 1.03, force3D: true })
        }
      })

      const t = tilt.current
      t.x = lerp(t.x, t.tx, 0.12)
      t.y = lerp(t.y, t.ty, 0.12)
      if (frameRef.current) {
        gsap.set(frameRef.current, {
          rotateX: t.x,
          rotateY: t.y,
          transformPerspective: 1200,
          force3D: true,
        })
      }

      if (progressRef.current) {
        const pct = count <= 1 ? 1 : focus / (count - 1)
        progressRef.current.style.transform = `scaleX(${clamp(pct)})`
      }

      if (orbitRef.current) {
        const pct = count <= 1 ? 0 : focus / (count - 1)
        gsap.set(orbitRef.current, { rotate: pct * 28, force3D: true })
      }

      if (counterRef.current) {
        const idx = clamp(Math.round(focus), 0, count - 1)
        const label = projects[idx]?.number ?? '01'
        if (counterRef.current.textContent !== label) {
          counterRef.current.textContent = label
        }
      }

      const nextIndex = clamp(Math.round(focus), 0, count - 1)
      if (nextIndex !== activeIndex.current) {
        activeIndex.current = nextIndex
        setActive(nextIndex)
      }
    },
    [count, projects, softDepth],
  )

  useGSAP(
    () => {
      const root = sectionRef.current
      if (!root || reduced || isMobile || count < 1) return

      gsap.set(layersRef.current.filter(Boolean), { clearProps: 'transform,filter,opacity' })
      paint(0, 0)

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 75%',
              once: true,
            },
          },
        )
      }

      if (frameRef.current) {
        gsap.fromTo(
          frameRef.current,
          { scale: 0.96, opacity: 0.72 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 70%',
              once: true,
            },
          },
        )
      }

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: false,
        onUpdate: (self) => {
          targetProgress.current = self.progress
        },
        invalidateOnRefresh: true,
      })

      const tick = (time: number) => {
        currentProgress.current = lerp(currentProgress.current, targetProgress.current, LERP)
        const focus = currentProgress.current * Math.max(count - 1, 0)
        paint(focus, time)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)

      requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        cancelAnimationFrame(rafRef.current)
        trigger.kill()
      }
    },
    {
      scope: sectionRef,
      dependencies: [reduced, isMobile, count, paint],
    },
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (reduced || isMobile || softDepth || !frameRef.current) return
      const rect = frameRef.current.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5
      tilt.current.tx = -py * 3.2
      tilt.current.ty = px * 3.2
    },
    [isMobile, reduced, softDepth],
  )

  const onPointerLeave = useCallback(() => {
    tilt.current.tx = 0
    tilt.current.ty = 0
  }, [])

  useEffect(() => {
    activeIndex.current = active
  }, [active])

  if (reduced) {
    return <ReducedFeatured projects={projects} copy={copy} />
  }

  if (isMobile) {
    return <MobileFeatured projects={projects} copy={copy} />
  }

  const activeProject = projects[active] ?? projects[0]
  const scrollHeight = `${Math.max(count, 1) * 100}vh`

  return (
    <section
      id="featured-projects"
      ref={sectionRef}
      className="relative overflow-x-clip [overflow-anchor:none]"
      style={{ height: scrollHeight }}
      aria-labelledby="featured-projects-title"
    >
      <div
        className="sticky top-0 flex h-svh flex-col overflow-hidden rounded-t-[2.5rem] md:rounded-t-[3.25rem] sticky-section"
        style={{ backgroundColor: PAPER }}
      >
        <Atmosphere />

        <svg
          ref={orbitRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-[14%] right-[5%] z-0 hidden h-44 w-44 opacity-40 xl:block"
          viewBox="0 0 176 176"
          fill="none"
        >
          <circle cx="88" cy="88" r="70" stroke="#0d121f" strokeOpacity="0.18" strokeWidth="0.7" />
          <circle cx="88" cy="88" r="48" stroke="#0d121f" strokeOpacity="0.1" strokeWidth="0.6" />
          <circle cx="138" cy="42" r="2.4" fill={ORANGE} />
        </svg>

        <Container variant="wide" className="relative z-20 w-full pt-7 md:pt-9 lg:pt-11">
          <SectionChrome
            headerRef={headerRef}
            title={copy.title}
            viewAllLabel={copy.viewAllLabel}
            viewAllTo={copy.viewAllTo}
          />

          <div className="mt-4 flex items-center gap-4 md:mt-5">
            <p className="text-eyebrow text-brand tabular-nums">
              <span ref={counterRef}>{activeProject?.number ?? '01'}</span>
              <span className="text-text-muted"> / 0{count}</span>
            </p>
            <div className="h-px max-w-40 flex-1 overflow-hidden bg-white/20">
              <div
                ref={progressRef}
                className="h-full origin-left bg-white"
                style={{
                  transform: 'scaleX(0)',
                  boxShadow: `0 0 0 0.5px ${ORANGE}`,
                }}
              />
            </div>
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full"
              style={{ backgroundColor: ORANGE }}
            />
          </div>
        </Container>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center px-4 pb-5 sm:px-6 md:pb-7 lg:px-8">
          <div
            className="mx-auto w-full max-w-[min(92vw,78rem)]"
            style={{ perspective: '1400px' }}
          >
            <div
              ref={frameRef}
              className="relative mx-auto w-full will-change-transform"
              style={{
                height: 'min(68vh, 640px)',
                maxWidth: '1280px',
                transformStyle: 'preserve-3d',
              }}
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
            >
              {projects.map((project, index) => (
                <article
                  key={project.id}
                  ref={(node) => {
                    layersRef.current[index] = node
                  }}
                  className="absolute inset-0 overflow-hidden rounded-[1.85rem] shadow-[0_32px_80px_rgb(6_40_80/0.38)] ring-1 ring-white/18 md:rounded-[2.15rem]"
                  style={{
                    zIndex: index + 1,
                    transformOrigin: '50% 50%',
                    backfaceVisibility: 'hidden',
                  }}
                  aria-hidden={index !== active}
                >
                  <div
                    ref={(node) => {
                      mediaRefs.current[index] = node
                    }}
                    className="absolute inset-[-4%] will-change-transform"
                  >
                    <ProjectImage project={project} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
