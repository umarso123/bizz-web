import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll, useTransform, } from 'framer-motion';
import { useRef, useState } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { careersCopy, workStages } from '@/content/careers.ts';
import { cn } from '@/lib/cn.ts';
import { useMediaQuery } from '@/sections/careers/useCareerMotion.ts';
export function WorkProcess() {
    const reduced = useReducedMotion() === true;
    const isDesktop = useMediaQuery('(min-width: 960px)');
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    });
    const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${((workStages.length - 1) / workStages.length) * 100}%`]);
    useMotionValueEvent(scrollYProgress, 'change', (value) => {
        const next = Math.min(workStages.length - 1, Math.max(0, Math.round(value * (workStages.length - 1))));
        setActiveIndex(next);
    });
    if (!isDesktop || reduced) {
        return (_jsx("section", { className: "bg-page-white py-24 md:py-32", "aria-labelledby": "how-we-work-title", children: _jsxs(Container, { variant: "page", className: "w-full", children: [_jsx(Eyebrow, { tone: "brand", className: "uppercase tracking-[0.14em]", children: careersCopy.process.eyebrow }), _jsx("h2", { id: "how-we-work-title", className: "mt-4 text-[clamp(2rem,1.3rem+2vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.025em] text-text", children: careersCopy.process.headline }), _jsx("ol", { className: "mt-14 space-y-0 border-t border-border-subtle", children: workStages.map((stage, index) => (_jsxs("li", { className: "grid gap-3 border-b border-border-subtle py-10 md:grid-cols-[6rem_minmax(0,1fr)] md:gap-10", children: [_jsx("p", { className: "text-[clamp(2rem,1.5rem+1vw,2.75rem)] leading-none font-medium tracking-[-0.03em] text-brand", children: stage.number }), _jsxs("div", { children: [_jsx("h3", { className: "text-title text-text", children: stage.title }), _jsx("p", { className: "mt-3 max-w-[36rem] text-body text-text-secondary", children: stage.body }), _jsx("div", { className: "mt-6 h-px w-full origin-left bg-brand", style: { transform: `scaleX(${0.35 + index * 0.12})` }, "aria-hidden": "true" })] })] }, stage.id))) })] }) }));
    }
    return (_jsx("section", { ref: sectionRef, className: "relative h-[420vh] bg-page-white", "aria-labelledby": "how-we-work-title", children: _jsxs("div", { className: "sticky top-0 flex min-h-svh flex-col justify-center overflow-hidden py-20", children: [_jsxs(Container, { variant: "page", className: "relative z-10 w-full", children: [_jsx(Eyebrow, { tone: "brand", className: "uppercase tracking-[0.14em]", children: careersCopy.process.eyebrow }), _jsxs("div", { className: "mt-4 flex flex-wrap items-end justify-between gap-6", children: [_jsx("h2", { id: "how-we-work-title", className: "text-[clamp(2rem,1.3rem+2vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.025em] text-text", children: careersCopy.process.headline }), _jsx(AnimatePresence, { mode: "wait", children: _jsx(m.p, { className: "max-w-[28rem] text-body text-text-secondary", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] }, children: workStages[activeIndex]?.body }, workStages[activeIndex]?.id) })] })] }), _jsxs("div", { className: "relative mt-16", children: [_jsx("div", { className: "pointer-events-none absolute top-[42%] right-0 left-0 h-px bg-border-strong", "aria-hidden": "true" }), _jsx(m.div, { ref: trackRef, className: "flex w-max gap-[6vw] px-[max(var(--page-gutter),calc((100vw-40rem)/2))] will-change-transform", style: { x }, children: workStages.map((stage, index) => {
                                const active = index === activeIndex;
                                return (_jsxs("article", { className: cn('relative flex w-[min(28rem,70vw)] shrink-0 flex-col justify-center transition-transform duration-500 ease-standard', active ? 'scale-100' : 'scale-[0.88]'), children: [_jsx("p", { className: cn('text-[clamp(3.5rem,2.5rem+2vw,5.5rem)] leading-none font-medium tracking-[-0.04em] transition-colors', active ? 'text-brand' : 'text-border-strong'), children: stage.number }), _jsx("h3", { className: cn('mt-4 text-[clamp(1.75rem,1.3rem+1vw,2.5rem)] leading-none font-semibold tracking-[-0.03em] transition-colors', active ? 'text-text' : 'text-text-muted'), children: stage.title }), _jsx(m.div, { className: "mt-8 h-1 origin-left rounded-full bg-brand", animate: { scaleX: active ? 1 : 0.25, opacity: active ? 1 : 0.35 }, transition: { duration: 0.45, ease: [0.2, 0, 0, 1] }, "aria-hidden": "true" }), _jsx(m.span, { "aria-hidden": "true", className: cn('absolute top-[calc(42%+0.35rem)] left-0 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-bg', active ? 'bg-[#F66C2A]' : 'bg-brand/50'), animate: { scale: active ? 1.25 : 1 } })] }, stage.id));
                            }) })] })] }) }));
}
