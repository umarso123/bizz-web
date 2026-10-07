import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/cn.ts';
gsap.registerPlugin(ScrollTrigger, useGSAP);
/**
 * Phrases float left → right on scroll (inspired by Copula’s manifesto drift).
 * Copy grounded in legacy positioning / services.
 * @see https://copula.agency/
 */
const phrases = [
    'Partner in disruption',
    'From idea to reality',
    'Healthcare solutions',
    'Mobile · Web · Cloud',
    "Let's connect",
];
/**
 * Sticky band: each line enters from the left, drifts across,
 * exits right — then the next line takes over.
 */
export function FloatingScrollText() {
    const reduced = useReducedMotion() === true;
    const sectionRef = useRef(null);
    useGSAP(() => {
        const root = sectionRef.current;
        if (!root || reduced)
            return;
        const lines = gsap.utils.toArray('[data-float-line]', root);
        if (lines.length === 0)
            return;
        gsap.set(lines, {
            left: '50%',
            top: '50%',
            xPercent: -50,
            yPercent: -50,
            x: '-95vw',
            opacity: 0,
            force3D: true,
        });
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: root,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.7,
                invalidateOnRefresh: true,
            },
        });
        lines.forEach((line, index) => {
            const at = index * 1.2;
            tl.fromTo(line, { x: '-95vw', opacity: 0 }, { x: '0vw', opacity: 1, ease: 'none', duration: 0.55 }, at);
            tl.to(line, { x: '95vw', opacity: 0, ease: 'none', duration: 0.55 }, at + 0.55);
        });
        requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
        };
    }, { scope: sectionRef, dependencies: [reduced] });
    if (reduced) {
        return (_jsx("section", { id: "manifesto-float", className: "relative overflow-hidden bg-page-white section-y", "aria-label": "Bizaffix manifesto", children: _jsx("ul", { className: "mx-auto flex w-full max-w-(--container-wide) flex-col gap-6 px-(--page-gutter)", children: phrases.map((phrase) => (_jsx("li", { className: "text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-bold tracking-tighter text-text", children: phrase }, phrase))) }) }));
    }
    return (_jsx("section", { id: "manifesto-float", ref: sectionRef, className: "relative h-[360vh] overflow-x-clip bg-page-white [overflow-anchor:none]", "aria-label": "Bizaffix manifesto", children: _jsxs("div", { className: "sticky top-0 flex h-svh items-center overflow-hidden sticky-section", children: [_jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-0", style: {
                        background: 'radial-gradient(ellipse 50% 45% at 15% 50%, rgb(201 215 248 / 0.45), transparent 55%), radial-gradient(ellipse 40% 40% at 85% 50%, rgb(254 246 216 / 0.4), transparent 50%)',
                    } }), _jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-y-0 left-0 z-20 w-[14vw] max-w-48 bg-gradient-to-r from-page-white via-page-white/80 to-transparent" }), _jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-y-0 right-0 z-20 w-[14vw] max-w-48 bg-gradient-to-l from-page-white via-page-white/80 to-transparent" }), _jsx("div", { className: "relative z-10 h-full w-full", children: phrases.map((phrase, index) => (_jsx("p", { "data-float-line": true, className: cn('absolute w-max max-w-none will-change-transform', 'text-[clamp(2.4rem,1.4rem+5vw,6.5rem)] leading-[0.95] font-bold tracking-tighter whitespace-nowrap', index % 2 === 1 ? 'text-brand' : 'text-text'), children: phrase }, phrase))) }), _jsx("p", { className: "pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-caption font-medium tracking-[0.16em] text-text-muted uppercase", children: "Scroll" })] }) }));
}
