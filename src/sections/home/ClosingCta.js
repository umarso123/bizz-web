import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { bookCall } from '@/app/navigation.ts';
import { Container } from '@/components/layout/Container.tsx';
import { Button } from '@/components/ui/Button.tsx';
import { homeContent } from '@/content/home.ts';
import { useMagnetic } from '@/sections/home/homeJourney.ts';
function MagneticButton({ children }) {
    const reduced = useReducedMotion() === true;
    const magnetic = useMagnetic(0.22, reduced);
    return (_jsx(m.div, { ref: magnetic.ref, style: { x: magnetic.x, y: magnetic.y }, onPointerMove: magnetic.onPointerMove, onPointerLeave: magnetic.onPointerLeave, className: "inline-flex", children: _jsx(Button, { to: bookCall.to, size: "lg", children: children }) }));
}
/**
 * Motion: COHERENT ECOSYSTEM
 * Hero network language returns — scattered lines resolve into one center.
 */
export function ClosingCta() {
    const reduced = useReducedMotion() === true;
    const ref = useRef(null);
    const copy = homeContent.cta;
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'center center'],
    });
    const converge = useSpring(useTransform(scrollYProgress, [0.15, 0.75], [0, 1]), {
        stiffness: 70,
        damping: 22,
    });
    const contentY = useSpring(useTransform(scrollYProgress, [0.2, 0.7], [72, 0]), {
        stiffness: 90,
        damping: 24,
    });
    const contentScale = useSpring(useTransform(scrollYProgress, [0.2, 0.7], [0.94, 1]), {
        stiffness: 90,
        damping: 24,
    });
    const glow = useTransform(scrollYProgress, [0.2, 0.7], [0.2, 1]);
    return (_jsxs("section", { ref: ref, className: "relative overflow-hidden bg-page-dark py-28 text-text-inverse md:py-36", "aria-labelledby": "close-title", children: [_jsxs(m.svg, { className: "pointer-events-none absolute inset-0 h-full w-full", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", style: { opacity: reduced ? 0.9 : glow }, children: [[
                        'M8 12 L50 55',
                        'M92 14 L50 55',
                        'M10 88 L50 55',
                        'M90 86 L50 55',
                        'M50 6 L50 55',
                        'M50 94 L50 55',
                        'M20 30 L50 55',
                        'M80 70 L50 55',
                    ].map((d, index) => (_jsx(m.path, { d: d, fill: "none", stroke: index % 2 === 0 ? 'rgb(10 143 216 / 0.45)' : 'rgb(246 108 42 / 0.4)', strokeWidth: "0.12", style: { pathLength: reduced ? 1 : converge } }, d))), _jsx(m.circle, { cx: "50", cy: "55", r: "1.6", fill: "#F66C2A", style: { opacity: reduced ? 0.85 : converge } }), _jsx(m.circle, { cx: "50", cy: "55", r: "4", fill: "none", stroke: "#0A8FD8", strokeWidth: "0.15", style: { opacity: reduced ? 0.5 : converge } })] }), _jsx(Container, { variant: "page", className: "relative w-full", children: _jsxs(m.div, { className: "mx-auto max-w-[42rem] text-center", style: {
                        y: reduced ? 0 : contentY,
                        scale: reduced ? 1 : contentScale,
                    }, children: [_jsx("h2", { id: "close-title", className: "text-[clamp(2.25rem,1.3rem+2.4vw,3.75rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-text-inverse", children: copy.title }), _jsx("p", { className: "mx-auto mt-5 max-w-[34rem] text-body-large text-white/75", children: copy.body }), _jsxs("div", { className: "mt-10 flex flex-wrap items-center justify-center gap-3", children: [_jsx(MagneticButton, { children: bookCall.label }), _jsx(Button, { to: "/work", variant: "secondary", size: "lg", children: copy.secondaryCta })] })] }) })] }));
}
