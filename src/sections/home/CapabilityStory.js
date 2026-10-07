import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m, useMotionValueEvent, useReducedMotion, useScroll, useTransform, } from 'framer-motion';
import { useRef, useState } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { homeJourney, useMediaQuery } from '@/sections/home/homeJourney.ts';
import { cn } from '@/lib/cn.ts';
const atmospheres = ['#E8F5FC', '#FFFFFF', '#E8F5FC', '#FFFFFF', '#E8F5FC'];
/**
 * Motion identity: STACKED PEEL / CLIP WIPE
 * Panels sit in a deck. Scroll peels the top layer upward via clip-path.
 * Not a horizontal track.
 */
export function CapabilityStory() {
    const reduced = useReducedMotion() === true;
    const desktop = useMediaQuery('(min-width: 960px)');
    const ref = useRef(null);
    const count = homeJourney.capabilities.length;
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end end'],
    });
    const [active, setActive] = useState(0);
    useMotionValueEvent(scrollYProgress, 'change', (value) => {
        setActive(Math.min(count - 1, Math.max(0, Math.floor(value * count))));
    });
    if (!desktop || reduced) {
        return (_jsx("section", { className: "bg-page-white py-20 md:py-28", "aria-labelledby": "capability-title", children: _jsxs(Container, { variant: "page", className: "w-full", children: [_jsx("p", { className: "text-eyebrow text-brand-hover uppercase tracking-[0.14em]", children: "Capabilities" }), _jsx("h2", { id: "capability-title", className: "mt-4 text-section-title text-text", children: "Experience the potential of your business." }), _jsx("div", { className: "mt-12 space-y-8", children: homeJourney.capabilities.map((panel, index) => (_jsxs("article", { className: "overflow-hidden rounded-xl border border-brand/20 bg-white p-8 shadow-sm md:p-12", style: { backgroundColor: atmospheres[index] }, children: [_jsxs("p", { className: "text-caption font-semibold text-brand-hover", children: ["0", index + 1] }), _jsx("h3", { className: "mt-4 text-[clamp(2rem,1.4rem+2vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-text", children: panel.title }), _jsx("p", { className: "mt-4 max-w-[34rem] text-body-large text-text-secondary", children: panel.body })] }, panel.id))) })] }) }));
    }
    return (_jsx("section", { ref: ref, className: "relative h-[360vh] bg-page-white", "aria-labelledby": "capability-title", children: _jsx("div", { className: "sticky top-0 flex h-svh items-center overflow-hidden", children: _jsxs(Container, { variant: "page", className: "relative w-full", children: [_jsx("p", { className: "text-eyebrow text-brand-hover uppercase tracking-[0.14em]", children: "Capabilities" }), _jsx("h2", { id: "capability-title", className: "mt-3 text-section-title text-text", children: "Experience the potential of your business." }), _jsx("div", { className: "relative mt-10 h-[min(58vh,32rem)]", children: homeJourney.capabilities.map((panel, index) => (_jsx(PeelPanel, { panel: panel, index: index, count: count, progress: scrollYProgress, active: active, atmosphere: atmospheres[index] ?? atmospheres[0] }, panel.id))) }), _jsx("div", { className: "mt-6 flex gap-2", "aria-hidden": "true", children: homeJourney.capabilities.map((panel, index) => (_jsx("span", { className: cn('h-1.5 flex-1 rounded-full transition-colors duration-300', index <= active ? 'bg-brand' : 'bg-white/80') }, panel.id))) })] }) }) }));
}
function PeelPanel({ panel, index, count, progress, active, atmosphere, }) {
    const start = index / count;
    const end = (index + 1) / count;
    // Top panel peels away by clipping from bottom upward as user scrolls past it
    const clip = useTransform(progress, [start, end], ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)']);
    const y = useTransform(progress, [start, end], [0, -48]);
    const scale = useTransform(progress, [start, end], [1, 0.96]);
    const isTop = index === active;
    const isPast = index < active;
    return (_jsxs(m.article, { className: "absolute inset-0 overflow-hidden rounded-2xl border border-border-subtle p-10 md:p-14", style: {
            zIndex: count - index,
            backgroundColor: atmosphere,
            clipPath: isPast ? 'inset(0% 0% 100% 0%)' : clip,
            y: isPast ? -48 : y,
            scale: isPast ? 0.96 : scale,
            boxShadow: isTop ? '0 18px 50px rgb(23 33 43 / 0.08)' : 'none',
        }, children: [_jsxs("p", { className: "text-caption text-text-muted", children: ["0", index + 1] }), _jsx("h3", { className: "mt-5 max-w-[12ch] text-[clamp(2.5rem,1.5rem+3vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-text", children: panel.title }), _jsx("p", { className: "mt-5 max-w-[34rem] text-body-large text-text-secondary", children: panel.body }), _jsxs("span", { "aria-hidden": "true", className: "pointer-events-none absolute top-8 right-8 text-[clamp(4rem,2rem+6vw,7rem)] font-semibold tracking-[-0.05em] text-brand/10", children: ["0", index + 1] })] }));
}
