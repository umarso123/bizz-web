import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { servicesPage } from '@/content/services.ts'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { useMediaQuery } from '@/sections/home/homeJourney.ts'

const services = servicesPage.services
const count = services.length

const chips = {
  android: ['Mobile solutions', 'Business needs'],
  ios: ['Your vision', 'Mobile experiences'],
  flutter: ['Future of mobile', 'Cutting-edge solutions'],
  web: ['Websites', 'Drive results'],
  fullstack: ['Front and back-end', 'Web presence'],
  cloud: ['Scalable cloud', 'Cloud solutions'],
} as const

const arcRadius = 560
const arcStep = 0.34

function travel(portion: number) {
  if (typeof window === 'undefined') return portion * 900
  return window.innerHeight * portion
}

function ServiceMark({ kind }: { kind: (typeof services)[number]['id'] }) {
  const uid = useId().replace(/:/g, '')
  const soft = `${uid}-soft`

  return (
    <svg viewBox="0 0 640 640" className="h-full w-full" aria-hidden="true">
      <defs>
        <filter id={soft} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="22" stdDeviation="16" floodColor="#0d121f" floodOpacity="0.16" />
        </filter>
      </defs>
      <g filter={`url(#${soft})`} fill="#E8E7E4" stroke="#C9C7C2" strokeWidth="2.5">
        {kind === 'android' && <Bloom />}
        {kind === 'ios' && <Discs />}
        {kind === 'flutter' && <Burst />}
        {kind === 'web' && <Sheets />}
        {kind === 'fullstack' && <Twist />}
        {kind === 'cloud' && <Cluster />}
      </g>
    </svg>
  )
}

function Bloom() {
  return (
    <>
      {Array.from({ length: 10 }, (_, index) => (
        <ellipse
          key={index}
          cx="330"
          cy="250"
          rx="72"
          ry="156"
          transform={`rotate(${index * 36} 320 320)`}
        />
      ))}
      <circle cx="320" cy="320" r="34" />
    </>
  )
}

function Discs() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((index) => (
        <ellipse key={index} cx="330" cy={210 + index * 58} rx={168 - index * 8} ry="46" />
      ))}
    </>
  )
}

function Burst() {
  return (
    <>
      {Array.from({ length: 8 }, (_, index) => (
        <path
          key={index}
          d="M320 168c18 62 38 92 92 110-54 18-74 48-92 110-18-62-38-92-92-110 54-18 74-48 92-110Z"
          transform={`rotate(${index * 45} 320 320)`}
        />
      ))}
      <circle cx="320" cy="320" r="28" />
    </>
  )
}

function Sheets() {
  return (
    <>
      <rect x="168" y="168" width="250" height="300" rx="36" transform="rotate(-16 293 318)" />
      <rect x="214" y="150" width="250" height="300" rx="36" transform="rotate(-4 339 300)" />
      <rect x="250" y="176" width="236" height="286" rx="34" transform="rotate(8 368 319)" />
    </>
  )
}

function Twist() {
  return (
    <>
      {Array.from({ length: 9 }, (_, index) => (
        <ellipse
          key={index}
          cx="320"
          cy={188 + index * 32}
          rx={46 + Math.sin(index * 0.7) * 78}
          ry="22"
          transform={`rotate(${-28 + index * 7} 320 ${188 + index * 32})`}
        />
      ))}
    </>
  )
}

function Cluster() {
  const bubbles = [
    { cx: 250, cy: 250, r: 92 },
    { cx: 390, cy: 230, r: 78 },
    { cx: 330, cy: 360, r: 110 },
    { cx: 210, cy: 380, r: 64 },
    { cx: 450, cy: 360, r: 70 },
    { cx: 320, cy: 250, r: 48 },
  ]
  return (
    <>
      {bubbles.map((bubble) => (
        <circle key={`${bubble.cx}-${bubble.cy}`} {...bubble} />
      ))}
    </>
  )
}

function ArcNumber({
  index,
  focus,
}: {
  index: number
  focus: MotionValue<number>
}) {
  const x = useTransform(focus, (value) => (Math.cos((index - value) * arcStep) - 1) * arcRadius)
  const y = useTransform(focus, (value) => Math.sin((index - value) * arcStep) * arcRadius)
  const opacity = useTransform(focus, (value) => {
    const distance = Math.abs(index - value)
    if (distance > 2.2) return 0
    return Math.max(0, 1 - distance * 0.38)
  })
  const color = useTransform(focus, (value) => (Math.abs(index - value) < 0.45 ? '#171717' : '#C8C8C2'))
  const dot = useTransform(focus, (value) => (Math.abs(index - value) < 0.45 ? 1 : 0))

  return (
    <m.div
      style={{ x, y, opacity }}
      className="pointer-events-none absolute top-[34%] left-[18rem]"
      aria-hidden="true"
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <m.span
          style={{ opacity: dot }}
          className="absolute top-1/2 right-[calc(100%+0.85rem)] size-2.5 -translate-y-1/2 rounded-full bg-accent"
        />
        <m.span
          style={{ color }}
          className="block text-[1.85rem] leading-none font-medium tracking-[-0.04em] font-[Georgia,Palatino,serif]"
        >
          {String(index + 1).padStart(2, '0')}
        </m.span>
      </div>
    </m.div>
  )
}

