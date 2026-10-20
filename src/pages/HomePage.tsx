import { LazyMotion, domAnimation } from 'framer-motion'
import { CaseHighlight } from '@/sections/home/CaseHighlight.tsx'
import { FactsSnapshot } from '@/sections/home/FactsSnapshot.tsx'
import { HorizontalWork } from '@/sections/home/HorizontalWork.tsx'
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
        <WhoWeWorkWith />
        <HowWeWork />
        <Members />
        <CaseHighlight />
        <HorizontalWork showHeader={false} />
        <ServiceArc />
        <ServiceOrbit />
        <FactsSnapshot />
      </main>
    </LazyMotion>
  )
}
