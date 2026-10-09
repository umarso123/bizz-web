import { LazyMotion, domAnimation } from 'framer-motion'
import { CaseHighlight } from '@/sections/home/CaseHighlight.tsx'
import { FactsSnapshot } from '@/sections/home/FactsSnapshot.tsx'
import { FeaturedProjects } from '@/sections/home/FeaturedProjects.tsx'
import { HowWeWork } from '@/sections/home/HowWeWork.tsx'
import { PremiumHero } from '@/sections/home/PremiumHero.tsx'
import { ServiceArc } from '@/sections/home/ServiceArc.tsx'
import { ServiceOrbit } from '@/sections/home/ServiceOrbit.tsx'
import { WhatWeDo } from '@/sections/home/WhatWeDo.tsx'

export function HomePage() {
  return (
    <LazyMotion features={domAnimation}>
      <main className="bg-page-white">
        <PremiumHero />
        <WhatWeDo />
        <HowWeWork />
        <CaseHighlight />
        <FeaturedProjects />
        <ServiceArc />
        <ServiceOrbit />
        <FactsSnapshot />
      </main>
    </LazyMotion>
  )
}
