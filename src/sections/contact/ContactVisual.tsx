import { useEffect, useRef, type RefObject } from 'react'
import { signalColor } from '@/content/contact.ts'
import { contactLive, tensionFor } from '@/sections/contact/contactLive.ts'
import {
  blendPaths,
  clearTitles,
  closePoints,
  easeOut,
  fieldTick,
  formPoints,
  heroExtent,
  heroPoints,
  lerp,
  offsetPath,
  optionGeometry,
  sceneWeight,
  smoothPath,
  stayInMargin,
  type Pt,
} from '@/sections/contact/filament.ts'

const samples = 32

function nearestPoint(points: Pt[], y: number) {
  let best = points[0]
  let score = Number.POSITIVE_INFINITY
  for (const point of points) {
    const next = Math.abs(point.y - y)
    if (next < score) {
      score = next
      best = point
    }
  }
  return best
}

function hide(node: SVGElement) {
  node.setAttribute('opacity', '0')
}

export function StaticMeridian() {
  return (
    <svg viewBox="0 0 640 88" className="mt-6 h-16 w-[min(100%,34rem)]" fill="none" aria-hidden="true">
      <path
        d="M8 62C110 16 220 84 330 46C440 8 530 78 632 34"
        stroke={signalColor}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="8" cy="62" r="3.2" fill={signalColor} />
    </svg>
  )
}

