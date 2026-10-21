import type {
  CultureTheme,
  GallerySlot,
  JobPosting,
  TeamMember,
  WorkStage,
} from '@/types/careers.ts'

/**
 * Careers content lives here so presentation can swap live openings
 * without rewriting section components. Placeholder jobs are examples only.
 */
export const careersCopy = {
  hero: {
    eyebrow: 'Careers',
    headline: 'A good place to work.',
    body: 'We focus on remote opportunity and flexible timing. That is what sets us apart.',
    primaryCta: 'View open positions',
    secondaryCta: 'Life at Bizaffix',
    directoryTitle: 'Teams hiring',
  },
  why: {
    eyebrow: 'Why Bizaffix',
    headline: 'We build ambitious products with people who care about the details.',
    body: 'At Bizaffix, product, design, engineering, and healthcare expertise work together. We solve difficult problems, learn continuously, and build products that have a real-world impact.',
  },
  culture: {
    eyebrow: 'Culture',
    headline: 'How we show up.',
    /** From the legacy "What's Bizaffix" section (content/legacy-site.md). */
    quote:
      'With our team of skilled experts, we’re not just about lines of code; we’re about building relationships.',
  },
  pillars: {
    title: 'What sets us apart.',
    items: [
      {
        id: 'remote',
        label: 'Remote.',
        body: 'We focus on remote opportunity, so you can do ambitious work from where you work best.',
      },
      {
        id: 'flexible',
        label: 'Flexible.',
        body: 'Flexible timing is what sets us apart. The work stays sharp; the hours stay human.',
      },
      {
        id: 'impact',
        label: 'Impact.',
        body: 'Product, design, engineering, and healthcare expertise share one table and ship work with real-world impact.',
      },
    ],
  },
  process: {
    eyebrow: 'Process',
    headline: 'How we work',
    title: 'From idea to reality, in five steps.',
    body: 'Every Bizaffix project moves through the same five steps, from the first conversation to a tested product.',
  },
  jobs: {
    eyebrow: 'Open positions',
    headline: 'Find your place on the team.',
    body: 'Every opening is listed here. Choose a role to read the details and apply.',
    placeholderNote:
      'Example roles below show how openings are presented. Replace this data with live listings when available.',
  },
  life: {
    eyebrow: 'Studio life',
    headline: 'Life at Bizaffix',
    body: 'Moments from the work: collaboration, craft, and the quiet focus that shapes healthcare products.',
  },
  team: {
    eyebrow: 'People',
    headline: 'Great products start with great people.',
  },
  cultureCta: {
    headline: 'Think you could build something great here?',
    cta: 'Explore open positions',
  },
  finalCta: {
    headline: 'Your next chapter could start here.',
    body: 'Explore our open roles and find where your skills can make an impact.',
    cta: 'View open positions',
  },
} as const

export const heroFragments = [
  'DESIGN',
  'ENGINEERING',
  'AI',
  'HEALTHCARE',
  'PRODUCT',
  'IMPACT',
] as const

export const cultureThemes: CultureTheme[] = [
  {
    id: 'purpose',
    label: 'Build with purpose',
    detail: 'Every product decision serves a real clinical or human need.',
  },
  {
    id: 'think',
    label: 'Think deeply',
    detail: 'We slow down where complexity demands clarity.',
  },
  {
    id: 'own',
    label: 'Own the outcome',
    detail: 'From first sketch to shipped release, the work is yours.',
  },
  {
    id: 'learn',
    label: 'Keep learning',
    detail: 'Healthcare and technology move, so do we.',
  },
  {
    id: 'together',
    label: 'Work together',
    detail: 'Design, engineering, and domain expertise share one table.',
  },
  {
    id: 'human',
    label: 'Stay human',
    detail: 'Empathy for patients and teammates shapes the craft.',
  },
]

/** The legacy process (content/legacy-site.md): Understanding, Research, Analysis, Design, Testing. */
export const workStages: WorkStage[] = [
  {
    id: 'understanding',
    number: '01',
    title: 'Understanding',
    body: 'We start with the problem, the people, and the opportunity behind the idea.',
  },
  {
    id: 'research',
    number: '02',
    title: 'Research',
    body: 'We study the workflows and constraints the product has to live with, from clinics to classrooms.',
  },
  {
    id: 'analysis',
    number: '03',
    title: 'Analysis',
    body: 'Findings become a clear product direction and the right mix of mobile, web, and cloud.',
  },
  {
    id: 'design',
    number: '04',
    title: 'Design',
    body: 'UI/UX shapes the experience before engineering takes over, so complexity feels simple.',
  },
  {
    id: 'testing',
    number: '05',
    title: 'Testing',
    body: 'We validate that the product works as intended, so what ships is ready for real use.',
  },
]

/** Placeholder postings — swap with live openings without changing JobList/JobDetail. */
export const jobPostings: JobPosting[] = [
  {
    id: 'job-product-designer',
    slug: 'product-designer',
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    employmentType: 'Full-time',
    experience: '4+ years',
    description:
      'Shape interfaces and flows for healthcare products where clarity, trust, and accessibility are non-negotiable. You will work beside product and engineering from discovery through release.',
    responsibilities: [
      'Design end-to-end product experiences for complex healthcare workflows',
      'Translate clinical and user research into clear interaction patterns',
      'Partner with engineering to ship polished, accessible interfaces',
      'Maintain and evolve the design system used across products',
    ],
    requirements: [
      'Strong portfolio of product or digital product design',
      'Fluency with modern design tools and prototyping',
      'Comfort collaborating with engineers and product managers',
      'Care for accessibility, clarity, and detail',
    ],
    niceToHave: [
      'Experience in healthcare, healthtech, or regulated domains',
      'Motion and microinteraction craft',
      'Familiarity with design systems at scale',
    ],
    applyUrl: 'mailto:careers@bizaffix.com?subject=Application%20%3A%20Product%20Designer',
    status: 'open',
  },
  {
    id: 'job-frontend-engineer',
    slug: 'frontend-engineer',
    title: 'Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    experience: '3+ years',
    description:
      'Build the interfaces people rely on: performant, accessible React experiences for healthcare products that must feel calm under pressure.',
    responsibilities: [
      'Implement product UI with React, TypeScript, and modern tooling',
      'Collaborate with design on interaction quality and motion',
      'Own performance, accessibility, and frontend architecture decisions',
      'Ship reliable features with clear testing and review habits',
    ],
    requirements: [
      'Strong React and TypeScript experience',
      'Solid CSS and responsive layout craft',
      'Understanding of accessibility fundamentals',
      'Comfortable reviewing code and mentoring peers',
    ],
    niceToHave: [
      'Framer Motion or similar animation experience',
      'Design system contribution',
      'Healthcare or complex domain product experience',
    ],
    applyUrl: 'mailto:careers@bizaffix.com?subject=Application%20%3A%20Frontend%20Engineer',
    status: 'open',
  },
  {
    id: 'job-backend-engineer',
    slug: 'backend-engineer',
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    experience: '4+ years',
    description:
      'Design and build the systems behind healthcare products: secure APIs, data flows, and integrations that clinicians and patients can trust.',
    responsibilities: [
      'Design and maintain APIs and services for product features',
      'Integrate with healthcare and third-party systems thoughtfully',
      'Uphold security, reliability, and data integrity standards',
      'Collaborate with frontend and product on end-to-end delivery',
    ],
    requirements: [
      'Experience building production backend services',
      'Strong fundamentals in APIs, data modeling, and security',
      'Comfort with cloud infrastructure and observability',
      'Clear written and verbal communication',
    ],
    niceToHave: [
      'Healthcare interoperability or HL7/FHIR familiarity',
      'Experience with Python, C#, or similar stacks',
      'Event-driven or distributed systems experience',
    ],
    applyUrl: 'mailto:careers@bizaffix.com?subject=Application%20%3A%20Backend%20Engineer',
    status: 'open',
  },
  {
    id: 'job-mobile-developer',
    slug: 'mobile-app-developer',
    title: 'Mobile App Developer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    experience: '3+ years',
    description:
      'Craft mobile experiences for Android, iOS, or Flutter that feel native, fast, and worthy of healthcare contexts.',
    responsibilities: [
      'Build and ship mobile features across supported platforms',
      'Partner with design on touch-first interaction quality',
      'Maintain release quality, performance, and store readiness',
      'Contribute to shared mobile architecture and patterns',
    ],
    requirements: [
      'Production experience with Flutter, Android, or iOS',
      'Strong understanding of mobile UX constraints',
      'Habit of testing and shipping carefully',
      'Ability to collaborate across product and design',
    ],
    niceToHave: [
      'Cross-platform Flutter expertise',
      'Health, wellness, or regulated app experience',
      'CI/CD for mobile releases',
    ],
    applyUrl: 'mailto:careers@bizaffix.com?subject=Application%20%3A%20Mobile%20App%20Developer',
    status: 'open',
  },
  {
    id: 'job-ai-ml-engineer',
    slug: 'ai-ml-engineer',
    title: 'AI / ML Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    experience: '4+ years',
    description:
      'Bring machine learning into healthcare products with rigor: models and pipelines that improve decisions without sacrificing trust.',
    responsibilities: [
      'Design and implement ML features for product workflows',
      'Evaluate model quality, bias, and clinical usefulness',
      'Collaborate with product and domain experts on responsible AI',
      'Productionize models with monitoring and clear failure modes',
    ],
    requirements: [
      'Hands-on experience shipping ML features',
      'Strong Python and ML tooling fundamentals',
      'Ability to communicate trade-offs to non-ML stakeholders',
      'Care for privacy, evaluation, and responsible deployment',
    ],
    niceToHave: [
      'Healthcare or clinical ML experience',
      'LLM application experience with grounding and safety',
      'MLOps and monitoring practice',
    ],
    applyUrl: 'mailto:careers@bizaffix.com?subject=Application%20%3A%20AI%20%2F%20ML%20Engineer',
    status: 'open',
  },
  {
    id: 'job-product-manager',
    slug: 'product-manager',
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote',
    employmentType: 'Full-time',
    experience: '5+ years',
    description:
      'Lead product direction for healthcare experiences, from problem framing to shipped outcomes that clinicians and patients can feel.',
    responsibilities: [
      'Define roadmaps grounded in user need and business clarity',
      'Facilitate discovery with design, engineering, and domain experts',
      'Prioritize ruthlessly and communicate decisions with context',
      'Measure outcomes and iterate after release',
    ],
    requirements: [
      'Experience shipping digital products end to end',
      'Strong facilitation and written communication',
      'Comfort with ambiguity and complex stakeholder landscapes',
      'Bias toward clarity, evidence, and thoughtful scope',
    ],
    niceToHave: [
      'Healthcare or healthtech product experience',
      'Familiarity with clinical workflows',
      'Technical background that aids collaboration with engineering',
    ],
    applyUrl: 'mailto:careers@bizaffix.com?subject=Application%20%3A%20Product%20Manager',
    status: 'open',
  },
]

