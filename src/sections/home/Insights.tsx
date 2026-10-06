import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router'
import { useRef } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { homeContent } from '@/content/home.ts'

export function Insights() {
  const reduced = useReducedMotion() === true
  const ref = useRef<HTMLElement>(null)
  const copy = homeContent.insights
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'center center'],
  })
  const featuredClip = useTransform(
    scrollYProgress,
    [0, 0.55],
    reduced ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] : ['inset(18% 12% 18% 12%)', 'inset(0% 0% 0% 0%)'],
  )
  const featuredScale = useTransform(scrollYProgress, [0, 0.55], reduced ? [1, 1] : [0.92, 1])
  const leftX = useTransform(scrollYProgress, [0.2, 0.7], reduced ? [0, 0] : [-80, 0])
  const rightX = useTransform(scrollYProgress, [0.3, 0.8], reduced ? [0, 0] : [80, 0])
  const leftRotate = useTransform(scrollYProgress, [0.2, 0.7], reduced ? [0, 0] : [-4, 0])
  const rightRotate = useTransform(scrollYProgress, [0.3, 0.8], reduced ? [0, 0] : [4, 0])
  const supportOpacity = useTransform(scrollYProgress, [0.25, 0.55], reduced ? [1, 1] : [0, 1])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-page-brand py-24 md:py-32"
      aria-labelledby="insights-title"
    >
      <Container variant="page" className="relative w-full">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow tone="brand">{copy.eyebrow}</Eyebrow>
            <h2 id="insights-title" className="mt-4 text-section-title text-text">
              {copy.title}
            </h2>
            <p className="mt-4 max-w-[36rem] text-body-large text-text-secondary">{copy.body}</p>
          </div>
          <Link
            to="/insights"
            className="text-body-small font-semibold text-brand-hover underline underline-offset-[0.22em]"
          >
            {copy.cta} →
          </Link>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-10">
          <m.article style={{ clipPath: featuredClip, scale: featuredScale }}>
            <Link
              to="/insights"
              className="group relative block overflow-hidden rounded-xl border border-brand/25 bg-page-white p-8 no-underline shadow-sm md:min-h-[28rem] md:p-12"
            >
              <div className="flex h-full flex-col justify-end">
                <p className="text-caption font-semibold text-brand-hover">{copy.featured.meta}</p>
                <h3 className="mt-4 max-w-[22ch] text-[clamp(1.75rem,1.2rem+1.5vw,2.75rem)] leading-[1.12] font-semibold tracking-[-0.025em] text-text group-hover:text-brand-active">
                  {copy.featured.title}
                </h3>
                <p className="mt-5 max-w-[40rem] text-body-large text-text-secondary">
                  {copy.featured.dek}
                </p>
              </div>
            </Link>
          </m.article>

          <div className="flex flex-col gap-6">
            <m.article style={{ x: leftX, rotate: leftRotate, opacity: supportOpacity }}>
              <Link
                to="/insights"
                className="group block rounded-xl border border-brand/20 bg-page-white p-6 no-underline md:p-8"
              >
                <p className="text-caption font-semibold text-brand-hover">
                  {copy.supporting[0]?.meta}
                </p>
                <h3 className="mt-3 text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] leading-snug font-semibold tracking-[-0.02em] text-text group-hover:text-brand-active">
                  {copy.supporting[0]?.title}
                </h3>
              </Link>
            </m.article>
            <m.article style={{ x: rightX, rotate: rightRotate, opacity: supportOpacity }}>
              <Link
                to="/insights"
                className="group block rounded-xl border border-[#F66C2A]/25 bg-page-white p-6 no-underline md:p-8"
              >
                <p className="text-caption font-semibold text-[#C45A20]">
                  {copy.supporting[1]?.meta}
                </p>
                <h3 className="mt-3 text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] leading-snug font-semibold tracking-[-0.02em] text-text group-hover:text-brand-active">
                  {copy.supporting[1]?.title}
                </h3>
              </Link>
            </m.article>
          </div>
        </div>
      </Container>
    </section>
  )
}
