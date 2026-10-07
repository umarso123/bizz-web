export type Pt = { x: number; y: number }

export function clamp(value: number, min = 0, max = 1) {
  if (min > max) return (min + max) / 2
  return Math.min(max, Math.max(min, value))
}

export function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount
}

function distance(a: Pt, b: Pt) {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

export function easeOut(amount: number) {
  const t = clamp(amount)
  return 1 - (1 - t) ** 3
}

/** How much of the viewport a scene currently owns. */
export function sceneWeight(scene: DOMRect | undefined, anchor: DOMRect | undefined, viewport: number) {
  if (!scene || !anchor) return 0
  if (anchor.bottom < -140 || anchor.top > viewport + 140) return 0
  const visibleTop = Math.max(scene.top, 0)
  const visibleBottom = Math.min(scene.bottom, viewport)
  const visible = visibleBottom - visibleTop
  if (visible <= 0) return 0
  return clamp(visible / (viewport * 0.7))
}

export function resample(points: Pt[], count: number): Pt[] {
  if (points.length === 0) return []
  if (points.length === 1) return Array.from({ length: count }, () => ({ x: points[0].x, y: points[0].y }))

  const lengths = [0]
  for (let index = 1; index < points.length; index += 1) {
    lengths.push(lengths[index - 1] + distance(points[index - 1], points[index]))
  }
  const total = lengths[lengths.length - 1] || 1
  const out: Pt[] = []

  for (let index = 0; index < count; index += 1) {
    const target = (index / (count - 1)) * total
    let segment = 1
    while (segment < lengths.length - 1 && lengths[segment] < target) segment += 1
    const span = lengths[segment] - lengths[segment - 1] || 1
    const amount = (target - lengths[segment - 1]) / span
    const start = points[segment - 1]
    const end = points[segment]
    out.push({ x: lerp(start.x, end.x, amount), y: lerp(start.y, end.y, amount) })
  }

  return out
}

export function blendPaths(layers: Array<{ points: Pt[]; weight: number }>, count: number): Pt[] {
  const active = layers.filter((layer) => layer.weight > 0.001 && layer.points.length > 1)
  if (active.length === 0) return []
  const sum = active.reduce((total, layer) => total + layer.weight, 0)
  const mixed = Array.from({ length: count }, () => ({ x: 0, y: 0 }))

  for (const layer of active) {
    const points = resample(layer.points, count)
    const weight = layer.weight / sum
    for (let index = 0; index < count; index += 1) {
      mixed[index].x += points[index].x * weight
      mixed[index].y += points[index].y * weight
    }
  }

  return mixed
}

export function smoothPath(points: Pt[], tension: number) {
  if (points.length < 2) return ''
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} L ${points[1].x.toFixed(2)} ${points[1].y.toFixed(2)}`
  }

  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index]
    const current = points[index]
    const next = points[index + 1]
    const after = points[index + 2] ?? next
    const c1x = current.x + ((next.x - previous.x) / 6) * tension
    const c1y = current.y + ((next.y - previous.y) / 6) * tension
    const c2x = next.x - ((after.x - current.x) / 6) * tension
    const c2y = next.y - ((after.y - current.y) / 6) * tension
    path += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${next.x.toFixed(2)} ${next.y.toFixed(2)}`
  }
  return path
}

export function offsetPath(points: Pt[], amount: number): Pt[] {
  return points.map((point, index) => {
    const previous = points[index - 1] ?? point
    const next = points[index + 1] ?? point
    const dx = next.x - previous.x
    const dy = next.y - previous.y
    const length = Math.hypot(dx, dy) || 1
    return {
      x: point.x - (dy / length) * amount,
      y: point.y + (dx / length) * amount,
    }
  })
}

export function heroExtent(title: DOMRect, viewport: number) {
  const travel = clamp((viewport * 0.78 - title.top) / (viewport * 0.62))
  return lerp(0.46, 1, travel)
}

export function heroPoints(title: DOMRect, width: number, extent: number): Pt[] {
  const y = title.bottom + 28
  const left = title.left
  const room = Math.max(0, width - left - 36)
  const reach = lerp(Math.min(title.width * 0.7, room), room, extent)
  return [
    { x: left, y: y + 18 },
    { x: left + reach * 0.34, y: y },
    { x: left + reach * 0.67, y: y + 22 },
    { x: left + reach, y: y + 6 },
  ]
}

