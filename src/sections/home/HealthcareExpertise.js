import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { m, useMotionValueEvent, useReducedMotion, useScroll, useTransform, } from 'framer-motion';
import { Link } from 'react-router';
import { useRef, useState } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { homeContent } from '@/content/home.ts';
import { useMediaQuery } from '@/sections/home/homeJourney.ts';
function FlowNode({ label, index, active, progress, reduced, }) {
    const y = 48 + index * 72;
    const lit = active >= index;
    const pulse = useTransform(progress, [index / 5, (index + 0.6) / 5], reduced ? [1, 1] : [0.7, 1]);
    return (_jsxs("g", { transform: `translate(200 ${y})`, children: [_jsx(m.circle, { r: lit ? 18 : 12, fill: lit ? 'rgb(10 143 216 / 0.16)' : 'white', stroke: lit ? '#0A8FD8' : 'rgb(10 143 216 / 0.25)', strokeWidth: 1.5, style: { scale: pulse } }), _jsx("circle", { r: 4, fill: lit ? (index % 2 === 0 ? '#0A8FD8' : '#F66C2A') : 'rgb(10 143 216 / 0.35)' }), _jsx("text", { x: 36, y: 5, fill: lit ? '#17212B' : '#67737E', fontSize: "15", fontWeight: "600", children: label })] }));
}
function CareFlow({ active, progress, reduced, }) {
    const draw = useTransform(progress, [0.05, 0.85], reduced ? [1, 1] : [0.08, 1]);
    const aiOpacity = useTransform(progress, [0.55, 0.8], reduced ? [1, 1] : [0, 1]);
    return (_jsxs("div", { className: "relative h-full min-h-[24rem] overflow-hidden rounded-2xl border border-white/70 bg-white/60 p-6 shadow-card backdrop-blur-md", children: [_jsx("div", { className: "pointer-events-none absolute inset-0 surface-mesh opacity-80", "aria-hidden": "true" }), _jsxs("svg", { viewBox: "0 0 420 420", className: "relative h-full w-full", "aria-hidden": "true", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "care-line", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#0A8FD8" }), _jsx("stop", { offset: "100%", stopColor: "#F66C2A" })] }) }), _jsx(m.path, { d: "M200 48 V336", fill: "none", stroke: "url(#care-line)", strokeWidth: "2", strokeLinecap: "round", style: { pathLength: draw } }), homeContent.specialization.flow.map((label, index) => (_jsx(FlowNode, { label: label, index: index, active: active, progress: progress, reduced: reduced }, label))), _jsxs(m.g, { style: { opacity: aiOpacity }, children: [_jsx("rect", { x: "300", y: "160", width: "96", height: "36", rx: "18", fill: "rgb(246 108 42 / 0.12)", stroke: "#F66C2A" }), _jsx("text", { x: "348", y: "183", textAnchor: "middle", fill: "#C45A20", fontSize: "12", fontWeight: "700", children: "AI" }), _jsx("path", { d: "M300 178 H236", stroke: "#F66C2A", strokeWidth: "1.4", strokeDasharray: "4 4" })] })] })] }));
}
/**
 * Specialization bridge to /digital-health.
 * Motion: vertical care system assembly (not medical illustration).
 */
export function HealthcareExpertise() {
    const reduced = useReducedMotion() === true;
    const desktop = useMediaQuery('(min-width: 1024px)');
    const ref = useRef(null);
    const copy = homeContent.specialization;
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end end'],
    });
    const [active, setActive] = useState(0);
    useMotionValueEvent(scrollYProgress, 'change', (value) => {
        setActive(Math.min(copy.flow.length - 1, Math.max(0, Math.floor(value * copy.flow.length))));
    });
    const body = (_jsxs(_Fragment, { children: [_jsx(Eyebrow, { tone: "brand", children: copy.eyebrow }), _jsx("h2", { id: "expertise-title", className: "mt-4 max-w-[14ch] text-section-title text-text", children: copy.title }), _jsx("p", { className: "mt-5 max-w-[36rem] text-body-large text-text-secondary", children: copy.body }), _jsx("ul", { className: "mt-8 flex flex-wrap gap-2", children: copy.offers.map((offer) => (_jsx("li", { className: "rounded-full border border-brand/20 bg-brand-subtle px-3 py-1.5 text-caption font-medium text-brand-hover", children: offer }, offer))) }), _jsxs(Link, { to: copy.ctaTo, className: "mt-8 inline-flex text-body-small font-semibold text-brand-hover underline underline-offset-[0.22em]", children: [copy.cta, " \u2192"] })] }));
    if (!desktop || reduced) {
        return (_jsxs("section", { className: "relative bg-[#D6EEF8] section-y", "aria-labelledby": "expertise-title", children: [_jsx("div", { className: "pointer-events-none absolute inset-0 surface-mesh", "aria-hidden": "true" }), _jsxs(Container, { variant: "page", className: "relative w-full", children: [body, _jsx("div", { className: "mt-12", children: _jsx(CareFlow, { active: copy.flow.length - 1, progress: scrollYProgress, reduced: true }) })] })] }));
    }
    return (_jsx("section", { ref: ref, className: "relative h-[280vh] bg-[#D6EEF8]", "aria-labelledby": "expertise-title", children: _jsxs("div", { className: "sticky top-0 flex h-svh items-center overflow-hidden sticky-section", children: [_jsx("div", { className: "pointer-events-none absolute inset-0 surface-mesh", "aria-hidden": "true" }), _jsx("div", { className: "pointer-events-none absolute inset-0 surface-grain", "aria-hidden": "true" }), _jsxs(Container, { variant: "page", className: "relative grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-14", children: [_jsx("div", { children: body }), _jsx(CareFlow, { active: active, progress: scrollYProgress, reduced: false }), _jsxs("p", { className: "sr-only", children: ["Active stage: ", copy.flow[active]] })] })] }) }));
}
