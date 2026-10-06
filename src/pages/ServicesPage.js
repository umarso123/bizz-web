import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { bookCall } from '@/app/navigation.ts';
import { Container } from '@/components/layout/Container.tsx';
import { Button } from '@/components/ui/Button.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { servicesPage } from '@/content/services.ts';
import { cn } from '@/lib/cn.ts';
import { Reveal } from '@/sections/home/Reveal.tsx';
const ease = [0.2, 0, 0, 1];
function ServiceRow({ service, index, hovered, setHovered, reduced, }) {
    const isHovered = hovered === index;
    const neighbor = hovered !== null && hovered !== index && Math.abs(hovered - index) === 1;
    return (_jsx(m.li, { onPointerEnter: () => setHovered(index), onPointerLeave: () => setHovered(null), animate: reduced
            ? undefined
            : {
                y: isHovered ? -3 : neighbor ? 2 : 0,
                scale: isHovered ? 1.01 : 1,
            }, transition: { type: 'spring', stiffness: 280, damping: 24 }, children: _jsxs("article", { id: service.slug, className: "group relative grid scroll-mt-28 gap-4 border-b border-border-subtle py-10 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,26rem)] md:items-baseline md:gap-10 md:py-12", children: [_jsx(m.span, { "aria-hidden": "true", className: "pointer-events-none absolute inset-x-[-1rem] inset-y-2 -z-10 rounded-xl md:inset-x-[-1.5rem]", animate: {
                        opacity: isHovered && !reduced ? 1 : 0,
                        backgroundColor: isHovered ? 'rgb(234 246 252 / 0.85)' : 'transparent',
                    }, transition: { duration: 0.25 } }), _jsx(m.span, { "aria-hidden": "true", className: "absolute top-1/2 left-0 h-10 w-[3px] -translate-y-1/2 rounded-full", animate: {
                        scaleY: isHovered ? 1 : 0.3,
                        opacity: isHovered ? 1 : 0,
                        backgroundColor: isHovered
                            ? index % 2 === 0
                                ? '#0A8FD8'
                                : '#F66C2A'
                            : 'transparent',
                    }, transition: { type: 'spring', stiffness: 300, damping: 24 } }), _jsxs("p", { className: "text-caption text-text-muted", children: ["0", index + 1] }), _jsx("h2", { className: "text-[clamp(1.5rem,1.15rem+1vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.025em] text-text", children: service.title }), _jsx("p", { className: "text-body text-text-secondary", children: service.body })] }) }));
}
export function ServicesPage() {
    const reduced = useReducedMotion() === true;
    const [hovered, setHovered] = useState(null);
    useEffect(() => {
        const previousTitle = document.title;
        document.title = 'Services · Bizaffix';
        return () => {
            document.title = previousTitle;
        };
    }, []);
    return (_jsx(LazyMotion, { features: domAnimation, children: _jsxs("main", { children: [_jsxs("section", { className: "relative overflow-hidden bg-[#D9EFFA] pt-10 pb-20 md:pt-14 md:pb-28", children: [_jsx("div", { className: "pointer-events-none absolute inset-0", style: {
                                backgroundImage: 'radial-gradient(ellipse at 15% 20%, rgb(10 143 216 / 0.22), transparent 50%), radial-gradient(ellipse at 85% 70%, rgb(246 108 42 / 0.14), transparent 45%)',
                            }, "aria-hidden": "true" }), _jsx(Container, { variant: "page", className: "relative w-full", children: _jsxs("div", { className: "grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-20", children: [_jsxs("div", { children: [_jsx(m.div, { initial: reduced ? false : { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.55, ease }, children: _jsx(Eyebrow, { tone: "brand", children: servicesPage.hero.eyebrow }) }), _jsx(m.h1, { className: "mt-4 max-w-[12ch] text-[clamp(2.5rem,1.5rem+2.8vw,4.25rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-text", initial: reduced ? false : { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.08, ease }, children: servicesPage.hero.title }), _jsx(m.p, { className: "mt-6 max-w-[38rem] text-body-large text-text-secondary", initial: reduced ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.16, ease }, children: servicesPage.hero.body }), _jsx(m.div, { className: "mt-8", initial: reduced ? false : { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.24, ease }, children: _jsx(Button, { to: bookCall.to, size: "lg", children: bookCall.label }) })] }), _jsxs(Reveal, { delay: 0.1, children: [_jsx("p", { className: "text-eyebrow text-text-muted uppercase tracking-[0.12em]", children: "From idea to reality" }), _jsx("p", { className: "mt-4 text-title text-text", children: servicesPage.intro.title }), _jsx("p", { className: "mt-4 text-body text-text-secondary", children: servicesPage.intro.body })] })] }) })] }), _jsx("section", { className: "bg-[#FFF1E8] py-20 md:py-28", "aria-labelledby": "services-list-title", children: _jsxs(Container, { variant: "page", className: "w-full", children: [_jsxs(Reveal, { className: "max-w-[36rem]", children: [_jsx(Eyebrow, { tone: "brand", children: "What we offer" }), _jsx("h2", { id: "services-list-title", className: "mt-4 text-section-title text-text", children: "Six practices. One studio." })] }), _jsx("ul", { className: "mt-12 border-t border-border-subtle", children: servicesPage.services.map((service, index) => (_jsx(ServiceRow, { service: service, index: index, hovered: hovered, setHovered: setHovered, reduced: reduced }, service.id))) })] }) }), _jsx("section", { className: "bg-[#D6EEF8] py-20 md:py-28", "aria-labelledby": "process-title", children: _jsxs(Container, { variant: "page", className: "w-full", children: [_jsxs(Reveal, { className: "max-w-[36rem]", children: [_jsx(Eyebrow, { tone: "brand", children: servicesPage.process.eyebrow }), _jsx("h2", { id: "process-title", className: "mt-4 text-section-title text-text", children: servicesPage.process.title })] }), _jsx("ol", { className: "mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2 lg:grid-cols-3", children: servicesPage.process.stages.map((stage, index) => (_jsx("li", { children: _jsxs(Reveal, { delay: index * 0.04, children: [_jsx("p", { className: "text-[clamp(2.25rem,1.8rem+1.2vw,3.25rem)] leading-none font-medium tracking-[-0.03em] text-brand", children: stage.number }), _jsx("h3", { className: "mt-4 text-title text-text", children: stage.title }), _jsx("p", { className: "mt-3 max-w-[28rem] text-body text-text-secondary", children: stage.body }), _jsx("span", { "aria-hidden": "true", className: cn('mt-6 block h-px origin-left bg-gradient-to-r from-brand to-transparent', index % 2 === 0 ? 'w-16' : 'w-24') })] }) }, stage.number))) })] }) }), _jsx("section", { className: "bg-[#FFE8DA] py-16 md:py-20", "aria-labelledby": "tech-title", children: _jsx(Container, { variant: "page", className: "w-full", children: _jsxs(Reveal, { className: "flex flex-col gap-8 md:flex-row md:items-end md:justify-between", children: [_jsxs("div", { className: "max-w-[28rem]", children: [_jsx(Eyebrow, { children: servicesPage.technologies.eyebrow }), _jsx("h2", { id: "tech-title", className: "mt-3 text-title text-text", children: servicesPage.technologies.title })] }), _jsx("ul", { className: "flex flex-wrap gap-x-6 gap-y-2", children: servicesPage.technologies.items.map((name) => (_jsx("li", { className: "text-body text-text-secondary", children: name }, name))) })] }) }) }), _jsx("section", { className: "bg-[#CFE9F7] py-20 md:py-28", "aria-labelledby": "industries-title", children: _jsxs(Container, { variant: "page", className: "w-full", children: [_jsxs(Reveal, { className: "max-w-[36rem]", children: [_jsx(Eyebrow, { tone: "brand", children: servicesPage.industries.eyebrow }), _jsx("h2", { id: "industries-title", className: "mt-4 text-section-title text-text", children: servicesPage.industries.title })] }), _jsx("ul", { className: "mt-12 flex flex-wrap gap-3", children: servicesPage.industries.items.map((industry, index) => (_jsx(Reveal, { delay: index * 0.04, children: _jsx("li", { className: cn('rounded-md border px-5 py-3 text-body font-semibold', industry === 'Healthcare'
                                            ? 'border-brand/30 bg-brand-subtle text-brand-hover'
                                            : 'border-border bg-surface text-text'), children: industry }) }, industry))) }), _jsx(Reveal, { className: "mt-8", children: _jsx(Button, { to: "/healthcare", variant: "secondary", children: "Explore healthcare" }) })] }) }), _jsxs("section", { className: "relative overflow-hidden bg-[#FFE6D4] py-24 md:py-32", "aria-labelledby": "services-cta-title", children: [_jsx("div", { className: "pointer-events-none absolute inset-0", style: {
                                backgroundImage: 'radial-gradient(ellipse at 20% 40%, rgb(10 143 216 / 0.2), transparent 55%), radial-gradient(ellipse at 80% 60%, rgb(246 108 42 / 0.22), transparent 50%)',
                            }, "aria-hidden": "true" }), _jsx(Container, { variant: "page", className: "relative w-full", children: _jsxs(Reveal, { className: "max-w-[42rem]", children: [_jsx("h2", { id: "services-cta-title", className: "text-[clamp(2.25rem,1.3rem+2.4vw,3.5rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-text", children: servicesPage.cta.title }), _jsx("p", { className: "mt-5 max-w-[36rem] text-body-large text-text-secondary", children: servicesPage.cta.body }), _jsx("div", { className: "mt-8", children: _jsx(Button, { to: bookCall.to, size: "lg", children: bookCall.label }) })] }) })] })] }) }));
}
