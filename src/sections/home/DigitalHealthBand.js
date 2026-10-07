import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { m, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router';
import { Container } from '@/components/layout/Container.tsx';
import { premiumHome } from '@/content/premium-home.ts';
import { cn } from '@/lib/cn.ts';
export function DigitalHealthBand() {
    const reduced = useReducedMotion() === true;
    const copy = premiumHome.healthcare;
    return (_jsx("section", { id: "digital-health", className: "relative overflow-hidden bg-page-white section-y", "aria-labelledby": "digital-health-title", children: _jsx(Container, { variant: "wide", className: "relative z-10 w-full", children: _jsxs(m.div, { className: "overflow-hidden rounded-[2.15rem] bg-surface-dark px-6 py-11 text-text-inverse shadow-lg md:rounded-[2.75rem] md:px-12 md:py-16 lg:px-16", style: {
                    backgroundImage: 'radial-gradient(ellipse 58% 72% at 92% 12%, rgb(47 91 234 / 0.55), transparent 58%), radial-gradient(ellipse 42% 48% at 8% 88%, rgb(245 200 76 / 0.22), transparent 52%)',
                }, initial: reduced ? false : { opacity: 0, y: 24 }, whileInView: reduced ? undefined : { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.35 }, transition: { duration: 0.55 }, children: [_jsxs("p", { className: "text-eyebrow font-semibold tracking-[0.08em] text-accent uppercase", children: [copy.index, " \u2014 ", copy.label] }), _jsxs("div", { className: "mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end", children: [_jsxs("div", { children: [_jsx("h2", { id: "digital-health-title", className: "max-w-[14ch] text-section-title text-white", children: copy.title }), _jsx("p", { className: "mt-4 max-w-[36rem] text-body-large text-white/70", children: copy.body })] }), _jsxs("div", { children: [_jsx("ul", { className: "flex flex-wrap gap-2", children: copy.offers.map((offer) => (_jsx("li", { className: "rounded-pill border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.78rem] font-medium text-white/85", children: offer }, offer))) }), _jsxs(Link, { to: copy.ctaTo, className: cn('mt-7 inline-flex min-h-(--button-height) items-center rounded-pill bg-accent px-5 text-body-small font-semibold text-text no-underline', 'transition-colors hover:bg-accent-deep'), children: [copy.cta, _jsx("span", { "aria-hidden": "true", className: "ms-2", children: "\u2192" })] })] })] })] }) }) }));
}
