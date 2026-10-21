import { LazyMotion, domAnimation } from 'framer-motion'
import { Outlet, useLocation } from 'react-router'
import { ConnectBanner } from '@/components/layout/ConnectBanner.tsx'
import { Footer } from '@/components/layout/Footer.tsx'
import { Header } from '@/components/layout/Header.tsx'
import { AmbientBackground } from '@/components/motion/AmbientBackground.tsx'
import { ScrollRoute } from '@/components/motion/ScrollRoute.tsx'

export function SiteLayout() {
  const { pathname } = useLocation()

  return (
    // One motion provider for every page, so shared scroll visuals animate everywhere
    <LazyMotion features={domAnimation}>
      <AmbientBackground />
      <ScrollRoute />
      <Header />
      <div className="pt-(--header-clearance)">
        <Outlet />
      </div>
      {pathname === '/contact' ? null : <ConnectBanner />}
      <Footer />
      <div aria-hidden="true" className="page-grain" />
    </LazyMotion>
  )
}
