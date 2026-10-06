import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LazyMotion, domAnimation } from 'framer-motion';
import { ClosingCta } from '@/sections/home/ClosingCta.tsx';
import { FactsSnapshot } from '@/sections/home/FactsSnapshot.tsx';
import { HealthcareExpertise } from '@/sections/home/HealthcareExpertise.tsx';
import { HowWeWork } from '@/sections/home/HowWeWork.tsx';
import { ServiceOrbit } from '@/sections/home/ServiceOrbit.tsx';
import { Insights } from '@/sections/home/Insights.tsx';
import { LaptopZoomExperience } from '@/sections/home/laptop-zoom/LaptopZoomExperience.tsx';
import { PointOfView } from '@/sections/home/PointOfView.tsx';
import { WhyBizaffix } from '@/sections/home/WhyBizaffix.tsx';
import { WorkShowcase } from '@/sections/home/WorkShowcase.tsx';
import { FloatingHero } from '@/sections/home/FloatingHero.tsx';
import { Hero } from '@/sections/Hero.tsx';
export function HomePage() {
    return (_jsx(LazyMotion, { features: domAnimation, children: _jsxs("main", { children: [_jsx(FloatingHero, {}), _jsx(Hero, {}), _jsx(PointOfView, {}), _jsx(LaptopZoomExperience, {}), _jsx(HealthcareExpertise, {}), _jsx(ServiceOrbit, {}), _jsx(HowWeWork, {}), _jsx(WorkShowcase, {}), _jsx(FactsSnapshot, {}), _jsx(WhyBizaffix, {}), _jsx(Insights, {}), _jsx(ClosingCta, {})] }) }));
}
