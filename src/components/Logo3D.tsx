import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import logoSvg from '@/assets/bizaffix/Vector.svg'
import { cn } from '@/lib/cn.ts'

const TAU = Math.PI * 2
/** Idle spin per frame. */
const SPIN = 0.008
/** Float height; tied to the spin angle (two bobs per turn) so the idle loop is seamless. */
const FLOAT = 0.06
/** Scroll distance past which the logo stops and turns to face front. */
const SCROLL_STOP = 8
/** Largest side of the logo, in world units. */
const FIT = 3
/**
 * The extrude settings (depth 40, bevel 6) are tuned for an SVG about this big.
 * They scale with the real SVG, so a small viewBox (the logo is 73×84) keeps its
 * proportions instead of the bevel swallowing the strokes.
 */
const EXTRUDE_REF = 300

type Logo3DProps = {
  /** The extruded SVG. */
  src?: string
  /** Shown instead of the canvas on low-power phones, and if the SVG fails to load. */
  fallbackSrc?: string
  className?: string
  /**
   * When the logo spins. 'top': while the page is at the top (for the hero).
   * 'visible': while the logo is on screen (for a section further down).
   */
  spinWhen?: 'top' | 'visible'
  /** Called once the logo has eased to its front-facing pose and stopped. */
  onSettled?: () => void
  /** Called when the page is back at the top and the logo spins again. */
  onReset?: () => void
}

/** The running instance, so the dev helper below can reach its renderer. */
let active: { exportFrontPose: () => void } | null = null

/**
 * Dev only: turn the logo to face front, render one frame, and download it as a
 * transparent logo-front.png (use it as the fallback image).
 */
export function exportFrontPose() {
  if (!import.meta.env.DEV) return
  if (!active) {
    console.warn('[Logo3D] No 3D logo is mounted.')
    return
  }
  active.exportFrontPose()
}

function detectDevice() {
  if (typeof window === 'undefined') return { reduced: false, mobile: false, lowPower: false }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency ?? 8
  return { reduced, mobile, lowPower: mobile && cores <= 4 }
}

/**
 * The brand mark as glossy enamel: the SVG extruded with a rounded bevel, spinning
 * slowly while the page is at the top. Once the visitor scrolls it eases to face
 * front and stops rendering; back at the top it spins again.
 */
