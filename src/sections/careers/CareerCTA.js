import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { Button } from '@/components/ui/Button.tsx';
import { careersCopy } from '@/content/careers.ts';
import { useMagnetic, usePointerParallax } from '@/sections/careers/useCareerMotion.ts';
import { Reveal } from '@/sections/home/Reveal.tsx';
function MagneticButton({ children, to }) {
    const reduced = useReducedMotion() === true;
    const magnetic = useMagnetic({ strength: 0.24, disabled: reduced });
    return (_jsx(m.div, { ref: magnetic.ref, style: { x: magnetic.x, y: magnetic.y }, onPointerMove: magnetic.onPointerMove, onPointerLeave: magnetic.onPointerLeave, className: "inline-flex", children: _jsx(Button, { to: to, size: "lg", children: children }) }));
}
export function CareerCultureCta() {
    const reduced = useReducedMotion() === true;
    const ref = useRef(null);
    const pointer = usePointerParallax(reduced);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const geoX = useTransform(pointer.x, [-1, 1], [-30, 30]);
    const geoY = useTransform(pointer.y, [-1, 1], [-20, 20]);
    const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
    const words = careersCopy.cultureCta.headline.split(' ');
    return (_jsxs("section", { ref: ref, className: "relative overflow-hidden bg-bg-subtle py-28 md:py-36", "aria-labelledby": "culture-cta-title", children: [_jsxs(m.div, { className: "pointer-events-none absolute inset-0", "aria-hidden": "true", style: { x: reduced ? 0 : geoX, y: reduced ? 0 : geoY }, children: [_jsx("span", { className: "absolute top-[18%] left-[12%] h-16 w-16 rounded-full border border-brand/25" }), _jsx("span", { className: "absolute top-[30%] right-[18%] h-3 w-3 rounded-full bg-[#F66C2A]" }), _jsx("span", { className: "absolute bottom-[22%] left-[28%] h-24 w-24 rotate-12 rounded-xl border border-[rgb(246_108_42_/0.25)]" }), _jsx("span", { className: "absolute right-[12%] bottom-[28%] h-2 w-28 rounded-full bg-brand/30" }), _jsx("span", { className: "absolute top-[55%] left-[8%] h-2 w-2 rounded-full bg-brand" })] }), _jsxs(Container, { variant: "page", className: "relative w-full", children: [_jsx(m.h2, { id: "culture-cta-title", className: "mx-auto max-w-[16ch] text-center text-[clamp(2.25rem,1.2rem+3vw,4.5rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-text", style: { y: reduced ? 0 : textY }, children: words.map((word, index) => (_jsx(m.span, { className: "mr-[0.28em] inline-block", initial: reduced ? false : { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-10%' }, transition: {
                                duration: reduced ? 0 : 0.55,
                                delay: reduced ? 0 : index * 0.05,
                                ease: [0.2, 0, 0, 1],
                            }, children: word }, `${word}-${index}`))) }), _jsx("div", { className: "mt-10 flex justify-center", children: _jsx(MagneticButton, { to: "/careers#open-positions", children: careersCopy.cultureCta.cta }) })] })] }));
}
export function CareerFinalCta() {
    const reduced = useReducedMotion() === true;
    return (_jsxs("section", { className: "relative overflow-hidden bg-bg py-24 md:py-32", "aria-labelledby": "final-cta-title", children: [_jsx(m.div, { className: "pointer-events-none absolute inset-0", "aria-hidden": "true", animate: reduced
                    ? undefined
                    : { backgroundPosition: ['0% 40%', '100% 60%', '0% 40%'] }, transition: reduced ? { duration: 0 } : { duration: 18, repeat: Infinity, ease: 'easeInOut' }, style: {
                    backgroundImage: 'radial-gradient(ellipse at 20% 40%, rgb(10 143 216 / 0.14), transparent 55%), radial-gradient(ellipse at 80% 60%, rgb(246 108 42 / 0.08), transparent 50%)',
                    backgroundSize: '140% 140%',
                } }), _jsx(Container, { variant: "page", className: "relative w-full", children: _jsxs(Reveal, { className: "max-w-[42rem]", children: [_jsx("h2", { id: "final-cta-title", className: "text-[clamp(2.25rem,1.3rem+2.4vw,3.75rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-text", children: careersCopy.finalCta.headline }), _jsx("p", { className: "mt-5 max-w-[36rem] text-body-large text-text-secondary", children: careersCopy.finalCta.body }), _jsx("div", { className: "mt-8", children: _jsx(MagneticButton, { to: "/careers#open-positions", children: careersCopy.finalCta.cta }) })] }) })] }));
}
