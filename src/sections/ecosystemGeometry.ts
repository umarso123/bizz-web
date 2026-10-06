export const ecosystemCenter = { x: 320, y: 368 }

export function ecosystemPoint(angle: number, orbit: number, phase: number) {
  const spread = 1 + phase * 0.46
  const spin = phase * 0.42
  return {
    x: ecosystemCenter.x + Math.cos(angle + spin) * orbit * spread,
    y: ecosystemCenter.y + Math.sin(angle + spin) * orbit * 0.72 * spread,
  }
}
