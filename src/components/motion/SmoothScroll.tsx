import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const lenis = useLenis()
  const { pathname, hash } = useLocation()
  // null on first render, so a deep link like /#healthcare also counts as arriving.
  const lastPathname = useRef<string | null>(null)
  // Lenis arrives a tick after the first render. Read it from a ref so its arrival
  // can't cancel a pending scroll in the route effect below.
  const lenisRef = useRef(lenis)

  useEffect(() => {
    lenisRef.current = lenis
  }, [lenis])

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
    const pageChanged = lastPathname.current !== pathname
    lastPathname.current = pathname
    const anchor = hash ? decodeURIComponent(hash.slice(1)) : ''

    // A link to another page's section (e.g. /services#cloud-development) lands on
    // that section. Same-page anchors are left to Lenis so they stay smooth.
    if (anchor) {
      if (!pageChanged) return
      let target: HTMLElement | null = null
      const jump = () => {
        if (!target) return
        const instance = lenisRef.current
        if (reduced || !instance) target.scrollIntoView({ block: 'start' })
        else instance.scrollTo(target, { immediate: true, force: true })
      }
      // Pinned sections add spacing when ScrollTrigger measures; land again after that.
      const onRefresh = () => jump()
      let tries = 0
      const finder = window.setInterval(() => {
        tries += 1
        target = document.getElementById(anchor)
        if (!target && tries < 20) return
        window.clearInterval(finder)
        jump()
        ScrollTrigger.addEventListener('refresh', onRefresh)
      }, 75)
      const settle = window.setTimeout(() => ScrollTrigger.removeEventListener('refresh', onRefresh), 3000)
      return () => {
        window.clearInterval(finder)
        window.clearTimeout(settle)
        ScrollTrigger.removeEventListener('refresh', onRefresh)
      }
    }

    const instance = lenisRef.current
    if (reduced || !instance) window.scrollTo(0, 0)
    else instance.scrollTo(0, { immediate: true, force: true })
  }, [pathname, hash, reduced])

  if (reduced) return children

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        anchors: true,
        // Smooth glide that still answers small wheel movements quickly
        lerp: 0.085,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
