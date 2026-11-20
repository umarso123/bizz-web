/**
 * The mark's scroll script, as pure functions of progress p (0–1). The frame
 * player, the liquid and the test section's reveal all read the same p, so
 * scrolling backwards replays every phase exactly in reverse.
 *
 * p is the playhead, not the raw scroll: it follows the pinned timeline's
 * progress but no faster than PACE allows, so a fast scroll still plays the
 * melt instead of skipping it. When the scroll stops, the playhead settles on
 * the scroll position, so at rest everything is a function of the scroll.
 *
 * 'frames' (desktop):
 *   0.00–0.30  melt frames, first to last (once the logo faces front)
 *   0.30–0.36  the liquid fades in over the last frame's pool, at the pool's height
 *   0.36–0.42  the frame canvas fades out underneath it
 *   0.45–0.85  the liquid rises until the crest leaves the top; text fades to 0.2
 *   0.55–1.00  the test section shows under the liquid
 *
 * 'still' (phones, tablets, or if the frames fail): the static logo fades out,
 * then only the rise and the reveal run, over a shorter pin.
 */
export type MeltMode = 'frames' | 'still'

export const FRAMES = {
  meltEnd: 0.3,
  liquidIn: 0.3,
  liquidOpaque: 0.36,
  canvasOutStart: 0.36,
  canvasOutEnd: 0.42,
  riseStart: 0.45,
  fillEnd: 0.85,
  revealStart: 0.55,
} as const

export const STILL = {
  logoOutEnd: 0.15,
  riseStart: 0.1,
  fillEnd: 0.85,
  revealStart: 0.3,
} as const

/** Pinned scroll distance per mode. */
export const PIN_END: Record<MeltMode, string> = { frames: '+=400%', still: '+=200%' }

/** Wave amplitude at the crest, in CSS px. */
export const WAVE_AMP = 10

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))
export const easeInOut2 = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

/* ------------------------------------------------------------------ pace */

/**
 * The shortest time each stretch of the timeline may take, however fast the
 * scroll: [edges of the stretches], [seconds for each]. The melt never plays in
 * less than 1.8 s, and the liquid waits for it.
 */
const PACE: Record<MeltMode, { edges: readonly number[]; seconds: readonly number[] }> = {
  frames: { edges: [0, FRAMES.meltEnd, FRAMES.riseStart, FRAMES.fillEnd, 1], seconds: [1.8, 0.5, 0.9, 0.25] },
  still: { edges: [0, STILL.riseStart, STILL.fillEnd, 1], seconds: [0.2, 1.0, 0.25] },
}

/** Move the playhead towards `target` for `dt` seconds, no faster than PACE. */
export function stepPlayhead(play: number, target: number, dt: number, mode: MeltMode) {
  const { edges, seconds } = PACE[mode]
  let p = play
  let left = dt
  for (let guard = 0; guard < 16 && left > 1e-6 && Math.abs(target - p) > 1e-6; guard++) {
    const dir = target > p ? 1 : -1
    // The stretch p is in, in the direction of travel (an edge belongs to the stretch ahead).
    let i = 0
    while (i < seconds.length - 1 && (dir > 0 ? p >= edges[i + 1] : p > edges[i + 1])) i++
    const rate = (edges[i + 1] - edges[i]) / seconds[i]
    const stop = dir > 0 ? Math.min(target, edges[i + 1]) : Math.max(target, edges[i])
    const need = Math.abs(stop - p) / rate
    if (need <= left) {
      p = stop
      left -= need
    } else {
      p += dir * rate * left
      left = 0
    }
  }
  return p
}

/* ----------------------------------------------------------------- phases */

/**
 * The liquid's height from the bottom of the viewport (CSS px) and its opacity.
 * `poolPx` is the height of the pool in the last melt frame as drawn on screen.
 */
export function liquidLevel(p: number, vh: number, poolPx: number, mode: MeltMode) {
  // Full means even the lowest trough is above the top edge.
  const full = vh + WAVE_AMP * 2 + 4
  if (mode === 'still') return { level: full * easeInOut2(range(p, STILL.riseStart, STILL.fillEnd)), alpha: 1 }
  if (p < FRAMES.liquidIn) return { level: 0, alpha: 0 }
  // Troughs sit just above the pool's top edge, so its broken surface never shows through.
  const start = poolPx + WAVE_AMP
  const alpha = range(p, FRAMES.liquidIn, FRAMES.liquidOpaque)
  return { level: start + (full - start) * easeInOut2(range(p, FRAMES.riseStart, FRAMES.fillEnd)), alpha }
}

/** Wave amplitude for a pool this tall: a thin pool gets a gentler wave so it never leaves the bottom edge. */
export const waveAmp = (level: number) => WAVE_AMP * Math.min(1, level / (WAVE_AMP * 3))

export const revealStart = (mode: MeltMode) => (mode === 'frames' ? FRAMES.revealStart : STILL.revealStart)

/** Section A's text: full, then down to 0.2 while the liquid rises. */
export const textOpacityAt = (p: number, mode: MeltMode) =>
  1 - 0.8 * (mode === 'frames' ? range(p, FRAMES.riseStart, FRAMES.fillEnd) : range(p, STILL.riseStart, STILL.fillEnd))

/** The frame canvas, faded out once the liquid covers the pool. */
export const framesOpacityAt = (p: number) => 1 - range(p, FRAMES.canvasOutStart, FRAMES.canvasOutEnd)

/** The still logo (phones, tablets, fallback), faded out before the rise. */
export const stillOpacityAt = (p: number) => 1 - range(p, 0, STILL.logoOutEnd)

/**
 * How far the frame has glided from the logo column to the screen's edge (0–1).
 * The melt art is centred in a full-width frame: its splashes and pool reach
 * both sides. While the melted logo is at its narrowest (after the wide crown of
 * drips, as it collapses into the pool), the frame moves until it covers the
 * screen edge to edge, so the pool reaches both sides as drawn. The crown stays
 * over the logo column, clear of the text.
 */
export const slideAt = (p: number) => easeInOut2(range(range(p, 0, FRAMES.meltEnd), 0.44, 0.64))
