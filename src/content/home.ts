/**
 * Homepage 2.0 copy.
 * Grounded in content/legacy-site.md for process, case study, articles, and healthcare facts.
 */

export const homeContent = {
  hero: {
    eyebrow: 'AI Product Studio',
    title: 'We build what’s next.',
    body: 'Bizaffix designs and engineers digital products that turn ambitious ideas into real-world experiences — from strategy and product design to engineering and launch.',
    primaryCta: 'Book a call',
    secondaryCta: 'Explore our work',
    positioning: 'Healthcare · AI · Digital Products',
  },
  pointOfView: {
    eyebrow: 'Built for complexity',
    title: 'The best digital products make complexity feel simple.',
    body: 'We work with ambitious teams to turn complex ideas, workflows, and technologies into products people can actually use.',
    scatter: ['Idea', 'Data', 'Users', 'Technology', 'Business'] as const,
    organized: ['People', 'Design', 'Technology'] as const,
    productLabel: 'Product',
  },
  whatWeBuild: {
    eyebrow: 'What we build',
    title: 'Digital products built for real-world complexity.',
    body: 'We combine product thinking, design, and engineering to create digital experiences across web, mobile, AI, and connected systems.',
    capabilities: [
      {
        id: 'cds',
        short: 'CDS',
        number: '01',
        title: 'Clinical Decision Support',
        body: 'Evidence-based experiences designed to support clinical decision-making.',
      },
      {
        id: 'telemedicine',
        short: 'Telemedicine',
        number: '02',
        title: 'Telemedicine',
        body: 'Digital experiences that connect patients and providers beyond traditional care settings.',
      },
      {
        id: 'hie',
        short: 'HIE',
        number: '03',
        title: 'Health Information Exchange',
        body: 'Connected systems designed to support secure healthcare data exchange.',
      },
      {
        id: 'ehr',
        short: 'EHR',
        number: '04',
        title: 'Electronic Health Records',
        body: 'Digital record experiences designed around clinical workflows and usability.',
      },
      {
        id: 'interop',
        short: 'Interop',
        number: '05',
        title: 'Integration & Interoperability',
        body: 'Connected healthcare systems that help information move between platforms.',
      },
      {
        id: 'mobile-web',
        short: 'Mobile & Web',
        number: '06',
        title: 'Mobile & Web',
        body: 'Patient and provider experiences across mobile and web.',
      },
    ],
  },
  specialization: {
    eyebrow: 'Where we go deep',
    title: 'Healthcare is one of the most complex places to build.',
    body: 'That complexity is exactly what makes it worth solving. We bring product, design, engineering, and healthcare expertise together to build digital experiences around the realities of care.',
    cta: 'Explore Digital Health',
    ctaTo: '/digital-health',
    flow: ['Patient', 'Experience', 'Provider', 'Platform', 'Data'] as const,
    offers: [
      'Clinical Decision Support',
      'Telemedicine',
      'Health Information Exchange',
      'Electronic Health Records',
      'Integration and Interoperability',
    ] as const,
  },
  process: {
    eyebrow: 'How we work',
    title: 'From understanding to something real.',
    body: 'The best products aren’t built by jumping straight into code. We start by understanding the problem, the people, and the opportunity — then turn that understanding into something useful.',
    stages: [
      {
        number: '01',
        title: 'Understand',
        body: 'Understand the problem, users, business, and context.',
      },
      {
        number: '02',
        title: 'Research',
        body: 'Explore the users, workflows, constraints, and opportunities.',
      },
      {
        number: '03',
        title: 'Analyze',
        body: 'Turn findings into clear product direction and priorities.',
      },
      {
        number: '04',
        title: 'Design',
        body: 'Shape the experience, interaction, and product system.',
      },
      {
        number: '05',
        title: 'Testing',
        body: 'Validate that the product works as intended before it meets the world.',
      },
    ],
  },
  work: {
    /** Vertical collage label */
    label: 'Most recent work',
    /** Short accent chip labels — keep minimal */
    chips: ['Healthcare', 'Mobile', 'Web'] as const,
    cardTitle: 'Optimized Strength',
    /**
     * Drop real screenshots here later.
     * Suggested paths: /images/projects/desktop.webp, phone-left.webp, phone-right.webp, card.webp
     */
    shots: {
      desktop: { src: null as string | null, alt: 'Desktop product screenshot' },
      phoneLeft: { src: null as string | null, alt: 'Mobile product screenshot' },
      phoneRight: { src: null as string | null, alt: 'Mobile product screenshot' },
      card: { src: null as string | null, alt: 'Project highlight image' },
    },
  },
  why: {
    eyebrow: 'Why Bizaffix',
    title: 'One team across product, design, and engineering.',
    body: 'Good products don’t happen in silos. We bring strategy, design, technology, and domain understanding into the same conversation — so decisions happen faster and the product stays coherent from idea to launch.',
    concepts: [
      { word: 'PRODUCT', line: 'Think beyond features.' },
      { word: 'DESIGN', line: 'Make complexity understandable.' },
      { word: 'ENGINEERING', line: 'Build for what comes next.' },
      { word: 'DOMAIN', line: 'Understand the world the product lives in.' },
    ],
    sum: 'BIZAFFIX',
  },
  facts: {
    title: 'Key facts',
    subtitle: 'A snapshot of our experience and focus.',
    cards: [
      {
        id: 'focus',
        tone: 'dark' as const,
        kind: 'stat' as const,
        eyebrow: 'Lead focus',
        title: 'Healthcare',
        caption: 'Custom apps, websites, designs, and branding for care teams.',
        value: '01',
        media: null,
      },
      {
        id: 'rating',
        tone: 'light' as const,
        kind: 'circle' as const,
        eyebrow: 'Overall platforms',
        title: null,
        caption: 'Stated rating on the previous Bizaffix site.',
        value: '5/5',
        media: null,
      },
      {
        id: 'services',
        tone: 'dark' as const,
        kind: 'stat' as const,
        eyebrow: 'Core services',
        title: 'What we build',
        caption: 'Product, mobile, web, and cloud — one team.',
        value: '07',
        media: null,
      },
    ],
  },
  insights: {
    eyebrow: 'Insights',
    title: 'Notes from the work.',
    body: 'Ideas, lessons, and perspectives on product, technology, AI, and digital health.',
    cta: 'Explore all insights',
    featured: {
      title: 'Driving Digital Health Success: The Power of Clinical Validation and Cultural Competency',
      meta: 'Marketing · August 4, 2025',
      dek: 'The badge protects everyone except the one wearing it—until now, technology is changing that narrative.',
    },
    supporting: [
      { title: 'Future of learning', meta: 'July 17, 2023' },
      { title: 'Future of work', meta: 'July 17, 2023' },
    ],
  },
  cta: {
    title: 'Have something worth building?',
    body: 'Let’s turn the idea into a product people can use.',
    secondaryCta: 'Explore our work',
  },
  footer: {
    tagline: 'AI product studio for ambitious teams.',
    nav: [
      { label: 'Services', to: '/#services' },
      { label: 'Digital Health', to: '/#digital-health' },
      { label: 'Work', to: '/#featured-projects' },
      { label: 'Process', to: '/#how-we-work' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  industries: ['Healthcare', 'Educational', 'Fintech', 'Fitness', 'eCommerce'] as const,
  services: [
    'Product Design',
    'Web Development',
    'Android App Development',
    'Flutter App Development',
    'iOS App Development',
    'Frontend & Backend Development',
    'Cloud Development',
  ] as const,
} as const
