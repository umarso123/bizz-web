import type { ReactNode } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Wayfinder } from '@/components/ui/Wayfinder.tsx'
import { cn } from '@/lib/cn.ts'

type PageHeroProps = {
  /** Zone name for the wayfinding rule. Matches the nav label. */
  zone: ReactNode
  /** Short fact at the end of the rule, e.g. "5 industries". */
  meta?: ReactNode
  title: ReactNode
  titleId?: string
  intro?: ReactNode
  actions?: ReactNode
  /** Optional visual on the right on wide screens. */
  aside?: ReactNode
  /** Extra content under the hero copy, inside the same container. */
  children?: ReactNode
  className?: string
}

/**
 * The top of every inner page: zone rule, page title, intro, actions.
 * Sits under the floating header, on the quiet floor-plan field.
 */
export function PageHero({
  zone,
  meta,
  title,
  titleId = 'page-title',
  intro,
  actions,
  aside,
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'atmosphere-hero -mt-(--header-clearance) border-b border-border-subtle pt-[calc(var(--header-clearance)+2.5rem)] pb-16 md:pt-[calc(var(--header-clearance)+4rem)] md:pb-24',
        className,
      )}
      aria-labelledby={titleId}
    >
      <Container variant="wide" className="w-full">
        <Wayfinder label={zone} meta={meta} draw />
        <div className="mt-10 grid gap-12 md:mt-16 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className={aside ? 'lg:col-span-7' : 'lg:col-span-10'}>
            <h1 id={titleId} className="max-w-[15ch] text-page-title text-text">
              {title}
            </h1>
            {intro ? (
              <p className="mt-6 max-w-[38rem] text-body-large text-text-secondary md:mt-8">{intro}</p>
            ) : null}
            {actions ? <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">{actions}</div> : null}
          </div>
          {aside ? <div className="lg:col-span-5">{aside}</div> : null}
        </div>
        {children}
      </Container>
    </section>
  )
}
