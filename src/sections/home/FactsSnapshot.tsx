import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { homeContent } from '@/content/home.ts'
import { cn } from '@/lib/cn.ts'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type FactCard = (typeof homeContent.facts.cards)[number]

const scenes: Record<string, string> = {
  focus: 'bg-page-dark',
  rating: 'bg-[#F7F6F4]',
  services: 'bg-[#0E1A24]',
}

function signedDelta(index: number, focus: number, count: number) {
  let delta = index - focus
  delta = ((delta % count) + count) % count
  if (delta > count / 2) delta -= count
  return delta
}

/** Slot positions are percentages of each card, so scroll updates never read layout. */
function placeCards(cards: HTMLElement[], focus: number) {
  const count = cards.length

  cards.forEach((card, index) => {
    const delta = signedDelta(index, focus, count)
    const abs = Math.abs(delta)
    const sign = Math.sign(delta)

    let shift = 0
    let scale = 1
    let z = 30
    let drop = 0
    let opacity = 1

    if (abs <= 1) {
      shift = sign * 52 * abs
      scale = 1 - abs * 0.12
      z = Math.round(40 - abs * 24)
      drop = abs * 1.8
      opacity = 1 - abs * 0.08
    } else {
      const t = Math.min((abs - 1) / 0.5, 1)
      shift = sign * 52 * (1 - t)
      scale = 0.88 - t * 0.08
      z = Math.max(1, Math.round(16 - t * 14))
      drop = 1.8 * (1 - t)
      opacity = 0.92 * (1 - t)
    }

    const xPercent = -50 + shift
    const yPercent = -50 + drop
    const slot = `${xPercent.toFixed(2)}|${yPercent.toFixed(2)}|${scale.toFixed(3)}|${z}|${opacity.toFixed(2)}`
    if (card.dataset.slot === slot) return
    card.dataset.slot = slot

    gsap.set(card, {
      xPercent,
      yPercent,
      scale,
      opacity,
      zIndex: z,
      force3D: true,
    })
  })
}

function CardFace({ card, reduced }: { card: FactCard; reduced: boolean }) {
  const dark = card.tone === 'dark'
  const hasVideo = typeof card.media === 'string' && card.media.length > 0
  const lead = card.title ?? card.eyebrow
  const ink = hasVideo || dark ? 'text-white' : 'text-[#171717]'
  const mute = hasVideo || dark ? 'text-white/70' : 'text-[#171717]/60'

  return (
    <>
      <div className={cn('absolute inset-0', scenes[card.id] ?? scenes.focus)} aria-hidden="true" />
      {hasVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={card.media}
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : null}
      {card.id === 'focus' ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse at 70% 28%, rgb(47 91 234 / 0.38), transparent 55%), radial-gradient(ellipse at 18% 78%, rgb(245 200 76 / 0.22), transparent 50%)',
          }}
        />
      ) : null}
      {card.id === 'services' ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgb(47 91 234 / 0.22), transparent 48%)',
          }}
        />
      ) : null}
      {hasVideo ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(23_33_43/0.15)_0%,rgb(23_33_43/0.45)_55%,rgb(23_33_43/0.78)_100%)]"
        />
      ) : null}

      {card.kind === 'circle' ? (
        <div className="absolute inset-0 flex items-center justify-center pb-10">
          <div className="grid aspect-square w-[42%] min-w-28 place-items-center rounded-full bg-white shadow-[0_18px_50px_rgb(23_33_43/0.12)] ring-1 ring-[#171717]/6">
            <p className="text-[clamp(2.2rem,3.4vw,3.75rem)] leading-none font-semibold tracking-tighter text-[#171717]">
              {card.value}
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-20 md:px-7 md:pb-24">
          <p className={cn('text-[clamp(3.25rem,4.5vw,5.5rem)] leading-none font-semibold tracking-tighter', ink)}>
            {card.value}
          </p>
          {card.title ? (
            <p className={cn('mt-2 text-[clamp(1.15rem,1.4vw,1.5rem)] font-semibold tracking-tighter', ink)}>
              {card.title}
            </p>
          ) : null}
          <p className={cn('mt-2 max-w-[18rem] text-[0.92rem] leading-snug', mute)}>{card.caption}</p>
        </div>
      )}

      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-28',
          hasVideo || dark
            ? 'bg-gradient-to-t from-[#0A121A] via-[#0A121A]/70 to-transparent'
            : 'bg-gradient-to-t from-[#F7F6F4] via-[#F7F6F4]/80 to-transparent',
        )}
      />

      <p
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 flex items-start gap-2.5 px-5 pb-5 md:px-6 md:pb-6',
          hasVideo || dark ? 'text-white' : 'text-[#171717]',
        )}
      >
        <span
          className={cn(
            'mt-[0.45em] size-1.5 shrink-0 rounded-full',
            hasVideo || dark ? 'bg-accent' : 'bg-brand',
          )}
          aria-hidden="true"
        />
        <span className="line-clamp-2 text-[0.92rem] leading-snug font-medium tracking-tight">
          {lead}: {card.caption}
        </span>
      </p>
    </>
  )
}

