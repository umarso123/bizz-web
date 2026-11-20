/**
 * Every word the studio homepage renders. Components only lay it out.
 * Anything marked TODO(confirm) still needs a yes from Bizaffix before launch.
 */
import { mockups } from '@/content/mockups.ts'

export type StickerTone = 'ink' | 'blue' | 'cyan' | 'yellow' | 'outline'

export type Sticker = {
  text: string
  tone: StickerTone
  /** Resting rotation, degrees. */
  rotate: number
  /** Position, as CSS lengths relative to the sticker's frame. */
  at: { left?: string; right?: string; top?: string; bottom?: string }
}

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */

export const studioHero = {
  /** Screen readers hear this; the two lines are the visual split. */
  title: 'From idea to reality.',
  lines: ['From idea', 'to reality'] as const,
  stickers: [
    { text: 'Healthcare software', tone: 'ink', rotate: -7, at: { left: '9%', top: '27%' } },
    { text: 'One team, end to end', tone: 'ink', rotate: 4, at: { right: '10%', top: '17%' } },
    { text: 'No guesswork', tone: 'yellow', rotate: -4, at: { right: '15%', bottom: '24%' } },
  ] satisfies Sticker[],
  lead: 'Mobile apps, web platforms and healthcare software, designed and engineered by one team.',
  cta: 'Book a 30-min call',
  dragHint: 'Drag the mark',
  scrollCue: 'Scroll',
  /** Appears while the mark melts. */
  caption: { title: ['Ideas don’t', 'sit still.'] as const, sticker: 'Neither do we' },
}

/* ── 02 Ribbon ───────────────────────────────────────────────────────────── */

export const studioRibbon = {
  front: ['From idea to reality', 'Healthcare software', 'Mobile & web', 'Built to last'],
  back: ['Design', 'Engineering', 'Strategy', 'Cloud', 'Interoperability'],
}

/* ── 03 Statement ────────────────────────────────────────────────────────── */

export const studioAbout = {
  label: 'A bit about us',
  statement:
    'You bring the problem. We bring the engineers, the designers and the plan, and we don’t leave until it’s solved.',
  stickers: [
    { text: 'Healthcare natives', tone: 'blue', rotate: -5, at: { right: '6%', top: '14%' } },
    { text: 'Allergic to guesswork', tone: 'cyan', rotate: 4, at: { left: '2%', top: '50%' } },
    { text: 'Designers who code', tone: 'blue', rotate: -3, at: { right: '14%', bottom: '6%' } },
  ] satisfies Sticker[],
}

/* ── 04 Work ─────────────────────────────────────────────────────────────── */

export type StudioProject = {
  slug: string
  name: string
  category: string
  image: string
  alt: string
  /** cover: the board fills the card. contain: a white board, multiplied onto the tint. */
  fit: 'cover' | 'contain'
  /** Focal point for cover crops (object-position). */
  focus?: string
  tint: string
  tintInk: string
}

export const studioWork = {
  label: 'Selected work',
  titleLines: ['Things', 'we’ve shipped'] as const,
  link: { label: 'All case studies', href: '/work' },
  projects: [
    {
      slug: 'optimized-strength',
      name: 'Optimized Strength',
      category: 'Fitness',
      image: mockups.optimizedStrengthIcon,
      alt: 'Optimized Strength app icon on an iPhone',
      fit: 'cover',
      focus: '60% 50%',
      tint: '#141a2e',
      tintInk: '#234ed1',
    },
    {
      slug: 'traino-ai',
      name: 'Traino.ai',
      category: 'AI learning platform',
      image: mockups.trainoLaptop,
      alt: 'Traino.ai dashboard on a laptop',
      fit: 'cover',
      focus: '10% 50%',
      tint: '#4b5fd8',
      tintInk: '#0d121f',
    },
    {
      slug: 'clinical-decision-support',
      name: 'Clinical Decision Support',
      category: 'Digital health',
      image: mockups.healthcare,
      alt: 'Population health product on tablets',
      fit: 'cover',
      focus: '100% 50%',
      tint: '#1f6fb3',
      tintInk: '#009bdf',
    },
    {
      slug: 'bank-alfalah',
      name: 'Bank Alfalah',
      category: 'Fintech',
      image: mockups.bankAlfalah,
      alt: 'Bank Alfalah web banking on a tablet',
      fit: 'contain',
      tint: '#f6dcd6',
      tintInk: '#c9302c',
    },
    {
      slug: 'poised-journey-academy',
      name: 'Poised Journey',
      category: 'Education',
      image: mockups.poisedDevicesPills,
      alt: 'The Poised Journey Academy on laptop and tablets',
      fit: 'cover',
      tint: '#3d58a8',
      tintInk: '#234ed1',
    },
    {
      slug: 'family-tree',
      name: 'Family Tree',
      category: 'Family platform',
      image: mockups.familyTreeLaptop,
      alt: 'Family Tree on a laptop and a tablet',
      fit: 'contain',
      tint: '#dfe9e4',
      tintInk: '#1f4d43',
    },
    {
      slug: 'drug-testing',
      name: 'Drug Testing',
      category: 'Healthcare',
      image: mockups.drugTestingApp,
      alt: 'Drug testing service website on a laptop',
      fit: 'contain',
      tint: '#e7edfc',
      tintInk: '#234ed1',
    },
  ] satisfies StudioProject[],
}

