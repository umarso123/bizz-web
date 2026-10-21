/**
 * Insights ("Articles by Bizaffix"). The legacy site has one real article; only its
 * title, category, date, and opening line survive, so nothing here links to a body.
 * "Future of learning" and "Future of work" were placeholder text and stay unpublished.
 */

export const insightsPage = {
  hero: {
    zone: 'Insights',
    title: 'Articles by Bizaffix',
    intro: 'Writing from the team on digital health and the work around it.',
  },
  featured: {
    label: 'Featured article',
    title: 'Driving Digital Health Success: The Power of Clinical Validation and Cultural Competency',
    category: 'Marketing',
    date: 'August 4, 2025',
    dateTime: '2025-08-04',
    opening:
      'The badge protects everyone except the one wearing it—until now, technology is changing that narrative.',
  },
  note: 'More articles are on the way.',
} as const
