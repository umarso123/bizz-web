import { LazyMotion, domAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { CareerCultureCta, CareerFinalCta } from '@/sections/careers/CareerCTA.tsx'
import { CareerHero } from '@/sections/careers/CareerHero.tsx'
import { CultureStory } from '@/sections/careers/CultureStory.tsx'
import { JobList } from '@/sections/careers/JobList.tsx'
import { LifeAtBizaffix } from '@/sections/careers/LifeAtBizaffix.tsx'
import { TeamStrip } from '@/sections/careers/TeamStrip.tsx'
import { WhyBizaffixIntro } from '@/sections/careers/WhyBizaffixIntro.tsx'
import { WorkProcess } from '@/sections/careers/WorkProcess.tsx'

export function CareersPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Careers · Bizaffix'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <main>
        <CareerHero />
        <WhyBizaffixIntro />
        <CultureStory />
        <WorkProcess />
        <JobList />
        <LifeAtBizaffix />
        <TeamStrip />
        <CareerCultureCta />
        <CareerFinalCta />
      </main>
    </LazyMotion>
  )
}
