import { Asterisk, ScanSearch, UsersRound } from 'lucide-react'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperLink, PaperSection } from '@/components/paper/kit.tsx'
import { needs, type NeedCard } from '@/data/home.ts'

const icons = [Asterisk, UsersRound, ScanSearch] as const

/** A tiny "window" chip set into the headline, like a sticker on the page. */
function TitleChip() {
  return (
    <span aria-hidden="true" className="ph-title-chip">
      <span className="bg-[var(--ph-yellow)]" />
      <span className="bg-[var(--ph-periwinkle)]" />
      <span className="bg-white" />
    </span>
  )
}

function Need({ card, index }: { card: NeedCard; index: number }) {
  const Icon = icons[index % icons.length]
  return (
    <Reveal as="li" delay={index * 90} className="flex">
      <article className="ph-need" data-featured={index === 1 ? 'true' : undefined}>
        <Icon aria-hidden="true" className="size-7 stroke-[1.4]" />
        <p className="ph-label ph-need-muted mt-auto pt-16">
          {card.number} · {card.tag}
        </p>
        <h3 className="ph-h3 mt-3">{card.title}</h3>
        <p className="ph-body ph-need-muted mt-3">{card.body}</p>
        {card.cta.bookCall ? (
          <PaperLink bookCall className="mt-8 self-start">
            {card.cta.label}
          </PaperLink>
        ) : (
          <PaperLink {...(card.cta.href?.startsWith('#') ? { href: card.cta.href } : { to: card.cta.href })} className="mt-8 self-start">
            {card.cta.label}
          </PaperLink>
        )}
      </article>
    </Reveal>
  )
}

/** 03: three ways in. Hovering a card turns it blue; the middle one is blue until then. */
export function NeedsGrid() {
  const [first, second] = needs.titleLines
  return (
    <PaperSection tone="cream" grid={false} labelledBy="needs-title">
      <h2 id="needs-title" className="ph-h2">
        <RevealLines
          lines={[
            first,
            <span key="chip" className="inline-flex items-center gap-[0.25em]">
              <TitleChip />
              {second}
            </span>,
          ]}
        />
      </h2>
      <ul className="ph-needs mt-16 grid gap-6 md:grid-cols-3">
        {needs.cards.map((card, index) => (
          <Need key={card.number} card={card} index={index} />
        ))}
      </ul>
    </PaperSection>
  )
}
