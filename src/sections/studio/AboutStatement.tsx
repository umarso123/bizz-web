import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { studioAbout } from '@/data/studio-home.ts'
import { Sticker } from '@/sections/studio/kit.tsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Words in the ink front at once: they pass from periwinkle, through blue, to navy. */
const FRONT = 5
const UNREAD = '#B3C5FA'
const FRONT_INK = '#234ED1'
const READ = '#0D121F'

/**
 * 03: one sentence, pinned while it reads itself. A front of colour moves word
 * by word, periwinkle to blue to navy, and once it has passed the last word the
 * stickers slap on. Scrubbed, so scrolling back un-reads it.
 */
export function AboutStatement() {
  const ref = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const words = studioAbout.statement.split(' ')

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>('.sh-word')
      const toFront = gsap.utils.interpolate(UNREAD, FRONT_INK)
      const toRead = gsap.utils.interpolate(FRONT_INK, READ)
      const n = els.length
      // Last step written per word (24 steps per word): words outside the moving
      // front are skipped, so a scroll frame repaints ~5 words, not all of them.
      const last = new Int8Array(els.length).fill(-1)
      const paint = (p: number) => {
        els.forEach((el, i) => {
          const t = gsap.utils.clamp(0, 1, (p * (n + FRONT) - i) / FRONT)
          const step = Math.round(t * 24)
          if (step === last[i]) return
          last[i] = step
          const u = step / 24
          el.style.color = u < 0.5 ? toFront(u * 2) : toRead((u - 0.5) * 2)
        })
      }

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        paint(0)
        const stickers = gsap.utils.toArray<HTMLElement>('.sh-about-sticker .sh-sticker')
        const rest = (i: number) => studioAbout.stickers[i]?.rotate ?? 0
        const pop = gsap
          .timeline({ paused: true })
          .fromTo(
            stickers,
            { scale: 0, rotation: (i: number) => rest(i) + [-30, 24, -20][i % 3] },
            { scale: 1, rotation: rest, duration: 0.8, ease: 'back.out(2.4)', stagger: 0.12 },
          )
        let shown = false

        ScrollTrigger.create({
          trigger: stageRef.current,
          start: 'center center',
          end: '+=140%',
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          onUpdate: (self) => {
            paint(gsap.utils.clamp(0, 1, self.progress / 0.86))
            if (self.progress > 0.9 && !shown) {
              shown = true
              pop.play()
            } else if (self.progress < 0.84 && shown) {
              shown = false
              pop.reverse()
            }
          },
        })
        gsap.from('.sh-about-label', { autoAlpha: 0, y: 20, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
      })
      mm.add('(prefers-reduced-motion: reduce)', () => paint(1))
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="sh-about" aria-labelledby="about-label">
      <div ref={stageRef} className="sh-about-stage sh-wrap">
        <h2 id="about-label" className="sh-about-label sh-label">
          {studioAbout.label}
        </h2>
        <p className="sh-about-text sh-statement">
          <span className="sr-only">{studioAbout.statement}</span>
          <span aria-hidden="true">
            {words.map((word, i) => (
              <span key={`${word}-${i}`}>
                <span className="sh-word">{word}</span>
                {i < words.length - 1 ? ' ' : null}
              </span>
            ))}
          </span>
          {studioAbout.stickers.map((sticker) => (
            <span key={sticker.text} className="sh-about-sticker absolute" style={sticker.at}>
              <Sticker sticker={{ ...sticker, at: {} }} className="relative" />
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}

export default AboutStatement
