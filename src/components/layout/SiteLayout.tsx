import { Outlet, useLocation } from 'react-router'
import { ConnectBanner } from '@/components/layout/ConnectBanner.tsx'
import { Footer } from '@/components/layout/Footer.tsx'
import { Header } from '@/components/layout/Header.tsx'

export function SiteLayout() {
  const { pathname } = useLocation()

  return (
    <>
      <Header />
      <div className="pt-(--header-clearance)">
        <Outlet />
      </div>
      {pathname === '/contact' ? null : <ConnectBanner />}
      <Footer />
    </>
  )
}
