import { useEffect } from 'react'
import { Link } from 'react-router'
import { Container } from '@/components/layout/Container.tsx'
import { PageHero } from '@/components/layout/PageHero.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'

type PlaceholderPageProps = {
  title: string
}

/** The main stops a lost visitor can take back onto the route. */
const stops = [
  { label: 'Home', to: '/', body: 'Start again from the overview.' },
  {
    label: 'Healthcare',
    to: '/healthcare',
    body: 'Clinical decision support, telemedicine, records, exchange, and integration.',
  },
  { label: 'Work', to: '/work', body: 'Selected projects and case studies.' },
  { label: 'Contact', to: '/contact', body: 'Book a call, or tell us about your project.' },
] as const

/**
 * Not-found page, used by the router's catch-all route.
 */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    const previous = document.title
    document.title = 'Page not found | Bizaffix'
    return () => {
      meta.remove()
      document.title = previous
    }
  }, [])

  return (
    <main className="studio-page">
      <PageHero
        zone="Not found"
        meta="Error 404"
        title={title}
        titleId="not-found-title"
        intro="The link may be out of date, or the address may be mistyped. Pick a main stop to get back on the route."
      />

      <section className="section-y bg-page-white" aria-labelledby="main-stops-title">
        <Container variant="wide" className="w-full">
          <h2 id="main-stops-title" className="text-eyebrow text-text-muted [font-stretch:100%]">
            Main stops
          </h2>
          <ul className="mt-6 border-t border-border">
            {stops.map((stop) => (
              <li key={stop.to}>
                <Link
                  to={stop.to}
                  className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-1 border-b border-border py-6 text-text no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:grid-cols-[auto_minmax(0,16rem)_minmax(0,1fr)] md:gap-x-8 md:py-8"
                >
                  <HexMark
                    variant="station"
                    size={20}
                    className="[&_polygon]:transition-colors [&_polygon]:duration-300 group-hover:[&_polygon]:fill-accent group-focus-visible:[&_polygon]:fill-accent"
                  />
                  <span className="text-title text-text decoration-brand decoration-2 underline-offset-[0.2em] group-hover:underline">
                    {stop.label}
                  </span>
                  <span className="col-start-2 text-body-small text-text-secondary md:col-start-auto">
                    {stop.body}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  )
}
