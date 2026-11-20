/**
 * Homepage "Build your project." section: every word the section renders.
 * Edit copy here; ServicesDirectory.tsx only lays it out.
 */

export type ServiceIcon = 'mobile' | 'web' | 'cloud'

export type ServiceRow = {
  title: string
  line: string
  /** Anchor on /services. */
  href: string
}

export type ServiceGroup = {
  id: ServiceIcon
  label: string
  summary: string
  rows: readonly ServiceRow[]
  tags: readonly string[]
}

export type ServicesHomeCopy = {
  title: string
  lead: string
  link: { label: string; href: string }
  groups: readonly ServiceGroup[]
  technologies: { label: string; items: readonly string[] }
}

export const servicesHome: ServicesHomeCopy = {
  title: 'Build your project.',
  lead: 'Mobile, web, and cloud, designed and engineered by one team.',
  link: { label: 'View all services', href: '/services' },
  groups: [
    {
      id: 'mobile',
      label: 'Mobile apps',
      summary: 'Native Android and iOS apps, or one Flutter codebase for both.',
      rows: [
        { title: 'Android App Development', line: 'Native Android apps, built in Kotlin.', href: '/services#android-app-development' },
        { title: 'iOS App Development', line: 'Native apps for iPhone and iPad.', href: '/services#ios-app-development' },
        { title: 'Flutter App Development', line: 'One codebase for Android and iOS.', href: '/services#flutter-app-development' },
      ],
      tags: ['Kotlin', 'Flutter'],
    },
    {
      id: 'web',
      label: 'Web',
      summary: 'Websites and complete web platforms, from the interface to the server.',
      rows: [
        { title: 'Web Development', line: 'Websites built to engage and drive results.', href: '/services#web-development' },
        { title: 'Frontend & Backend Development', line: 'Front end and back end for complete web platforms.', href: '/services#frontend-backend-development' },
      ],
      tags: ['HTML'],
    },
    {
      id: 'cloud',
      label: 'Cloud',
      summary: 'Scalable cloud infrastructure behind your apps.',
      rows: [{ title: 'Cloud Development', line: 'Cloud solutions that scale with your product.', href: '/services#cloud-development' }],
      tags: [],
    },
  ],
  technologies: {
    label: 'Technologies',
    items: ['Kotlin', 'C#', 'Flutter', 'Python', 'HTML', 'Ruby'],
  },
}
