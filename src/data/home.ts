/**
 * Homepage copy for the sections added in the 2026 redesign.
 * Every word these sections render lives here; components only lay it out.
 *
 * Anything flagged `confirmed: false` or commented TODO is a placeholder that
 * still needs a yes from Bizaffix before launch.
 */
import { mockups } from '@/content/mockups.ts'

/* ── Shared ─────────────────────────────────────────────────────────────── */

export type Cta = { label: string; href?: string; /** Use the site's Book a call target. */ bookCall?: boolean }

/* ── Hero ───────────────────────────────────────────────────────────────── */

export type HeroCopy = {
  /** Screen-reader sentence; `lines` are the visual line breaks. */
  title: string
  lines: readonly string[]
  /** The last line's highlighted word. */
  accent: string
  /** TODO(confirm): only show while it is true. Set to null to hide. */
  badge: string | null
  lead: string
  primaryCta: string
  secondaryCta: { label: string; href: string }
  /** Small affordance next to the spinning mark. */
  dragHint: string
  scrollCue: string
}

export const hero: HeroCopy = {
  title: 'Ideas built from code, pixels and nerve.',
  lines: ['Ideas built from code,', 'pixels and'],
  accent: 'nerve.',
  badge: 'Now booking Q1 2027',
  lead: 'Mobile apps, web platforms and healthcare software, designed and engineered by one team.',
  primaryCta: 'Book a 30-min call',
  secondaryCta: { label: 'See our work', href: '/#selected-work' },
  dragHint: 'Drag to spin',
  scrollCue: 'Scroll',
}

/* ── Why Bizaffix ───────────────────────────────────────────────────────── */

export const whyBizaffix = {
  label: 'Why Bizaffix',
  statement:
    'You bring the problem. We bring the engineers, the designers and the plan, and we don’t leave until it’s solved.',
} as const

/* ── Inside the liquid, and the section after it ───────────────────────── */
// Copy from content/home.ts (`why`), already on the site.

/** Shown under the liquid as it floods the screen. Not interactive (it is an overlay). */
export const markFlood = {
  label: 'From idea to reality',
  title: 'One team across product, design, and engineering.',
  body: 'Good products don’t happen in silos. We bring strategy, design, technology, and domain understanding into the same conversation, so decisions happen faster and the product stays coherent from idea to launch.',
} as const

export type ConceptIcon = 'product' | 'design' | 'engineering' | 'domain' | 'mark'

export type MarkConcept = {
  /** Spec code shown in the label, e.g. BZ-01. */
  code: string
  word: string
  icon: ConceptIcon
  line: string
  href: string
}

/** The section straight after the flood: four stations on one route, ending at the mark. */
export const markConcepts: {
  code: string
  title: string
  rows: readonly MarkConcept[]
  destination: MarkConcept
} = {
  code: 'BZ-00',
  title: 'What goes into every product.',
  rows: [
    { code: 'BZ-01', word: 'Product', icon: 'product', line: 'Think beyond features.', href: '/services' },
    { code: 'BZ-02', word: 'Design', icon: 'design', line: 'Make complexity understandable.', href: '/services' },
    { code: 'BZ-03', word: 'Engineering', icon: 'engineering', line: 'Build for what comes next.', href: '/services' },
    { code: 'BZ-04', word: 'Domain', icon: 'domain', line: 'Understand the world the product lives in.', href: '/healthcare' },
  ],
  destination: { code: 'BZ-05', word: 'Bizaffix', icon: 'mark', line: 'All four, in one team.', href: '/about' },
}

/* ── What do you need? ──────────────────────────────────────────────────── */

export type NeedCard = {
  number: string
  tag: string
  title: string
  body: string
  cta: Cta
}

export type NeedsCopy = { titleLines: readonly string[]; cards: readonly NeedCard[] }

