/**
 * The mark's two image sequences (rotation and melt), and what the code needs to
 * know about the art: its colours, letterbox and pool, read from the frames.
 */

const natural = (map: Record<string, string>) =>
  Object.keys(map)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path) => map[path])

// eager: true only inlines the URL strings (no image is fetched here). With
// eager: false every frame would become its own one-line JS chunk: 476 of them.
export const ROTATION_URLS = natural(
  import.meta.glob<string>('/src/assets/bizaffix/rotation/*.{webp,png,jpg}', { eager: true, query: '?url', import: 'default' }),
)
export const MELT_URLS = natural(
  import.meta.glob<string>('/src/assets/bizaffix/melt/*.{webp,png,jpg}', { eager: true, query: '?url', import: 'default' }),
)

/* ------------------------------------------------------------------ the art */

/** Measured from the frames at runtime. All lengths in source pixels. */
export type Art = {
  /** Native frame size. */
  width: number
  height: number
  /** Background, from (5,5) of the first melt frame. */
  bg: string
  /** Liquid, from inside the pool of the last melt frame. */
  liquid: string
  /** Rows cropped off the top and bottom of every frame: the letterbox, to the next 16px WebP macroblock. */
  cropTop: number
  cropBottom: number
  /** Top edge of the pool in the last melt frame. */
  poolTop: number
  /** The logo's centre and half-width in the first melt frame, as fractions of the frame width. */
  logoCx: number
  logoHalf: number
}

const hex = (r: number, g: number, b: number) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase()

async function pixels(url: string, signal: AbortSignal) {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  const bmp = await createImageBitmap(await res.blob())
  const canvas = document.createElement('canvas')
  canvas.width = bmp.width
  canvas.height = bmp.height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('2D canvas unavailable')
  ctx.drawImage(bmp, 0, 0)
  bmp.close()
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  canvas.width = 0
  const at = (x: number, y: number) => {
    const i = (Math.round(y) * width + Math.round(x)) * 4
    return [data[i], data[i + 1], data[i + 2]] as const
  }
  return { at, width, height }
}

const luma = ([r, g, b]: readonly number[]) => 0.299 * r + 0.587 * g + 0.114 * b
const dist = (a: readonly number[], b: readonly number[]) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
const median = (values: number[]) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)]

/** Read the colours, letterbox, pool and logo position from the first and last melt frames. */
export async function sampleArt(firstUrl: string, lastUrl: string, signal: AbortSignal): Promise<Art> {
  const [first, last] = await Promise.all([pixels(firstUrl, signal), pixels(lastUrl, signal)])
  const { width: w, height: h } = first
  const bgPx = first.at(5, 5)

  // The letterbox, cropped out to the next 16px WebP macroblock. Cropping just the
  // dark rows was not enough: scaling still blends in the row beside the crop, and
  // the rest of the block they share rings darker, which drew a line along the top.
  const BLOCK = 16
  let cropTop = 0
  while (cropTop < h * 0.05 && luma(first.at(w / 2, cropTop)) < 40) cropTop++
  let cropBottom = 0
  while (cropBottom < h * 0.05 && luma(first.at(w / 2, h - 1 - cropBottom)) < 40) cropBottom++
  cropTop = Math.ceil((cropTop + 1) / BLOCK) * BLOCK
  cropBottom = h - Math.floor((h - cropBottom - 1) / BLOCK) * BLOCK

  // The logo: the outermost non-background pixels along a few rows through the middle.
  let left = w
  let right = 0
  for (const fy of [0.4, 0.5, 0.6]) {
    for (let x = 0; x < w; x++) {
      if (dist(first.at(x, h * fy), bgPx) > 60) {
        left = Math.min(left, x)
        right = Math.max(right, x)
      }
    }
  }
  if (right <= left) {
    left = w * 0.33
    right = w * 0.67
  }

  // The pool: from 40% down, the first row that is no longer background, per column.
  const lastBg = last.at(5, 5)
  const tops: number[] = []
  for (let fx = 0.1; fx <= 0.9; fx += 0.1) {
    let y = Math.round(h * 0.4)
    while (y < h - cropBottom - 1 && dist(last.at(w * fx, y), lastBg) < 60) y++
    tops.push(y)
  }
  const poolTop = median(tops)

  // The liquid: the median over a band just under the pool's top edge (the cyan
  // dominates the darker swirls there).
  const rs: number[] = []
  const gs: number[] = []
  const bs: number[] = []
  const bandEnd = Math.min(h - cropBottom - 1, poolTop + 22)
  for (let y = poolTop + 6; y <= bandEnd; y += 4) {
    for (let fx = 0.05; fx <= 0.95; fx += 0.02) {
      const [r, g, b] = last.at(w * fx, y)
      rs.push(r)
      gs.push(g)
      bs.push(b)
    }
  }

  return {
    width: w,
    height: h,
    bg: hex(...bgPx),
    liquid: hex(median(rs), median(gs), median(bs)),
    cropTop,
    cropBottom,
    poolTop,
    logoCx: (left + right) / 2 / w,
    logoHalf: (right - left) / 2 / w,
  }
}

