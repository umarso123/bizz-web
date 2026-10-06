/**
 * Laptop zoom experience config.
 * Swap productVisual.mode to "image" and set image path later — animation stays the same.
 */

export type ProductVisualMode = 'concept' | 'image'

export const productVisual: {
  mode: ProductVisualMode
  /** Public path, e.g. /images/projects/healthcare-product.webp */
  image: string | null
} = {
  mode: 'concept',
  image: null,
}

export const laptopZoomCopy = {
  eyebrow: 'Digital products',
  title: 'From idea to reality.',
  cta: 'Book a call',
  ctaTo: '/contact',
} as const
