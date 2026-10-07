import { useEffect } from 'react'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { Section } from '@/components/layout/Section.tsx'
import { Badge } from '@/components/ui/Badge.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { Surface } from '@/components/ui/Surface.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'

const arrowIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type SwatchProps = {
  name: string
  value: string
  className: string
}

function Swatch({ name, value, className }: SwatchProps) {
  return (
    <figure className="flex min-w-0 flex-col gap-2">
      <div className={`h-14 rounded-md border border-border ${className}`} />
      <figcaption className="flex flex-col gap-1">
        <span className="text-body-small text-text">{name}</span>
        <span className="text-caption text-text-muted">{value}</span>
      </figcaption>
    </figure>
  )
}

export function FoundationPage() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    const previousTitle = document.title
    document.title = 'Design system'
    return () => {
      meta.remove()
      document.title = previousTitle
    }
  }, [])

  return (
    <>
      <Section as="main" spacing="default">
        <Container variant="wide">
          <div className="mx-auto flex w-full max-w-page flex-col gap-16">
            <header className="flex flex-col gap-4">
              <Eyebrow>Internal preview</Eyebrow>
              <h1 className="text-display">Component specimen</h1>
              <p className="measure text-body-large">
                Reusable primitives for later pages. This is not a website page.
              </p>
            </header>

            <div className="flex flex-col gap-8" id="buttons">
              <h2>Buttons</h2>
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="subtle">Subtle</Button>
                <Button variant="ghost">Ghost</Button>
                <Button disabled>Disabled</Button>
                <Button size="lg">Large</Button>
                <Button variant="secondary" leadingIcon={arrowIcon}>
                  With icon
                </Button>
                <Button href="#buttons">Anchor</Button>
                <Button to="/">Route</Button>
                <Button loading>Loading</Button>
              </div>
            </div>

            <div className="flex flex-col gap-4" id="text-links">
              <h2>Text links</h2>
              <div className="flex flex-col items-start gap-3">
                <TextLink href="#text-links">Specimen link</TextLink>
                <TextLink href="#text-links" trailingIcon={arrowIcon}>
                  Specimen link with icon
                </TextLink>
                <TextLink to="/">Route link</TextLink>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h2>Eyebrows and badges</h2>
              <div className="flex flex-col items-start gap-3">
                <Eyebrow>Default eyebrow</Eyebrow>
                <Eyebrow tone="brand">Brand eyebrow</Eyebrow>
                <Eyebrow>Internal preview</Eyebrow>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>Neutral</Badge>
                <Badge variant="brand">Brand</Badge>
                <Badge variant="success">Success</Badge>
              </div>
            </div>

            <SectionHeader
              eyebrow="Specimen"
              title="Left-aligned header"
              titleId="left-header"
              description="A short supporting sentence that stays within the reading measure."
              action={<Button variant="secondary">Action</Button>}
            />

            <div className="flex flex-col gap-6">
              <h2>Surfaces</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Surface variant="plain" className="p-6">
                  <p className="text-body-small text-text">Plain</p>
                </Surface>
                <Surface variant="bordered" className="p-6">
                  <p className="text-body-small text-text">Bordered</p>
                </Surface>
                <Surface variant="subtle" className="p-6">
                  <p className="text-body-small text-text">Subtle</p>
                </Surface>
                <Surface variant="raised" className="p-6">
                  <p className="text-body-small text-text">Raised</p>
                </Surface>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="brand" spacing="compact" aria-labelledby="center-header">
        <Container variant="page">
          <SectionHeader
            align="center"
            eyebrow="Specimen"
            eyebrowTone="brand"
            title="Centered header"
            titleId="center-header"
            description="Centered copy stays in a narrow column so the line length remains comfortable."
          />
        </Container>
      </Section>

      <Section spacing="compact" aria-labelledby="containers-heading">
        <Container variant="wide">
          <h2 id="containers-heading">Containers</h2>
        </Container>
        <div className="mt-6 flex flex-col gap-4">
          <Container variant="wide" className="rounded-md border border-border-strong py-4">
            <p className="text-body-small text-text">Wide, 1440px</p>
          </Container>
          <Container variant="page" className="rounded-md border border-border py-4">
            <p className="text-body-small text-text">Page, 1280px</p>
          </Container>
          <Container variant="reading" className="rounded-md border border-border-subtle py-4">
            <p className="text-body-small text-text">Reading, 760px</p>
          </Container>
        </div>
      </Section>

      <Section background="brand" spacing="compact">
        <Container variant="page">
          <div className="flex flex-col gap-8">
            <h2>Typography</h2>
            <div className="flex flex-col gap-6">
              <p className="text-display text-text">Display</p>
              <p className="text-page-title text-text">Page title</p>
              <p className="text-section-title text-text">Section title</p>
              <p className="text-title text-text">Title</p>
              <p className="text-card-title text-text">Card title</p>
              <p className="measure text-body-large">
                Large body for short introductions. The line length stays inside a comfortable
                reading measure.
              </p>
              <p className="measure">
                Body text for paragraphs. Long lines stop around sixty-eight characters so the
                text stays easy to read on wide screens.
              </p>
              <p className="text-body-small text-text-muted">Small text for secondary information.</p>
              <p className="text-caption text-text-subtle">Caption for metadata.</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="compact">
        <Container variant="page">
          <div className="flex flex-col gap-8">
            <h2>Color</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              <Swatch name="Page" value="#FFFFFF" className="bg-bg" />
              <Swatch name="Subtle" value="#F8FAFC" className="bg-bg-subtle" />
              <Swatch name="Muted surface" value="#F4F7F9" className="bg-bg-muted" />
              <Swatch name="Warm" value="#FAF8F4" className="bg-surface-warm" />
              <Swatch name="Brand" value="#0A8FD8" className="bg-brand" />
              <Swatch name="Brand hover" value="#087BB9" className="bg-brand-hover" />
              <Swatch name="Brand active" value="#06699E" className="bg-brand-active" />
              <Swatch name="Brand soft" value="#EAF6FC" className="bg-brand-soft" />
              <Swatch name="Brand subtle" value="#F3F9FC" className="bg-brand-subtle" />
              <Swatch name="Success soft" value="#EDF8F2" className="bg-success-soft" />
              <Swatch name="Warning soft" value="#FFF6E8" className="bg-warning-soft" />
              <Swatch name="Error soft" value="#FFF0F1" className="bg-error-soft" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
