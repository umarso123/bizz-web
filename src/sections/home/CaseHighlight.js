import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/layout/Container.tsx';
import { homeContent } from '@/content/home.ts';
const ease = [0.22, 1, 0.36, 1];
export function CaseHighlight() {
    const reduced = useReducedMotion() === true;
    const copy = homeContent.caseHighlight;
    return (_jsx("section", { id: "proof", className: "relative overflow-x-clip bg-page-white section-y", "aria-labelledby": "case-highlight-title", children: _jsx(Container, { variant: "wide", className: "relative w-full", children: _jsxs(m.figure, { className: "relative overflow-hidden rounded-[2.15rem] px-7 py-11 shadow-card md:rounded-[2.75rem] md:px-14 md:py-16", style: {
                    background: 'linear-gradient(110deg, #fef6d8 0%, #fbf7f2 38%, #e8eefc 78%, #d9e3fb 100%)',
                }, initial: reduced ? false : { opacity: 0, y: 22, scale: 0.985 }, whileInView: reduced ? undefined : { opacity: 1, y: 0, scale: 1 }, viewport: { once: true, amount: 0.35 }, transition: { duration: 0.65, ease }, children: [_jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -top-16 -left-10 h-48 w-48 rounded-full bg-accent/40 blur-3xl" }), _jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute -right-12 -bottom-20 h-64 w-64 rounded-full bg-brand/25 blur-3xl" }), _jsxs("blockquote", { className: "relative", children: [_jsx("span", { "aria-hidden": "true", className: "mb-6 block text-[3.5rem] leading-none font-bold text-brand/25 md:text-[4.5rem]", children: "\u201C" }), _jsx("p", { id: "case-highlight-title", className: "max-w-160 text-[clamp(1.4rem,1.05rem+1.3vw,2.25rem)] leading-tight font-bold tracking-tight text-text", children: copy.quote })] }), _jsxs("figcaption", { className: "relative mt-12 flex items-center gap-4", children: [_jsx("span", { "aria-hidden": "true", className: "size-12 shrink-0 rounded-full bg-brand shadow-[0_10px_28px_rgb(47_91_234/0.35)] ring-4 ring-white/60" }), _jsxs("div", { children: [_jsx("p", { className: "text-body-small font-semibold text-text", children: copy.role }), _jsx("p", { className: "text-caption text-text-muted", children: copy.meta })] })] })] }) }) }));
}