export function Logo3D({ src = logoSvg, fallbackSrc = '/logo-front.png', spinWhen = 'top', className, onSettled, onReset }: Logo3DProps) {
  const [device] = useState(detectDevice)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const [fallbackMissing, setFallbackMissing] = useState(false)
  const hostRef = useRef<HTMLDivElement>(null)

  // Callbacks through refs, so a new function from the parent never rebuilds the scene.
  const onSettledRef = useRef(onSettled)
  const onResetRef = useRef(onReset)
  useEffect(() => {
    onSettledRef.current = onSettled
    onResetRef.current = onReset
  }, [onSettled, onReset])

  const useFallback = device.lowPower || failed

  useEffect(() => {
    if (useFallback) return
    const host = hostRef.current
    if (!host) return

    let disposed = false
    let raf = 0
    // 'visible' starts still; the IntersectionObserver below starts the spin once it is on screen.
    let mode: 'spin' | 'settling' | 'settled' | 'static' = device.reduced
      ? 'static'
      : spinWhen === 'visible' || window.scrollY > SCROLL_STOP
        ? 'settled'
        : 'spin'

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, device.mobile ? 1.5 : 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    const envMap = pmrem.fromScene(room, 0.04).texture
    scene.environment = envMap

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, 6.5)

    // One soft key light from the upper left; the room environment does the rest.
    const key = new THREE.DirectionalLight(0xffffff, 1.4)
    key.position.set(-4, 5, 5)
    scene.add(key)

    const material = new THREE.MeshPhysicalMaterial({
      color: '#009BDF',
      roughness: 0.25,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    })

    // Spins and floats; the mesh inside it carries the SVG flip and fit scale.
    const pivot = new THREE.Group()
    scene.add(pivot)
    let geometry: THREE.ExtrudeGeometry | null = null

    const render = () => renderer.render(scene, camera)

    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      render()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    const frame = () => {
      raf = 0
      if (disposed) return

      if (mode === 'spin') {
        pivot.rotation.y = (pivot.rotation.y + SPIN) % TAU
        pivot.position.y = Math.sin(pivot.rotation.y * 2) * FLOAT
      } else if (mode === 'settling') {
        const target = Math.round(pivot.rotation.y / TAU) * TAU
        const diff = target - pivot.rotation.y
        pivot.rotation.y += diff * 0.08
        pivot.position.y += (0 - pivot.position.y) * 0.08
        if (Math.abs(diff) < 0.001 && Math.abs(pivot.position.y) < 0.001) {
          pivot.rotation.y = 0
          pivot.position.y = 0
          mode = 'settled'
          render()
          onSettledRef.current?.()
          return
        }
      } else {
        render()
        return
      }

      render()
      raf = requestAnimationFrame(frame)
    }
    const start = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(frame)
    }

    let loaded = false
    const setSpinning = (spin: boolean) => {
      if (mode === 'static') return
      if (!spin && mode === 'spin') {
        mode = 'settling'
        start()
      } else if (spin && mode !== 'spin') {
        mode = 'spin'
        onResetRef.current?.()
        if (loaded) start()
      }
    }

    // 'top': stop past a few pixels of scroll, spin again only right at the top.
    const onScroll = () => {
      const y = window.scrollY
      if (y > SCROLL_STOP) setSpinning(false)
      else if (y <= 0) setSpinning(true)
    }
    // 'visible': spin while on screen, settle (and stop rendering) once it leaves.
    const io =
      spinWhen === 'visible'
        ? new IntersectionObserver(([entry]) => setSpinning(entry.isIntersecting), { threshold: 0.15 })
        : null

    new SVGLoader().load(
      src,
      (data) => {
        if (disposed) return
        // createShapes keeps each path's holes, so the cut-outs read from both sides.
        const shapes = data.paths.flatMap((path) => SVGLoader.createShapes(path))
        if (shapes.length === 0) {
          setFailed(true)
          return
        }
        // Size of the flat artwork, to scale the extrude settings to it.
        const flat = new THREE.Box2()
        for (const shape of shapes) for (const point of shape.getPoints()) flat.expandByPoint(point)
        const artSize = flat.getSize(new THREE.Vector2())
        const k = Math.max(artSize.x, artSize.y, 1) / EXTRUDE_REF

        geometry = new THREE.ExtrudeGeometry(shapes, {
          depth: 40 * k,
          bevelEnabled: true,
          bevelThickness: 6 * k,
          bevelSize: 6 * k,
          bevelSegments: 8,
          curveSegments: 32,
        })
        geometry.center()
        geometry.computeBoundingBox()
        const size = new THREE.Vector3()
        geometry.boundingBox?.getSize(size)
        const fit = FIT / Math.max(size.x, size.y, 1e-6)

        const mesh = new THREE.Mesh(geometry, material)
        // SVG's y axis points down. The renderer flips face winding for the negative scale.
        mesh.scale.set(fit, -fit, fit)
        pivot.add(mesh)

        if (mode === 'settled' || mode === 'static') {
          pivot.rotation.y = 0
          pivot.position.y = 0
        }
        loaded = true
        resize()
        setReady(true)
        if (mode === 'spin') start()
      },
      undefined,
      () => {
        if (!disposed) setFailed(true)
      },
    )

    if (io) io.observe(host)
    else window.addEventListener('scroll', onScroll, { passive: true })

    const instance = {
      exportFrontPose: () => {
        const was = mode
        mode = 'settled'
        pivot.rotation.y = 0
        pivot.position.y = 0
        render()
        // Read straight after render, before the browser clears the drawing buffer.
        const url = renderer.domElement.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = url
        link.download = 'logo-front.png'
        link.click()
        if (was === 'spin') {
          mode = 'spin'
          start()
        }
      },
    }
    active = instance
    if (import.meta.env.DEV) {
      ;(window as unknown as { exportFrontPose?: typeof exportFrontPose }).exportFrontPose = exportFrontPose
    }

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
      ro.disconnect()
      if (active === instance) active = null
      geometry?.dispose()
      material.dispose()
      envMap.dispose()
      room.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [src, device, useFallback, spinWhen])

  if (useFallback) {
    if (fallbackMissing) return null
    return (
      <div aria-hidden="true" className={cn('relative', className)}>
        <img
          src={fallbackSrc}
          alt=""
          className="size-full object-contain"
          decoding="async"
          draggable={false}
          onError={() => setFallbackMissing(true)}
        />
      </div>
    )
  }

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={cn('relative transition-opacity duration-700 motion-reduce:transition-none', ready ? 'opacity-100' : 'opacity-0', className)}
    />
  )
}

export default Logo3D
