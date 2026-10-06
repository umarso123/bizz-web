/**
 * Stable content models for blog posts and case studies.
 * MDX frontmatter and a future headless CMS should both map onto these types.
 */
export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
}

export interface CaseStudy {
  slug: string
  title: string
  summary: string
  publishedAt: string
}

export interface ContentProvider {
  getBlogPosts(): Promise<readonly BlogPost[]>
  getBlogPost(slug: string): Promise<BlogPost | null>
  getCaseStudies(): Promise<readonly CaseStudy[]>
  getCaseStudy(slug: string): Promise<CaseStudy | null>
}
