import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LazyMotion, domAnimation } from 'framer-motion';
import { Approach } from '@/sections/home/Approach.tsx';
import { CaseHighlight } from '@/sections/home/CaseHighlight.tsx';
import { FactsSnapshot } from '@/sections/home/FactsSnapshot.tsx';
import { FeaturedProjects } from '@/sections/home/FeaturedProjects.tsx';
import { FloatingScrollText } from '@/sections/home/FloatingScrollText.tsx';
import { HowWeWork } from '@/sections/home/HowWeWork.tsx';
import { PremiumHero } from '@/sections/home/PremiumHero.tsx';
import { ServiceOrbit } from '@/sections/home/ServiceOrbit.tsx';
import { WhatWeDo } from '@/sections/home/WhatWeDo.tsx';
import { LaptopZoomExperience } from '@/sections/home/laptop-zoom/LaptopZoomExperience.tsx';
export function HomePage() {
    return (_jsx(LazyMotion, { features: domAnimation, children: _jsxs("main", { className: "bg-page-white", children: [_jsx(PremiumHero, {}), _jsx(WhatWeDo, {}), _jsx(Approach, {}), _jsx(HowWeWork, {}), _jsx(FloatingScrollText, {}), _jsx(CaseHighlight, {}), _jsx(FeaturedProjects, {}), _jsx(LaptopZoomExperience, {}), _jsx(ServiceOrbit, {}), _jsx(FactsSnapshot, {})] }) }));
}
