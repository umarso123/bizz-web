import { useEffect, type ReactNode } from 'react'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { PageHero } from '@/components/layout/PageHero.tsx'
import { Badge } from '@/components/ui/Badge.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { Surface } from '@/components/ui/Surface.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { Wayfinder } from '@/components/ui/Wayfinder.tsx'
import {
  CareWorkspaceShot,
  CdsShot,
  EhrShot,
  HieShot,
  InteropShot,
  TelemedicineShot,
} from '@/components/visuals/HealthShots.tsx'
import { FintechShot, FitnessShot } from '@/components/visuals/IndustryShots.tsx'
import { cn } from '@/lib/cn.ts'

/* Values mirror src/styles/theme.css. Update both together. */
const coreColours = [
  { name: 'Ink', token: 'text', value: '#0d121f', className: 'bg-text', role: 'Text and dark buttons' },
  { name: 'Clinic white', token: 'page-white', value: '#ffffff', className: 'bg-page-white', role: 'The page' },
  { name: 'Ward', token: 'bg-subtle', value: '#f5f7fb', className: 'bg-bg-subtle', role: 'Quiet zones and media wells' },
  { name: 'Route blue', token: 'brand', value: '#234ed1', className: 'bg-brand', role: 'The route line, links, brand button' },
  {
    name: 'Night route',
    token: 'surface-brand-deep',
    value: '#14245f',
    className: 'bg-surface-brand-deep',
    role: 'Healthcare zone and closing panel',
  },
  { name: 'Signal gold', token: 'accent', value: '#fde36e', className: 'bg-accent', role: 'The active station only' },
] as const

const supportColours = [
  { name: 'Muted surface', token: 'bg-muted', value: '#edf1f7', className: 'bg-bg-muted' },
  { name: 'Brand hover', token: 'brand-hover', value: '#2549c9', className: 'bg-brand-hover' },
  { name: 'Brand soft', token: 'brand-soft', value: '#e8eefc', className: 'bg-brand-soft' },
  { name: 'Mist', token: 'mist', value: '#c9d7f8', className: 'bg-mist' },
  { name: 'Night', token: 'surface-brand-night', value: '#0f1b4a', className: 'bg-surface-brand-night' },
  { name: 'Gold soft', token: 'accent-soft', value: '#fef6d8', className: 'bg-accent-soft' },
  { name: 'Border subtle', token: 'border-subtle', value: '#ebeff5', className: 'bg-border-subtle' },
  { name: 'Border', token: 'border', value: '#dde3ec', className: 'bg-border' },
  { name: 'Border strong', token: 'border-strong', value: '#c3ccd9', className: 'bg-border-strong' },
  { name: 'Text secondary', token: 'text-secondary', value: '#5a6472', className: 'bg-text-secondary' },
  { name: 'Success', token: 'success', value: '#247f5a', className: 'bg-success' },
  { name: 'Error', token: 'error', value: '#c73a42', className: 'bg-error' },
] as const

const typeScale = [
  {
    role: 'Display',
    className: 'text-display text-text',
    spec: 'text-display, 48–100px, 600, 80% wide',
    sample: 'From idea to reality',
  },
  {
    role: 'Page title',
    className: 'text-page-title text-text',
    spec: 'text-page-title, 44–80px, 600, 82% wide',
    sample: 'Partner in disruption',
  },
  {
    role: 'Section title',
    className: 'text-section-title text-text',
    spec: 'text-section-title, 34–60px, 600, 85% wide',
    sample: 'Healthcare is where we go deep',
  },
  {
    role: 'Title',
    className: 'text-title text-text',
    spec: 'text-title, 22–28px, 600, 92% wide',
    sample: 'Clinical Decision Support',
  },
  {
    role: 'Card title',
    className: 'text-card-title text-text',
    spec: 'text-card-title, 19–22px, 600, 96% wide',
    sample: 'Telemedicine Development',
  },
  {
    role: 'Body large',
    className: 'text-body-large text-text-secondary measure',
    spec: 'text-body-large, 18–20px, 400',
    sample: 'Experience the power of innovation, and let us attune our interactive services to your healthcare business.',
  },
  {
    role: 'Body',
    className: 'text-body text-text-secondary measure',
    spec: 'text-body, 17px, 400',
    sample:
      'Break healthcare data barriers with our Integration and Interoperability services. Smooth data exchange for informed decisions, and fewer errors.',
  },
  {
    role: 'Small',
    className: 'text-body-small text-text-secondary measure',
    spec: 'text-body-small, 15px, 400',
    sample: 'Secure, scalable healthcare data sharing, tailored to your needs.',
  },
  { role: 'Label', className: 'text-eyebrow text-text', spec: 'text-eyebrow, 14px, 500, sentence case', sample: 'Healthcare' },
  { role: 'Caption', className: 'text-caption text-text-muted', spec: 'text-caption, 13px, 400', sample: 'August 4, 2025' },
] as const

