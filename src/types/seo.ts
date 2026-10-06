/**
 * Per-page metadata for the future prerender step.
 * Public pages stay indexable. Do not add a default noindex flag.
 */
export interface PageMetadata {
  title: string
  description: string
  /** Site path beginning with `/`, used to build the canonical URL. */
  path: string
  openGraph?: {
    title: string
    description: string
    imagePath?: string
  }
}
