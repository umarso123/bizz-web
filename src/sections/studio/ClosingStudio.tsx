import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { Link } from 'react-router'
import { studioClosing } from '@/data/studio-home.ts'
import { PillButton, SplitChars, Sticker } from '@/sections/studio/kit.tsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** The Bizaffix mark (src/assets/bizaffix/Vector.svg), inlined so it can take any fill. */
const MARK_PATH =
  'M71.8993 19.9974L37.6064 0.294504C36.9185 -0.0981679 36.0815 -0.0981679 35.3936 0.294504L1.12361 19.9974C0.435684 20.3901 0 21.1408 0 21.9377V61.9786C0 62.7871 0.435684 63.5262 1.12361 63.9304L35.4165 83.7142C36.0815 84.0953 36.907 84.0953 37.572 83.7142L71.8535 64.2076C72.5643 63.8034 73 63.0527 73 62.2327V48.3275C73 47.5422 72.5872 46.803 71.9108 46.4103L65.0889 42.1141C64.5271 41.7907 64.5042 40.9822 65.0316 40.6242L72.014 36.7783C72.6216 36.3626 72.9885 35.6581 72.9885 34.9189V21.9492C72.9885 21.1523 72.5643 20.4247 71.8764 20.032L71.8993 19.9974ZM26.1181 41.2017L34.8318 35.9006C35.107 35.7389 35.4509 35.7389 35.7261 35.9006L62.9334 51.1917C63.5984 51.5844 64.0112 52.312 64.0112 53.0858V57.255C64.0112 58.0519 63.5869 58.8026 62.8875 59.1953L37.0102 74.0129C36.3223 74.4055 35.4739 74.4055 34.7974 74.0013L9.09204 58.791C8.41558 58.3868 7.99136 57.6477 7.99136 56.8623V27.4004C7.99136 26.592 8.42705 25.8528 9.11497 25.4486L35.3592 10.1921C36.0586 9.78792 36.93 9.81102 37.6179 10.2383L62.9678 24.4207C63.6099 24.8249 63.9997 25.541 63.9997 26.3032V30.6688C63.9997 31.4773 63.564 32.2164 62.8761 32.5975L56.1918 36.1085C55.9166 36.2702 55.5726 36.2586 55.2975 36.0854L37.6293 26.3032C36.6319 25.6796 35.3707 25.6796 34.3732 26.3032L15.6044 37.6792C15.054 38.0141 14.733 38.6377 14.7674 39.2845L14.8591 42.1025C14.905 42.8301 15.398 43.4538 16.0974 43.6501L18.8376 44.805C19.2848 44.932 19.7663 44.8743 20.1676 44.6433L26.1066 41.2017H26.1181Z'

const SEAL_TEXT = 'From idea to reality ✦ Bizaffix ✦ From idea to reality ✦ Bizaffix ✦ '

/** A round seal: the mark in the middle, a line of type turning round it. */
function Seal() {
  return (
    <div className="sh-seal relative size-[clamp(120px,13vw,190px)]" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="sh-spin absolute inset-0 size-full">
        <defs>
          <path id="sh-seal-ring" d="M 100 100 m -78 0 a 78 78 0 1 1 156 0 a 78 78 0 1 1 -156 0" />
        </defs>
        <circle cx="100" cy="100" r="99" fill="#234ED1" />
        <text fontSize="15.5" fill="#FFFFFF" letterSpacing="2.4" style={{ fontFamily: 'var(--sh-display)', textTransform: 'uppercase' }}>
          <textPath href="#sh-seal-ring">{SEAL_TEXT}</textPath>
        </text>
      </svg>
      <svg viewBox="0 0 73 84" className="absolute inset-[30%] m-auto size-[40%]" aria-hidden="true">
        <path d={MARK_PATH} fill="#FDE36E" />
      </svg>
    </div>
  )
}

/**
 * 07: the closing call. The biggest type on the page, a seal turning in the
 * corner, stickers slapped round it, and the one button. Hover the title and
 * the letters jostle.
 */
export function ClosingStudio() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: ref.current, start: 'top 62%' },
          onComplete: () => ref.current?.querySelector('.sh-wave')?.classList.add('is-ready'),
        })
        tl.from('.sh-close-label', { autoAlpha: 0, y: 16, duration: 0.9 }, 0)
          .from('.sh-close-title .sh-line-0 .sh-char', { yPercent: 108, duration: 1.2, stagger: 0.035 }, 0.05)
          .from('.sh-close-title .sh-line-1 .sh-char', { yPercent: 108, duration: 1.2, stagger: 0.035 }, 0.2)
          .from('.sh-seal', { scale: 0, rotation: -120, duration: 1.4, ease: 'back.out(1.6)' }, 0.5)
          .from('.sh-close-sticker .sh-sticker', { scale: 0, rotation: (i: number) => (i % 2 ? 40 : -40), duration: 0.85, ease: 'back.out(2.2)', stagger: 0.1 }, 0.6)
          .from('.sh-close-actions > *', { autoAlpha: 0, y: 20, duration: 1, stagger: 0.08 }, 0.7)

        // The title drifts apart slightly as the section scrolls past, like the hero did.
        gsap.to('.sh-close-title .sh-line-0', { xPercent: -4, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
        gsap.to('.sh-close-title .sh-line-1', { xPercent: 4, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="closing" aria-labelledby="closing-title" className="relative overflow-hidden pt-[clamp(120px,20vh,240px)] pb-[clamp(96px,16vh,200px)]">
      <div className="sh-wrap flex flex-col items-center text-center">
        <p className="sh-close-label sh-label text-[var(--sh-ink-soft)]">{studioClosing.label}</p>

        <div className="relative mt-8 w-full">
          <h2 id="closing-title" className="sh-close-title sh-display sh-wave">
            <span className="sr-only">{studioClosing.lines.join(' ')}</span>
            {studioClosing.lines.map((line, i) => (
              <span key={line} className={`sh-line-${i} block overflow-hidden pt-[0.05em] ${i === 1 ? 'text-[var(--sh-blue)]' : ''}`}>
                <SplitChars text={line} />
              </span>
            ))}
          </h2>

          <div className="absolute top-[-8%] right-[2%] z-4 max-md:hidden">
            <Seal />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-3">
            {studioClosing.stickers.map((sticker) => (
              <span key={sticker.text} className="sh-close-sticker absolute" style={sticker.at}>
                <Sticker sticker={{ ...sticker, at: {} }} className="relative" />
              </span>
            ))}
          </div>
        </div>

        <p className="sh-body mt-12 max-w-[44ch] text-[var(--sh-ink-soft)]">{studioClosing.body}</p>
        <div className="sh-close-actions mt-10 flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
          <PillButton size="lg">{studioClosing.cta}</PillButton>
          <Link to={studioClosing.secondary.href} className="sh-text-link text-[1.0625rem]">
            {studioClosing.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ClosingStudio
