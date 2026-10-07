import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { bookCall } from '@/app/navigation.ts';
import { Container } from '@/components/layout/Container.tsx';
import { Button } from '@/components/ui/Button.tsx';
import { homeContent } from '@/content/home.ts';
import { cn } from '@/lib/cn.ts';
const ease = [0.2, 0, 0, 1];
function Rise({ delay, children }) {
    const reduced = useReducedMotion() === true;
    return (_jsx(m.div, { initial: reduced ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.6, delay: reduced ? 0 : delay, ease }, children: children }));
}
export function Hero() {
    const reduced = useReducedMotion() === true;
    const copy = homeContent.hero;
    return (_jsx(LazyMotion, { features: domAnimation, children: _jsxs("section", { className: "atmosphere-hero relative overflow-x-clip pt-(--header-clearance) pb-16 md:pb-20", "aria-labelledby": "hero-title", children: [_jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -top-10 right-[-8%] h-[min(70vh,36rem)] w-[min(70vw,40rem)] rounded-full opacity-90 blur-3xl", style: {
                        background: 'radial-gradient(circle at 40% 40%, rgb(47 91 234 / 0.55), rgb(201 215 248 / 0.35) 45%, transparent 70%)',
                    } }), _jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute bottom-[-10%] left-[-5%] h-64 w-64 rounded-full bg-accent-soft/80 blur-3xl" }), _jsxs(Container, { variant: "page", className: "relative z-10 w-full", children: [_jsxs("div", { className: "flex max-w-[52rem] flex-col items-start", children: [_jsx(Rise, { delay: 0.08, children: _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx("span", { className: "inline-flex rounded-full bg-accent-soft px-3.5 py-1.5 text-[0.78rem] font-semibold text-text", children: copy.badge }), _jsx("span", { className: "text-body-small text-text-muted", children: copy.support })] }) }), _jsxs(m.h1, { id: "hero-title", className: "mt-7 text-display text-text md:mt-8", initial: reduced ? false : { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.65, delay: reduced ? 0 : 0.16, ease }, children: [copy.titleLead, _jsx("br", {}), copy.titleMid, _jsx("br", {}), copy.titleEnd, ' ', _jsx("span", { className: "text-brand", children: copy.titleAccent })] }), _jsx(Rise, { delay: 0.28, children: _jsx("p", { className: "mt-6 max-w-[36rem] text-body-large text-text-secondary md:mt-7", children: copy.body }) }), _jsx(Rise, { delay: 0.38, children: _jsxs("div", { className: "mt-8 flex flex-wrap items-center gap-3", children: [_jsxs(Button, { to: bookCall.to, variant: "brand", size: "lg", children: [copy.primaryCta, _jsx("span", { "aria-hidden": "true", children: "\u2192" })] }), _jsx(Button, { to: "/#featured-projects", variant: "secondary", size: "lg", children: copy.secondaryCta })] }) })] }), _jsx(Rise, { delay: 0.48, children: _jsx("ul", { className: "mt-14 grid gap-4 sm:grid-cols-3 md:mt-16 md:gap-5", children: copy.stats.map((stat) => (_jsxs("li", { className: cn('rounded-[1.75rem] px-6 py-7 shadow-card md:rounded-[2rem] md:px-7 md:py-8', stat.tone === 'brand'
                                        ? 'bg-brand text-white'
                                        : 'border border-border-subtle bg-surface text-text'), children: [_jsx("p", { className: cn('text-[clamp(1.65rem,1.2rem+1.4vw,2.35rem)] leading-none font-bold tracking-tighter', stat.tone === 'brand' ? 'text-white' : 'text-text'), children: stat.value }), _jsx("p", { className: cn('mt-3 text-body-small leading-snug', stat.tone === 'brand' ? 'text-white/80' : 'text-text-secondary'), children: stat.label })] }, stat.id))) }) })] })] }) }));
}
