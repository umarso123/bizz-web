import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { cn } from '@/lib/cn.ts';
gsap.registerPlugin(useGSAP);
/**
 * Animated brand hexagon mark — Trionn-style magnetic idle motion without Three.js.
 */
export function HeroMark({ className, reduced = false }) {
    const rootRef = useRef(null);
    const markRef = useRef(null);
    const target = useRef({ x: 0, y: 0 });
    const current = useRef({ x: 0, y: 0 });
    useGSAP(() => {
        const root = rootRef.current;
        const mark = markRef.current;
        if (!root || !mark || reduced)
            return;
        const arms = mark.querySelectorAll('.hero-arm');
        const core = mark.querySelector('.hero-core');
        gsap.to(mark, {
            rotate: 360,
            duration: 48,
            repeat: -1,
            ease: 'none',
            transformOrigin: '50% 50%',
        });
        arms.forEach((arm, i) => {
            gsap.to(arm, {
                y: i % 2 === 0 ? -6 : 6,
                duration: 2.4 + i * 0.35,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        });
        gsap.to(core, {
            scale: 1.06,
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            transformOrigin: '50% 50%',
        });
        const onMove = (e) => {
            const r = root.getBoundingClientRect();
            const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
            const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
            target.current.x = nx * 28;
            target.current.y = ny * 18;
        };
        const onLeave = () => {
            target.current.x = 0;
            target.current.y = 0;
        };
        const tick = () => {
            current.current.x += (target.current.x - current.current.x) * 0.08;
            current.current.y += (target.current.y - current.current.y) * 0.08;
            gsap.set(root, {
                x: current.current.x,
                y: current.current.y,
            });
        };
        root.addEventListener('pointermove', onMove);
        root.addEventListener('pointerleave', onLeave);
        gsap.ticker.add(tick);
        return () => {
            root.removeEventListener('pointermove', onMove);
            root.removeEventListener('pointerleave', onLeave);
            gsap.ticker.remove(tick);
        };
    }, { dependencies: [reduced], revertOnUpdate: true });
    return (_jsx("div", { ref: rootRef, className: cn('pointer-events-auto absolute inset-0 flex items-center justify-center', className), "aria-hidden": "true", children: _jsxs("svg", { ref: markRef, viewBox: "0 0 200 200", className: "h-[min(58vw,28rem)] w-[min(58vw,28rem)] opacity-90 md:h-[min(42vw,34rem)] md:w-[min(42vw,34rem)]", children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "hero-mark-stroke", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#0A8FD8" }), _jsx("stop", { offset: "100%", stopColor: "#F66C2A" })] }), _jsxs("filter", { id: "hero-mark-glow", x: "-40%", y: "-40%", width: "180%", height: "180%", children: [_jsx("feGaussianBlur", { stdDeviation: "4", result: "b" }), _jsxs("feMerge", { children: [_jsx("feMergeNode", { in: "b" }), _jsx("feMergeNode", { in: "SourceGraphic" })] })] })] }), _jsx("path", { className: "hero-arm", d: "M100 18 L168 56 L168 144 L100 182 L32 144 L32 56 Z", fill: "none", stroke: "url(#hero-mark-stroke)", strokeWidth: "10", strokeLinejoin: "round", filter: "url(#hero-mark-glow)", opacity: "0.9" }), _jsx("path", { className: "hero-arm", d: "M100 52 L140 74 L140 126 L100 148 L60 126 L60 74 Z", fill: "none", stroke: "#0A8FD8", strokeWidth: "6", strokeLinejoin: "round", opacity: "0.55" }), _jsx("path", { className: "hero-core", d: "M100 72 L128 88 L128 120 L100 136 L72 120 L72 88 Z", fill: "rgb(10 143 216 / 0.12)", stroke: "#F66C2A", strokeWidth: "3.5", strokeLinejoin: "round" }), _jsx("circle", { cx: "100", cy: "104", r: "5", fill: "#0A8FD8" })] }) }));
}
