import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const lenis = useLenis()
  const { pathname } = useLocation()

  useEffect(() => {
    if (reduced || !lenis) return

    const onScroll = () => {
      ScrollTrigger.update()
    }

    lenis.on('scroll', onScroll)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(tick)
    }
  }, [reduced, lenis])

  useEffect(() => {
    if (reduced) {
      window.scrollTo(0, 0)
      return
    }

    lenis?.scrollTo(0, { immediate: true })
  }, [pathname, reduced, lenis])

  if (reduced) return children

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        anchors: true,
        lerp: 0.075,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
