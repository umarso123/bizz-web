/**
 * Featured Projects, single source for the immersive portfolio stage.
 * Images are the presentation boards in src/assets.
 */

import { mockups } from '@/content/mockups.ts'

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
      image: mockups.optimizedStrengthIcon,
      alt: 'Optimized Strength app on a phone',
      href: '/work/optimized-strength',
    },
    {
      id: 'project-02',
      number: '02',
      name: 'Healthcare',
      category: 'Digital Health',
      description:
        'Custom healthcare experiences spanning clinical workflows, care access, and connected data.',
      image: mockups.healthcare,
      alt: 'Healthcare website shown on tablets',
      href: '/work/clinical-decision-support',
    },
    {
      id: 'project-03',
      number: '03',
      name: 'The Poised Journey Academy',
      category: 'Education',
      description:
        'A learning platform that helps families plan, personalize, document, and manage homeschool journeys.',
      image: mockups.poisedDevicesPills,
      alt: 'Poised Journey Academy on laptop and tablets',
      href: '/work/poised-journey-academy',
    },
    {
      id: 'project-04',
      number: '04',
      name: 'Traino.ai',
      category: 'Education',
      description:
        'An AI-powered LMS built to optimize training knowledge retention and workforce learning.',
      image: mockups.trainoLaptop,
      alt: 'Traino.ai dashboard on a laptop',
      href: '/work/traino-ai',
    },
    {
      id: 'project-05',
      number: '05',
      name: 'Bank Alfalah',
      category: 'Finance',
      description: 'Bank Alfalah product screens across web and tablet.',
      image: mockups.bankAlfalah,
      alt: 'Bank Alfalah product on a presentation board',
      href: '/work/bank-alfalah',
    },
    {
      id: 'project-06',
      number: '06',
      name: 'Fitness',
      category: 'Wellness',
      description: 'Mobile and web experiences built around motivation, progress, and daily use.',
      image: mockups.fitnessBoards,
      alt: 'Fitness tracking app across several phones',
      href: '/work/fitness',
    },
    {
      id: 'project-07',
      number: '07',
      name: 'eCommerce',
      category: 'Commerce',
      description: 'Storefront and product journeys designed to convert without friction.',
      image: mockups.foodScreens,
      alt: 'Food ordering app across several phones',
      href: '/work/ecommerce',
    },
    {
      id: 'project-08',
      number: '08',
      name: 'Family Tree',
      category: 'Product',
      description:
        'Genealogy, shared updates, events, and profiles in one family web experience.',
      image: mockups.familyTreeTablets,
      alt: 'Family Tree app screens across tablets',
      href: '/work/family-tree',
    },
    {
      id: 'project-09',
      number: '09',
      name: 'Drug Testing',
      category: 'Healthcare',
      description: 'Drug testing app screens for the mobile experience.',
      image: mockups.drugTestingBoard,
      alt: 'Drug testing app screens',
      href: '/work/drug-testing',
    },
  ] satisfies FeaturedProject[],
} as const
