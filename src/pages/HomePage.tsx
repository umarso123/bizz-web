import { LazyMotion, domAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { CenterTearReveal } from '@/components/paper/CenterTearReveal.tsx'
import { HealthcareZone } from '@/sections/home/HealthcareZone.tsx'
import { HorizontalWork } from '@/sections/home/HorizontalWork.tsx'
import { IndustriesMarquee } from '@/sections/home/IndustriesMarquee.tsx'
import { ApproachStack } from '@/sections/home/ApproachStack.tsx'
import { GlobalPresence } from '@/sections/home/GlobalPresence.tsx'
import { Members } from '@/sections/home/Members.tsx'
import { PremiumHero } from '@/sections/home/PremiumHero.tsx'
import { ServicesDirectory } from '@/sections/home/ServicesDirectory.tsx'

/**
 * The homepage as a rhythm of panels, never two alike in a row:
 * hero and industries (white), healthcare (light blue), work (cream), industries
 * board (white), case study (cream), services (light blue), how we work
 * (periwinkle), numbers (dark), people (white), then the blue CTA and navy footer.
 * ConnectBanner (the destination) is added by SiteLayout.
 */
export function HomePage() {
  useEffect(() => {
    document.title = 'Bizaffix: Healthcare software, from idea to reality'
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <main className="homepage paper-home">
        <PremiumHero />
        <IndustriesMarquee />
        <HealthcareZone />
        {/* 04 Work: a night sheet that pins edge to edge while scrolling sideways */}
        <HorizontalWork />
        {/* WhoWeWorkWith → CaseHighlight: the centre tear reveal */}
        <CenterTearReveal />
        <ServicesDirectory />
        <ApproachStack />
        <Members />
        <GlobalPresence />
      </main>
    </LazyMotion>
  )
}
