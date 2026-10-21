import type { ReactNode } from 'react'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { studioAddress, studioEmail, studioPhone, studioSocial } from '@/content/contact.ts'

/** Same look as TextLink, without its button-height tap box, for rows of details. */
const linkClass =
  'text-text underline decoration-brand/45 decoration-[1.5px] underline-offset-[0.3em] transition-[text-decoration-color,text-decoration-thickness] duration-(--duration-standard) ease-standard hover:text-text hover:decoration-brand hover:decoration-[2.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[5.25rem_minmax(0,1fr)] items-baseline gap-4 border-t border-border py-4 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
      <dt className="text-eyebrow text-text-muted">{label}</dt>
      <dd className="min-w-0 text-body text-text">{children}</dd>
    </div>
  )
}

/**
 * The studio's direct details, set like a directory board.
 * The gold station marks where the studio is.
 */
export function ContactDirectory() {
  return (
    <address className="not-italic">
      <p className="text-eyebrow text-text-secondary">Or reach the studio directly</p>
      <dl className="mt-4 border-b border-border">
        <Row label="Email">
          <a href={`mailto:${studioEmail}`} className={linkClass}>
            {studioEmail}
          </a>
        </Row>
        <Row label="Phone">
          <a href={studioPhone.href} className={`${linkClass} tabular-nums`}>
            {studioPhone.label}
          </a>
        </Row>
        <Row label="Studio">
          <span className="inline-flex items-center gap-2.5">
            <HexMark variant="active" size={14} />
            {studioAddress}
          </span>
        </Row>
        <Row label="Social">
          <span className="flex flex-wrap gap-x-5 gap-y-1">
            {studioSocial.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer noopener" className={linkClass}>
                {item.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </span>
        </Row>
      </dl>
    </address>
  )
}
