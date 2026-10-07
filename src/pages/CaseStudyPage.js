import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { Container } from '@/components/layout/Container.tsx';
import { getCaseStudy, workPageContent } from '@/content/work.ts';
import { cn } from '@/lib/cn.ts';
const ease = [0.22, 1, 0.36, 1];
function CaseMedia({ src, alt, title }) {
    const [failed, setFailed] = useState(false);
    return (_jsxs("div", { className: "relative aspect-16/10 overflow-hidden rounded-[1.75rem] bg-brand-soft shadow-card ring-1 ring-border-subtle md:rounded-[2.25rem]", children: [_jsx("div", { "aria-hidden": "true", className: "absolute inset-0", style: {
                    background: 'linear-gradient(145deg, #e8eefc 0%, #fef6d8 45%, #d9e3fb 100%)',
                } }), src && !failed ? (_jsx("img", { src: src, alt: alt, className: "absolute inset-0 h-full w-full object-cover", onError: () => setFailed(true) })) : (_jsx("div", { className: "absolute inset-0 flex items-center justify-center px-6 text-center", children: _jsx("p", { className: "text-[clamp(1.5rem,1.1rem+1.5vw,2.5rem)] font-bold tracking-tight text-text/80", children: title }) }))] }));
}
/**
 * Single case study — Productea-style detail:
 * title, category, summary, challenge / solution, services.
 */
export function CaseStudyPage() {
    const { slug } = useParams();
    const reduced = useReducedMotion() === true;
    const study = slug ? getCaseStudy(slug) : undefined;
    useEffect(() => {
        if (!study)
            return;
        const previous = document.title;
        document.title = `${study.title} · Bizaffix`;
        return () => {
            document.title = previous;
        };
    }, [study]);
    if (!study) {
        return _jsx(Navigate, { to: "/work", replace: true });
    }
    return (_jsx(LazyMotion, { features: domAnimation, children: _jsxs("main", { className: "relative min-h-svh overflow-x-clip bg-page-white pb-20 md:pb-28", children: [_jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-x-0 top-0 h-88", style: {
                        background: 'radial-gradient(ellipse 50% 60% at 85% 0%, rgb(201 215 248 / 0.5), transparent 58%)',
                    } }), _jsxs(Container, { variant: "wide", className: "relative z-10 w-full pt-8 md:pt-12", children: [_jsxs(Link, { to: "/work", className: "inline-flex items-center gap-2 text-body-small font-semibold text-text-secondary no-underline transition-colors hover:text-brand", children: [_jsx("span", { "aria-hidden": "true", children: "\u2190" }), workPageContent.backLabel] }), _jsxs(m.div, { initial: reduced ? false : { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, ease }, children: [_jsx("p", { className: "mt-8 text-eyebrow font-semibold tracking-widest text-brand uppercase", children: study.category }), _jsx("h1", { className: "mt-3 max-w-[16ch] text-page-title text-text md:text-display", children: study.title }), _jsx("p", { className: "mt-5 max-w-160 text-body-large text-text-secondary", children: study.description })] }), _jsx(m.div, { className: "mt-10 md:mt-14", initial: reduced ? false : { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay: 0.08, ease }, children: _jsx(CaseMedia, { src: study.image, alt: `${study.title} visual`, title: study.title }) }), (study.challenge || study.solution) && (_jsxs("div", { className: "mt-14 grid gap-10 border-t border-border pt-12 md:mt-16 md:grid-cols-2 md:gap-14 md:pt-16", children: [study.challenge ? (_jsxs("section", { children: [_jsx("h2", { className: "text-title text-text", children: "Challenge" }), _jsx("p", { className: "mt-4 text-body text-text-secondary", children: study.challenge })] })) : null, study.solution ? (_jsxs("section", { children: [_jsx("h2", { className: "text-title text-text", children: "Solution" }), _jsx("p", { className: "mt-4 text-body text-text-secondary", children: study.solution })] })) : null] })), _jsxs("section", { className: "mt-12 border-t border-border pt-10 md:mt-16 md:pt-12", children: [_jsx("h2", { className: "text-eyebrow font-semibold tracking-[0.12em] text-text-muted uppercase", children: "Services" }), _jsx("ul", { className: "mt-5 flex flex-wrap gap-2", children: study.services.map((service) => (_jsx("li", { className: cn('rounded-pill border border-border bg-surface px-3.5 py-1.5', 'text-[0.78rem] font-semibold text-text'), children: service }, service))) })] }), _jsx("div", { className: "mt-14 md:mt-16", children: _jsxs(Link, { to: workPageContent.ctaTo, className: "inline-flex min-h-(--button-height-desktop) items-center rounded-pill bg-brand px-7 text-body-small font-semibold text-text-inverse no-underline shadow-lg transition-colors hover:bg-brand-hover", children: [workPageContent.ctaLabel, _jsx("span", { "aria-hidden": "true", className: "ms-2", children: "\u2192" })] }) })] })] }) }));
}