function ServiceCopy({
  service,
  chipsForService,
}: {
  service: (typeof services)[number]
  chipsForService: readonly string[]
}) {
  return (
    <div>
      <h2 className="max-w-[14ch] text-[clamp(3.1rem,4.7vw,5.35rem)] leading-[0.94] font-medium tracking-[-0.035em] text-[#171717] font-[Georgia,Palatino,serif]">
        <Link to={`/services#${service.slug}`} className="text-[#171717] no-underline hover:text-[#171717]">
          {service.title}
        </Link>
      </h2>
      <p className="mt-6 max-w-[28rem] text-[1.05rem] leading-relaxed text-[#6d6d68]">{service.body}</p>
      <ul className="mt-8 flex flex-wrap gap-2.5">
        {chipsForService.map((chip) => (
          <li
            key={chip}
            className="rounded-full border border-[#171717]/8 bg-[#fff] px-4 py-2 text-[0.92rem] text-[#2a2a28] shadow-[0_1px_1px_rgb(23_33_43/0.04)]"
          >
            {chip}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ServiceSlide({
  index,
  focus,
  service,
}: {
  index: number
  focus: MotionValue<number>
  service: (typeof services)[number]
}) {
  const y = useTransform(focus, (value) => (index - value) * travel(0.82))
  const opacity = useTransform(focus, (value) => {
    const distance = Math.abs(index - value)
    if (distance > 1.05) return 0
    return 1 - Math.max(0, distance - 0.15) * 0.35
  })
  const filter = useTransform(focus, (value) => {
    const distance = Math.abs(index - value)
    const amount = distance < 0.42 ? 0 : Math.min(8, (distance - 0.42) * 12)
    return `blur(${amount}px)`
  })

  return (
    <m.div style={{ y, opacity, filter }} className="absolute inset-x-0 top-0">
      <ServiceCopy service={service} chipsForService={chips[service.id]} />
    </m.div>
  )
}

function FloatingMark({
  index,
  focus,
  kind,
}: {
  index: number
  focus: MotionValue<number>
  kind: (typeof services)[number]['id']
}) {
  const opacity = useTransform(focus, (value) => {
    const distance = Math.abs(index - value)
    if (distance > 0.55) return 0
    return 1 - distance * 1.4
  })

  return (
    <m.div style={{ opacity }} className="absolute inset-0">
      <m.div
        className="h-full w-full"
        animate={{ y: [0, -28, 0], rotate: [0, 1.8, 0, -1.8, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ServiceMark kind={kind} />
      </m.div>
    </m.div>
  )
}

function ServiceStack() {
  return (
    <section id="services" className="section-y bg-[#F7F6F4]" aria-label="Services">
      <div className="mx-auto w-full max-w-[90rem] px-(--page-gutter)">
        <ol className="space-y-20 md:space-y-28">
          {services.map((service, index) => (
            <li
              key={service.id}
              className="grid items-center gap-8 border-t border-[#171717]/8 pt-10 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-12"
            >
              <div>
                <p className="text-[1.35rem] text-[#171717] font-[Georgia,Palatino,serif]">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <div className="mt-4">
                  <ServiceCopy service={service} chipsForService={chips[service.id]} />
                </div>
              </div>
              <div className="mx-auto h-56 w-56 md:h-64 md:w-64">
                <ServiceMark kind={service.id} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function ServiceOrbit() {
  const reduced = useReducedMotion() === true
  const desktop = useMediaQuery('(min-width: 960px)')
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const focus = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0, 0, count - 1, count - 1])
  const [active, setActive] = useState(0)

  useMotionValueEvent(focus, 'change', (value) => {
    setActive(Math.min(count - 1, Math.max(0, Math.round(value))))
  })

  if (!desktop || reduced) return <ServiceStack />

  const service = services[active]

  return (
    <section ref={ref} id="services" className="relative h-[620vh] bg-[#F7F6F4]" aria-label="Services">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[34%] left-[18rem] size-[1120px] -translate-x-full -translate-y-1/2 rounded-full border border-[#E1E1DC]"
        />
        <div
          aria-hidden="true"
          className="absolute top-[34%] left-0 z-20 flex h-48 w-12 -translate-y-1/2 flex-col items-center bg-page-dark pt-3.5 text-[#fff]"
        >
          <span className="text-[1.15rem] leading-none font-medium font-[Georgia,Palatino,serif]">S.</span>
          <Eyebrow as="span" inverse className="mt-4 [writing-mode:vertical-rl] rotate-180">
            Services
          </Eyebrow>
        </div>

        {services.map((item, index) => (
          <ArcNumber key={item.id} index={index} focus={focus} />
        ))}

        <div className="pointer-events-none absolute top-[18%] bottom-[14%] left-[26rem] w-[min(38rem,40vw)] overflow-hidden">
          <div className="pointer-events-auto relative h-full">
            {services.map((item, index) => (
              <ServiceSlide key={item.id} index={index} focus={focus} service={item} />
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute top-[8%] right-[-8%] h-[84%] w-[40%] overflow-hidden">
          {services.map((item, index) => (
            <FloatingMark key={item.id} index={index} focus={focus} kind={item.id} />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {service.title}
        </p>
      </div>
    </section>
  )
}