export function ContactVisual({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const mainRef = useRef<SVGPathElement>(null)
  const echoRef = useRef<SVGPathElement>(null)
  const tickRef = useRef<SVGPathElement>(null)
  const originRef = useRef<SVGCircleElement>(null)
  const emailRef = useRef<SVGCircleElement>(null)
  const arriveRef = useRef<SVGCircleElement>(null)
  const dockRef = useRef<SVGCircleElement>(null)
  const spurRefs = useRef<Array<SVGPathElement | null>>([])

  useEffect(() => {
    const svg = svgRef.current
    const main = mainRef.current
    const echo = echoRef.current
    const tick = tickRef.current
    const origin = originRef.current
    const emailNode = emailRef.current
    const arrive = arriveRef.current
    const dock = dockRef.current
    const root = rootRef.current
    if (!svg || !main || !echo || !tick || !origin || !emailNode || !arrive || !dock || !root) return

    const fine = window.matchMedia('(pointer: fine)').matches
    contactLive.finePointer = fine

    let alive = true
    let frame = 0
    let points: Pt[] = []
    let pointerX = 0.5
    let pointerY = 0.5
    let tension = 0.88
    let awake = 0
    let emailOpacity = 0
    let arrived = 0
    let complete = 0
    let echoOpacity = 0
    const introStarted = performance.now()
    let introTop: number | null = null

    const onPointer = (event: PointerEvent) => {
      contactLive.pointerX = event.clientX / Math.max(window.innerWidth, 1)
      contactLive.pointerY = event.clientY / Math.max(window.innerHeight, 1)
    }
    const onLeave = (event: PointerEvent) => {
      if (event.relatedTarget) return
      contactLive.pointerX = 0.5
      contactLive.pointerY = 0.5
    }

    if (fine) {
      window.addEventListener('pointermove', onPointer, { passive: true })
      window.addEventListener('pointerout', onLeave)
    }

    const draw = (now: number) => {
      if (!alive) return
      const width = window.innerWidth
      const height = window.innerHeight
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      svg.style.width = `${width}px`
      svg.style.height = `${height}px`

      const heroScene = root.querySelector<HTMLElement>('[data-scene="hero"]')?.getBoundingClientRect()
      const heroTitle = root.querySelector<HTMLElement>('[data-filament="hero"]')?.getBoundingClientRect()
      const optionScene = root.querySelector<HTMLElement>('[data-scene="options"]')?.getBoundingClientRect()
      const optionList = root.querySelector<HTMLElement>('[data-filament="options"]')?.getBoundingClientRect()
      const optionRows = [...root.querySelectorAll<HTMLElement>('[data-filament="option"]')].map((node) =>
        node.getBoundingClientRect(),
      )
      const formScene = root.querySelector<HTMLElement>('[data-scene="form"]')?.getBoundingClientRect()
      const formAnchor = root.querySelector<HTMLElement>('[data-filament="form"]')?.getBoundingClientRect()
      const closeScene = root.querySelector<HTMLElement>('[data-scene="close"]')?.getBoundingClientRect()
      const closeTitle = root.querySelector<HTMLElement>('[data-filament="close"]')?.getBoundingClientRect()

      const heroW = sceneWeight(heroScene, heroTitle, height)
      const optionW = sceneWeight(optionScene, optionList, height)
      const formW = sceneWeight(formScene, formAnchor, height)
      const closeW = sceneWeight(closeScene, closeTitle, height)

      const layers: Array<{ points: Pt[]; weight: number }> = []
      if (heroTitle && heroW > 0) {
        if (introTop === null) introTop = heroTitle.top
        const extent = heroExtent(heroTitle, height) * (1 - Math.min(0.72, optionW) * 0.85)
        layers.push({
          points: heroPoints(heroTitle, width, extent),
          weight: heroW,
        })
      }

      const options = optionGeometry(optionRows, width)
      if (options.trunk.length > 1 && optionW > 0) layers.push({ points: options.trunk, weight: optionW })

      const activeName = contactLive.activeField
      const activeField = activeName
        ? root.querySelector<HTMLElement>(`[data-filament-field="${CSS.escape(activeName)}"]`)?.getBoundingClientRect()
        : undefined

      if (formAnchor && formW > 0) {
        layers.push({
          points: formPoints(formAnchor, activeField ?? null, width, height),
          weight: formW,
        })
      }
      if (closeTitle && closeW > 0) layers.push({ points: closePoints(closeTitle, width), weight: closeW })

      const target = blendPaths(layers, samples)
      if (target.length === 0) {
        hide(main)
        hide(echo)
        hide(tick)
        hide(origin)
        hide(emailNode)
        hide(arrive)
        hide(dock)
        for (const spur of spurRefs.current) {
          if (spur) hide(spur)
        }
        frame = requestAnimationFrame(draw)
        return
      }

      pointerX = lerp(pointerX, contactLive.pointerX, 0.08)
      pointerY = lerp(pointerY, contactLive.pointerY, 0.08)
      const warp = fine ? 1 - Math.max(formW, optionW * 0.85) : 0
      const warped = target.map((point, index) => {
        const bell = Math.sin((index / (samples - 1)) * Math.PI)
        return {
          x: point.x + (pointerX - 0.5) * 34 * bell * warp,
          y: point.y + (pointerY - 0.5) * 18 * bell * warp,
        }
      })

      const titles = [...root.querySelectorAll<HTMLElement>('[data-filament="hero"], [data-filament="close"]')].map(
        (node) => node.getBoundingClientRect(),
      )
      const writing = [formAnchor, optionList].filter((rect): rect is DOMRect => Boolean(rect))
      const cleared = stayInMargin(clearTitles(warped, titles), writing, width)

      if (points.length !== cleared.length) points = cleared
      else {
        points = points.map((point, index) => ({
          x: lerp(point.x, cleared[index].x, 0.16),
          y: lerp(point.y, cleared[index].y, 0.16),
        }))
      }

      tension = lerp(tension, tensionFor(contactLive.build), 0.08)
      main.setAttribute('d', smoothPath(points, tension))
      main.setAttribute('opacity', '1')
      awake = lerp(awake, contactLive.awake ? 1 : 0, 0.12)
      main.setAttribute('stroke-width', (1.35 + awake * 0.5).toFixed(2))

      const scrolled = introTop !== null && heroTitle ? Math.abs(heroTitle.top - introTop) > 28 : false
      const intro = scrolled ? 1 : easeOut((now - introStarted) / 1300)
      if (intro < 0.995) {
        const length = main.getTotalLength()
        main.setAttribute('stroke-dasharray', `${length}`)
        main.setAttribute('stroke-dashoffset', `${(length * (1 - intro)).toFixed(2)}`)
      } else {
        main.removeAttribute('stroke-dasharray')
        main.removeAttribute('stroke-dashoffset')
      }

      const healthcare = contactLive.build === 'healthcare'
      const echoAmount = healthcare ? Math.max(0.28, contactLive.messageRatio) : contactLive.messageRatio
      const echoTarget = formW * (healthcare ? Math.max(0.42, contactLive.messageRatio * 0.7) : echoAmount * 0.72)
      echoOpacity = lerp(echoOpacity, echoTarget, 0.1)
      if (echoOpacity > 0.025) {
        const echoPoints = offsetPath(points, healthcare ? 14 : 8)
        echo.setAttribute('d', smoothPath(echoPoints, tension))
        echo.setAttribute('opacity', echoOpacity.toFixed(3))
        echo.setAttribute('stroke-width', contactLive.build === 'dashboard' ? '1' : '1.15')
        const echoLength = echo.getTotalLength()
        echo.setAttribute('stroke-dasharray', `${echoLength}`)
        echo.setAttribute('stroke-dashoffset', `${(echoLength * (1 - echoAmount)).toFixed(2)}`)
      } else {
        hide(echo)
      }

      origin.setAttribute('cx', points[0].x.toFixed(2))
      origin.setAttribute('cy', points[0].y.toFixed(2))
      origin.setAttribute('opacity', intro > 0.02 ? '1' : '0')

      spurRefs.current.forEach((spur, index) => {
        if (!spur) return
        const spurPoints = options.spurs[index]
        if (!spurPoints || optionW < 0.05) {
          hide(spur)
          return
        }
        const hot = contactLive.hoverOption === index || contactLive.chosenOption === index
        spur.setAttribute('d', smoothPath(spurPoints, 1))
        spur.setAttribute('stroke-width', hot ? '1.7' : '1.15')
        spur.setAttribute('opacity', (optionW * (hot ? 1 : 0.34)).toFixed(3))
      })

      const dockIndex = contactLive.hoverOption ?? contactLive.chosenOption
      const dockSpur = dockIndex === null ? undefined : options.spurs[dockIndex]
      if (dockSpur && optionW > 0.05) {
        const end = dockSpur[dockSpur.length - 1]
        dock.setAttribute('cx', end.x.toFixed(2))
        dock.setAttribute('cy', end.y.toFixed(2))
        dock.setAttribute('opacity', Math.min(1, optionW + 0.1).toFixed(3))
      } else {
        hide(dock)
      }

      if (activeField && formW > 0.12 && activeField.bottom > 0 && activeField.top < height) {
        const from = nearestPoint(points, activeField.top + activeField.height / 2)
        const tickPoints = fieldTick(activeField, from, width)
        const span = Math.hypot(tickPoints[1].x - tickPoints[0].x, tickPoints[1].y - tickPoints[0].y)
        if (span < 160) {
          tick.setAttribute('d', smoothPath(tickPoints, 1))
          tick.setAttribute('stroke-width', '1.5')
          tick.setAttribute('opacity', Math.min(1, formW).toFixed(3))
        } else {
          hide(tick)
        }
      } else {
        hide(tick)
      }

      const emailField = root.querySelector<HTMLElement>('[data-filament-field="email"]')?.getBoundingClientRect()
      const emailVisible = emailField ? emailField.bottom > 0 && emailField.top < height : false
      emailOpacity = lerp(emailOpacity, contactLive.emailReady && emailVisible && formW > 0.15 ? 1 : 0, 0.12)
      if (emailField && emailOpacity > 0.02) {
        const fromRight = emailField.left < 64
        emailNode.setAttribute('cx', (fromRight ? width - 14 : emailField.left - 18).toFixed(2))
        emailNode.setAttribute('cy', (emailField.top + emailField.height / 2).toFixed(2))
        emailNode.setAttribute('opacity', emailOpacity.toFixed(3))
      } else {
        hide(emailNode)
      }

      arrived = lerp(arrived, contactLive.arrived ? 1 : 0, 0.1)
      complete = lerp(complete, contactLive.complete ? 1 : 0, 0.08)
      const showEnd = Math.max(arrived, complete)
      const end = points[points.length - 1]
      const hitsControl = [...root.querySelectorAll('button, a')].some((node) => {
        const rect = node.getBoundingClientRect()
        return end.x > rect.left - 14 && end.x < rect.right + 14 && end.y > rect.top - 14 && end.y < rect.bottom + 14
      })
      if (showEnd > 0.03 && !hitsControl) {
        arrive.setAttribute('cx', end.x.toFixed(2))
        arrive.setAttribute('cy', end.y.toFixed(2))
        arrive.setAttribute('opacity', showEnd.toFixed(3))
        arrive.setAttribute('r', complete > 0.45 ? '8' : '5.5')
        arrive.setAttribute('fill', complete > 0.6 ? signalColor : 'none')
      } else {
        hide(arrive)
      }

      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      if (fine) {
        window.removeEventListener('pointermove', onPointer)
        window.removeEventListener('pointerout', onLeave)
      }
    }
  }, [rootRef])

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none fixed top-0 left-0 z-10 overflow-hidden"
      fill="none"
      aria-hidden="true"
    >
      <path ref={echoRef} stroke={signalColor} strokeLinecap="round" opacity="0" />
      <path ref={mainRef} stroke={signalColor} strokeLinecap="round" strokeLinejoin="round" opacity="0" />
      {Array.from({ length: 4 }, (_, index) => (
        <path
          key={index}
          ref={(node) => {
            spurRefs.current[index] = node
          }}
          stroke={signalColor}
          strokeLinecap="round"
          opacity="0"
        />
      ))}
      <path ref={tickRef} stroke={signalColor} strokeLinecap="round" opacity="0" />
      <circle ref={originRef} r="3.25" fill={signalColor} opacity="0" />
      <circle ref={dockRef} r="3.25" fill={signalColor} opacity="0" />
      <circle ref={emailRef} r="3" fill={signalColor} opacity="0" />
      <circle ref={arriveRef} r="5.5" fill="none" stroke={signalColor} strokeWidth="1.25" opacity="0" />
    </svg>
  )
}
