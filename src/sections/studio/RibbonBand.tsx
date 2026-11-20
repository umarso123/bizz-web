import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { studioRibbon } from '@/data/studio-home.ts'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const FRONT = 'M -160 560 C 260 300, 760 150, 1600 205'
const BACK = 'M -160 150 C 420 210, 980 470, 1600 520'

/** Repeat the phrases with a separator until the run is long enough to scroll. */
const run = (items: readonly string[], times: number) => Array.from({ length: times }, () => items.join('  ✦  ')).join('  ✦  ') + '  ✦'

/**
 * 02: two bands cross the cream sheet like ribbons: blue in front, periwinkle
 * behind. Their words travel along the curve as you scroll, in opposite
 * directions, and the bands straighten a little as they pass.
 */
export function RibbonBand() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const st = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
        gsap.fromTo('.sh-ribbon-front', { attr: { startOffset: 0 } }, { attr: { startOffset: -1500 }, ease: 'none', scrollTrigger: st })
        gsap.fromTo('.sh-ribbon-back', { attr: { startOffset: -1600 } }, { attr: { startOffset: -300 }, ease: 'none', scrollTrigger: st })
        gsap.fromTo('.sh-ribbon-svg', { rotation: -3, y: 60 }, { rotation: 1.5, y: -40, ease: 'none', transformOrigin: '50% 50%', scrollTrigger: st })
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="sh-ribbon" aria-label={[...studioRibbon.front, ...studioRibbon.back].join(', ')} role="img">
      <svg className="sh-ribbon-svg" viewBox="0 0 1440 700" aria-hidden="true">
        <defs>
          <path id="sh-ribbon-front" d={FRONT} />
          <path id="sh-ribbon-back" d={BACK} />
        </defs>

        <use href="#sh-ribbon-back" fill="none" stroke="#B3C5FA" strokeWidth="104" />
        <text fontSize="62" fill="#0D121F" dominantBaseline="central" letterSpacing="1">
          <textPath className="sh-ribbon-back" href="#sh-ribbon-back" startOffset="-1600">
            {run(studioRibbon.back, 8)}
          </textPath>
        </text>

        {/* Two soft offset strokes stand in for a blur filter, which would be re-rasterised every frame. */}
        <use href="#sh-ribbon-front" fill="none" stroke="rgb(10 26 58 / 0.06)" strokeWidth="176" transform="translate(0 16)" />
        <use href="#sh-ribbon-front" fill="none" stroke="rgb(10 26 58 / 0.08)" strokeWidth="158" transform="translate(0 9)" />
        <use href="#sh-ribbon-front" fill="none" stroke="#234ED1" strokeWidth="150" />
        <text fontSize="96" fill="#FFFFFF" dominantBaseline="central" letterSpacing="1">
          <textPath className="sh-ribbon-front" href="#sh-ribbon-front" startOffset="0">
            {run(studioRibbon.front, 4)}
          </textPath>
        </text>
      </svg>
    </div>
  )
}

export default RibbonBand
