import { useEffect } from 'react'
import { CompassPromo } from '@/sections/home/CompassPromo.tsx'
import { AboutStatement } from '@/sections/studio/AboutStatement.tsx'
import { ClosingStudio } from '@/sections/studio/ClosingStudio.tsx'
import { ProcessStack } from '@/sections/studio/ProcessStack.tsx'
import { RibbonBand } from '@/sections/studio/RibbonBand.tsx'
import { ServicesPath } from '@/sections/studio/ServicesPath.tsx'
import { StudioHero } from '@/sections/studio/StudioHero.tsx'
import { WorkRail } from '@/sections/studio/WorkRail.tsx'

/**
 * The homepage, as one continuous sheet of cream paper with a single loud blue.
 * System: styles/studio-home.css · copy: data/studio-home.ts
 *
 *   01 hero       the mark spins, the headline parts, it melts, the sheet rises
 *   02 ribbon     two bands cross, their words running along the curve
 *   03 statement  one sentence reads itself, then the stickers land
 *   04 work       a pinned sideways rail of projects
 *   05 services   a line draws itself through each service
 *   06 process    a blue panel; the steps are a pile of cards thrown off one by one
 *   07 closing    the biggest type on the page and the one button
 *
 * Retired from the homepage (files kept in sections/home): LogoHero, WhyStatement,
 * ClientLogos, NeedsGrid, BrandMark, ServicesDirectory, ComplianceCheck,
 * IndustriesCovered, HorizontalWork, ProcessBoard, FaqList, ClosingCall.
 */
export function HomePage() {
  useEffect(() => {
    document.title = 'Bizaffix: Healthcare software, from idea to reality'
  }, [])

  return (
    <main className="sh">
      <StudioHero />
      <RibbonBand />
      <AboutStatement />
      <WorkRail />
      <ServicesPath />
      <CompassPromo />
      <ProcessStack />
      <ClosingStudio />
    </main>
  )
}
