/**
 * Premium homepage sections — copy grounded in content/legacy-site.md.
 * Visual language follows the provided design-system reference.
 */

export const premiumHome = {
  hero: {
    badge: 'Healthcare technology studio',
    title: 'Digital products that move healthcare forward.',
    body: 'We design and engineer mobile apps, web platforms, and healthcare solutions, from idea to reality, with clarity people can use.',
    primaryCta: 'Book a call',
    secondaryCta: 'See our work',
    secondaryTo: '/#selected-work',
    also: 'Healthcare leads. We also build for Educational, Fintech, Fitness, and eCommerce teams.',
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
  /**
   * Homepage-only rewrites: the legacy facts in shorter, plainer words. The full
   * legacy descriptions stay on the Healthcare and Services pages.
   */
  copy: {
    healthcareLead:
      'We design and build clinical tools, patient apps, and the integrations between them, so care teams spend less time fighting software and more time with patients.',
    healthcareSummaries: {
      cds: 'Real-time, evidence-based recommendations inside the clinician’s workflow, so decisions are faster and better informed.',
      telemedicine: 'Virtual care platforms that connect patients and providers, with the integrations a real practice needs.',
      hie: 'Secure, scalable data sharing between clinics, hospitals, labs, and pharmacies.',
      ehr: 'Easy-to-use record systems that cut paperwork, protect patient data, and fit the way your practice works.',
      interop: 'Connect siloed systems so data flows cleanly and care teams work from one picture of the patient.',
    } as Record<string, string>,
    workLead: 'Products we’ve designed and built for health, education, and fitness.',
    servicesLead: 'Mobile, web, and cloud, designed and engineered by one team.',
    serviceGroups: {
      mobile: { summary: 'Native Android and iOS apps, or one Flutter codebase for both.', tech: ['Kotlin', 'Flutter'] },
      web: { summary: 'Websites and complete web platforms, from the interface to the server.', tech: ['HTML'] },
      cloud: { summary: 'Scalable cloud infrastructure behind your apps.', tech: [] },
    } as Record<string, { summary: string; tech: readonly string[] }>,
    serviceLines: {
      android: 'Native Android apps, built in Kotlin.',
      ios: 'Native apps for iPhone and iPad.',
      flutter: 'One codebase for Android and iOS.',
      web: 'Websites built to engage and drive results.',
      fullstack: 'Front end and back end for complete web platforms.',
      cloud: 'Cloud solutions that scale with your product.',
    } as Record<string, string>,
    membersBody: 'Designers and engineers who take your product from the first workshop to launch.',
    caseLabel: 'Case study — Fitness',
    presenceLines: ['From Texas', 'to Dubai,', 'and growing.'] as const,
  },
} as const
