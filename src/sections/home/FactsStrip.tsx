import { m, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/layout/Container.tsx'
import { premiumHome } from '@/content/premium-home.ts'
import { cn } from '@/lib/cn.ts'

export function FactsStrip() {
  const reduced = useReducedMotion() === true
  const cards = premiumHome.facts.cards

  return (
    <section
      className="relative bg-page-white pb-10 md:pb-14"
      aria-label="Key facts"
    >
      <Container variant="wide" className="w-full">
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {cards.map((card, index) => (
            <m.article
              key={card.id}
              className={cn(
                'flex min-h-[9.5rem] flex-col justify-between rounded-[1.75rem] p-6 md:min-h-[11rem] md:rounded-[2rem] md:p-7',
                card.tone === 'brand' && 'bg-brand text-text-inverse shadow-lg',
                card.tone === 'light' && 'bg-surface-warm text-text ring-1 ring-border-subtle',
              )}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className={cn(
                  'text-[clamp(1.65rem,1.1rem+1.6vw,2.65rem)] leading-none font-bold tracking-tighter',
                  card.tone === 'brand' ? 'text-white' : 'text-text',
                )}
              >
                {card.value}
              </p>
              <p
                className={cn(
                  'mt-4 text-body-small',
                  card.tone === 'brand' ? 'text-white/80' : 'text-text-secondary',
                )}
              >
                {card.label}
              </p>
            </m.article>
          ))}
        </div>
      </Container>
    </section>
  )
}
