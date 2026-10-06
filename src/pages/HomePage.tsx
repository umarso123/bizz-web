import { LazyMotion, domAnimation } from 'framer-motion'
import { FactsSnapshot } from '@/sections/home/FactsSnapshot.tsx'
import { FeaturedProjects } from '@/sections/home/FeaturedProjects.tsx'
import { HealthcareExpertise } from '@/sections/home/HealthcareExpertise.tsx'
import { HowWeWork } from '@/sections/home/HowWeWork.tsx'
import { ServiceOrbit } from '@/sections/home/ServiceOrbit.tsx'
import { LaptopZoomExperience } from '@/sections/home/laptop-zoom/LaptopZoomExperience.tsx'
import { FloatingHero } from '@/sections/home/FloatingHero.tsx'
import { Hero } from '@/sections/Hero.tsx'

export function HomePage() {
  return (
    <LazyMotion features={domAnimation}>
      <main>
        <FloatingHero />
        <Hero />
        <LaptopZoomExperience />
        <HealthcareExpertise />
        <ServiceOrbit />
        <HowWeWork />
        <FeaturedProjects />
        <FactsSnapshot />
      </main>
    </LazyMotion>
  )
}
