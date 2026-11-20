import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { studioWork } from '@/data/studio-home.ts'
import { RoundArrow, SplitChars } from '@/sections/studio/kit.tsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * 04: selected work. A pinned rail: scrolling down moves the cards sideways.
 * Cards lean into the scroll speed and settle when it stops; each image drifts
 * inside its frame (parallax). Below 768px it is a native swipe row instead.
 */
export function WorkRail() {
  const ref = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const count = String(studioWork.projects.length).padStart(2, '0')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.sh-work-title .sh-char', {
          yPercent: 105,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.03,
          scrollTrigger: { trigger: ref.current, start: 'top 72%' },
        })
        gsap.from('.sh-work-meta > *', { autoAlpha: 0, y: 16, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: ref.current, start: 'top 68%' } })
      })

      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
        const track = trackRef.current
        if (!track) return
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
        const cards = gsap.utils.toArray<HTMLElement>('.sh-card')
        const lean = cards.map((card) => gsap.quickTo(card, 'skewX', { duration: 0.6, ease: 'power3.out' }))
        const progressBar = ref.current?.querySelector('.sh-progress > span')
        const setProgress = progressBar ? gsap.quickSetter(progressBar, 'scaleX') : () => {}
        let lastLean = 0

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Rounded so tiny velocity jitter doesn't restart seven tweens every frame.
              const v = Math.round(gsap.utils.clamp(-5, 5, self.getVelocity() / -400) * 4) / 4
              if (v !== lastLean) {
                lastLean = v
                lean.forEach((to) => to(v))
              }
              setProgress(self.progress)
            },
            onScrubComplete: () => {
              lastLean = 0
              lean.forEach((to) => to(0))
            },
          },
        })

        // Each image drifts across its frame as the card crosses the screen.
        cards.forEach((card) => {
          const img = card.querySelector('img')
          if (!img) return
          gsap.fromTo(
            img,
            { xPercent: -3 },
            {
              xPercent: 3,
              ease: 'none',
              scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
            },
          )
        })

        // Cards rise in, one after another, as the section arrives.
        gsap.from(cards, { y: 80, autoAlpha: 0, rotation: (i: number) => (i % 2 ? 3 : -3), duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: pinRef.current, start: 'top 80%' } })
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="selected-work" aria-labelledby="work-title" className="relative pt-[clamp(80px,12vh,160px)]">
      <div ref={pinRef} className="sh-work-pin">
        <div className="sh-wrap flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <h2 id="work-title" className="sh-work-title sh-display sh-fit-title">
            <span className="sr-only">{studioWork.titleLines.join(' ')}</span>
            {studioWork.titleLines.map((line, i) => (
              <span key={line} className={`block overflow-hidden pt-[0.04em] ${i === 1 ? 'text-[var(--sh-blue)]' : ''}`}>
                <SplitChars text={line} />
              </span>
            ))}
          </h2>
          <div className="sh-work-meta flex items-center gap-8 pb-2">
            <p className="sh-label text-[var(--sh-ink-soft)]">
              {studioWork.label} <span className="text-[var(--sh-blue)]">({count})</span>
            </p>
            <Link to={studioWork.link.href} className="sh-text-link text-[1.0625rem]">
              {studioWork.link.label}
            </Link>
          </div>
        </div>

        <div className="max-md:overflow-x-auto max-md:[scroll-snap-type:x_mandatory] max-md:[scrollbar-width:none]">
          <ul ref={trackRef} className="sh-work-track">
            {studioWork.projects.map((project, i) => (
              <li key={project.slug} className="sh-card max-md:[scroll-snap-align:center]">
                <Link to={`/work/${project.slug}`} className="sh-card-link block text-inherit no-underline">
                  <div
                    className="sh-card-media sh-cut"
                    data-fit={project.fit}
                    style={{ '--tint': project.tint } as CSSProperties}
                  >
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading="lazy"
                      fetchPriority="low"
                      decoding="async"
                      draggable={false}
                      style={project.focus ? { objectPosition: project.focus } : undefined}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="sh-card-badge" style={{ '--tint-ink': project.tintInk } as CSSProperties} aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="sh-display truncate text-[clamp(1.375rem,calc(var(--sh-card-w)*0.058),2.75rem)] leading-[0.95]">{project.name}</h3>
                      <p className="sh-label mt-1.5 text-[var(--sh-blue)]">{project.category}</p>
                    </div>
                    <RoundArrow />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sh-wrap max-md:hidden">
          <div className="sh-progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkRail
