/**
 * Work / case studies — Productea-style portfolio list.
 * Grounded in content/legacy-site.md. No invented clients or metrics.
 */

import { mockups } from '@/content/mockups.ts'

export const workIndustries = ['Healthcare', 'Educational', 'Fintech', 'Fitness', 'eCommerce'] as const

export type WorkIndustry = (typeof workIndustries)[number]

/** Still treatment on the index. Day stills need a dark arrow chip. */
export type WorkMedia = 'ink' | 'day'

export type CaseStudy = {
  slug: string
  title: string
  industry: WorkIndustry | 'Family Tree'
  category: string
  /** Headline overlaid on the index banner. Defaults to title when omitted. */
  bannerTitle?: string
  /** One-line blurb on the index list */
  summary: string
  /** Longer intro on the detail page */
  description: string
  challenge?: string
  solution?: string
  services: string[]
  image: string | null
  /** Extra boards already in the project. Omit rather than invent. */
  gallery?: readonly { src: string; alt: string }[]
  media: WorkMedia
}

export const workPageContent = {
  title: 'Case studies',
  eyebrow: 'Work',
  intro: 'Explored our projects yet? Have a look.',
  filtersLabel: 'Filter by industry',
  emptyLabel: 'No case studies in this industry.',
  backLabel: 'Back to work',
  ctaLabel: 'Book a call',
  ctaTo: '/contact',
  studies: [
    {
      slug: 'clinical-decision-support',
      title: 'Clinical Decision Support',
      industry: 'Healthcare',
      category: 'Healthcare · CDS',
      media: 'ink',
      bannerTitle: 'Population Health Management',
      summary:
        'Evidence-based experiences designed to support clinical decision-making and seamless workflow integration.',
      description:
        'Advanced Clinical Decision Support System work, leveraging data-driven insights to streamline decision-making and customize solutions for seamless workflow integration.',
      challenge:
        'Clinicians need real-time, evidence-based recommendations without adding friction to existing workflows.',
      solution:
        'We design CDS experiences that integrate into clinical flow, improving efficiency so professionals can focus on exceptional care.',
      services: ['Product Design', 'Frontend & Backend Development', 'Cloud Development'],
      image: mockups.healthcare,
    },
    {
      slug: 'telemedicine',
      title: 'Telemedicine',
      industry: 'Healthcare',
      category: 'Healthcare · Telemedicine',
      media: 'ink',
      bannerTitle: 'Virtual care that stays human',
      summary:
        'Personalized telemedicine platforms that enhance patient-provider connections, access, and operational efficiency.',
      description:
        'Telemedicine Development solutions that prioritize patient satisfaction and quality care with seamless system integration and the convenience of virtual healthcare.',
      challenge:
        'Care needs to extend beyond traditional settings without losing trust, clarity, or operational control.',
      solution:
        'We build telemedicine experiences that connect patients and providers with access and efficiency at the center.',
      services: ['iOS App Development', 'Android App Development', 'Flutter App Development', 'Web Development'],
      image: null,
    },
    {
      slug: 'health-information-exchange',
      title: 'Health Information Exchange',
      industry: 'Healthcare',
      category: 'Healthcare · HIE',
      media: 'ink',
      bannerTitle: 'Secure healthcare data exchange',
      summary: 'Secure, scalable HIE development tailored for healthcare data sharing.',
      description:
        'Cutting-edge Health Information Exchange Development: secure, scalable, and tailored to healthcare data-sharing needs.',
      challenge: 'Healthcare data often stays siloed, slowing coordination and informed decisions.',
      solution:
        'We develop HIE systems designed for secure exchange, helping information move where care needs it.',
      services: ['Cloud Development', 'Frontend & Backend Development', 'Integration'],
      image: null,
    },
    {
      slug: 'electronic-health-records',
      title: 'Electronic Health Records',
      industry: 'Healthcare',
      category: 'Healthcare · EHR',
      media: 'day',
      bannerTitle: 'Records built for the practice',
      summary:
        'User-friendly EHR experiences that streamline practice workflows and safeguard patient data.',
      description:
        'Electronic Health Record System solutions designed to enhance patient care, boost efficiency, and integrate into clinical workflow, with advanced security measures for patient data.',
      challenge: 'Paperwork and rigid record systems steal time from care and frustrate providers.',
      solution:
        'We design EHR experiences around real practice workflows: usable, secure, and ready to replace friction with clarity.',
      services: ['Product Design', 'UI/UX', 'Web Development', 'Cloud Development'],
      image: null,
    },
    {
      slug: 'integration-interoperability',
      title: 'Integration & Interoperability',
      industry: 'Healthcare',
      category: 'Healthcare · Interop',
      media: 'ink',
      bannerTitle: 'Systems that finally talk',
      summary:
        'Connected systems that break data barriers and support coordinated patient care.',
      description:
        'Integration and Interoperability services that ensure smooth data exchange, optimize data flow, minimize errors, and help care teams move from siloed systems to a unified ecosystem.',
      challenge: 'Disconnected platforms create errors, delays, and incomplete pictures of care.',
      solution:
        'We customize integration so information moves cleanly between systems, supporting coordination and better outcomes.',
      services: ['Frontend & Backend Development', 'Cloud Development', 'Integration'],
      image: null,
    },
    {
      slug: 'optimized-strength',
      title: 'Optimized Strength',
      industry: 'Fitness',
      category: 'Fitness · Product',
      media: 'ink',
      bannerTitle: 'Training that sticks',
      summary:
        'A consolidated, intuitive, and personalized fitness tool built for lasting adherence and progress.',
      description:
        'In the expansive world of fitness, while many are motivated to start, the absence of a consolidated, intuitive, and personalized tool often results in lackluster adherence and unsatisfactory progress.',
      challenge:
        'People want to stay consistent, but fragmented tools make personalization and progress hard to sustain.',
      solution:
        'We shaped a product experience that consolidates the journey: clear, intuitive, and personalized enough to support real adherence.',
      services: ['Product Design', 'UI/UX', 'Mobile', 'Web Development'],
      image: mockups.optimizedStrengthIcon,
      gallery: [
        { src: mockups.optimizedStrengthScreens, alt: 'Optimized Strength app screens' },
        { src: mockups.optimizedStrengthTall, alt: 'Optimized Strength phone screens' },
        { src: mockups.optimizedStrengthDetail, alt: 'Optimized Strength app detail' },
      ],
    },
    {
      slug: 'educational',
      title: 'Educational',
      industry: 'Educational',
      category: 'Educational',
      media: 'day',
      summary: 'Digital learning products shaped for clarity, engagement, and real outcomes.',
      description:
        'Educational industry work across mobile apps, websites, and product experiences, built to make complex learning feel approachable.',
      services: ['Product Design', 'Web Development', 'Mobile'],
      bannerTitle: 'Learning products with clarity',
      image: mockups.stepup,
    },
    {
      slug: 'poised-journey-academy',
      title: 'The Poised Journey Academy',
      industry: 'Educational',
      category: 'Educational · Learning platform',
      media: 'ink',
      bannerTitle: 'Homeschool journeys, one place',
      summary:
        'A learning platform that helps families plan, personalize, document, and manage homeschool journeys in one place.',
      description:
        'Poised Journey Academy is a learning platform designed to help families plan, personalize, document, and manage their child\'s homeschool learning journeys. The platform brings learning activities, educational goals, progress tracking, learning stories, and available funding into one connected experience, making it easier for families to organize their learning journey and keep everything in one place.',
      challenge:
        'Homeschool families need one place to plan personalized journeys, track progress, document learning, and understand available funding without juggling disconnected tools.',
      solution:
        'We shaped a simple, engaging product experience for journey planning, standards guidance, funding clarity, and learning documentation across web and mobile.',
      services: ['Product Design', 'UI/UX', 'Web Development', 'Mobile'],
      image: mockups.poisedDevicesPills,
      gallery: [
        { src: mockups.poisedScreens, alt: 'Poised Journey Academy product screens' },
        { src: mockups.poisedJourneyHero, alt: 'Poised Journey Academy product board' },
      ],
    },
    {
      slug: 'traino-ai',
      title: 'Traino.ai',
      industry: 'Educational',
      category: 'Educational · AI LMS',
      media: 'ink',
      bannerTitle: 'AI-powered training retention',
      summary:
        'An AI-powered LMS built to optimize training knowledge retention, engagement, and workforce learning.',
      description:
        'Traino.ai is an AI-powered learning management solution for personalized training. The product helps teams boost engagement, streamline development, and transform workforce learning with clear dashboards, team views, and training detail experiences.',
      challenge:
        'Organizations need training that people retain, not another LMS that is hard to navigate or easy to ignore.',
      solution:
        'We designed Traino.ai around clear learning activity, department tracking, and course detail views so training stays personal, measurable, and easy to manage.',
      services: ['Product Design', 'UI/UX', 'Web Development'],
      image: mockups.trainoLaptop,
      gallery: [
        { src: mockups.trainoMonitor, alt: 'Traino.ai desktop and floating product screens' },
      ],
    },
    {
      slug: 'bank-alfalah',
      title: 'Bank Alfalah',
      industry: 'Fintech',
      category: 'Fintech · Bank Alfalah',
      media: 'ink',
      bannerTitle: 'Banking across web and tablet',
      summary: 'Bank Alfalah product screens across web and tablet.',
      description: 'Product visuals for Bank Alfalah, covering the web experience and tablet screens.',
      services: ['Product Design', 'Web Development'],
      image: mockups.bankAlfalah,
      gallery: [
        { src: mockups.bankAlfalahTablet, alt: 'Bank Alfalah on a tablet' },
        { src: mockups.bankAlfalahMark, alt: 'Bank Alfalah mark' },
      ],
    },
    {
      slug: 'drug-testing',
      title: 'Drug Testing',
      industry: 'Healthcare',
      category: 'Healthcare · Drug Testing',
      media: 'ink',
      summary: 'Drug testing app screens for the mobile experience.',
      description: 'Product visuals for the drug testing app.',
      services: ['Product Design'],
      bannerTitle: 'Drug testing on mobile',
      image: mockups.drugTestingBoard,
      gallery: [{ src: mockups.drugTestingApp, alt: 'Drug testing app screens' }],
    },
    {
      slug: 'family-tree',
      title: 'Family Tree',
      industry: 'Family Tree',
      category: 'Product · Family Tree',
      media: 'ink',
      bannerTitle: 'Family history, shared clearly',
      summary:
        'A family platform for genealogy mapping, shared updates, events, and member profiles.',
      description:
        'Family Tree brings genealogy views, a family news feed, upcoming events, and profile management into one connected web experience for relatives to stay linked and share history.',
      challenge:
        'Families need a clear way to map relationships, share updates, and keep profiles and events in one place.',
      solution:
        'We designed product screens for registration, genealogy trees, social feed, and account details across tablet layouts.',
      services: ['Product Design', 'UI/UX', 'Web Development'],
      image: mockups.familyTreeTablets,
      gallery: [
        { src: mockups.familyTreePage, alt: 'Family Tree page' },
        { src: mockups.familyTreeLaptop, alt: 'Family Tree on a laptop' },
      ],
    },
    {
      slug: 'ecommerce',
      title: 'eCommerce',
      industry: 'eCommerce',
      category: 'eCommerce',
      media: 'ink',
      summary: 'Storefront and product journeys designed to convert without friction.',
      description:
        'eCommerce websites and product experiences crafted to captivate audiences and strengthen digital presence.',
      services: ['Web Development', 'UI/UX', 'Product Design'],
      bannerTitle: 'Commerce without friction',
      image: mockups.foodScreens,
      gallery: [
        { src: mockups.foodPhones, alt: 'Food ordering phones' },
        { src: mockups.foodPresentation, alt: 'Food ordering app presentation' },
      ],
    },
    {
      slug: 'fitness',
      title: 'Fitness',
      industry: 'Fitness',
      category: 'Fitness',
      media: 'ink',
      bannerTitle: 'Motivation, progress, daily use',
      summary: 'Mobile and web experiences built around motivation, progress, and daily use.',
      description:
        'Mobile and web experiences built around motivation, progress, and daily use.',
      services: ['Product Design', 'Web Development'],
      image: mockups.fitnessBoards,
    },
  ] satisfies CaseStudy[],
} as const

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return workPageContent.studies.find((study) => study.slug === slug)
}

