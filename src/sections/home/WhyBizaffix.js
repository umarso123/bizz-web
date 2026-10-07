import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll, useTransform, } from 'framer-motion';
import { useRef, useState } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { homeContent } from '@/content/home.ts';
import { useMediaQuery } from '@/sections/home/homeJourney.ts';
/**
 * Motion: WORD SUM
 * PRODUCT + DESIGN + ENGINEERING + DOMAIN → BIZAFFIX
 */
export function WhyBizaffix() {
    const reduced = useReducedMotion() === true;
    const desktop = useMediaQuery('(min-width: 768px)');
    const ref = useRef(null);
    const concepts = homeContent.why.concepts;
    const copy = homeContent.why;
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end end'],
    });
    const [active, setActive] = useState(0);
    const sumOpacity = useTransform(scrollYProgress, [0.78, 0.92], reduced ? [1, 1] : [0, 1]);
    const sumScale = useTransform(scrollYProgress, [0.78, 0.92], reduced ? [1, 1] : [0.92, 1]);
    const stackOpacity = useTransform(scrollYProgress, [0.78, 0.9], reduced ? [0, 0] : [1, 0]);
    useMotionValueEvent(scrollYProgress, 'change', (value) => {
        setActive(Math.min(concepts.length - 1, Math.max(0, Math.floor(value * concepts.length))));
    });
    if (!desktop || reduced) {
        return (_jsx("section", { className: "bg-page-dark py-24 text-text-inverse md:py-32", "aria-labelledby": "why-title", children: _jsxs(Container, { variant: "page", className: "w-full", children: [_jsx(Eyebrow, { tone: "brand", children: copy.eyebrow }), _jsx("h2", { id: "why-title", className: "mt-4 max-w-[18ch] text-section-title text-text-inverse", children: copy.title }), _jsx("p", { className: "mt-5 max-w-[40rem] text-body-large text-white/70", children: copy.body }), _jsx("div", { className: "mt-12 space-y-3", children: concepts.map((concept, index) => (_jsxs("div", { children: [_jsx("p", { className: `text-[clamp(2.25rem,1.3rem+2.5vw,4rem)] leading-[0.95] font-semibold tracking-[-0.04em] ${index % 2 === 0 ? 'text-brand' : 'text-[#F66C2A]'}`, children: concept.word }), _jsx("p", { className: "mt-1 text-body text-white/65", children: concept.line })] }, concept.word))) }), _jsx("p", { className: "mt-10 text-[clamp(2.5rem,1.5rem+3vw,4.5rem)] font-semibold tracking-[-0.04em] text-text-inverse", children: copy.sum })] }) }));
    }
    return (_jsx("section", { ref: ref, className: "relative h-[340vh] bg-page-dark text-text-inverse", "aria-labelledby": "why-title", children: _jsx("div", { className: "sticky top-0 flex h-svh flex-col justify-center overflow-hidden sticky-section", children: _jsxs(Container, { variant: "page", className: "relative w-full", children: [_jsx(Eyebrow, { tone: "brand", children: copy.eyebrow }), _jsx("h2", { id: "why-title", className: "mt-4 max-w-[16ch] text-section-title text-text-inverse", children: copy.title }), _jsx("p", { className: "mt-4 max-w-[36rem] text-body-large text-white/70", children: copy.body }), _jsx(m.div, { className: "relative mt-10 min-h-[42vh]", style: { opacity: stackOpacity }, children: _jsx(AnimatePresence, { mode: "wait", children: _jsxs(m.div, { initial: { y: '55%', opacity: 0, clipPath: 'inset(100% 0 0 0)' }, animate: { y: '0%', opacity: 1, clipPath: 'inset(0% 0 0 0)' }, exit: { y: '-35%', opacity: 0, clipPath: 'inset(0 0 100% 0)' }, transition: { duration: 0.55, ease: [0.2, 0, 0, 1] }, children: [_jsx("p", { className: `text-[clamp(3.5rem,2rem+6vw,8rem)] leading-[0.9] font-semibold tracking-[-0.045em] ${active % 2 === 0 ? 'text-brand' : 'text-[#F66C2A]'}`, children: concepts[active]?.word }), _jsx("p", { className: "mt-4 max-w-[32rem] text-body-large text-white/70", children: concepts[active]?.line })] }, concepts[active]?.word) }) }), _jsxs(m.div, { className: "absolute inset-x-[var(--page-gutter)] top-1/2 -translate-y-1/2 text-center", style: { opacity: sumOpacity, scale: sumScale }, children: [_jsx("div", { className: "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-caption font-semibold tracking-[0.12em] text-white/50 uppercase", children: concepts.map((concept, index) => (_jsxs("span", { className: "inline-flex items-center gap-3", children: [_jsx("span", { className: index % 2 === 0 ? 'text-brand' : 'text-[#F66C2A]', children: concept.word }), index < concepts.length - 1 ? _jsx("span", { className: "text-white/35", children: "+" }) : null] }, concept.word))) }), _jsx("p", { className: "mt-4 text-[clamp(3rem,1.8rem+4vw,5.5rem)] font-semibold tracking-[-0.04em] text-white/80", children: "\u2193" }), _jsx("p", { className: "text-[clamp(3.25rem,2rem+5vw,6.5rem)] font-semibold tracking-[-0.045em] text-brand", children: copy.sum })] })] }) }) }));
}
