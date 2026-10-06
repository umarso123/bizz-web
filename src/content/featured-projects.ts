/**
 * Featured Projects — single source for the immersive portfolio stage.
 *
 * Drop images into `public/images/projects/` using the filenames below,
 * then update name / category / description / href as real case studies land.
 *
 * Expected files (in order):
 *   project-01.webp … project-06.webp
 */

export type FeaturedProject = {
  id: string
  number: string
  name: string
  category: string
  description: string
  image: string
  alt: string
  href: string
}

export const featuredProjectsContent = {
  title: 'Featured Projects',
  viewAllLabel: 'View all projects',
  viewAllTo: '/work',
  caseStudyLabel: 'View case study',
  projects: [
    {
      id: 'project-01',
      number: '01',
      name: 'Optimized Strength',
      category: 'Fitness',
      description:
        'A consolidated, intuitive fitness product designed for lasting adherence and progress.',
      image: '/images/projects/project-01.webp',
      alt: 'Optimized Strength — featured project visual',
      href: '/work',
    },
    {
      id: 'project-02',
      number: '02',
      name: 'Healthcare',
      category: 'Digital Health',
      description:
        'Custom healthcare experiences spanning clinical workflows, care access, and connected data.',
      image: '/images/projects/project-02.webp',
      alt: 'Healthcare — featured project visual',
      href: '/work',
    },
    {
      id: 'project-03',
      number: '03',
      name: 'Educational',
      category: 'Education',
      description: 'Digital learning products shaped for clarity, engagement, and real outcomes.',
      image: '/images/projects/project-03.webp',
      alt: 'Educational — featured project visual',
      href: '/work',
    },
    {
      id: 'project-04',
      number: '04',
      name: 'Fintech',
      category: 'Finance',
      description: 'Product experiences that make complex financial systems feel approachable.',
      image: '/images/projects/project-04.webp',
      alt: 'Fintech — featured project visual',
      href: '/work',
    },
    {
      id: 'project-05',
      number: '05',
      name: 'Fitness',
      category: 'Wellness',
      description: 'Mobile and web experiences built around motivation, progress, and daily use.',
      image: '/images/projects/project-05.webp',
      alt: 'Fitness — featured project visual',
      href: '/work',
    },
    {
      id: 'project-06',
      number: '06',
      name: 'eCommerce',
      category: 'Commerce',
      description: 'Storefront and product journeys designed to convert without friction.',
      image: '/images/projects/project-06.webp',
      alt: 'eCommerce — featured project visual',
      href: '/work',
    },
  ] satisfies FeaturedProject[],
} as const
