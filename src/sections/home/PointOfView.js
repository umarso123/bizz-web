import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m, useReducedMotion, useScroll, useTransform, } from 'framer-motion';
import { useRef } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { homeContent } from '@/content/home.ts';
import { useMediaQuery } from '@/sections/home/homeJourney.ts';
const scatterSlots = [
    { x: '8%', y: '18%' },
    { x: '72%', y: '12%' },
    { x: '18%', y: '68%' },
    { x: '78%', y: '62%' },
    { x: '48%', y: '40%' },
];
const organizedSlots = [
    { x: '18%', y: '72%' },
    { x: '50%', y: '72%' },
    { x: '82%', y: '72%' },
];
function ScatterChip({ label, index, progress, reduced, }) {
    const slot = scatterSlots[index];
    const fadeOut = index >= 3;
    const target = organizedSlots[Math.min(index, organizedSlots.length - 1)];
    const x = useTransform(progress, [0, 0.4, 0.72], reduced ? [target.x, target.x, target.x] : [slot.x, slot.x, fadeOut ? slot.x : target.x]);
    const y = useTransform(progress, [0, 0.4, 0.72], reduced ? [target.y, target.y, target.y] : [slot.y, slot.y, fadeOut ? slot.y : target.y]);
    const opacity = useTransform(progress, [0.55, 0.78], reduced ? [fadeOut ? 0 : 1, fadeOut ? 0 : 1] : [1, fadeOut ? 0 : 0.15]);
    const earlyOpacity = useTransform(progress, [0, 0.18], reduced ? [1, 1] : [0.4, 1]);
    return (_jsx(m.span, { className: "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-caption font-semibold tracking-[0.04em] text-brand-hover uppercase shadow-sm backdrop-blur-md", style: { left: x, top: y, opacity: reduced ? (fadeOut ? 0 : 1) : earlyOpacity }, children: _jsx(m.span, { className: "block", style: { opacity }, children: label }) }));
}
function OrganizedLabel({ label, index, progress, reduced, }) {
    const slot = organizedSlots[index];
    const opacity = useTransform(progress, [0.72, 0.9], reduced ? [1, 1] : [0, 1]);
    const y = useTransform(progress, [0.72, 0.9], reduced ? [0, 0] : [18, 0]);
    return (_jsx(m.span, { className: "absolute -translate-x-1/2 text-[clamp(1.1rem,0.9rem+0.6vw,1.5rem)] font-semibold tracking-[-0.02em] text-text", style: { left: slot.x, top: '78%', opacity, y }, children: label }));
}
function ScatterVisual({ progress, reduced }) {
    const productOpacity = useTransform(progress, [0.35, 0.55], reduced ? [1, 1] : [0, 1]);
    const productY = useTransform(progress, [0.35, 0.55], reduced ? [0, 0] : [28, 0]);
    const trunkOpacity = useTransform(progress, [0.55, 0.7], reduced ? [1, 1] : [0, 1]);
    const branchOpacity = useTransform(progress, [0.65, 0.85], reduced ? [1, 1] : [0, 1]);
    return (_jsxs("div", { className: "relative h-[min(32rem,58vh)] w-full overflow-hidden rounded-2xl border border-white/70 bg-page-brand shadow-card", children: [homeContent.pointOfView.scatter.map((label, index) => (_jsx(ScatterChip, { label: label, index: index, progress: progress, reduced: reduced }, label))), _jsx(m.div, { className: "absolute top-[28%] left-1/2 -translate-x-1/2 text-center", style: { opacity: productOpacity, y: productY }, children: _jsx("p", { className: "rounded-xl border border-brand/15 bg-white/80 px-5 py-3 text-[clamp(2rem,1.4rem+2vw,3.5rem)] font-semibold tracking-[-0.04em] text-text shadow-sm backdrop-blur-sm", children: homeContent.pointOfView.productLabel }) }), _jsx(m.div, { className: "pointer-events-none absolute top-[42%] left-1/2 h-[18%] w-px -translate-x-1/2 bg-gradient-to-b from-brand to-[#F66C2A]", style: { opacity: trunkOpacity }, "aria-hidden": "true" }), _jsx(m.div, { className: "pointer-events-none absolute top-[60%] left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-brand to-transparent", style: { opacity: branchOpacity }, "aria-hidden": "true" }), homeContent.pointOfView.organized.map((label, index) => (_jsx(OrganizedLabel, { label: label, index: index, progress: progress, reduced: reduced }, label)))] }));
}
/**
 * Motion: SCATTER → ORGANIZE
 * Elements start scattered, scroll collapses them into Product → People / Design / Technology.
 */
export function PointOfView() {
    const reduced = useReducedMotion() === true;
    const desktop = useMediaQuery('(min-width: 960px)');
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end end'],
    });
    if (!desktop || reduced) {
        return (_jsx("section", { className: "relative bg-page-white section-y", "aria-labelledby": "pov-title", children: _jsxs(Container, { variant: "page", className: "relative w-full", children: [_jsx(Eyebrow, { tone: "brand", children: homeContent.pointOfView.eyebrow }), _jsx("h2", { id: "pov-title", className: "mt-4 max-w-[16ch] text-section-title text-text", children: homeContent.pointOfView.title }), _jsx("p", { className: "mt-5 max-w-[40rem] text-body-large text-text-secondary", children: homeContent.pointOfView.body }), _jsx("div", { className: "mt-12", children: _jsx(ScatterVisual, { progress: scrollYProgress, reduced: true }) }), _jsxs("p", { className: "mt-8 text-body text-text-secondary", children: [homeContent.pointOfView.productLabel, " \u2192", ' ', homeContent.pointOfView.organized.join(' · ')] })] }) }));
    }
    return (_jsx("section", { ref: ref, className: "relative h-[320vh] bg-page-white", "aria-labelledby": "pov-title", children: _jsx("div", { className: "sticky top-0 flex h-svh items-center overflow-hidden sticky-section", children: _jsxs(Container, { variant: "page", className: "relative grid w-full items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14", children: [_jsxs("div", { children: [_jsx(Eyebrow, { tone: "brand", children: homeContent.pointOfView.eyebrow }), _jsx("h2", { id: "pov-title", className: "mt-4 max-w-[14ch] text-section-title text-text", children: homeContent.pointOfView.title }), _jsx("p", { className: "mt-5 max-w-[34rem] text-body-large text-text-secondary", children: homeContent.pointOfView.body })] }), _jsx(ScatterVisual, { progress: scrollYProgress, reduced: false })] }) }) }));
}
