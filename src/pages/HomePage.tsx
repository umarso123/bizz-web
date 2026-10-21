import { LazyMotion, domAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { CaseHighlight } from '@/sections/home/CaseHighlight.tsx'
import { HealthcareZone } from '@/sections/home/HealthcareZone.tsx'
import { HorizontalWork } from '@/sections/home/HorizontalWork.tsx'
import { IndustriesMarquee } from '@/sections/home/IndustriesMarquee.tsx'
import { ApproachStack } from '@/sections/home/ApproachStack.tsx'
import { Members } from '@/sections/home/Members.tsx'
import { PremiumHero } from '@/sections/home/PremiumHero.tsx'
import { ServicesDirectory } from '@/sections/home/ServicesDirectory.tsx'
import { StatsBand } from '@/sections/home/StatsBand.tsx'
import { WhoWeWorkWith } from '@/sections/home/WhoWeWorkWith.tsx'

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
      <main className="homepage">
        <PremiumHero />
        <IndustriesMarquee />
        <HealthcareZone />
        {/* Work: a full-bleed cream band (it pins edge to edge while scrolling sideways) */}
        <HorizontalWork className="bg-[rgb(255_252_240/0.9)]" />
        <WhoWeWorkWith />
        <CaseHighlight />
        <ServicesDirectory />
        <ApproachStack />
        <StatsBand />
        <Members />
      </main>
    </LazyMotion>
  )
}