const hexVariants = ['station', 'active', 'solid', 'outline', 'inverse'] as const

const radii = [
  { name: 'Feature panel', className: 'h-32 w-full rounded-2xl', value: 'rounded-2xl, 36px' },
  { name: 'Card and media', className: 'h-32 w-full rounded-xl', value: 'rounded-xl, 28px' },
  { name: 'Small surface', className: 'h-32 w-full rounded-lg', value: 'rounded-lg, 20px' },
  { name: 'Control', className: 'h-12 w-40 rounded-pill', value: 'rounded-pill' },
] as const

const index = [
  { label: 'Colour', href: '#colour' },
  { label: 'Type', href: '#type' },
  { label: 'Controls', href: '#controls' },
  { label: 'Wayfinding', href: '#wayfinding' },
  { label: 'Layout', href: '#layout' },
  { label: 'Visuals', href: '#visuals' },
] as const

/** Product visuals: drawn in code, sample data only, labelled as illustrations. */
const visuals = [
  { name: 'Care workspace', note: 'Healthcare industry, homepage healthcare zone', Shot: CareWorkspaceShot },
  { name: 'Clinical decision support', note: 'CDS case study and homepage work card', Shot: CdsShot },
  { name: 'Telemedicine', note: 'Telemedicine case study', Shot: TelemedicineShot },
  { name: 'Health information exchange', note: 'HIE case study, Research step', Shot: HieShot },
  { name: 'Electronic health records', note: 'EHR case study', Shot: EhrShot },
  { name: 'Integration and interoperability', note: 'Interoperability case study', Shot: InteropShot },
  { name: 'Fintech', note: 'Fintech industry', Shot: FintechShot },
  { name: 'Fitness', note: 'Fitness study', Shot: FitnessShot },
] as const

function Specimen({ id, children, subtle = false }: { id: string; children: ReactNode; subtle?: boolean }) {
  return (
    <section
      id={id}
      className={cn('scroll-mt-28 section-y', subtle ? 'bg-bg-subtle' : 'bg-page-white')}
      aria-labelledby={`${id}-title`}
    >
      <Container variant="wide" className="w-full">
        {children}
      </Container>
    </section>
  )
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="text-caption text-text-muted">{children}</p>
}