export const needs: NeedsCopy = {
  titleLines: ['What do', 'you need?'],
  cards: [
    {
      number: '01',
      tag: 'Build',
      title: 'Build or improve a product',
      body: 'MVPs, web and mobile apps, custom software and integrations. Strategy and design included.',
      cta: { label: 'Book a discovery call', bookCall: true },
    },
    {
      number: '02',
      tag: 'Hire',
      title: 'Add engineers to your team',
      body: 'Developers, designers and QA for companies in the USA, Saudi Arabia, UAE and the GCC.',
      // TODO(confirm): no dedicated staffing page yet, so this goes to the contact form.
      cta: { label: 'Request engineers', href: '/contact' },
    },
    {
      number: '03',
      tag: 'Check',
      title: 'Check your product’s compliance gaps',
      body: 'A free assessment for healthcare and education products, with a written report.',
      cta: { label: 'Start the assessment', href: '#compliance' },
    },
  ],
}

/* ── Compliance gap assessment ──────────────────────────────────────────── */

export type ProductKind = 'healthcare' | 'education'

export type ComplianceCopy = {
  label: string
  title: string
  body: string
  areas: readonly string[]
  form: {
    title: string
    kinds: readonly { id: ProductKind; label: string }[]
    placeholder: string
    addLink: string
    linkPlaceholder: string
    submit: string
    /** Example descriptions that fill the textarea, per product kind. */
    examples: Record<ProductKind, readonly string[]>
    tooShort: string
    pending: string
  }
  footnote: string
}

export const compliance: ComplianceCopy = {
  label: 'Free · 10 minutes',
  title: 'Compliance gap assessment for your product.',
  body: 'Answer a few questions about how your product handles data, access and accessibility. Get a score by area and a written report of the gaps to fix first.',
  areas: ['Data handling', 'Access & security', 'Accessibility', 'Documentation'],
  form: {
    title: 'Check your product’s compliance gaps',
    kinds: [
      { id: 'healthcare', label: 'Healthcare product' },
      { id: 'education', label: 'Education product' },
    ],
    placeholder: 'Describe your product, e.g. a booking app for a chain of dental clinics',
    addLink: 'Add product link',
    linkPlaceholder: 'https://',
    submit: 'Start assessment',
    examples: {
      education: ['School learning platform', 'Student portal', 'Tutoring app'],
      // TODO(confirm): healthcare examples were not in the screenshot.
      healthcare: ['Patient booking app', 'Telehealth platform', 'Clinic staff portal'],
    },
    tooShort: 'Add a sentence or two about the product so the questions fit it.',
    // TODO: replace once the assessment flow exists.
    pending: 'Thanks. The assessment is not connected yet, so nothing was sent.',
  },
  footnote: 'International review, not legal advice or certification.',
}

/** What the compliance form will send once a backend exists. */
export type ComplianceAssessmentRequest = {
  kind: ProductKind
  description: string
  /** Absolute URL, or null when none was given. */
  productUrl: string | null
}

/* ── Industries ─────────────────────────────────────────────────────────── */

export type Industry = {
  id: string
  number: string
  name: string
  image: { src: string; alt: string }
  /** Focus areas shown under the product shot. */
  chips: readonly string[]
}

export type IndustriesCopy = {
  label: string
  titleLines: readonly string[]
  tagline: readonly string[]
  items: readonly Industry[]
}

export const industries: IndustriesCopy = {
  label: 'Across the world',
  titleLines: ['Industries', 'we cover.'],
  tagline: ['Real projects, real results.', 'Built for brands that mean business.'],
  items: [
    {
      id: 'healthcare',
      number: '01',
      name: 'Healthcare',
      image: { src: mockups.drugTestingApp, alt: 'Drug testing app screens' },
      // From the existing healthcare card on the homepage.
      chips: ['EHR', 'HIE', 'Telehealth'],
    },
    {
      id: 'education',
      number: '02',
      name: 'Education',
      image: { src: mockups.familyTreeLaptop, alt: 'Family tree learning product on a laptop' },
      chips: ['Learning platforms', 'School websites', 'Student portals'],
    },
    {
      id: 'fitness',
      number: '03',
      name: 'Fitness',
      image: { src: mockups.optimizedStrength, alt: 'Optimized Strength fitness app screens' },
      chips: [], // TODO(confirm): fitness focus areas
    },
    {
      id: 'fintech',
      number: '04',
      name: 'Fintech',
      image: { src: mockups.bankAlfalah, alt: 'Bank Alfalah banking app mockup' },
      chips: [], // TODO(confirm): fintech focus areas
    },
  ],
}

