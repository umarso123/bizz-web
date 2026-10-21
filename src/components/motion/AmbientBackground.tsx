import { useEffect, useRef } from 'react'

/*
 * The one background for the whole site: a single fixed canvas behind every page.
 * Layers, bottom to top: soft blurred colour blobs, a faint hexagon lattice
 * (strongest at the edges and right side, nearly gone behind text), slow flowing
 * lines, and a cursor glow on desktop. Panels are semi-opaque so it shows through.
 */

const BLUE = '37, 99, 235' // #2563EB
const SKY = '147, 197, 253' // #93C5FD
const R = 44
const COL = Math.sqrt(3) * R
const ROW = 1.5 * R
const FRAME_MS = 1000 / 30
const PARALLAX = 0.18
const CURSOR_RADIUS = 150

/** Blob colours: soft blue, periwinkle, pale cyan, a hint of peach. */
const BLOBS = [
  { color: '219, 234, 254', x: 0.85, y: 0.15, r: 0.55, period: 34, phase: 0, alpha: 0.9 }, // #DBEAFE
  { color: '199, 210, 254', x: 0.1, y: 0.55, r: 0.45, period: 38, phase: 1.7, alpha: 0.55 }, // #C7D2FE
  { color: '207, 250, 254', x: 0.65, y: 0.85, r: 0.5, period: 30, phase: 3.1, alpha: 0.6 }, // #CFFAFE
  { color: '255, 228, 214', x: 0.3, y: 0.05, r: 0.35, period: 40, phase: 4.4, alpha: 0.45 }, // #FFE4D6
]

function hexPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.moveTo(cx, cy - r)
  for (let i = 1; i < 6; i += 1) {
    const a = (Math.PI / 3) * i - Math.PI / 2
    ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
  }
  ctx.closePath()
}

