import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m, useReducedMotion, useScroll, useSpring, useTransform, } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button.tsx';
import { Container } from '@/components/layout/Container.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { careersCopy, heroFragments } from '@/content/careers.ts';
import { cn } from '@/lib/cn.ts';
import { useMagnetic, usePointerParallax } from '@/sections/careers/useCareerMotion.ts';
const ease = [0.2, 0, 0, 1];
const fragments = [
    { label: 'DESIGN', left: '8%', top: '18%', depth: 28, rotate: -6, size: 'md' },
    { label: 'ENGINEERING', left: '72%', top: '14%', depth: 40, accent: true, rotate: 5, size: 'md' },
    { label: 'AI', left: '18%', top: '62%', depth: 18, rotate: 8, size: 'sm', accent: true },
    { label: 'HEALTHCARE', left: '58%', top: '58%', depth: 34, rotate: -4, size: 'lg' },
    { label: 'PRODUCT', left: '78%', top: '42%', depth: 22, rotate: 3, size: 'sm' },
    { label: 'IMPACT', left: '38%', top: '28%', depth: 46, accent: true, rotate: -8, size: 'md' },
];
const orbs = [
    { left: '12%', top: '40%', size: 9, accent: false, depth: 16 },
    { left: '86%', top: '28%', size: 6, accent: true, depth: 30 },
    { left: '48%', top: '72%', size: 7, accent: false, depth: 24 },
    { left: '64%', top: '20%', size: 4, accent: true, depth: 12 },
    { left: '30%', top: '78%', size: 5, accent: false, depth: 36 },
];
function MagneticCta({ children, to, variant = 'primary', }) {
    const reduced = useReducedMotion() === true;
    const magnetic = useMagnetic({ strength: 0.22, disabled: reduced });
    return (_jsx(m.div, { ref: magnetic.ref, style: { x: magnetic.x, y: magnetic.y }, onPointerMove: magnetic.onPointerMove, onPointerLeave: magnetic.onPointerLeave, className: "inline-flex", children: _jsx(Button, { to: to, size: "lg", variant: variant, children: children }) }));
}
function FloatingFragment({ fragment, pointerX, pointerY, scrollY, index, reduced, }) {
    const px = useTransform(pointerX, [-1, 1], [-fragment.depth, fragment.depth]);
    const py = useTransform(pointerY, [-1, 1], [-fragment.depth * 0.7, fragment.depth * 0.7]);
    const scrollShiftX = useTransform(scrollY, [0, 1], [0, (index % 2 === 0 ? -1 : 1) * (80 + index * 28)]);
    const scrollShiftY = useTransform(scrollY, [0, 1], [0, 40 + index * 36]);
    const scrollRotate = useTransform(scrollY, [0, 1], [fragment.rotate, fragment.rotate + (index % 2 === 0 ? 12 : -14)]);
    const opacity = useTransform(scrollY, [0, 0.55, 0.85], [1, 0.85, 0.15]);
    const x = useTransform([px, scrollShiftX], ([a, b]) => a + b);
    const y = useTransform([py, scrollShiftY], ([a, b]) => a + b);
    const sizeClass = fragment.size === 'lg'
        ? 'px-5 py-3 text-[0.7rem] tracking-[0.18em]'
        : fragment.size === 'md'
            ? 'px-4 py-2.5 text-[0.65rem] tracking-[0.16em]'
            : 'px-3 py-2 text-[0.6rem] tracking-[0.14em]';
    return (_jsx(m.div, { className: cn('pointer-events-none absolute hidden select-none rounded-md border font-semibold uppercase md:block', sizeClass, fragment.accent
            ? 'border-[rgb(246_108_42_/0.35)] bg-[rgb(246_108_42_/0.08)] text-[#F66C2A]'
            : 'border-[rgb(10_143_216_/0.28)] bg-[rgb(10_143_216_/0.07)] text-brand-hover'), style: {
            left: fragment.left,
            top: fragment.top,
            x: reduced ? 0 : x,
            y: reduced ? 0 : y,
            rotate: reduced ? fragment.rotate : scrollRotate,
            opacity: reduced ? 1 : opacity,
        }, animate: reduced
            ? undefined
            : {
                y: [0, index % 2 === 0 ? -10 : 12, 0],
                rotate: [fragment.rotate, fragment.rotate + (index % 2 === 0 ? 2 : -2), fragment.rotate],
            }, transition: reduced
            ? { duration: 0 }
            : { duration: 7 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }, children: fragment.label }));
}
function FloatingOrb({ orb, pointerX, pointerY, scrollY, index, reduced, }) {
    const ox = useTransform(pointerX, [-1, 1], [-orb.depth, orb.depth]);
    const oy = useTransform(pointerY, [-1, 1], [-orb.depth * 0.6, orb.depth * 0.6]);
    const sy = useTransform(scrollY, [0, 1], [0, 60 + index * 20]);
    const y = useTransform([oy, sy], ([a, b]) => a + b);
    return (_jsx(m.span, { "aria-hidden": "true", className: cn('pointer-events-none absolute hidden rounded-full md:block', orb.accent ? 'bg-[#F66C2A]/70' : 'bg-brand/55'), style: {
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            x: reduced ? 0 : ox,
            y: reduced ? 0 : y,
        }, animate: reduced ? undefined : { scale: [1, 1.35, 1], opacity: [0.45, 0.9, 0.45] }, transition: reduced
            ? { duration: 0 }
            : { duration: 4.5 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 } }));
}
function ConnectionLines({ progress, reduced }) {
    const pathLength = useSpring(useTransform(progress, [0.15, 0.7], [0, 1]), {
        stiffness: 80,
        damping: 24,
    });
    const opacity = useTransform(progress, [0.1, 0.35, 0.75, 0.95], [0, 0.7, 0.55, 0]);
    return (_jsxs(m.svg, { className: "pointer-events-none absolute inset-0 hidden h-full w-full md:block", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", style: { opacity: reduced ? 0.25 : opacity }, children: [_jsx(m.path, { d: "M18 22 C 34 18, 42 36, 52 30 S 70 18, 82 24", fill: "none", stroke: "rgb(10 143 216 / 0.35)", strokeWidth: "0.2", style: { pathLength: reduced ? 1 : pathLength } }), _jsx(m.path, { d: "M22 68 C 38 54, 48 62, 58 52 S 74 48, 84 42", fill: "none", stroke: "rgb(246 108 42 / 0.3)", strokeWidth: "0.18", style: { pathLength: reduced ? 1 : pathLength } }), _jsx(m.path, { d: "M40 30 C 48 48, 36 58, 44 74", fill: "none", stroke: "rgb(10 143 216 / 0.22)", strokeWidth: "0.16", style: { pathLength: reduced ? 1 : pathLength } })] }));
}
export function CareerHero() {
    const reduced = useReducedMotion() === true;
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });
    const pointer = usePointerParallax(reduced);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.45, 0.7], [1, 0.85, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.7], [0, -80]);
    const atmosphereX = useTransform(pointer.x, [-1, 1], [-24, 24]);
    const atmosphereY = useTransform(pointer.y, [-1, 1], [-16, 16]);
    return (_jsx("section", { ref: sectionRef, className: "relative -mt-24 h-[180vh] bg-bg md:h-[220vh]", "aria-labelledby": "careers-hero-title", children: _jsxs("div", { className: "sticky top-0 flex min-h-svh items-center overflow-hidden", children: [_jsx(m.div, { className: "pointer-events-none absolute inset-0", "aria-hidden": "true", style: { x: reduced ? 0 : atmosphereX, y: reduced ? 0 : atmosphereY }, children: _jsx("div", { className: "absolute inset-0", style: {
                            backgroundImage: 'radial-gradient(ellipse at 18% 30%, rgb(10 143 216 / 0.14), transparent 55%), radial-gradient(ellipse at 82% 58%, rgb(246 108 42 / 0.09), transparent 50%), radial-gradient(ellipse at 50% 100%, rgb(10 143 216 / 0.06), transparent 45%)',
                        } }) }), _jsx(ConnectionLines, { progress: scrollYProgress, reduced: reduced }), fragments.map((fragment, index) => (_jsx(FloatingFragment, { fragment: fragment, pointerX: pointer.x, pointerY: pointer.y, scrollY: scrollYProgress, index: index, reduced: reduced }, fragment.label))), orbs.map((orb, index) => (_jsx(FloatingOrb, { orb: orb, pointerX: pointer.x, pointerY: pointer.y, scrollY: scrollYProgress, index: index, reduced: reduced }, `${orb.left}-${orb.top}`))), _jsx(Container, { variant: "page", className: "relative z-10 w-full py-28 md:py-32", children: _jsxs(m.div, { className: "mx-auto flex max-w-[46rem] flex-col items-center text-center", style: { opacity: reduced ? 1 : contentOpacity, y: reduced ? 0 : contentY }, children: [_jsx(m.div, { initial: reduced ? false : { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.1, ease }, children: _jsx(Eyebrow, { tone: "brand", className: "uppercase tracking-[0.14em]", children: careersCopy.hero.eyebrow }) }), _jsx(m.h1, { id: "careers-hero-title", className: "mt-5 text-[clamp(2.75rem,1.6rem+3.2vw,5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-text", initial: reduced ? false : { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.65, delay: reduced ? 0 : 0.2, ease }, children: careersCopy.hero.headline }), _jsx(m.p, { className: "mt-6 max-w-[36rem] text-body-large text-text-secondary", initial: reduced ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.32, ease }, children: careersCopy.hero.body }), _jsxs(m.div, { className: "mt-10 flex flex-wrap items-center justify-center gap-3", initial: reduced ? false : { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.44, ease }, children: [_jsx(MagneticCta, { to: "/careers#open-positions", children: careersCopy.hero.primaryCta }), _jsx(MagneticCta, { to: "/careers#life-at-bizaffix", variant: "secondary", children: careersCopy.hero.secondaryCta })] })] }) })] }) }));
}
