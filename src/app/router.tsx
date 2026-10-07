import { Route, Routes } from 'react-router'
import { SiteLayout } from '@/components/layout/SiteLayout.tsx'
import { CareersPage } from '@/pages/CareersPage.tsx'
import { CaseStudyPage } from '@/pages/CaseStudyPage.tsx'
import { FoundationPage } from '@/pages/FoundationPage.tsx'
import { ContactPage } from '@/pages/ContactPage.tsx'
import { HomePage } from '@/pages/HomePage.tsx'
import { JobDetailPage } from '@/pages/JobDetailPage.tsx'
import { PlaceholderPage } from '@/pages/PlaceholderPage.tsx'
import { ServicesPage } from '@/pages/ServicesPage.tsx'
import { WorkPage } from '@/pages/WorkPage.tsx'

/**
 * Public routes live here. The paths below are temporary central routes
 * until the URL audit. Do not invent legacy paths before that audit.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/healthcare" element={<PlaceholderPage title="Digital Health" />} />
        <Route path="/digital-health" element={<PlaceholderPage title="Digital Health" />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:slug" element={<CaseStudyPage />} />
        <Route path="/insights" element={<PlaceholderPage title="Insights" />} />
        <Route path="/about" element={<PlaceholderPage title="About" />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:slug" element={<JobDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/__design-system" element={<FoundationPage />} />
      </Route>
    </Routes>
  )
}
