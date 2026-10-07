import { m, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { premiumHome } from '@/content/premium-home.ts'
import { cn } from '@/lib/cn.ts'

export function WhatWeDo() {
  const reduced = useReducedMotion() === true
  const copy = premiumHome.whatWeDo
  const [a, b, c, d] = copy.cards

  return (
    <section
      id="services"
      className="atmosphere-soft relative overflow-hidden section-y"
      aria-labelledby="what-we-do-title"
    >

      <Container variant="wide" className="relative z-10 w-full">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
          <div>
            <Eyebrow>{copy.label}</Eyebrow>
            <h2 id="what-we-do-title" className="mt-4 text-section-title text-text">
              {copy.title}
              <br />
              {copy.titleLine2}
            </h2>
          </div>
          <p className="max-w-[34rem] text-body-large text-text-secondary lg:justify-self-end">
            {copy.body}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
          {[a, b, c].map((card, index) => (
            <ServiceCard key={card.id} card={card} index={index} reduced={reduced} />
          ))}
        </div>

        {d ? (
          <m.article
            className="mt-4 flex min-h-[12rem] flex-col justify-between gap-6 rounded-[1.75rem] bg-accent-soft p-6 md:mt-5 md:min-h-[14rem] md:flex-row md:items-end md:rounded-[2.15rem] md:p-8 lg:p-10"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 50% 80% at 88% 50%, rgb(245 200 76 / 0.55), transparent 60%)',
            }}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <div className="max-w-[40rem]">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex rounded-pill border border-text/15 bg-surface/50 px-3 py-1 text-[0.72rem] font-semibold text-text">
                  {d.badge}
                </span>
                <span className="text-[0.8rem] font-medium text-text/35">{d.index}</span>
              </div>
              <h3 className="mt-6 text-[clamp(1.5rem,1.1rem+1.4vw,2.35rem)] leading-[1.12] font-bold tracking-tight text-text">
                {d.title}
              </h3>
              <p className="mt-3 max-w-[36rem] text-body text-text-secondary">{d.body}</p>
            </div>
            {d.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 md:justify-end">
                {d.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-pill border border-text/12 bg-surface/70 px-3 py-1 text-[0.72rem] font-medium text-text"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </m.article>
        ) : null}
      </Container>
    </section>
  )
}

function ServiceCard({
  card,
  index,
  reduced,
}: {
  card: (typeof premiumHome.whatWeDo.cards)[number]
  index: number
  reduced: boolean
}) {
  const brand = card.tone === 'brand'
  const accent = card.tone === 'accent'
  const ink = brand ? 'text-white' : 'text-text'
  const mute = brand ? 'text-white/75' : 'text-text-secondary'

  return (
    <m.article
      className={cn(
        'flex min-h-[22rem] flex-col justify-between rounded-[1.85rem] p-6 transition-[transform,box-shadow] duration-500 md:min-h-[27rem] md:rounded-[2.15rem] md:p-7',
        'hover:-translate-y-1',
        brand && 'bg-brand shadow-lg hover:shadow-[0_24px_56px_rgb(47_91_234/0.32)]',
        accent && 'bg-accent shadow-card hover:shadow-card-hover',
        card.tone === 'light' && 'bg-surface shadow-card ring-1 ring-border-subtle hover:shadow-card-hover',
      )}
      style={
        brand
          ? {
              backgroundImage:
                'linear-gradient(165deg, #3d6bf0 0%, #2f5bea 48%, #2549c9 100%)',
            }
          : undefined
      }
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'inline-flex rounded-pill border px-3 py-1 text-[0.72rem] font-semibold',
            brand && 'border-white/25 bg-white/10 text-white',
            accent && 'border-text/15 bg-surface/40 text-text',
            card.tone === 'light' && 'border-border bg-bg-subtle text-text',
          )}
        >
          {card.badge}
        </span>
        <span className={cn('text-[0.8rem] font-medium', brand ? 'text-white/40' : 'text-text/30')}>
          {card.index}
        </span>
      </div>

      <div>
        <h3 className={cn('text-[clamp(1.35rem,1.05rem+0.9vw,1.85rem)] leading-[1.15] font-bold tracking-tight', ink)}>
          {card.title}
        </h3>
        <p className={cn('mt-3 text-body-small', mute)}>{card.body}</p>
        {card.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  'rounded-pill border px-3 py-1 text-[0.7rem] font-medium',
                  brand && 'border-white/25 text-white/90',
                  accent && 'border-text/15 bg-surface/50 text-text',
                  card.tone === 'light' && 'border-border text-text-secondary',
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </m.article>
  )
}
