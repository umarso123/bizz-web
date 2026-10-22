import { rng } from '@/lib/tear.ts'

/**
 * Paper grain: a 160px tile of black and white specks with random alpha, from the
 * Pushpin Tear Footer. Built once on a canvas and cached as a data URL.
 */
const cache = new Map<string, string>()

export function grainTile(seed = 42, size = 160, maxAlpha = 46) {
  const key = `${seed}:${size}:${maxAlpha}`
  const hit = cache.get(key)
  if (hit !== undefined) return hit
  if (typeof document === 'undefined') return ''
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  if (!g) return ''
  const img = g.createImageData(size, size)
  const r = rng(seed)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = r() < 0.5 ? 0 : 255
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = Math.floor(r() * maxAlpha)
  }
  g.putImageData(img, 0, 0)
  const url = c.toDataURL()
  cache.set(key, url)
  return url
}
