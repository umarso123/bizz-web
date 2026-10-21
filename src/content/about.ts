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