export function FoundationPage() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    const previousTitle = document.title
    document.title = 'Design system | Bizaffix'
    return () => {
      meta.remove()
      document.title = previousTitle
    }
  }, [])

  return (
    <main className="studio-page">
      <PageHero
        zone="Design system"
        meta="Internal preview"
        title="Care wayfinding"
        titleId="design-system-title"
        intro="Tokens and components shared by every page. This page is not linked from the site; the full spec lives in docs/design-system.md. The top of this page is a live PageHero."
        actions={index.map((item) => (
          <Button key={item.href} href={item.href} variant="secondary">
            {item.label}
          </Button>
        ))}
      />

      <Specimen id="colour">
        <SectionHeader
          eyebrow="Colour"
          meta="6 core tokens"
          title="Clinic white, ink, and one route blue."
          titleId="colour-title"
          description="Gold marks the active station and nothing else. Status colours are only for status."
        />
        <ul className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {coreColours.map((colour) => (
            <li key={colour.token} className="flex flex-col gap-4">
              <div className={cn('h-28 rounded-xl border border-border', colour.className)} />
              <div>
                <p className="text-card-title text-text">{colour.name}</p>
                <p className="mt-1 text-body-small text-text-secondary">{colour.role}</p>
                <p className="mt-2 text-caption text-text-muted">
                  {colour.token}, {colour.value}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {supportColours.map((colour) => (
            <li key={colour.token} className="flex flex-col gap-3">
              <div className={cn('h-14 rounded-lg border border-border', colour.className)} />
              <div>
                <p className="text-body-small text-text">{colour.name}</p>
                <p className="text-caption text-text-muted">
                  {colour.token}, {colour.value}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Specimen>

      <Specimen id="type" subtle>
        <SectionHeader
          eyebrow="Type"
          meta="Instrument Sans"
          title="One family, set like signage."
          titleId="type-title"
          description="Headings narrow as they grow, from 80% wide at display size to 100% for body text. Sentence case throughout; no capitals for labels, no monospace."
        />
        <ul className="mt-14 border-t border-border md:mt-20">
          {typeScale.map((style) => (
            <li key={style.role} className="grid gap-4 border-b border-border py-8 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-3">
                <p className="text-body-small text-text">{style.role}</p>
                <Caption>{style.spec}</Caption>
              </div>
              <p className={cn('lg:col-span-9', style.className)}>{style.sample}</p>
            </li>
          ))}
        </ul>
      </Specimen>

      <Specimen id="controls">
        <SectionHeader
          eyebrow="Controls"
          title="Flat pills, plain words."
          titleId="controls-title"
          description="Buttons carry no arrows and no shadows. Text links are underlined, and the underline thickens on hover."
        />

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-10 lg:col-span-7">
            <div className="flex flex-col gap-4">
              <Caption>Variants</Caption>
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="brand">Brand</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="subtle">Subtle</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Caption>Sizes, states, and elements</Caption>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
                <Button variant="secondary" leadingIcon={<HexMark variant="active" size={14} />}>
                  With station
                </Button>
                <Button href="#controls" variant="secondary">
                  Anchor
                </Button>
                <Button to="/" variant="secondary">
                  Route
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Caption>Text links: ink and brand tones</Caption>
              <div className="flex flex-wrap items-center gap-x-8">
                <TextLink href="#controls">View all services</TextLink>
                <TextLink href="#controls" tone="brand">
                  View Case Study
                </TextLink>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Caption>Badges</Caption>
              <div className="flex flex-wrap gap-2">
                <Badge>Neutral</Badge>
                <Badge variant="brand">Marketing</Badge>
                <Badge variant="success">Success</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 rounded-2xl bg-night-route p-8 text-text-inverse md:p-10 lg:col-span-5">
            <Wayfinder label="On night route" meta="Inverse" inverse />
            <p className="text-title text-text-inverse">Controls for dark panels.</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="inverse" size="lg">
                Book a call
              </Button>
              <Button variant="inverse-outline" size="lg">
                See our work
              </Button>
            </div>
            <TextLink href="#controls" tone="inverse">
              info@bizaffix.com
            </TextLink>
          </div>
        </div>
      </Specimen>

      <Specimen id="wayfinding" subtle>
        <SectionHeader
          eyebrow="Wayfinding"
          meta="Wayfinder, HexMark"
          title="Zones, routes, and stations."
          titleId="wayfinding-title"
          description="A Wayfinder opens a section a visitor might navigate to. Hexagons mark stations; gold means you are here."
        />

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <div className="flex flex-col gap-3">
              <Caption>Label only</Caption>
              <Wayfinder label="Healthcare" />
            </div>
            <div className="flex flex-col gap-3">
              <Caption>With meta</Caption>
              <Wayfinder label="Services" meta="6 services" />
            </div>
            <div className="flex flex-col gap-3">
              <Caption>Drawn once on load, for the page-top marker</Caption>
              <Wayfinder label="About" meta="Austin, Texas" draw />
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Caption>HexMark variants at 12, 24, and 40px</Caption>
            <ul className="mt-4 border-t border-border">
              {hexVariants.map((variant) => (
                <li key={variant} className="flex items-center gap-5 border-b border-border py-4">
                  <span className="flex items-center gap-4 text-text">
                    <HexMark variant={variant} size={12} />
                    <HexMark variant={variant} size={24} />
                    <HexMark variant={variant} size={40} />
                  </span>
                  <span className="text-body-small text-text">{variant}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Specimen>

      <Specimen id="layout">
        <SectionHeader
          eyebrow="Layout"
          meta="12 columns"
          title="Section intros, shape, and width."
          titleId="layout-title"
          description="Radius follows hierarchy. Shadows belong to things that float, like the header and menus."
        />

        <div className="mt-14 flex flex-col gap-16 md:mt-20">
          <div className="flex flex-col gap-6">
            <Caption>SectionHeader, left: title on the left, supporting text against it</Caption>
            <div className="rounded-2xl border border-border p-6 md:p-10">
              <SectionHeader
                eyebrow="Specimen"
                meta="Left"
                title="A section title sits on the left."
                description="Supporting text sits against it, inside a comfortable measure, with an optional action."
                action={<Button variant="secondary">Action</Button>}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Caption>SectionHeader, center: for closing moments</Caption>
            <div className="rounded-2xl bg-bg-subtle px-6 py-12 md:py-16">
              <SectionHeader
                align="center"
                eyebrow="Specimen"
                title="Centered for closing moments."
                description="Centered copy stays in a narrow column so the line length stays comfortable."
                action={<Button>Book a call</Button>}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Caption>Radius hierarchy</Caption>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {radii.map((radius) => (
                <li key={radius.name} className="flex flex-col gap-3">
                  <div className={cn('border border-border bg-bg-subtle', radius.className)} />
                  <div>
                    <p className="text-body-small text-text">{radius.name}</p>
                    <Caption>{radius.value}</Caption>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <Caption>Surfaces</Caption>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Surface variant="plain" className="border border-dashed border-border p-6">
                <p className="text-body-small text-text">Plain</p>
              </Surface>
              <Surface variant="bordered" className="p-6">
                <p className="text-body-small text-text">Bordered</p>
              </Surface>
              <Surface variant="subtle" className="p-6">
                <p className="text-body-small text-text">Subtle</p>
              </Surface>
              <Surface variant="raised" className="p-6">
                <p className="text-body-small text-text">Raised, for floating things</p>
              </Surface>
            </div>
          </div>
        </div>
      </Specimen>

      <Specimen id="visuals" subtle>
        <SectionHeader
          eyebrow="Visuals"
          meta={`${visuals.length} scenes`}
          title="Product visuals."
          titleId="visuals-title"
          description="Drawn in code with the house type and colours, so they stay light and scale like images. Sample data only, and each one is labelled as an illustration."
        />
        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2">
          {visuals.map(({ name, note, Shot }) => (
            <figure key={name}>
              <div className="relative aspect-[16/11] overflow-hidden rounded-xl border border-border-subtle">
                <Shot />
              </div>
              <figcaption className="mt-3">
                <p className="text-card-title text-text">{name}</p>
                <p className="text-body-small text-text-secondary">{note}</p>
              </figcaption>
            </figure>
          ))}
          <figure className="md:col-span-2">
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-night-route md:aspect-[2.2/1]">
              <CareWorkspaceShot tone="night" />
            </div>
            <figcaption className="mt-3 text-body-small text-text-secondary">Night tone, on dark panels</figcaption>
          </figure>
        </div>
      </Specimen>

      <section className="pb-(--section-space)" aria-label="Containers">
        <Container variant="wide" className="w-full pb-6">
          <Caption>Containers</Caption>
        </Container>
        <div className="flex flex-col gap-4">
          <Container variant="wide" className="rounded-lg border border-border-strong py-4">
            <p className="text-body-small text-text">Wide, 90rem: sections</p>
          </Container>
          <Container variant="page" className="rounded-lg border border-border py-4">
            <p className="text-body-small text-text">Page, 80rem</p>
          </Container>
          <Container variant="reading" className="rounded-lg border border-border-subtle py-4">
            <p className="text-body-small text-text">Reading, 47.5rem: long text</p>
          </Container>
        </div>
      </section>
    </main>
  )
}
