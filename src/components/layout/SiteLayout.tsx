import { LazyMotion, domAnimation } from 'framer-motion'
import { Outlet, useLocation } from 'react-router'
import { ConnectBanner } from '@/components/layout/ConnectBanner.tsx'
import { SiteFooter } from '@/components/layout/SiteFooter.tsx'
import { Header } from '@/components/layout/Header.tsx'
import { ScrollRoute } from '@/components/motion/ScrollRoute.tsx'
import { PaperConnect } from '@/sections/home/PaperConnect.tsx'

export function SiteLayout() {
  const { pathname } = useLocation()

  return (
    // One motion provider for every page, so shared scroll visuals animate everywhere
    <LazyMotion features={domAnimation}>
      <ScrollRoute />
      <Header />
      <div className="pt-(--header-clearance)">
        <Outlet />
      </div>
      {/* The homepage closes on its own yellow sheet; contact has the form instead */}
      {pathname === '/' ? <PaperConnect /> : pathname === '/contact' ? null : <ConnectBanner />}
      <SiteFooter />
      <div aria-hidden="true" className="page-grain" />
    </LazyMotion>
  )
}