/* ── Process ────────────────────────────────────────────────────────────── */

export type ProcessCopy = {
  label: string
  titleLines: readonly string[]
  steps: readonly string[]
  /** The illustrative design board beside the list (not real client data). */
  board: {
    title: string
    research: readonly string[]
    persona: string
    brandName: string
    screenTitle: string
    screenBody: string
    screenCta: string
    signedOff: string
  }
}

export const process: ProcessCopy = {
  label: 'Process',
  titleLines: ['We listen first,', 'then we design.'],
  steps: ['Research & interviews', 'Brand identity', 'Colour & type', 'Wireframes', 'UI design', 'Feedback & sign-off'],
  board: {
    title: 'Bizaffix · Brand & UI',
    research: ['“Booking takes too many steps.”', '“I do everything on my phone.”', '“Where’s my order now?”'],
    persona: 'Clinic manager',
    brandName: 'bizaffix',
    screenTitle: 'Book in two taps.',
    screenBody: 'Pick a time, then you’re done.',
    screenCta: 'Book now',
    signedOff: 'Design signed off, ready to build',
  },
}

/* ── FAQ ────────────────────────────────────────────────────────────────── */

export type Faq = {
  question: string
  answer: string
  /** False until Bizaffix has approved the answer. */
  confirmed: boolean
}

export const faqs: { title: string; items: readonly Faq[] } = {
  title: 'FAQs',
  items: [
    {
      question: 'What services do you offer?',
      answer:
        'Mobile apps (native Android, iOS and Flutter), websites and complete web platforms, and cloud infrastructure, with strategy and design included.',
      confirmed: false, // TODO(confirm)
    },
    {
      question: 'What industries do you work with?',
      answer: 'Mostly healthcare and education, and also fitness and fintech products.',
      confirmed: false, // TODO(confirm)
    },
    {
      question: 'How long does a typical project take?',
      answer: 'It depends on scope. After a discovery call we send an estimate for your project.',
      confirmed: false, // TODO(confirm): add a real range if you want to state one
    },
    {
      question: 'What does the process look like?',
      answer: 'We start with research and interviews, then brand, wireframes and UI design, and build once the design is signed off.',
      confirmed: false, // TODO(confirm)
    },
    {
      question: 'Do you offer ongoing support or retainers?',
      answer: 'TODO: confirm whether support or retainer plans are offered, and what they cover.',
      confirmed: false, // TODO(confirm)
    },
    {
      question: 'What platforms or tools do you use?',
      answer: 'Kotlin, C#, Flutter, Python, HTML and Ruby, chosen to fit the product.',
      confirmed: false, // TODO(confirm)
    },
  ],
}

/* ── Closing ────────────────────────────────────────────────────────────── */

export const closing = {
  titleLines: ['Let’s build your', 'next experience'],
  body: 'Our work goes beyond deliverables. We design each system to bring strategy, design, and technology together into cohesive, future-ready experiences.',
  bookCall: 'Book a call',
  text: {
    label: 'Text us directly',
    placeholder: 'Your WhatsApp number',
    submit: 'Get a text',
    invalid: 'Enter a phone number with country code, e.g. +1 555 010 0000.',
    // TODO: replace once the WhatsApp flow exists.
    pending: 'Thanks. Texting is not connected yet, so nothing was sent.',
  },
} as const

/** What the WhatsApp form will send once a backend exists. */
export type TextMeRequest = { phone: string }

/* ── Client logos (off until real clients are confirmed) ────────────────── */

export type ClientLogo = { name: string; src: string }

export const clientLogos: { title: string; logos: readonly ClientLogo[] } = {
  title: 'Trusted by',
  // TODO(confirm): add only real, approved clients. Empty hides the strip.
  logos: [],
}
