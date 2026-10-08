import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'

const services = [
  {
    title: 'Clinical Decision Support',
    body: 'Evidence-based recommendations that streamline clinical decisions.',
    tilt: 68,
  },
  {
    title: 'Telemedicine',
    body: 'Patient–provider connections with virtual care convenience.',
    tilt: 28,
  },
  {
    title: 'Health Information Exchange',
    body: 'Secure, scalable healthcare data sharing.',
    tilt: 42,
  },
  {
    title: 'Electronic Health Records',
    body: 'Records that enhance care and fit the workflow.',
    tilt: 36,
  },
  {
    title: 'Integration & Interoperability',
    body: 'Unified exchange instead of siloed data.',
    tilt: 50,
  },
  {
    title: 'Mobile & Web',
    body: 'Android, iOS, Flutter, and web experiences beside the care system.',
    tilt: 24,
  },
] as const

const introTitle = 'Healthcare technology,\nbuilt around care.'
const count = services.length

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

function pad(index: number) {
  return String(index + 1).padStart(2, '0')
}

function Sculpture({ index }: { index: number }) {
  if (index === 0) {
    return (
      <>
        <Ring size={148} />
        <Ring size={104} tilt={18} />
        <Ring size={62} gold tilt={-12} />
        <Sphere left="72%" top="28%" size={14} gold />
      </>
    )
  }
  if (index === 1) {
    return (
      <>
        <Node left="22%" top="58%" />
        <Node left="68%" top="30%" gold />
        <Node left="74%" top="70%" />
        <Connector d="M48 112 C70 96 92 78 128 62" />
        <Connector d="M48 112 C78 120 108 128 140 132" />
        <Connector d="M128 62 C150 90 148 118 140 132" gold />
      </>
    )
  }
  if (index === 2) {
    return (
      <>
        <Ribbon rotate={-18} offset={-18} />
        <Ribbon rotate={8} offset={0} gold />
        <Ribbon rotate={28} offset={18} />
      </>
    )
  }
  if (index === 3) {
    return (
      <>
        <Slab top={34} left={28} width={92} height={58} />
        <Slab top={22} left={40} width={92} height={58} gold />
        <Slab top={10} left={52} width={92} height={58} />
      </>
    )
  }
  if (index === 4) {
    return (
      <>
        <Frame size={118} rotate={18} />
        <Frame size={86} rotate={-24} gold />
        <Frame size={48} rotate={12} />
      </>
    )
  }
  return (
    <>
      <Pane width={108} height={72} top={48} left={28} />
      <Pane width={72} height={108} top={22} left={78} gold />
      <Pane width={48} height={36} top={78} left={62} />
    </>
  )
}

