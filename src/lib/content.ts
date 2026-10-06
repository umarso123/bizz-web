import type { BlogPost, CaseStudy, ContentProvider } from '@/types/content.ts'

const blogPosts: readonly BlogPost[] = []
const caseStudies: readonly CaseStudy[] = []

/**
 * Content access boundary. Pages should read posts and case studies through
 * this provider. A local MDX loader or a headless CMS adapter can replace
 * `content` without changing page components.
 */
export const content = {
  async getBlogPosts() {
    return blogPosts
  },
  async getBlogPost(slug: string) {
    return blogPosts.find((post) => post.slug === slug) ?? null
  },
  async getCaseStudies() {
    return caseStudies
  },
  async getCaseStudy(slug: string) {
    return caseStudies.find((study) => study.slug === slug) ?? null
  },
} satisfies ContentProvider
