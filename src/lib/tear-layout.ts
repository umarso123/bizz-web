import { XS, flapPoly, makeTear, rng, type Flap, type Tear } from '@/lib/tear.ts'

/** Linear sample of a ridge array at ridge x `u`, clamped at both ends. */
function sample(values: number[], u: number) {
  if (u <= XS[0]) return values[0]
  const last = XS.length - 1
  if (u >= XS[last]) return values[last]
  let j = 0
  while (j < last - 1 && XS[j + 1] < u) j++
  const t = (u - XS[j]) / (XS[j + 1] - XS[j] || 1)
  return values[j] + (values[j + 1] - values[j]) * t
}

const n1 = (v: number) => Math.round(v * 10) / 10

/** The paper below the ridge: the part of a band the torn sheet has uncovered. */
export function underD(ys: number[], W: number, H: number) {
  let d = `M-20 ${H + 20}L${W + 20} ${H + 20}`
  for (let i = ys.length - 1; i >= 0; i--) d += `L${n1(XS[i] * W)} ${n1(ys[i] * H)}`
  return `${d}Z`
}

/** The white fibre rim: the strip between the ridge and the ridge lifted by `rim` pixels. */
export function rimD(ys: number[], W: number, H: number, rim: number[]) {
  let d = ''
  for (let i = 0; i < ys.length; i++) d += `${i ? 'L' : 'M'}${n1(XS[i] * W)} ${n1(ys[i] * H)}`
  for (let i = ys.length - 1; i >= 0; i--) d += `L${n1(XS[i] * W)} ${n1(ys[i] * H - rim[i])}`
  return `${d}Z`
}

/**
 * Moves a tear's centre (where it rips first and climbs highest) under a pin at
 * `pinX` (0..1) by stretching each side, so a tear can start left or right of
 * centre. The tear itself still comes from makeTear, unchanged.
 */
export function shiftTear(tear: Tear, pinX: number): Tear {
  if (Math.abs(pinX - 0.5) < 1e-3) return tear
  const toCentred = (x: number) => (x < pinX ? (0.5 * x) / pinX : 0.5 + (0.5 * (x - pinX)) / (1 - pinX))
  const remap = (values: number[]) => XS.map((x) => sample(values, toCentred(x)))
  return { ...tear, ys: remap(tear.ys), rim: remap(tear.rim), lag: remap(tear.lag) }
}

/** A vertical tear down the middle of a sheet: x (0..1 of width) at each XS row (0..1 of height). */
export type Seam = { xs: number[]; rim: number[]; flaps: Flap[] }

/**
 * The centre seam, built like makeTear's ridge (three slow waves, a jag with an
 * occasional spike) but running top to bottom around x = 0.5. Rim widths and
 * flaps come from makeTear with the same seed.
 */
export function makeSeam(seed: number): Seam {
  const r = rng(seed * 7 + 3)
  const ph = [r() * 6.283, r() * 6.283, r() * 6.283]
  const xs = XS.map((y) => {
    const wander = 0.016 * Math.sin(y * 7 + ph[0]) + 0.011 * Math.sin(y * 13 + ph[1]) + 0.006 * Math.sin(y * 29 + ph[2])
    const spike = r() < 0.16 ? 2.3 : 1
    const jag = (r() - 0.5) * 0.018 * spike
    return 0.5 + wander + jag
  })
  const { rim, flaps } = makeTear(seed)
  return { xs, rim, flaps }
}

/** Seam points in pixels, top to bottom, nudged sideways by `dx`. */
export function seamPoints(seam: Seam, W: number, H: number, dx = 0) {
  return XS.map((y, i) => [n1(seam.xs[i] * W + dx), n1(y * H)])
}

/**
 * A flap on the seam: flapPoly on the seam turned on its side, so the flap hangs
 * off the torn edge sideways. `side` 1 curls toward the right, -1 toward the left;
 * `scale` shrinks flaps sized for a full-height ridge to fit a seam.
 */
export function seamFlap(seam: Seam, f: Flap, W: number, H: number, open: number, side: 1 | -1, scale = 0.5) {
  const turned = { ...f, len: f.len * scale, dir: f.dir * side }
  return flapPoly(seam.xs, turned, H, W, open).map(([y, x]) => [x, y])
}
