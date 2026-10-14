import { useEffect, useRef, type RefObject } from 'react'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  GLSL1,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  Group,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'

export type HelixPointer = {
  x: number
  y: number
}

type HelixStrandProps = {
  pointer: RefObject<HelixPointer>
  scroll: RefObject<number>
  reduced: boolean
  active: boolean
  onReady?: () => void
}

function createRenderer() {
  const attempts = [
    {
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance' as const,
      premultipliedAlpha: false,
    },
    {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    },
  ]

  for (const options of attempts) {
    try {
      const renderer = new WebGLRenderer(options)
      if (renderer.getContext()) return renderer
      renderer.dispose()
    } catch {
      // The next attempt drops the high-performance GPU request.
    }
  }

  return null
}

function canvasHasInk(renderer: WebGLRenderer, width: number, height: number) {
  const gl = renderer.getContext()
  const pixel = new Uint8Array(4)
  const xs = [0.32, 0.5, 0.68].map((ratio) => Math.floor(width * ratio))
  const ys = [0.28, 0.46, 0.64, 0.8].map((ratio) => Math.floor(height * ratio))

  for (const x of xs) {
    for (const y of ys) {
      gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
      if (pixel[3] > 12) return true
    }
  }

  return false
}

const deep = new Color('#1a2f8a')
const brand = new Color('#2f5bea')
const mist = new Color('#c9d7f8')
const gold = new Color('#f5c84c')
const goldDeep = new Color('#e0b030')

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aAmp;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vAmp;

  void main() {
    vec3 p = position;
    float n = sin(p.y * 2.6 + aAmp * 9.0 + uTime * 0.32);
    float m = cos(p.x * 1.8 - p.z * 2.1 + uTime * 0.24);
    p.x += n * aAmp * 0.05;
    p.y += m * aAmp * 0.02;
    p.z += (n - m) * aAmp * 0.035;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(aSize, 1.5, 16.0) * uPixelRatio;
    vColor = aColor;
    vAlpha = aAlpha;
    vAmp = aAmp;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vAmp;

  void main() {
    vec2 p = gl_PointCoord - vec2(0.5);
    float d = dot(p, p);
    if (d > 0.25) discard;
    float tight = smoothstep(0.22, 0.0, d);
    float wash = exp(-d * 2.15);
    float alpha = mix(tight, wash, clamp(vAmp, 0.0, 1.0)) * vAlpha;
    if (alpha < 0.015) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`

function buildRope() {
  const capacity = 48000
  const positions = new Float32Array(capacity * 3)
  const colors = new Float32Array(capacity * 3)
  const sizes = new Float32Array(capacity)
  const alphas = new Float32Array(capacity)
  const amps = new Float32Array(capacity)
  let pIdx = 0

  const steps = 420
  const height = 13.2
  const radius = 1.85
  const turns = Math.PI * 4.6

  const place = (
    x: number,
    y: number,
    z: number,
    color: Color,
    size: number,
    alpha: number,
    amp: number,
  ) => {
    if (pIdx >= capacity) return
    positions[pIdx * 3] = x
    positions[pIdx * 3 + 1] = y
    positions[pIdx * 3 + 2] = z
    colors[pIdx * 3] = color.r
    colors[pIdx * 3 + 1] = color.g
    colors[pIdx * 3 + 2] = color.b
    sizes[pIdx] = size
    alphas[pIdx] = alpha
    amps[pIdx] = amp
    pIdx++
  }

  const spine = (u: number, phase: number) => {
    const y = (u - 0.5) * height
    const t = u * turns + phase
    const breathe = Math.sin(u * 11.0 + phase * 2.0) * 0.07
    const r = radius + breathe
    return {
      x: Math.cos(t) * r,
      y: y + Math.sin(u * 7.0) * 0.04,
      z: Math.sin(t) * r,
      t,
    }
  }

  for (let i = 0; i < steps; i++) {
    const u = i / (steps - 1)
    for (const phase of [0, Math.PI]) {
      const s = spine(u, phase)
      const bx = -Math.sin(s.t)
      const bz = Math.cos(s.t)
      const rx = Math.cos(s.t)
      const rz = Math.sin(s.t)

      for (let j = 0; j < 28; j++) {
        const disk = Math.sqrt(Math.random()) * 0.32
        const ang = Math.random() * Math.PI * 2
        const along = Math.cos(ang) * disk
        const out = Math.sin(ang) * disk * 0.7
        const edge = disk / 0.32
        const goldFleck = Math.random() > 0.94
        const color = goldFleck ? gold : edge > 0.82 ? mist : edge > 0.4 ? brand : deep
        place(
          s.x + bx * along + rx * out,
          s.y + (Math.random() - 0.5) * 0.1,
          s.z + bz * along + rz * out,
          color,
          5.8 + edge * 3.2,
          0.5 + (1 - edge) * 0.32,
          0.34 + edge * 0.22,
        )
      }

      if (i % 8 === 0) {
        let ang = Math.random() * Math.PI * 2
        const curl = (Math.random() - 0.5) * 0.35
        let px = s.x
        let py = s.y
        let pz = s.z
        const length = 4 + Math.floor(Math.random() * 3)
        for (let k = 0; k < length; k++) {
          ang += curl
          px += Math.cos(ang) * 0.055
          py += Math.sin(k + phase) * 0.012
          pz += Math.sin(ang) * 0.055
          const fade = 1 - k / length
          place(px, py, pz, fade > 0.45 ? brand : mist, 6 + fade * 3, 0.08 + fade * 0.14, 0.55)
        }
      }

      if (i % 22 === 0) {
        for (let k = 0; k < 8; k++) {
          const disk = Math.random() * 0.12
          const ang = Math.random() * Math.PI * 2
          place(
            s.x + bx * Math.cos(ang) * disk,
            s.y + (Math.random() - 0.5) * 0.08,
            s.z + bz * Math.cos(ang) * disk,
            gold,
            5 + Math.random() * 2,
            0.9,
            0.2,
          )
        }
      }
    }

    if (i % 14 === 0) {
      const a = spine(u, 0)
      const b = spine(u, Math.PI)
      for (let row = -1; row <= 1; row++) {
        for (let step = 0; step < 20; step++) {
          const ratio = step / 19
          place(
            a.x + (b.x - a.x) * ratio,
            a.y + row * 0.055,
            a.z + (b.z - a.z) * ratio,
            ratio > 0.18 && ratio < 0.82 ? gold : goldDeep,
            4.6,
            0.84,
            0.18,
          )
        }
      }
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions.slice(0, pIdx * 3), 3))
  geometry.setAttribute('aColor', new BufferAttribute(colors.slice(0, pIdx * 3), 3))
  geometry.setAttribute('aSize', new BufferAttribute(sizes.slice(0, pIdx), 1))
  geometry.setAttribute('aAlpha', new BufferAttribute(alphas.slice(0, pIdx), 1))
  geometry.setAttribute('aAmp', new BufferAttribute(amps.slice(0, pIdx), 1))
  return geometry
}

export function HelixStrand({ pointer, scroll, reduced, active, onReady }: HelixStrandProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  const onReadyRef = useRef(onReady)
  activeRef.current = active
  onReadyRef.current = onReady

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const scene = new Scene()
    const camera = new PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(0.15, 0.1, 15.5)

    const renderer = createRenderer()
    if (!renderer) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.pointerEvents = 'none'
    container.appendChild(renderer.domElement)

    const geometry = buildRope()
    const material = new ShaderMaterial({
      glslVersion: GLSL1,
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
      toneMapped: false,
      vertexShader,
      fragmentShader,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uTime: { value: 0 },
      },
    })

    const points = new Points(geometry, material)
    const group = new Group()
    group.add(points)
    group.rotation.z = -0.12
    group.position.x = -0.15
    scene.add(group)

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w < 2 || h < 2) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)

    let frame = 0
    let running = true
    let drew = false
    const started = performance.now()

    const animate = () => {
      if (!running) return
      frame = requestAnimationFrame(animate)
      if (!activeRef.current && material.uniforms.uTime.value > 0) return
      const elapsed = reduced ? 0 : (performance.now() - started) / 1000
      const progress = scroll.current ?? 0
      material.uniforms.uTime.value = elapsed
      group.rotation.y = elapsed * 0.08 + progress * Math.PI
      group.rotation.x = 0.18 - (pointer.current?.y ?? 0) * 0.05
      group.position.y = Math.sin(elapsed * 0.45) * 0.12 - progress * 1.4
      try {
        renderer.render(scene, camera)
        if (!drew && canvasHasInk(renderer, container.clientWidth, container.clientHeight)) {
          drew = true
          onReadyRef.current?.()
        }
      } catch {
        running = false
      }
    }
    animate()

    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [pointer, reduced, scroll])

  return <div ref={mountRef} className="h-full w-full" />
}