/** Edge-weighted mask: ~0 over the reading area (centre-left), 1 at the edges and right. */
function edgeMask(x: number, y: number, w: number, h: number) {
  const nx = x / w
  const ny = y / h
  const dx = (nx - 0.38) / 0.42
  const dy = (ny - 0.5) / 0.55
  const d = Math.sqrt(dx * dx + dy * dy)
  const radial = Math.min(1, Math.max(0, (d - 0.45) / 0.65))
  const right = Math.max(0, (nx - 0.55) / 0.45)
  // A floor of 0.35 keeps the texture present everywhere, just quieter behind text.
  return 0.35 + 0.65 * Math.min(1, radial * 0.8 + right * 0.5)
}

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let width = 0
    let height = 0
    let frame = 0
    let last = 0
    const start = performance.now()
    const pointer = { x: -9999, y: -9999 }
    // Cursor heat per screen cell, so brightened hexagons fade out as a trail.
    let heat = new Float32Array(0)
    let cols = 0
    let rows = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(width / COL) + 3
      rows = Math.ceil(height / ROW) + 4
      heat = new Float32Array(cols * rows)
    }

    let lastScroll = window.scrollY
    let energy = 0

    const draw = (t: number, dt: number) => {
      const scroll = window.scrollY
      // Scrolling charges the lattice: a bright band travels with the scroll and fades when you stop.
      energy = Math.min(1, energy * Math.exp(-dt / 700) + Math.abs(scroll - lastScroll) * 0.006)
      lastScroll = scroll
      const bandY = (scroll * 0.5) % (height + 400) - 200
      ctx.clearRect(0, 0, width, height)

      // 1. Blobs: huge soft radial gradients drifting on 30–40 s loops, offset by
      //    scroll so colour changes from section to section.
      for (const blob of BLOBS) {
        const loop = (t / blob.period) * Math.PI * 2 + blob.phase
        const cx = width * (blob.x + 0.06 * Math.sin(loop))
        const cy = height * (blob.y + 0.05 * Math.cos(loop * 0.8)) - ((scroll * 0.05) % height) + Math.sin(scroll * 0.0006 + blob.phase) * height * 0.25
        const radius = Math.max(width, height) * blob.r
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        g.addColorStop(0, `rgba(${blob.color}, ${blob.alpha})`)
        g.addColorStop(0.55, `rgba(${blob.color}, ${blob.alpha * 0.35})`)
        g.addColorStop(1, `rgba(${blob.color}, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, width, height)
      }

      // 2. Hexagon lattice: texture, not objects. Strokes 0.6px, 4–8% opacity.
      const drift = (t / 36) * COL // one cell every 36 s
      const offsetX = -(drift % COL)
      const offsetY = -((scroll * PARALLAX + t * 0.6) % (ROW * 2))
      const decay = Math.exp(-dt / 900)
      ctx.lineWidth = 0.8
      for (let row = -1; row < rows - 1; row += 1) {
        for (let col = -1; col < cols - 1; col += 1) {
          const cx = col * COL + (row % 2 === 0 ? 0 : COL / 2) + offsetX
          const cy = row * ROW + offsetY
          const idx = (row + 1) * cols + (col + 1)

          // Cursor: cells near the pointer warm up, then cool slowly.
          let h = heat[idx] * decay
          const dx = cx - pointer.x
          const dy = cy - pointer.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CURSOR_RADIUS) h = Math.max(h, 1 - dist / CURSOR_RADIUS)
          heat[idx] = h

          const mask = edgeMask(cx, cy, width, height)
          const breathe = 0.5 + 0.5 * Math.sin(cx * 0.004 + cy * 0.003 + (t / 32) * Math.PI * 2)
          const base = mask * (0.07 + 0.07 * breathe) // 7–14%
          const band = Math.exp(-((cy - bandY) ** 2) / (2 * 140 * 140))
          const alpha = Math.max(base + energy * band * 0.22, h * 0.28)
          if (alpha < 0.012) continue
          ctx.beginPath()
          hexPath(ctx, cx, cy, R - 2)
          ctx.strokeStyle = `rgba(${BLUE}, ${alpha.toFixed(3)})`
          ctx.stroke()
        }
      }

      // 3. Flowing lines: eased curves gliding on 25–40 s loops, 6–10% opacity.
      const lines = [
        { base: 0.24, amp: 54, freq: 0.0016, period: 34, phase: 0, color: BLUE, alpha: 0.14 },
        { base: 0.52, amp: 70, freq: 0.0012, period: 40, phase: 2.1, color: SKY, alpha: 0.24 },
        { base: 0.8, amp: 46, freq: 0.0021, period: 28, phase: 4.2, color: BLUE, alpha: 0.12 },
      ]
      ctx.lineWidth = 1.3
      for (const line of lines) {
        // Lines also flow forward as you scroll
        const loop = (t / line.period) * Math.PI * 2 + scroll * 0.0025
        const baseY = height * line.base - ((scroll * PARALLAX * 0.6) % height)
        for (const shift of [0, height]) {
          const gradient = ctx.createLinearGradient(0, 0, width, 0)
          gradient.addColorStop(0, `rgba(${line.color}, 0)`)
          gradient.addColorStop(0.35, `rgba(${line.color}, ${line.alpha * 0.6})`)
          gradient.addColorStop(1, `rgba(${line.color}, ${line.alpha})`)
          ctx.beginPath()
          for (let x = -20; x <= width + 20; x += 18) {
            const y =
              baseY + shift + Math.sin(x * line.freq + loop + line.phase) * line.amp + Math.sin(x * line.freq * 2.1 - loop * 0.5) * line.amp * 0.2
            if (x === -20) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.strokeStyle = gradient
          ctx.stroke()
        }
      }

      // Grain is a separate page-wide overlay (.page-grain), so it also covers content.
    }

    let prev = performance.now()
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      if (now - last < FRAME_MS) return
      last = now
      const dt = now - prev
      prev = now
      draw((now - start) / 1000, dt)
    }

    // Reduced motion: one still frame, redrawn only on scroll or resize.
    const still = () => draw(0, 16)

    const startMotion = () => {
      cancelAnimationFrame(frame)
      if (reduced.matches || document.hidden) {
        still()
        return
      }
      prev = performance.now()
      frame = requestAnimationFrame(loop)
    }

    const onResize = () => {
      resize()
      if (reduced.matches) still()
    }
    const onScroll = () => {
      if (reduced.matches) still()
    }
    const onPointer = (event: PointerEvent) => {
      if (!finePointer.matches || reduced.matches) return
      pointer.x = event.clientX
      pointer.y = event.clientY
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    resize()
    startMotion()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', startMotion)
    reduced.addEventListener('change', startMotion)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', startMotion)
      reduced.removeEventListener('change', startMotion)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="block h-screen w-screen"
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
    />
  )
}