function Ring({ size, tilt = 0, gold = false }: { size: number; tilt?: number; gold?: boolean }) {
  return (
    <span
      className="absolute top-1/2 left-1/2 rounded-full"
      style={{
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotateZ(${tilt}deg)`,
        border: `3px solid ${gold ? '#f5c84c' : '#b9cbff'}`,
        boxShadow: gold
          ? '0 0 22px rgb(245 200 76 / 0.55), inset 0 0 14px rgb(245 200 76 / 0.35)'
          : '0 0 22px rgb(47 91 234 / 0.45), inset 0 0 18px rgb(47 91 234 / 0.28)',
        background: gold ? 'rgb(245 200 76 / 0.08)' : 'rgb(47 91 234 / 0.08)',
      }}
    />
  )
}

function Sphere({ left, top, size, gold = false }: { left: string; top: string; size: number; gold?: boolean }) {
  return (
    <span
      className="absolute rounded-full"
      style={{
        left,
        top,
        width: size,
        height: size,
        background: gold
          ? 'radial-gradient(circle at 32% 30%, #fff8e4, #f5c84c 42%, #a37816 78%)'
          : 'radial-gradient(circle at 32% 30%, #ffffff, #b9cbff 36%, #2f5bea 70%, #0d1733)',
        boxShadow: '0 8px 16px rgb(0 0 0 / 0.35)',
      }}
    />
  )
}

function Node({ left, top, gold = false }: { left: string; top: string; gold?: boolean }) {
  return <Sphere left={left} top={top} size={gold ? 22 : 18} gold={gold} />
}

function Connector({ d, gold = false }: { d: string; gold?: boolean }) {
  return (
    <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 180 180" aria-hidden="true">
      <path d={d} fill="none" stroke={gold ? '#f5c84c' : 'rgb(198 214 255 / 0.7)'} strokeWidth="1.4" />
    </svg>
  )
}

function Ribbon({ rotate, offset, gold = false }: { rotate: number; offset: number; gold?: boolean }) {
  return (
    <span
      className="absolute top-1/2 left-1/2 h-8 w-36 rounded-full"
      style={{
        transform: `translate(-50%, -50%) translateY(${offset}px) rotate(${rotate}deg) rotateX(58deg)`,
        background: gold
          ? 'linear-gradient(90deg, transparent, #fff4c8 18%, #f5c84c 50%, #8d6816 82%, transparent)'
          : 'linear-gradient(90deg, transparent, #d5e1ff 16%, #2f5bea 52%, #10182f 84%, transparent)',
        boxShadow: '0 10px 18px rgb(8 12 28 / 0.35)',
      }}
    />
  )
}

function Slab({
  top,
  left,
  width,
  height,
  gold = false,
}: {
  top: number
  left: number
  width: number
  height: number
  gold?: boolean
}) {
  return (
    <span
      className="absolute rounded-md"
      style={{
        top,
        left,
        width,
        height,
        background: gold
          ? 'linear-gradient(145deg, #fff6d4, #f5c84c 42%, #8d6818)'
          : 'linear-gradient(155deg, #f4f7ff, #9db4ff 38%, #244bc8 72%, #10182f)',
        boxShadow: '0 14px 24px rgb(5 8 20 / 0.4)',
        border: '1px solid rgb(255 255 255 / 0.28)',
      }}
    />
  )
}

function Frame({ size, rotate, gold = false }: { size: number; rotate: number; gold?: boolean }) {
  return (
    <span
      className="absolute top-1/2 left-1/2 rounded-lg"
      style={{
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) rotateX(28deg)`,
        border: gold ? '2px solid #f5c84c' : '2px solid rgb(198 214 255 / 0.85)',
        boxShadow: gold
          ? 'inset 0 0 18px rgb(245 200 76 / 0.35), 0 12px 20px rgb(0 0 0 / 0.28)'
          : 'inset 0 0 16px rgb(47 91 234 / 0.35), 0 12px 20px rgb(0 0 0 / 0.28)',
        background: 'linear-gradient(160deg, rgb(255 255 255 / 0.08), rgb(16 24 48 / 0.2))',
      }}
    />
  )
}

function Pane({
  width,
  height,
  top,
  left,
  gold = false,
}: {
  width: number
  height: number
  top: number
  left: number
  gold?: boolean
}) {
  return (
    <span
      className="absolute rounded-[1.1rem]"
      style={{
        width,
        height,
        top,
        left,
        border: gold ? '2px solid #f5c84c' : '2px solid rgb(214 226 255 / 0.8)',
        background: gold
          ? 'linear-gradient(160deg, rgb(245 200 76 / 0.28), rgb(16 20 36 / 0.15))'
          : 'linear-gradient(165deg, rgb(255 255 255 / 0.16), rgb(47 91 234 / 0.18) 55%, rgb(10 16 32 / 0.2))',
        boxShadow: '0 16px 28px rgb(0 0 0 / 0.32)',
      }}
    />
  )
}