/* ---------------------------------------------------------------- layout */

/**
 * Cover-fit a frame (letterbox cropped) to a W×H canvas, no stretching. The frame
 * is scaled to cover and shifted sideways so the logo sits over `anchorX`.
 * `slide` (0–1) moves it from there to the nearest position where it covers the
 * canvas edge to edge, with no strip uncovered at either side.
 */
export function coverLayout(W: number, H: number, srcW: number, srcH: number, art: Art, anchorX: number, margin: number, slide = 0) {
  const sh = srcH - art.cropTop - art.cropBottom
  const s = Math.max(W / srcW, H / sh)
  const dw = srcW * s
  const dh = sh * s
  const half = art.logoHalf * dw
  const cx = Math.min(Math.max(anchorX, half + margin), W - half - margin)
  const anchored = cx - art.logoCx * dw
  // dw >= W, so W - dw <= 0: the range of offsets that leave no gap.
  const covering = Math.min(0, Math.max(W - dw, anchored))
  return { s, sh, dw, dh, dx: anchored + (covering - anchored) * slide, dy: (H - dh) / 2 }
}

/** The last melt frame's pool, as drawn on a W×H canvas: its height above the bottom edge. */
export function poolOnScreen(W: number, H: number, srcW: number, srcH: number, art: Art) {
  const { s, dy } = coverLayout(W, H, srcW, srcH, art, W / 2, 0)
  return Math.max(0, H - (dy + (art.poolTop - art.cropTop) * s))
}

/* ------------------------------------------------------------- sequences */

/** Frames decoding at once. Three could not keep up with a fast scroll through the melt. */
const MAX_DECODING = 6

/** True when two blobs hold the same bytes. Sizes first, so most pairs never read their contents. */
async function sameBytes(a: Blob, b: Blob) {
  if (a.size !== b.size) return false
  const [x, y] = await Promise.all([a.arrayBuffer(), b.arrayBuffer()])
  const u = new Uint8Array(x)
  const v = new Uint8Array(y)
  for (let i = 0; i < u.length; i++) if (u[i] !== v[i]) return false
  return true
}

/**
 * One image sequence. Every file is fetched once and kept encoded (a few MB in
 * all), but only a window of frames around the playhead is decoded into
 * ImageBitmaps; the rest are closed. Decoding all 476 frames at 1280×720 would
 * hold about 1.75 GB.
 *
 * Playback goes through `order`, a list of source frame indices. It starts as
 * every frame; once all files are in, `dedupe()` drops frames that are
 * byte-identical to the one before (the export repeats every 5th frame, which
 * made the motion hitch five times a second).
 */
export class FrameSequence {
  readonly count: number
  /** Source frames to play, in order. Replaced (never mutated) by dedupe(). */
  order: readonly number[]
  private readonly urls: string[]
  private readonly signal: AbortSignal
  /** Frames to keep decoded ahead of and behind the playhead, in play order. */
  private readonly keep: { ahead: number; behind: number }
  /** Source frames that stay decoded (the front pose, for the crossfade). */
  private readonly pinned: ReadonlySet<number>
  private readonly blobs: (Promise<Blob> | undefined)[]
  private readonly bitmaps: (ImageBitmap | null)[]
  private readonly decoding = new Set<number>()
  /** The frame on screen: never closed, so it can be redrawn until a closer one is ready. */
  private held = -1
  private disposed = false