/** Index cards: only studies with banner art, capped at 10. */
export const workIndexLimit = 10

export function getWorkIndexStudies(industry?: WorkIndustry | 'All') {
  const withArt = workPageContent.studies.filter((study) => Boolean(study.image))
  const filtered =
    !industry || industry === 'All'
      ? withArt
      : withArt.filter((study) => study.industry === industry)
  return filtered.slice(0, workIndexLimit)
}

/** Questions grounded in the published process. No timelines or commercial terms are invented. */
export const caseStudyFaqs = [
  {
    question: 'How does a project begin?',
    answer:
      'Book a call. We start by understanding the problem, the people, and the opportunity, then turn that understanding into a product people can use.',
  },
  {
    question: 'What does the work include?',
    answer:
      'The services named on the study. Strategy, design, and engineering stay in the same conversation so the product stays coherent.',
  },
  {
    question: 'What happens before launch?',
    answer: 'We test that the product works as intended before it meets the world.',
  },
] as const

/** Light band under the gallery. Copy is taken from the legacy site. No client names or metrics. */
export const workBuiltContent = {
  title: 'From idea to reality.',
  lede: 'Delivering exceptional software solutions.',
  stories: [
    {
      slug: 'clinical-decision-support',
      industry: 'Healthcare',
      title: 'Clinical Decision Support',
      body: "Grow your healthcare business with Bizaffix's advanced Clinical Decision Support System services. Leverage data-driven insights to streamline decision-making, customizing solutions for seamless workflow integration.",
      tone: 'blue',
    },
    {
      slug: 'optimized-strength',
      industry: 'Fitness',
      title: 'Optimized Strength',
      body: 'In the expansive world of fitness, while many are motivated to start, the absence of a consolidated, intuitive, and personalized tool often results in lackluster adherence and unsatisfactory progress.',
      tone: 'ink',
    },
  ],
} as const
