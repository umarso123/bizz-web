/**
 * Services page content — grounded in content/legacy-site.md.
 */
export const servicesPage = {
  hero: {
    eyebrow: 'Services',
    title: 'Build your project.',
    body: 'Experience the potential of your business to its fullest with our comprehensive services, encompassing custom mobile apps, captivating websites, creative designs, and impactful branding solutions.',
  },
  intro: {
    title: 'Strengthen your digital presence.',
    body: 'Captivate your audience with our skilled team’s versatile expertise. Propel your business to new heights and unlock its true potential today.',
  },
  services: [
    {
      id: 'android',
      slug: 'android-app-development',
      title: 'Android App Development',
      body: 'Proficient Android app development service, crafting outstanding mobile solutions tailored to your business needs.',
    },
    {
      id: 'ios',
      slug: 'ios-app-development',
      title: 'iOS App Development',
      body: 'Leading iOS app development service, turning your vision into captivating and functional mobile experiences.',
    },
    {
      id: 'flutter',
      slug: 'flutter-app-development',
      title: 'Flutter App Development',
      body: 'Experience the future of mobile with expert Flutter app development, empowering your ideas with cutting-edge solutions.',
    },
    {
      id: 'web',
      slug: 'web-development',
      title: 'Web Development',
      body: 'Crafting exceptional websites that captivate and drive results.',
    },
    {
      id: 'fullstack',
      slug: 'frontend-backend-development',
      title: 'Frontend & Backend Development',
      body: 'Expert front and back-end development services for a powerful and seamless web presence.',
    },
    {
      id: 'cloud',
      slug: 'cloud-development',
      title: 'Cloud Development',
      body: 'Experience the power of scalable cloud solutions with our expert development service.',
    },
  ],
  process: {
    eyebrow: 'Process',
    title: 'How a project moves.',
    stages: [
      { number: '01', title: 'Understanding', body: 'The idea, the business, and what the software has to change.' },
      { number: '02', title: 'Research', body: 'The people who will use it, and the constraints around them.' },
      { number: '03', title: 'Analysis', body: 'What belongs in the product, and what can wait.' },
      { number: '04', title: 'Design', body: 'The interface, the brand, and the shape of the experience.' },
      { number: '05', title: 'Testing', body: 'Proof that the software works before it meets the world.' },
    ],
  },
  technologies: {
    eyebrow: 'Technologies',
    title: 'Driven by the tools the work already uses.',
    items: ['Kotlin', 'C#', 'Flutter', 'Python', 'HTML', 'Ruby'] as const,
  },
  industries: {
    eyebrow: 'Industries',
    title: 'Healthcare leads. Other industries sit beside it.',
    items: ['Healthcare', 'Educational', 'Fintech', 'Fitness', 'eCommerce'] as const,
  },
  cta: {
    title: 'Want to collaborate?',
    body: 'Reach out to us. Let’s connect — and propel your business to new heights.',
  },
} as const