export const gallerySlots: GallerySlot[] = [
  { id: 'g1', label: 'Team workshop, photo placeholder', aspect: 'large' },
  { id: 'g2', label: 'Desk detail, photo placeholder', aspect: 'square' },
  { id: 'g3', label: 'Studio corner, photo placeholder', aspect: 'tall' },
  { id: 'g4', label: 'Collaboration moment, photo placeholder', aspect: 'wide' },
  { id: 'g5', label: 'Focus session, photo placeholder', aspect: 'square' },
  { id: 'g6', label: 'Whiteboard session, photo placeholder', aspect: 'wide' },
]

export const teamMembers: TeamMember[] = [
  { id: 'ayesha-fahim', name: 'Ayesha Fahim', role: 'Project manager and design expert', photoLabel: 'Portrait of Ayesha Fahim' },
  { id: 'talha-ahmed-hashmi', name: 'Talha Ahmed Hashmi', role: 'Full Stack Developer', photoLabel: 'Portrait of Talha Ahmed Hashmi' },
  { id: 'shaheer-ahmed', name: 'Shaheer Ahmed', role: 'Technical Engineer', photoLabel: 'Portrait of Shaheer Ahmed' },
  { id: 'arshiya-anwer', name: 'Arshiya Anwer', role: 'Project manager', photoLabel: 'Portrait of Arshiya Anwer' },
]

export function getJobBySlug(slug: string): JobPosting | undefined {
  return jobPostings.find((job) => job.slug === slug)
}
