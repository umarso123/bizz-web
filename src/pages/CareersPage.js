import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LazyMotion, domAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { CareerCultureCta, CareerFinalCta } from '@/sections/careers/CareerCTA.tsx';
import { CareerHero } from '@/sections/careers/CareerHero.tsx';
import { CultureStory } from '@/sections/careers/CultureStory.tsx';
import { JobList } from '@/sections/careers/JobList.tsx';
import { LifeAtBizaffix } from '@/sections/careers/LifeAtBizaffix.tsx';
import { TeamStrip } from '@/sections/careers/TeamStrip.tsx';
import { WhyBizaffixIntro } from '@/sections/careers/WhyBizaffixIntro.tsx';
import { WorkProcess } from '@/sections/careers/WorkProcess.tsx';
export function CareersPage() {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = 'Careers · Bizaffix';
        return () => {
            document.title = previousTitle;
        };
    }, []);
    return (_jsx(LazyMotion, { features: domAnimation, children: _jsxs("main", { children: [_jsx(CareerHero, {}), _jsx(WhyBizaffixIntro, {}), _jsx(CultureStory, {}), _jsx(WorkProcess, {}), _jsx(JobList, {}), _jsx(LifeAtBizaffix, {}), _jsx(TeamStrip, {}), _jsx(CareerCultureCta, {}), _jsx(CareerFinalCta, {})] }) }));
}
