import { LazyMotion, domAnimation } from 'framer-motion'
import { Outlet, useLocation } from 'react-router'
import { ConnectBanner } from '@/components/layout/ConnectBanner.tsx'
import { SiteFooter } from '@/components/layout/SiteFooter.tsx'
import { Header } from '@/components/layout/Header.tsx'
import { StudioHeader } from '@/components/layout/StudioHeader.tsx'
import { ScrollRoute } from '@/components/motion/ScrollRoute.tsx'

export function SiteLayout() {
  const { pathname } = useLocation()

  return (
    // One motion provider for every page, so shared scroll visuals animate everywhere
    <LazyMotion features={domAnimation}>
      <ScrollRoute />
      {/* The homepage has its own floating-pill header */}
      {pathname === '/' ? <StudioHeader /> : <Header />}
      <div className="pt-(--header-clearance)">
        <Outlet />
      </div>
      {/* The homepage closes with its own ClosingCall; contact has the form instead */}
      {pathname === '/' || pathname === '/contact' ? null : <ConnectBanner />}
      <SiteFooter />
      <div aria-hidden="true" className="page-grain" />
    </LazyMotion>
  )
}
