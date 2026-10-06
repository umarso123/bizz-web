import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router';
import { useRef } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { homeContent } from '@/content/home.ts';
export function Insights() {
    const reduced = useReducedMotion() === true;
    const ref = useRef(null);
    const copy = homeContent.insights;
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.85', 'center center'],
    });
    const featuredClip = useTransform(scrollYProgress, [0, 0.55], reduced ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] : ['inset(18% 12% 18% 12%)', 'inset(0% 0% 0% 0%)']);
    const featuredScale = useTransform(scrollYProgress, [0, 0.55], reduced ? [1, 1] : [0.92, 1]);
    const leftX = useTransform(scrollYProgress, [0.2, 0.7], reduced ? [0, 0] : [-80, 0]);
    const rightX = useTransform(scrollYProgress, [0.3, 0.8], reduced ? [0, 0] : [80, 0]);
    const leftRotate = useTransform(scrollYProgress, [0.2, 0.7], reduced ? [0, 0] : [-4, 0]);
    const rightRotate = useTransform(scrollYProgress, [0.3, 0.8], reduced ? [0, 0] : [4, 0]);
    const supportOpacity = useTransform(scrollYProgress, [0.25, 0.55], reduced ? [1, 1] : [0, 1]);
    return (_jsx("section", { ref: ref, className: "relative overflow-hidden bg-[#D4EDF8] py-24 md:py-32", "aria-labelledby": "insights-title", children: _jsxs(Container, { variant: "page", className: "relative w-full", children: [_jsxs("div", { className: "flex flex-wrap items-end justify-between gap-6", children: [_jsxs("div", { children: [_jsx(Eyebrow, { tone: "brand", children: copy.eyebrow }), _jsx("h2", { id: "insights-title", className: "mt-4 text-section-title text-text", children: copy.title }), _jsx("p", { className: "mt-4 max-w-[36rem] text-body-large text-text-secondary", children: copy.body })] }), _jsxs(Link, { to: "/insights", className: "text-body-small font-semibold text-brand-hover underline underline-offset-[0.22em]", children: [copy.cta, " \u2192"] })] }), _jsxs("div", { className: "mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-10", children: [_jsx(m.article, { style: { clipPath: featuredClip, scale: featuredScale }, children: _jsxs(Link, { to: "/insights", className: "group relative block overflow-hidden rounded-xl border border-brand/25 bg-brand-subtle p-8 no-underline shadow-sm md:min-h-[28rem] md:p-12", children: [_jsx("div", { className: "pointer-events-none absolute inset-0", style: {
                                            backgroundImage: 'radial-gradient(ellipse at 20% 20%, rgb(10 143 216 / 0.28), transparent 50%), radial-gradient(ellipse at 80% 80%, rgb(246 108 42 / 0.18), transparent 45%)',
                                        }, "aria-hidden": "true" }), _jsxs("div", { className: "relative flex h-full flex-col justify-end", children: [_jsx("p", { className: "text-caption font-semibold text-brand-hover", children: copy.featured.meta }), _jsx("h3", { className: "mt-4 max-w-[22ch] text-[clamp(1.75rem,1.2rem+1.5vw,2.75rem)] leading-[1.12] font-semibold tracking-[-0.025em] text-text group-hover:text-brand-active", children: copy.featured.title }), _jsx("p", { className: "mt-5 max-w-[40rem] text-body-large text-text-secondary", children: copy.featured.dek })] })] }) }), _jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(m.article, { style: { x: leftX, rotate: leftRotate, opacity: supportOpacity }, children: _jsxs(Link, { to: "/insights", className: "group block rounded-xl border border-brand/20 bg-brand-subtle p-6 no-underline md:p-8", children: [_jsx("p", { className: "text-caption font-semibold text-brand-hover", children: copy.supporting[0]?.meta }), _jsx("h3", { className: "mt-3 text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] leading-snug font-semibold tracking-[-0.02em] text-text group-hover:text-brand-active", children: copy.supporting[0]?.title })] }) }), _jsx(m.article, { style: { x: rightX, rotate: rightRotate, opacity: supportOpacity }, children: _jsxs(Link, { to: "/insights", className: "group block rounded-xl border border-[#F66C2A]/25 bg-[#FFF8F4] p-6 no-underline md:p-8", children: [_jsx("p", { className: "text-caption font-semibold text-[#C45A20]", children: copy.supporting[1]?.meta }), _jsx("h3", { className: "mt-3 text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] leading-snug font-semibold tracking-[-0.02em] text-text group-hover:text-brand-active", children: copy.supporting[1]?.title })] }) })] })] })] }) }));
}
