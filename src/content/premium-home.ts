/**
 * Premium homepage sections — copy grounded in content/legacy-site.md.
 * Visual language follows the provided design-system reference.
 */

export const premiumHome = {
  hero: {
    badge: 'HealthTech innovation',
    titleLead: 'Digital products that',
    titleMove: 'move',
    titleItalic: 'healthcare',
    titleBridge: 'forward for',
    titleAccent: 'care teams.',
    body: 'We design, build and grow apps, platforms and brands for health, wellness and care teams, fast, clear and human-centred.',
    primaryCta: 'Book a call',
    primaryTo: '/contact',
    secondaryCta: 'See our work',
    secondaryTo: '/#featured-projects',
    milestone: {
      label: 'Healthcare expertise',
      title: ['Clinical Decision', 'Support'] as const,
      body: 'Bizaffix is about revolutionizing the healthcare industry with custom mobile applications, websites, designs, and branding solutions.',
    },
  },
  facts: {
    cards: [
      {
        id: 'focus',
        tone: 'light' as const,
        value: 'Healthcare',
        label: 'Lead industry focus',
      },
      {
        id: 'offers',
        tone: 'brand' as const,
        value: 'CDS · EHR · HIE',
        label: 'Digital health systems we build',
      },
      {
        id: 'rating',
        tone: 'light' as const,
        value: '5/5',
        label: 'Stated rating on overall platforms',
      },
    ],
  },
  approach: {
    index: '(02)',
    label: 'Approach',
    titleLead: 'Built fast',
    titleAccent: 'and',
    titleTrail: 'built right.',
    items: [
      {
        number: '01',
        title: 'Understanding & research',
        body: 'We start by understanding the problem, people, and opportunity, then research workflows and constraints.',
      },
      {
        number: '02',
        title: 'Analysis & design',
        body: 'Findings become clear product direction. Design shapes the experience before engineering takes over.',
      },
      {
        number: '03',
        title: 'Testing before launch',
        body: 'We validate that the product works as intended, so what ships is ready for real use.',
      },
    ],
  },
  healthcare: {
    index: '(03)',
    label: 'Digital health',
    title: 'Healthcare is where we go deep.',
    body: 'Custom mobile applications, websites, designs, and branding for care teams, plus clinical systems that keep data moving securely.',
    offers: [
      'Clinical Decision Support',
      'Telemedicine',
      'Health Information Exchange',
      'Electronic Health Records',
      'Integration and Interoperability',
    ] as const,
    cta: 'Book a call',
    ctaTo: '/contact',
  },
} as const
