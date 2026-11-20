import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { SiteLayout } from '@/components/layout/SiteLayout.tsx'
import { HomePage } from '@/pages/HomePage.tsx'

/**
 * Lazy page: each route below the homepage is its own chunk, fetched on first
 * visit. `preload()` warms a chunk ahead of time (e.g. on link hover/idle).
 */
function page<P extends object>(load: () => Promise<ComponentType<P>>) {
  const Component = Object.assign(
    lazy(() => load().then((component) => ({ default: component }))),
    { preload: () => void load() },
  )
  return Component
}

const AboutPage = page(() => import('@/pages/AboutPage.tsx').then((m) => m.AboutPage))
const CareersPage = page(() => import('@/pages/CareersPage.tsx').then((m) => m.CareersPage))
const CaseStudyPage = page(() => import('@/pages/CaseStudyPage.tsx').then((m) => m.CaseStudyPage))
const CompassPage = page(() => import('@/pages/CompassPage.tsx').then((m) => m.CompassPage))
const ContactPage = page(() => import('@/pages/ContactPage.tsx').then((m) => m.ContactPage))
const FoundationPage = page(() => import('@/pages/FoundationPage.tsx').then((m) => m.FoundationPage))
const HealthcarePage = page(() => import('@/pages/HealthcarePage.tsx').then((m) => m.HealthcarePage))
const InsightsPage = page(() => import('@/pages/InsightsPage.tsx').then((m) => m.InsightsPage))
const PlaceholderPage = page<{ title: string }>(() => import('@/pages/PlaceholderPage.tsx').then((m) => m.PlaceholderPage))
const ServicesPage = page(() => import('@/pages/ServicesPage.tsx').then((m) => m.ServicesPage))
const WorkPage = page(() => import('@/pages/WorkPage.tsx').then((m) => m.WorkPage))

/** The pages people go to next from the homepage: fetched once the browser is idle. */
const LIKELY_NEXT = [WorkPage, ServicesPage, HealthcarePage, ContactPage, AboutPage]

if (typeof window !== 'undefined') {
  const warm = () => LIKELY_NEXT.forEach((p) => p.preload())
  const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
  // After load and a pause, so it never competes with the hero's frames.
  window.addEventListener('load', () => (idle ? idle(warm, { timeout: 6000 }) : window.setTimeout(warm, 4000)), { once: true })
}

/** Holds the page height while a chunk loads, so the footer doesn't jump up. */
function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div aria-busy="true" className="min-h-svh" />}>{children}</Suspense>
}

/**
 * Public routes live here. The paths below are temporary central routes
 * until the URL audit. Do not invent legacy paths before that audit.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Lazy><ServicesPage /></Lazy>} />
        <Route path="/healthcare" element={<Lazy><HealthcarePage /></Lazy>} />
        <Route path="/digital-health" element={<Navigate to="/healthcare" replace />} />
        <Route path="/work" element={<Lazy><WorkPage /></Lazy>} />
        <Route path="/work/:slug" element={<Lazy><CaseStudyPage /></Lazy>} />
        <Route path="/insights" element={<Lazy><InsightsPage /></Lazy>} />
        <Route path="/about" element={<Lazy><AboutPage /></Lazy>} />
        <Route path="/careers" element={<Lazy><CareersPage /></Lazy>} />
        <Route path="/careers/:slug" element={<Lazy><CareersPage /></Lazy>} />
        <Route path="/compass" element={<Lazy><CompassPage /></Lazy>} />
        <Route path="/contact" element={<Lazy><ContactPage /></Lazy>} />
        <Route path="/__design-system" element={<Lazy><FoundationPage /></Lazy>} />
        <Route path="*" element={<Lazy><PlaceholderPage title="This page isn’t on the map." /></Lazy>} />
      </Route>
    </Routes>
  )
}
