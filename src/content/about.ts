/**
 * About page copy. Every line comes from content/legacy-site.md
 * ("What's Bizaffix", Positioning, Industries, Technologies, Process, Footer).
 */

export const aboutPage = {
  hero: {
    zone: 'About',
    title: 'Partner in disruption.',
    intro: 'From idea to reality: Delivering exceptional software solutions.',
    workPrompt: 'Explored our projects yet?',
    workLink: 'Have a look.',
  },
  story: {
    label: 'What’s Bizaffix',
    statement:
      'Welcome to Bizaffix. Here, dreams are transformed into reality. At our core, we are passionate creators dedicated to crafting outstanding mobile apps, dynamic web apps, ingenious healthcare solutions, and various other extensive business solutions.',
    relationships:
      'With our team of skilled experts, we’re not just about lines of code; we’re about building relationships.',
    closing:
      'Let’s embrace the possibilities and sail for success in the ever-evolving world of digital opportunities.',
  },
  /** Figures from the old About page. Locations (3) waits until all three are confirmed. */
  impact: {
    label: 'Our impact',
    meta: 'Since 2022',
    title: 'Transforming businesses, one digital solution at a time.',
    body: 'We’ve become a catalyst for entrepreneurial growth, helping startups compete with industry giants, and our healthcare software improves efficiency and patient care.',
    closing: 'Our impact is real, and we’re just getting started.',
    numbers: [
      { value: 400, label: 'Projects completed' },
      { value: 100, label: 'Brands developed' },
      { value: 50, label: 'Happy customers' },
      { value: 8, label: 'Product launches' },
    ],
  },
  values: {
    label: 'Values',
    title: 'Empowering entrepreneurs and advancing innovation.',
    body: 'Our values form the core of our operations, guiding our actions and driving our commitment to our clients.',
    items: [
      {
        title: 'Entrepreneurial empowerment',
        body: 'We believe in the power of ideas and the people behind them, and help entrepreneurs turn innovative concepts into successful businesses.',
      },
      {
        title: 'User-centricity',
        body: 'Users sit at the heart of everything we do. We create experiences that are intuitive, user-friendly, and engaging, not just good-looking.',
      },
      {
        title: 'Innovation',
        body: 'We push the boundaries of UI/UX design, web and app development, and healthcare software. We aim to shape the digital landscape, not keep up with it.',
      },
      {
        title: 'Partnership',
        body: 'We see ourselves not as a service provider but as part of your team, building solid, lasting partnerships.',
      },
      {
        title: 'Integrity',
        body: 'We work with transparency and honesty, and hold ourselves accountable for the quality of what we deliver.',
      },
    ],
  },
  industries: {
    label: 'Industries',
    title: 'Healthcare leads.',
    body: 'Bizaffix is about revolutionizing the healthcare industry with custom mobile applications, websites, designs, and branding solutions.',
    cta: 'Explore healthcare',
    ctaTo: '/healthcare',
    leadCaption: 'Lead industry',
    /** Legacy names for the five healthcare offers. */
    healthcareOffers: [
      'Clinical Decision Support',
      'Telemedicine',
      'Health Information Exchange',
      'Electronic Health Records',
      'Integration and Interoperability',
    ] as const,
    alsoLabel: 'Also building for',
    workLink: 'See the work',
  },
  services: {
    label: 'Services',
    title: 'Build your project.',
    body: 'Experience the potential of your business to its fullest with our comprehensive services, encompassing custom mobile apps, captivating websites, creative designs, and impactful branding solutions.',
    cta: 'View all services',
    technologiesLabel: 'Technologies',
    technologies: ['Kotlin', 'C#', 'Flutter', 'Python', 'HTML', 'Ruby'] as const,
    projectTypesLabel: 'Project types',
    projectTypes: ['Website', 'Logo', 'UI/UX', 'Product', 'Dashboard'] as const,
  },
  process: {
    label: 'Process',
    title: 'How a project moves.',
    body: 'Every project takes the same route, from idea to reality.',
    steps: [
      { title: 'Understanding', body: 'The idea, the business, and what the software has to change.' },
      { title: 'Research', body: 'The people who will use it, and the constraints around them.' },
      { title: 'Analysis', body: 'What belongs in the product, and what can wait.' },
      { title: 'Design', body: 'The interface, the brand, and the shape of the experience.' },
      { title: 'Testing', body: 'Proof that the software works before it meets the world.' },
    ],
  },
  team: {
    label: 'Team',
    title: 'Our team',
    body: 'Your vision is our inspiration, and together, we’ll create solutions that users won’t be able to resist.',
    careersLink: 'Careers at Bizaffix',
    careersTo: '/careers',
  },
} as const