/* ── 05 Services ─────────────────────────────────────────────────────────── */

export type ServiceIconId = 'mobile' | 'web' | 'health' | 'cloud'

export type StudioService = {
  id: ServiceIconId
  /** The word before and after the icon tile. */
  words: readonly [string, string]
  note: string
  href: string
  /** Which side of the page the row sits on. */
  side: 'left' | 'right'
}

export const studioServices = {
  label: 'What we do',
  titleLines: ['We build', 'the whole thing'] as const,
  lead: 'Strategy, design and engineering in one room, so nothing gets lost between them.',
  link: { label: 'All services', href: '/services' },
  items: [
    {
      id: 'mobile',
      words: ['Mobile', 'apps'],
      note: 'Native Android and iOS, or one Flutter codebase for both.',
      href: '/services#flutter-app-development',
      side: 'right',
    },
    {
      id: 'web',
      words: ['Web', 'platforms'],
      note: 'Websites and complete platforms, from the interface to the server.',
      href: '/services#web-development',
      side: 'left',
    },
    {
      id: 'health',
      words: ['Health', 'software'],
      note: 'Clinical decision support, telehealth, EHR and HIE, built to fit real workflows.',
      href: '/healthcare',
      side: 'right',
    },
    {
      id: 'cloud',
      words: ['Cloud', 'systems'],
      note: 'Infrastructure that scales with your product, not ahead of your budget.',
      href: '/services#cloud-development',
      side: 'left',
    },
  ] satisfies StudioService[],
}

/* ── 06 Process ──────────────────────────────────────────────────────────── */

export const studioProcess = {
  label: 'How we work',
  title: 'Four steps, no surprises',
  next: 'Next step',
  steps: [
    {
      number: '01',
      title: 'We listen first.',
      body: 'Research and interviews with the people who will use it, so we solve the problem behind the brief, not just the brief.',
      tags: ['Research', 'Interviews', 'Scope'],
    },
    {
      number: '02',
      title: 'We design it out loud.',
      body: 'Brand, wireframes and UI, shared as we go. You see every decision while it is still cheap to change.',
      tags: ['Brand', 'Wireframes', 'UI design'],
    },
    {
      number: '03',
      title: 'We build what we drew.',
      body: 'The team that designed it engineers it, native, Flutter or web, so nothing gets lost in a handoff.',
      tags: ['Engineering', 'QA', 'Integrations'],
    },
    {
      number: '04',
      title: 'We ship it with you.',
      body: 'Sign-off, testing and launch, side by side with your team, then we keep improving what people actually use.',
      tags: ['Sign-off', 'Launch', 'Iteration'],
    },
  ],
}

/* ── 07 Closing ──────────────────────────────────────────────────────────── */

export const studioClosing = {
  label: 'Got something in mind?',
  lines: ['Let’s make', 'it real'] as const,
  body: 'Tell us what you’re building. We’ll come back with questions, a plan and an honest estimate.',
  cta: 'Book a 30-min call',
  secondary: { label: 'Or send us a brief', href: '/contact' },
  stickers: [
    { text: 'Mobile', tone: 'blue', rotate: -10, at: { left: '6%', top: '18%' } },
    { text: 'Web', tone: 'ink', rotate: 8, at: { right: '9%', top: '8%' } },
    { text: 'Healthcare', tone: 'yellow', rotate: -5, at: { right: '4%', bottom: '24%' } },
    { text: 'Cloud', tone: 'cyan', rotate: 6, at: { left: '12%', bottom: '14%' } },
  ] satisfies Sticker[],
}
