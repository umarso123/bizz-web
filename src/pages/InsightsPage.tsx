import { useEffect } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { PageHero } from '@/components/layout/PageHero.tsx'
import { Badge } from '@/components/ui/Badge.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { insightsPage } from '@/content/insights.ts'

const copy = insightsPage

/* Cover art: a honeycomb field with one route through it, ending at a gold station. */
const CELL = 36
const COL_STEP = Math.sqrt(3) * CELL
const ROW_STEP = 1.5 * CELL

function centre(row: number, col: number) {
  return { x: 10 + col * COL_STEP + (row % 2 === 1 ? COL_STEP / 2 : 0), y: 20 + row * ROW_STEP }
}

function hexagon(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 180) * (60 * index - 90)
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`
  }).join(' ')
}

const field = Array.from({ length: 10 }, (_, row) =>
  Array.from({ length: 8 }, (_, index) => ({ row, col: index - 1 })),
).flat()

/** Adjacent cells, top left to bottom right. */
const route = (
  [
    [1, 0],
    [1, 1],
    [2, 2],
    [3, 2],
    [4, 3],
    [4, 4],
    [5, 4],
    [6, 4],
    [7, 4],
  ] as const
).map(([row, col]) => centre(row, col))

const destination = route[route.length - 1] ?? centre(7, 4)

function Cover() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-soft" aria-hidden="true">
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        {field.map(({ row, col }) => {
          const { x, y } = centre(row, col)
          return (
            <polygon
              key={`${row}-${col}`}
              points={hexagon(x, y, CELL)}
              fill="none"
              stroke="var(--color-brand)"
              strokeOpacity="0.16"
              strokeWidth="1.25"
            />
          )
        })}
        <polygon points={hexagon(destination.x, destination.y, CELL)} fill="var(--color-accent-soft)" />
        <polyline
          points={route.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {route.slice(0, -1).map(({ x, y }) => (
          <polygon
            key={`${x}-${y}`}
            points={hexagon(x, y, 11)}
            fill="var(--color-surface)"
            stroke="var(--color-text)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        ))}
        <polygon
          points={hexagon(destination.x, destination.y, 17)}
          fill="var(--color-accent)"
          stroke="var(--color-text)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export function InsightsPage() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Insights | Bizaffix'
    return () => {
      document.title = previous
    }
  }, [])

  const article = copy.featured

  return (
    <main className="studio-page">
      <PageHero zone={copy.hero.zone} title={copy.hero.title} titleId="insights-title" intro={copy.hero.intro} />

      <section className="section-y bg-page-white" aria-labelledby="featured-article-title">
        <Container variant="wide" className="w-full">
          <article className="grid gap-12 lg:grid-cols-12 lg:items-stretch lg:gap-8">
            <div className="flex flex-col lg:col-span-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Badge variant="brand">{article.category}</Badge>
                <time dateTime={article.dateTime} className="text-body-small text-text-secondary">
                  {article.date}
                </time>
              </div>

              <h2 id="featured-article-title" className="mt-6 max-w-[20ch] text-section-title text-text">
                {article.title}
              </h2>

              <blockquote className="mt-10 max-w-[34rem] border-l-[3px] border-accent pl-6">
                <p className="text-[length:clamp(1.25rem,1.05rem_+_0.7vw,1.625rem)] leading-[1.35] font-medium tracking-[-0.012em] text-text">
                  “{article.opening}”
                </p>
              </blockquote>

              <div className="mt-12 flex items-center gap-3 border-t border-border pt-6 lg:mt-auto">
                <HexMark variant="station" size={14} />
                <p className="text-body-small text-text-secondary">{copy.note}</p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Cover />
            </div>
          </article>
        </Container>
      </section>
    </main>
  )
}
