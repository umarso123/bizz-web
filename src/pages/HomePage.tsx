import { LazyMotion, domAnimation } from 'framer-motion'
import { CareAudience } from '@/sections/home/CareAudience.tsx'
import { CaseHighlight } from '@/sections/home/CaseHighlight.tsx'
import { FactsSnapshot } from '@/sections/home/FactsSnapshot.tsx'
import { ProjectShowcase } from '@/sections/home/ProjectShowcase.tsx'
import { HowWeWork } from '@/sections/home/HowWeWork.tsx'
import { Members } from '@/sections/home/Members.tsx'
import { PremiumHero } from '@/sections/home/PremiumHero.tsx'
import { ServiceArc } from '@/sections/home/ServiceArc.tsx'
import { ServiceOrbit } from '@/sections/home/ServiceOrbit.tsx'
import { WhoWeWorkWith } from '@/sections/home/WhoWeWorkWith.tsx'

export function HomePage() {
  return (
    <LazyMotion features={domAnimation}>
      <main className="homepage bg-page-white">
        <PremiumHero />
        <CareAudience />
        <WhoWeWorkWith />
        <HowWeWork />
        <Members />
        <CaseHighlight />
        <ProjectShowcase />
        <ServiceArc />
        <ServiceOrbit />
        <FactsSnapshot />
      </main>
    </LazyMotion>
  )
}
