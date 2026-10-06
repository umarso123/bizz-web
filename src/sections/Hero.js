import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { bookCall } from '@/app/navigation.ts';
import { Container } from '@/components/layout/Container.tsx';
import { Button } from '@/components/ui/Button.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { DyeWhorl } from '@/components/ui/dye-whorl.tsx';
import { homeContent } from '@/content/home.ts';
import { floatingPortalColor } from '@/sections/home/FloatingHero.tsx';
import { HeroVisual } from '@/sections/HeroVisual.tsx';
const ease = [0.2, 0, 0, 1];
function Rise({ delay, children }) {
    const reduced = useReducedMotion() === true;
    return (_jsx(m.div, { initial: reduced ? false : { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.55, delay: reduced ? 0 : delay, ease }, children: children }));
}
export function Hero() {
    const reduced = useReducedMotion() === true;
    const copy = homeContent.hero;
    return (_jsx(LazyMotion, { features: domAnimation, children: _jsx("section", { className: "relative min-h-svh overflow-x-clip", style: { backgroundColor: floatingPortalColor }, children: _jsx(DyeWhorl, { className: "min-h-svh", style: { backgroundColor: floatingPortalColor, ['--background']: floatingPortalColor }, children: _jsx("div", { className: "flex min-h-svh flex-col justify-center pt-(--header-clearance) pb-12", children: _jsx(Container, { variant: "page", className: "relative w-full", children: _jsxs("div", { className: "grid items-center gap-10 lg:grid-cols-2 lg:gap-16", children: [_jsxs("div", { className: "flex max-w-[36rem] flex-col items-start gap-6", children: [_jsx(Rise, { delay: 0.12, children: _jsx(Eyebrow, { tone: "brand", children: copy.eyebrow }) }), _jsx(m.h1, { className: "text-display text-text", initial: reduced ? false : { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.22, ease }, children: copy.title }), _jsx(Rise, { delay: 0.34, children: _jsx("p", { className: "max-w-[38rem] text-body-large text-text-secondary", children: copy.body }) }), _jsx(Rise, { delay: 0.46, children: _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx(Button, { to: bookCall.to, children: copy.primaryCta }), _jsx(Button, { to: "/work", variant: "secondary", children: copy.secondaryCta })] }) }), _jsx(Rise, { delay: 0.56, children: _jsx("p", { className: "text-caption font-semibold tracking-[0.08em] text-text-muted uppercase", children: copy.positioning }) })] }), _jsx(HeroVisual, {})] }) }) }) }) }) }));
}
