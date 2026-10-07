import { m, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { premiumHome } from '@/content/premium-home.ts'

const ease = [0.22, 1, 0.36, 1] as const

export function Approach() {
  const reduced = useReducedMotion() === true
  const copy = premiumHome.approach

  return (
    <section
      id="approach"
      className="relative overflow-x-clip bg-surface section-y"
      aria-labelledby="approach-title"
    >
      <Container variant="wide" className="relative w-full">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24 xl:gap-28">
          <m.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease }}
          >
            <Eyebrow>{copy.label}</Eyebrow>
            <h2
              id="approach-title"
              className="mt-4 max-w-[12ch] text-section-title text-text"
            >
              {copy.titleLead}{' '}
              <span className="text-brand">{copy.titleAccent}</span>{' '}
              {copy.titleTrail}
            </h2>
          </m.div>

          <ol className="border-t border-border">
            {copy.items.map((item, index) => (
              <m.li
                key={item.number}
                className="group grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 border-b border-border py-8 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-8 md:py-9"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.45, delay: index * 0.08, ease }}
              >
                <span className="pt-1 text-[0.95rem] font-medium text-text-muted tabular-nums transition-colors group-hover:text-brand">
                  {item.number}
                </span>
                <div>
                  <h3 className="text-title text-text">{item.title}</h3>
                  <p className="mt-2.5 max-w-136 text-body text-text-secondary">{item.body}</p>
                </div>
              </m.li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