export function optionGeometry(rows: DOMRect[], width: number) {
  if (rows.length === 0) return { trunk: [] as Pt[], spurs: [] as Pt[][] }
  const leftRoom = rows[0].left
  if (leftRoom < 56) {
    const x = width - 14
    const mid = (rows[0].top + rows[rows.length - 1].bottom) / 2
    return {
      trunk: [
        { x, y: rows[0].top + 8 },
        { x: x - 22, y: mid },
        { x, y: rows[rows.length - 1].bottom - 8 },
      ],
      spurs: [] as Pt[][],
    }
  }

  const x = leftRoom - 36
  const trunk: Pt[] = [{ x: x + 18, y: rows[0].top - 48 }]
  const spurs: Pt[][] = []
  for (const row of rows) {
    const y = row.top + row.height * 0.5
    trunk.push({ x, y })
    spurs.push([
      { x, y },
      { x: row.left - 8, y },
    ])
  }
  const last = rows[rows.length - 1]
  trunk.push({ x: x + 14, y: last.bottom + 36 })
  return { trunk, spurs }
}

export function formPoints(form: DOMRect, active: DOMRect | null, width: number, height: number): Pt[] {
  const midY = active
    ? clamp(active.top + active.height / 2, 136, height - 28)
    : clamp(form.top + Math.min(160, form.height * 0.22), 136, height - 28)
  const narrow = form.left < 64

  if (narrow) {
    const x = width - 16
    const top = clamp(Math.max(form.top, 136), 136, height - 80)
    const bottom = clamp(Math.min(form.bottom, height - 20), top + 48, height - 16)
    return [
      { x, y: top },
      { x: x - (active ? 28 : 8), y: midY },
      { x, y: bottom },
    ]
  }

  const x = form.left - 36
  const top = clamp(Math.max(form.top + 8, 136), 136, height - 80)
  const bottom = clamp(Math.min(form.bottom - 8, height - 24), top + 64, height - 16)
  return [
    { x, y: top },
    { x: x + (active ? 46 : 0), y: clamp(midY, top + 16, bottom - 16) },
    { x, y: bottom },
  ]
}

export function closePoints(title: DOMRect, width: number): Pt[] {
  const y = title.bottom + 30
  const room = Math.max(0, width - title.left - 36)
  const reach = Math.min(room, Math.max(title.width * 0.86, Math.min(room, 480)))
  return [
    { x: title.left, y: y + 16 },
    { x: title.left + reach * 0.36, y: y },
    { x: title.left + reach * 0.7, y: y + 20 },
    { x: title.left + reach, y: y + 4 },
  ]
}

/** Keep a blended path in the margin when it would otherwise cross the writing. */
export function stayInMargin(points: Pt[], boxes: DOMRect[], width: number): Pt[] {
  return points.map((point) => {
    let next = point
    for (const box of boxes) {
      const inside =
        next.x > box.left + 6 &&
        next.x < box.right - 12 &&
        next.y > box.top + 12 &&
        next.y < box.bottom - 12
      if (!inside) continue
      next = box.left < 72 ? { x: width - 16, y: next.y } : { x: box.left - 34, y: next.y }
    }
    return next
  })
}

/** Keep the filament in the margin under a headline instead of crossing the letters. */
export function clearTitles(points: Pt[], titles: DOMRect[]): Pt[] {
  return points.map((point) => {
    let next = point
    for (const title of titles) {
      const overlaps =
        next.x > title.left - 16 &&
        next.x < title.right + 28 &&
        next.y > title.top - 8 &&
        next.y < title.bottom + 12
      if (overlaps) next = { x: next.x, y: title.bottom + 26 }
    }
    return next
  })
}

export function fieldTick(field: DOMRect, rail: Pt, width: number): Pt[] {
  const y = field.top + field.height / 2
  const fromRight = field.left < 64
  return [
    rail,
    {
      x: fromRight ? Math.min(width - 20, field.right + 8) : field.left - 6,
      y,
    },
  ]
}