function ReducedServices() {
  return (
    <section id="services" className="bg-[#070b14] py-24 text-[#f6f3ec] md:py-32" aria-label="Services">
      <div className="mx-auto w-full max-w-[72rem] px-(--page-gutter)">
        <p className="text-[0.78rem] tracking-[0.18em] text-[#f5c84c] uppercase">What we build</p>
        <h2 className="mt-4 max-w-[12ch] text-[clamp(2.4rem,4vw,4.2rem)] leading-[1.05] font-normal tracking-[-0.03em] text-[#f7f4ee]">
          Healthcare technology, built around care.
        </h2>
        <ol className="mt-16 max-w-[40rem] space-y-10">
          {services.map((service, index) => (
            <li key={service.title} className="border-t border-white/10 pt-6">
              <p className="text-[0.85rem] text-[#f5c84c]">{pad(index)} / {String(count).padStart(2, '0')}</p>
              <h3 className="mt-2 text-[clamp(1.6rem,2vw,2.2rem)] leading-tight font-normal text-[#f7f4ee]">{service.title}</h3>
              <p className="mt-3 max-w-[36rem] text-[1.05rem] leading-relaxed text-[#c5ccda]">{service.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function ServiceOrbit() {
  const reduced = useReducedMotion() === true
  const sectionRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const copyBoxRef = useRef<HTMLDivElement>(null)
  const outTitleRef = useRef<HTMLHeadingElement>(null)
  const outBodyRef = useRef<HTMLParagraphElement>(null)
  const inTitleRef = useRef<HTMLParagraphElement>(null)
  const inBodyRef = useRef<HTMLParagraphElement>(null)
  const outLayerRef = useRef<HTMLDivElement>(null)
  const inLayerRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLParagraphElement>(null)
  const liveRef = useRef<HTMLParagraphElement>(null)
  const orbitRef = useRef<SVGEllipseElement>(null)
  const orbitFarRef = useRef<SVGEllipseElement>(null)
  const spokeRef = useRef<SVGLineElement>(null)
  const objectRefs = useRef<Array<HTMLDivElement | null>>([])
  const spinRefs = useRef<Array<HTMLDivElement | null>>([])
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([])
  const hoverRef = useRef<number | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    const fine = window.matchMedia('(pointer: fine)').matches
    let frame = 0
    let last = performance.now()
    let orbit = 0
    let shownProgress = 0
    let textMode = -2
    const shown = services.map((_, index) => (index / count) * Math.PI * 2)
    let announced = ''

    const onPointer = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1
      pointerRef.current.y = (event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1
    }
    const onLeave = () => {
      pointerRef.current.x = 0
      pointerRef.current.y = 0
    }

    if (fine) {
      window.addEventListener('pointermove', onPointer, { passive: true })
      window.addEventListener('pointerleave', onLeave)
    }

    const draw = (now: number) => {
      const width = window.innerWidth
      const height = window.innerHeight
      const narrow = width < 960
      const dt = Math.min(48, now - last)
      last = now
      const rect = section.getBoundingClientRect()
      const scrollable = Math.max(1, rect.height - height)
      const progress = clamp(-rect.top / scrollable)

      shownProgress = lerp(shownProgress, progress, 1 - Math.exp(-dt / 150))
      const storyStart = 0.14
      const storyEnd = 0.86
      const exit = smoothstep(0.9, 1, shownProgress)
      const dock = smoothstep(storyStart, 0.3, shownProgress) * (1 - exit)
      const speed = 0.000055 * (1 + dock * 0.25)
      orbit += dt * speed

      const storyT = clamp((shownProgress - storyStart) / (storyEnd - storyStart))
      const travel = storyT * (count - 0.001)
      const active = Math.floor(travel)
      const phase = travel - active
      const leave = smoothstep(0, 0.08, phase)
      const arrive = smoothstep(0.1, 0.22, phase)

      const introRx = narrow ? width * 0.4 : Math.min(width * 0.36, 560)
      const introRy = narrow ? height * 0.3 : Math.min(height * 0.34, 300)
      const sideRx = narrow ? width * 0.36 : Math.min(width * 0.16, 240)
      const sideRy = narrow ? height * 0.16 : Math.min(height * 0.3, 250)
      const rx = lerp(introRx, sideRx, dock) * lerp(1, 1.2, exit)
      const ry = lerp(introRy, sideRy, dock) * lerp(1, 1.2, exit)
      const anchorX = lerp(0, narrow ? 0 : width * 0.26, dock)
      const anchorY = lerp(0, narrow ? height * 0.24 : 0, dock)
      const centerX = width / 2 + anchorX
      const centerY = height / 2 + anchorY
      const focalX = narrow ? 0 : width * 0.22
      const focalY = narrow ? height * 0.22 : 0

      const orbitNode = orbitRef.current
      const farNode = orbitFarRef.current
      if (orbitNode && farNode) {
        const box = `0 0 ${width} ${height}`
        orbitNode.ownerSVGElement?.setAttribute('viewBox', box)
        for (const node of [orbitNode, farNode]) {
          node.setAttribute('cx', centerX.toFixed(1))
          node.setAttribute('cy', centerY.toFixed(1))
        }
        orbitNode.setAttribute('rx', rx.toFixed(1))
        orbitNode.setAttribute('ry', ry.toFixed(1))
        farNode.setAttribute('rx', (rx * 1.08).toFixed(1))
        farNode.setAttribute('ry', (ry * 0.86).toFixed(1))
        orbitNode.setAttribute('stroke', '#f4f1ea')
        orbitNode.setAttribute('stroke-opacity', (dock > 0.55 ? 0.14 : 0.08).toFixed(3))
        orbitNode.setAttribute('opacity', (1 - exit).toFixed(3))
        farNode.setAttribute('stroke', '#f4f1ea')
        farNode.setAttribute('stroke-opacity', '0.035')
        farNode.setAttribute('opacity', (1 - exit).toFixed(3))
      }

      let spokeX = centerX
      let spokeY = centerY
      let spokeOpacity = 0

      services.forEach((service, index) => {
        const outer = objectRefs.current[index]
        const spin = spinRefs.current[index]
        if (!outer || !spin) return
        const target = (index / count) * Math.PI * 2 - Math.PI / 2 + orbit
        const hovered = hoverRef.current === index
        const follow = 1 - Math.exp(-dt / (hovered ? 520 : 220))
        shown[index] = lerp(shown[index], target, follow)
        const depth = (Math.sin(shown[index]) + 1) / 2
        const slot = index - travel
        const presence = dock * (1 - Math.min(1, Math.abs(slot) * 1.05)) ** 1.6
        let x = anchorX + Math.cos(shown[index]) * rx
        let y = anchorY + Math.sin(shown[index]) * ry
        x = lerp(x, focalX, presence * 0.62)
        y = lerp(y, focalY, presence * 0.38)
        if (fine) {
          x += pointerRef.current.x * (6 + depth * 16)
          y += pointerRef.current.y * (4 + depth * 10)
        }
        const scale = (narrow ? 0.5 : 0.72) * lerp(0.78, 1, depth) * (1 + presence * 0.58) * (hovered ? 1.06 : 1) * lerp(1, 0.75, exit)
        const opacity = lerp(0.42, 0.88, depth) * lerp(1, 0.55 + presence * 0.7, dock) * (1 - exit * 0.92)
        outer.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`
        outer.style.opacity = opacity.toFixed(3)
        outer.style.zIndex = String(10 + Math.round(depth * 20 + presence * 40))
        outer.style.filter = `brightness(${(0.72 + depth * 0.28 + presence * 0.34 + (hovered ? 0.12 : 0)).toFixed(3)})`
        spin.style.transform = `rotateX(${(service.tilt - presence * 12).toFixed(2)}deg) rotateY(${((shown[index] * 18) + presence * 10).toFixed(2)}deg)`
        if (presence > 0.45) {
          spokeX = width / 2 + x
          spokeY = height / 2 + y
          spokeOpacity = presence * 0.22 * (1 - exit)
        }
      })

      const spoke = spokeRef.current
      if (spoke) {
        spoke.setAttribute('x1', centerX.toFixed(1))
        spoke.setAttribute('y1', centerY.toFixed(1))
        spoke.setAttribute('x2', spokeX.toFixed(1))
        spoke.setAttribute('y2', spokeY.toFixed(1))
        spoke.setAttribute('opacity', spokeOpacity.toFixed(3))
      }

      const inStory = shownProgress >= storyStart
      const mode = inStory ? active : -1
      const outLayer = outLayerRef.current
      const inLayer = inLayerRef.current
      if (outLayer && inLayer && outTitleRef.current && outBodyRef.current && inTitleRef.current && inBodyRef.current) {
        if (textMode !== mode) {
          textMode = mode
          const outgoing = mode <= 0 ? null : services[mode - 1]
          const incoming = mode < 0 ? services[0] : services[mode]
          outTitleRef.current.textContent = outgoing ? outgoing.title : introTitle
          outBodyRef.current.textContent = outgoing ? outgoing.body : ''
          inTitleRef.current.textContent = incoming.title
          inBodyRef.current.textContent = incoming.body
        }
        const endFade = 1 - smoothstep(0.9, 0.98, shownProgress)
        const outOpacity = (mode < 0 ? 1 : 1 - leave) * endFade
        const inOpacity = (mode < 0 ? 0 : arrive) * endFade
        outLayer.style.opacity = outOpacity.toFixed(3)
        outLayer.style.transform = `translate3d(0, ${(-20 * (mode < 0 ? 0 : leave)).toFixed(2)}px, 0)`
        inLayer.style.opacity = inOpacity.toFixed(3)
        inLayer.style.transform = `translate3d(0, ${(18 * (1 - (mode < 0 ? 0 : arrive))).toFixed(2)}px, 0)`
        outLayer.style.visibility = outOpacity < 0.02 ? 'hidden' : 'visible'
        inLayer.style.visibility = inOpacity < 0.02 ? 'hidden' : 'visible'
      }

      if (countRef.current) {
        const countOpacity = inStory ? arrive * (1 - smoothstep(0.9, 0.98, shownProgress)) : 0
        countRef.current.style.opacity = countOpacity.toFixed(3)
        countRef.current.textContent = `${pad(active)} / ${String(count).padStart(2, '0')}`
      }
      if (copyRef.current) copyRef.current.style.opacity = (1 - smoothstep(0.94, 1, shownProgress)).toFixed(3)
      if (copyBoxRef.current) {
        const slideX = narrow ? 0 : -Math.min(width * 0.16, 240) * dock
        const slideY = narrow ? -height * 0.2 * dock : 0
        copyBoxRef.current.style.transform = `translate3d(${slideX.toFixed(1)}px, ${slideY.toFixed(1)}px, 0)`
        copyBoxRef.current.style.textAlign = dock > 0.55 && !narrow ? 'left' : 'center'
      }

      const liveText = inStory && arrive > 0.6 ? services[active].title : 'Healthcare technology, built around care.'
      if (liveRef.current && announced !== liveText) {
        announced = liveText
        liveRef.current.textContent = liveText
      }

      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      if (fine) {
        window.removeEventListener('pointermove', onPointer)
        window.removeEventListener('pointerleave', onLeave)
      }
    }
  }, [reduced])

  if (reduced) return <ReducedServices />

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative h-[680vh] bg-[#070b14] max-md:h-[520vh]"
      aria-label="Services"
    >
      <div className="sticky top-0 h-svh overflow-hidden text-[#f6f3ec]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 48% 42% at 50% 46%, rgb(47 91 234 / 0.2), transparent 62%), radial-gradient(ellipse 32% 28% at 72% 62%, rgb(245 200 76 / 0.08), transparent 60%), #070b14',
          }}
        />
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <ellipse ref={orbitFarRef} fill="none" stroke="#f4f1ea" strokeWidth="1" strokeOpacity="0.04" />
          <ellipse ref={orbitRef} fill="none" stroke="#f4f1ea" strokeWidth="1" strokeOpacity="0.08" />
          <line ref={spokeRef} stroke="#f5c84c" strokeWidth="1" opacity="0" />
        </svg>

        <div className="absolute top-1/2 left-1/2 h-svh w-screen -translate-x-1/2 -translate-y-1/2 [perspective:1400px]">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(node) => {
                objectRefs.current[index] = node
              }}
              className="absolute top-1/2 left-1/2 size-40 opacity-0 will-change-transform md:size-48"
              onPointerEnter={() => {
                hoverRef.current = index
                const label = labelRefs.current[index]
                if (label) label.style.opacity = '1'
              }}
              onPointerLeave={() => {
                if (hoverRef.current === index) hoverRef.current = null
                const label = labelRefs.current[index]
                if (label) label.style.opacity = '0'
              }}
            >
              <span className="absolute top-[78%] left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-black/50 blur-md" />
              <div
                ref={(node) => {
                  spinRefs.current[index] = node
                }}
                className="relative size-full [transform-style:preserve-3d]"
              >
                <Sculpture index={index} />
              </div>
              <span
                ref={(node) => {
                  labelRefs.current[index] = node
                }}
                className="pointer-events-none absolute top-full left-1/2 mt-3 -translate-x-1/2 text-[0.78rem] whitespace-nowrap text-[#f6f3ec] opacity-0"
              >
                {service.title}
              </span>
            </div>
          ))}
        </div>

        <div ref={copyRef} className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
          <div ref={copyBoxRef} className="w-[min(34rem,88vw)] text-center">
            <p className="text-[0.78rem] tracking-[0.2em] text-[#f5c84c] uppercase">What we build</p>
            <div className="relative mt-5 min-h-[13rem] md:min-h-[15rem]">
              <div ref={outLayerRef} className="absolute inset-x-0 top-0">
                <h2
                  ref={outTitleRef}
                  className="text-[clamp(2.2rem,4vw,3.8rem)] leading-[1.05] font-normal tracking-[-0.03em] whitespace-pre-line text-[#f7f4ee]"
                >
                  {introTitle}
                </h2>
                <p ref={outBodyRef} className="mt-4 max-w-[32rem] text-[1.05rem] leading-relaxed text-[#d5dbe8]" />
              </div>
              <div ref={inLayerRef} className="absolute inset-x-0 top-0 opacity-0">
                <p
                  ref={inTitleRef}
                  className="text-[clamp(2.1rem,3.6vw,3.6rem)] leading-[1.05] font-normal tracking-[-0.03em] text-[#f7f4ee]"
                />
                <p ref={inBodyRef} className="mt-4 max-w-[32rem] text-[1.05rem] leading-relaxed text-[#d5dbe8]" />
              </div>
            </div>
            <p ref={countRef} className="mt-6 text-[0.95rem] tracking-[0.14em] text-[#f5c84c] opacity-0">
              01 / 06
            </p>
          </div>
        </div>
        <p ref={liveRef} className="sr-only" aria-live="polite">
          Healthcare technology, built around care.
        </p>
      </div>
    </section>
  )
}
