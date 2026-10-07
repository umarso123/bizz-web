import { m, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { homeContent } from '@/content/home.ts'
import { cn } from '@/lib/cn.ts'

const ease = [0.22, 1, 0.36, 1] as const

export function StudioOfferings() {
  const reduced = useReducedMotion() === true
  const copy = homeContent.studioOfferings

  return (
    <section
      id="what-we-do"
      className="relative overflow-x-clip bg-page-white section-y"
      aria-labelledby="what-we-do-title"
    >
      <Container variant="page" className="relative w-full">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-[28rem]">
            <Eyebrow>{copy.index}</Eyebrow>
            <h2
              id="what-we-do-title"
              className="mt-4 text-section-title text-text"
            >
              {copy.title}
            </h2>
          </div>
          <p className="max-w-[28rem] text-body text-text-secondary lg:pb-1">{copy.body}</p>
        </div>

        <div className="mt-12 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
          {copy.cards.slice(0, 3).map((card, index) => (
            <m.article
              key={card.id}
              className={cn(
                'flex min-h-[22rem] flex-col justify-between rounded-[1.85rem] p-6 md:min-h-[26rem] md:rounded-[2.15rem] md:p-7',
                card.tone === 'brand' && 'bg-brand text-white shadow-lg',
                card.tone === 'accent' && 'bg-accent text-text shadow-card',
                card.tone === 'light' && 'border border-border bg-surface text-text shadow-card',
              )}
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    'inline-flex rounded-full px-3 py-1 text-[0.72rem] font-semibold',
                    card.tone === 'brand' && 'bg-white/15 text-white',
                    card.tone === 'accent' && 'border border-text/15 bg-white/55 text-text',
                    card.tone === 'light' && 'border border-border bg-bg-subtle text-text',
                  )}
                >
                  {card.label}
                </span>
                <span
                  className={cn(
                    'text-[0.85rem] font-medium tabular-nums',
                    card.tone === 'brand' ? 'text-white/45' : 'text-text-muted',
                  )}
                >
                  {card.number}
                </span>
              </div>

              <div>
                <h3
                  className={cn(
                    'text-[clamp(1.35rem,1.1rem+0.9vw,1.85rem)] leading-[1.15] font-bold tracking-tight',
                    card.tone === 'brand' ? 'text-white' : 'text-text',
                  )}
                >
                  {card.title}
                </h3>
                {card.body ? (
                  <p
                    className={cn(
                      'mt-4 text-body-small leading-snug',
                      card.tone === 'brand' ? 'text-white/75' : 'text-text-secondary',
                    )}
                  >
                    {card.body}
                  </p>
                ) : null}
                {card.tags.length > 0 ? (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <li
                        key={tag}
                        className={cn(
                          'rounded-full px-3 py-1 text-[0.7rem] font-semibold',
                          card.tone === 'accent'
                            ? 'bg-white/70 text-text'
                            : 'bg-bg-muted text-text',
                        )}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </m.article>
          ))}
        </div>

        {copy.cards[3] ? (
          <m.article
            className="relative mt-4 overflow-hidden rounded-[1.85rem] border border-border bg-accent-soft p-6 shadow-card md:mt-5 md:rounded-[2.15rem] md:p-8 lg:p-10"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.12, ease }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[-20%] right-[-5%] h-56 w-56 rounded-full bg-accent/50 blur-3xl"
            />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-[40rem]">
                <div className="flex items-center justify-between gap-4 sm:justify-start sm:gap-6">
                  <span className="inline-flex rounded-full border border-text/10 bg-white/70 px-3 py-1 text-[0.72rem] font-semibold text-text">
                    {copy.cards[3].label}
                  </span>
                  <span className="text-[0.85rem] font-medium text-text-muted tabular-nums">
                    {copy.cards[3].number}
                  </span>
                </div>
                <h3 className="mt-5 text-[clamp(1.45rem,1.15rem+1.1vw,2.15rem)] leading-[1.12] font-bold tracking-tight text-text">
                  {copy.cards[3].title}
                </h3>
                {copy.cards[3].body ? (
                  <p className="mt-4 max-w-[34rem] text-body text-text-secondary">
                    {copy.cards[3].body}
                  </p>
                ) : null}
              </div>
            </div>
          </m.article>
        ) : null}
      </Container>
    </section>
  )
}