/**
 * Overlapping fact cards. Scroll sends the front card behind the stack
 * and brings the next card forward.
 */
export function FactsSnapshot() {
  const reduced = useReducedMotion() === true
  const sectionRef = useRef<HTMLElement>(null)
  const copy = homeContent.facts

  useGSAP(
    () => {
      const root = sectionRef.current
      if (!root) return

      const cards = gsap.utils.toArray<HTMLElement>('.fact-card', root)
      if (cards.length < 2) return

      const steps = cards.length - 1
      let placing = false
      const layout = (progress: number) => {
        if (placing) return
        placing = true
        placeCards(cards, progress * steps)
        placing = false
      }

      layout(0)
      if (reduced) return

      let frame = 0
      let latest = 0
      const schedule = (progress: number) => {
        latest = progress
        if (frame) return
        frame = requestAnimationFrame(() => {
          frame = 0
          layout(latest)
        })
      }

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => schedule(self.progress),
        invalidateOnRefresh: true,
      })

      const refresh = () => {
        layout(trigger.progress)
      }
      ScrollTrigger.addEventListener('refresh', refresh)
      requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        cancelAnimationFrame(frame)
        ScrollTrigger.removeEventListener('refresh', refresh)
        trigger.kill()
      }
    },
    { scope: sectionRef, dependencies: [reduced] },
  )

  return (
    <section
      id="facts"
      ref={sectionRef}
      className={cn(
        'relative overflow-x-clip bg-page-white [overflow-anchor:none]',
        reduced ? 'min-h-svh' : 'h-[280vh]',
      )}
      aria-labelledby="facts-title"
    >
      <div
        className={cn(
          'flex flex-col justify-center overflow-x-clip bg-page-white sticky-section',
          reduced ? 'min-h-svh py-16' : 'sticky top-0 h-svh',
        )}
      >
        <Container variant="wide" className="relative w-full">
          <div className="mx-auto max-w-160 text-center">
            <h2 id="facts-title" className="text-section-title text-text">
              {copy.title}
            </h2>
            <p className="mt-3 text-body text-text-secondary md:mt-4">{copy.subtitle}</p>
          </div>
        </Container>

        <div className="fact-stage relative mt-8 h-[min(38vh,270px)] w-full sm:mt-10 sm:h-[min(46vh,390px)] lg:h-[min(54vh,480px)]">
          {copy.cards.map((card, index) => (
            <article
              key={card.id}
              className="fact-card absolute top-1/2 left-1/2 h-full w-[min(74vw,300px)] overflow-hidden rounded-[1.7rem] border border-[#171717]/8 shadow-[0_24px_60px_rgb(40_32_24/0.14)] sm:w-[min(58vw,460px)] lg:w-[min(44vw,600px)]"
              style={{
                zIndex: index === 0 ? 30 : 12,
                transform: `translate(-50%, -50%) scale(${index === 0 ? 1 : 0.88})`,
              }}
            >
              <CardFace card={card} reduced={reduced} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