  constructor(urls: string[], signal: AbortSignal, keep = { ahead: 24, behind: 8 }, pinned: ReadonlySet<number> = new Set([0])) {
    this.urls = urls
    this.signal = signal
    this.keep = keep
    this.pinned = pinned
    this.count = urls.length
    this.order = Array.from({ length: this.count }, (_, i) => i)
    this.blobs = new Array(this.count)
    this.bitmaps = new Array(this.count).fill(null)
  }

  private blob(i: number) {
    this.blobs[i] ??= fetch(this.urls[i], { signal: this.signal }).then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${this.urls[i]}`)
      return res.blob()
    })
    return this.blobs[i]
  }

  /** Fetch every file in order, a few at a time, without decoding. */
  async preload(concurrency = 4) {
    let next = 0
    const worker = async () => {
      while (next < this.count && !this.disposed) {
        const i = next++
        await this.blob(i).catch(() => undefined)
      }
    }
    await Promise.all(Array.from({ length: concurrency }, worker))
  }

  /** Drop frames identical to the one before. Call after preload(); returns how many were dropped. */
  async dedupe() {
    const blobs = await Promise.all(this.order.map((i) => this.blob(i).catch(() => null)))
    const keep = [0]
    for (let i = 1; i < blobs.length; i++) {
      const a = blobs[i - 1]
      const b = blobs[i]
      if (this.disposed) return 0
      if (!a || !b || !(await sameBytes(a, b))) keep.push(i)
    }
    if (!this.disposed) this.order = keep
    return this.count - keep.length
  }

  /** Decode one source frame now. Resolves null if it failed or the sequence was disposed. */
  async decode(i: number): Promise<ImageBitmap | null> {
    if (this.bitmaps[i]) return this.bitmaps[i]
    if (this.decoding.has(i) || this.disposed) return null
    this.decoding.add(i)
    try {
      const bmp = await createImageBitmap(await this.blob(i))
      if (this.disposed) {
        bmp.close()
        return null
      }
      this.bitmaps[i] = bmp
      return bmp
    } catch {
      return null
    } finally {
      this.decoding.delete(i)
    }
  }

  /**
   * Keep the window around play position k of `order` (heading in `dir`) decoded,
   * and close everything else. `keep` narrows the window for a sequence that is
   * waiting rather than playing.
   */
  focus(order: readonly number[], k: number, dir: number, keep = this.keep) {
    const { ahead, behind } = keep
    const lo = Math.max(0, dir >= 0 ? k - behind : k - ahead)
    const hi = Math.min(order.length - 1, dir >= 0 ? k + ahead : k + behind)
    const wanted = new Set<number>(this.pinned)
    if (this.held >= 0) wanted.add(this.held)
    for (let j = lo; j <= hi; j++) wanted.add(order[j])
    for (let i = 0; i < this.count; i++) {
      const bmp = this.bitmaps[i]
      if (bmp && !wanted.has(i)) {
        bmp.close()
        this.bitmaps[i] = null
      }
    }
    for (const i of this.pinned) if (!this.bitmaps[i]) void this.decode(i)
    // Nearest first, in the direction of travel, a few in flight.
    const step = dir >= 0 ? 1 : -1
    for (let d = 0; d <= Math.max(ahead, behind) && this.decoding.size < MAX_DECODING; d++) {
      for (const j of [k + d * step, k - d * step]) {
        if (j < lo || j > hi) continue
        const i = order[j]
        if (!this.bitmaps[i] && !this.decoding.has(i)) void this.decode(i)
      }
    }
  }

  /** The decoded frame nearest to play position k of `order` (exact when ready), with its position. */
  nearest(order: readonly number[], k: number) {
    for (let d = 0; d < order.length; d++) {
      for (const j of [k - d, k + d]) {
        if (j < 0 || j >= order.length) continue
        const bmp = this.bitmaps[order[j]]
        if (bmp) return { index: order[j], pos: j, bmp }
      }
    }
    return null
  }

  /** Mark source frame i as the one on screen (-1: none). */
  hold(i: number) {
    this.held = i
  }

  /** Source frame i, if it is decoded. */
  get(i: number) {
    return this.bitmaps[i] ?? null
  }

  dispose() {
    this.disposed = true
    for (let i = 0; i < this.count; i++) {
      this.bitmaps[i]?.close()
      this.bitmaps[i] = null
    }
  }
}
