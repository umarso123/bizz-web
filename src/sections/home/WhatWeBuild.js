import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, m, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, } from 'framer-motion';
import { useId, useRef, useState } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { homeContent } from '@/content/home.ts';
import { useMediaQuery } from '@/sections/home/homeJourney.ts';
import { cn } from '@/lib/cn.ts';
const copy = homeContent.whatWeBuild;
const caps = copy.capabilities;
const N = caps.length;
const LABELS = [
    ['Evidence', 'Decision', 'Pathway'],
    ['Patient', 'Consult', 'Provider'],
    ['System', 'Exchange', 'System'],
    ['Record', 'Workflow', 'Layer'],
    ['Platform', 'Interop', 'Platform'],
    ['Web', 'Experience', 'Mobile'],
];
/** Node layouts — continuous morph across chapters */
const LAYOUTS = [
    [
        { x: 260, y: 210 },
        { x: 260, y: 90 },
        { x: 130, y: 150 },
        { x: 390, y: 150 },
        { x: 150, y: 310 },
        { x: 370, y: 310 },
        { x: 260, y: 350 },
    ],
    [
        { x: 150, y: 210 },
        { x: 370, y: 210 },
        { x: 260, y: 120 },
        { x: 260, y: 300 },
        { x: 120, y: 110 },
        { x: 400, y: 110 },
        { x: 260, y: 350 },
    ],
    [
        { x: 260, y: 210 },
        { x: 130, y: 100 },
        { x: 390, y: 100 },
        { x: 130, y: 320 },
        { x: 390, y: 320 },
        { x: 260, y: 70 },
        { x: 260, y: 350 },
    ],
    [
        { x: 260, y: 190 },
        { x: 260, y: 90 },
        { x: 260, y: 290 },
        { x: 155, y: 140 },
        { x: 365, y: 140 },
        { x: 155, y: 250 },
        { x: 365, y: 250 },
    ],
    [
        { x: 260, y: 210 },
        { x: 120, y: 110 },
        { x: 400, y: 110 },
        { x: 100, y: 250 },
        { x: 420, y: 250 },
        { x: 170, y: 340 },
        { x: 350, y: 340 },
    ],
    [
        { x: 180, y: 190 },
        { x: 360, y: 230 },
        { x: 260, y: 110 },
        { x: 140, y: 300 },
        { x: 400, y: 310 },
        { x: 260, y: 270 },
        { x: 300, y: 80 },
    ],
];
const EDGES = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [2, 3],
    [4, 5],
];
function stage(p) {
    return Math.min(N - 1, Math.max(0, Math.floor(p * N)));
}
function stageF(p) {
    return Math.min(N - 1, Math.max(0, p * (N - 0.001)));
}
/* -------------------------------------------------------------------------- */
/* Flowing paths — match reference: blue cluster up top, orange below          */
/* -------------------------------------------------------------------------- */
function FlowPaths({ progress, reduced, dense, gid, }) {
    const y = useTransform(progress, [0, 1], reduced ? [0, 0] : [18, -36]);
    const x = useTransform(progress, [0, 1], reduced ? [0, 0] : [-12, 24]);
    const bend = useTransform(progress, [0, 0.5, 1], reduced ? [0, 0, 0] : [0, 16, -14]);
    const draw = useSpring(useTransform(progress, [0, 0.2, 1], reduced ? [1, 1, 1] : [0.35, 0.75, 1]), {
        stiffness: 40,
        damping: 28,
    });
    // Paths tuned to look like the mock: soft S-curves through the stage
    const blue = dense
        ? [
            { d: 'M-100 210 C 220 140, 480 280, 780 190 S 1180 100, 1600 170', w: 2.4, o: 0.55 },
            { d: 'M-80 240 C 240 170, 500 310, 800 220 S 1200 130, 1580 200', w: 1.6, o: 0.4 },
            { d: 'M-60 270 C 260 200, 520 340, 820 250 S 1220 160, 1560 230', w: 1.1, o: 0.28 },
        ]
        : [
            { d: 'M-100 220 C 220 150, 480 290, 780 200 S 1180 110, 1600 180', w: 2.2, o: 0.5 },
            { d: 'M-60 260 C 260 190, 520 330, 820 240 S 1220 150, 1560 220', w: 1.2, o: 0.3 },
        ];
    const orange = dense
        ? [
            { d: 'M-100 360 C 240 280, 500 460, 800 340 S 1160 240, 1600 320', w: 2.6, o: 0.7 },
            { d: 'M-80 390 C 260 310, 520 490, 820 370 S 1180 270, 1580 350', w: 1.7, o: 0.45 },
            { d: 'M-60 420 C 280 340, 540 520, 840 400 S 1200 300, 1560 380', w: 1.15, o: 0.3 },
        ]
        : [
            { d: 'M-100 370 C 240 290, 500 470, 800 350 S 1160 250, 1600 330', w: 2.4, o: 0.65 },
            { d: 'M-60 410 C 280 330, 540 510, 840 390 S 1200 290, 1560 370', w: 1.3, o: 0.35 },
        ];
    return (_jsxs(m.svg, { className: "pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible", viewBox: "0 0 1440 900", preserveAspectRatio: "xMidYMid slice", "aria-hidden": "true", style: { x, y }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: `${gid}-blue`, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#0A8FD8", stopOpacity: "0" }), _jsx("stop", { offset: "25%", stopColor: "#0A8FD8", stopOpacity: "0.55" }), _jsx("stop", { offset: "55%", stopColor: "#0A8FD8", stopOpacity: "0.9" }), _jsx("stop", { offset: "100%", stopColor: "#0A8FD8", stopOpacity: "0" })] }), _jsxs("linearGradient", { id: `${gid}-orange`, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#F66C2A", stopOpacity: "0" }), _jsx("stop", { offset: "25%", stopColor: "#F66C2A", stopOpacity: "0.6" }), _jsx("stop", { offset: "55%", stopColor: "#F66C2A", stopOpacity: "1" }), _jsx("stop", { offset: "100%", stopColor: "#F66C2A", stopOpacity: "0" })] })] }), _jsxs(m.g, { style: { y: bend }, children: [blue.map((l) => (_jsx(m.path, { d: l.d, fill: "none", stroke: `url(#${gid}-blue)`, strokeWidth: l.w, strokeLinecap: "round", opacity: l.o, style: { pathLength: draw } }, l.d))), orange.map((l) => (_jsx(m.path, { d: l.d, fill: "none", stroke: `url(#${gid}-orange)`, strokeWidth: l.w, strokeLinecap: "round", opacity: l.o, style: { pathLength: draw } }, l.d)))] })] }));
}
/* -------------------------------------------------------------------------- */
/* Viewfinder + network (center stage from mock)                               */
/* -------------------------------------------------------------------------- */
function Edge({ a, b, progress, accent, }) {
    const d = useTransform(progress, (p) => {
        const f = stageF(p);
        const i0 = Math.floor(f);
        const i1 = Math.min(N - 1, i0 + 1);
        const t = f - i0;
        const A = LAYOUTS[i0];
        const B = LAYOUTS[i1];
        const ax = A[a].x + (B[a].x - A[a].x) * t;
        const ay = A[a].y + (B[a].y - A[a].y) * t;
        const bx = A[b].x + (B[b].x - A[b].x) * t;
        const by = A[b].y + (B[b].y - A[b].y) * t;
        const mx = (ax + bx) / 2 + (accent ? 10 : -8);
        const my = (ay + by) / 2 - 18;
        return `M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`;
    });
    return (_jsx(m.path, { d: d, fill: "none", stroke: accent ? '#F66C2A' : '#0A8FD8', strokeWidth: 1.15, strokeLinecap: "round", opacity: 0.4 }));
}
function Node({ index, progress, reduced, }) {
    const x = useTransform(progress, (p) => {
        const f = stageF(p);
        const i0 = Math.floor(f);
        const i1 = Math.min(N - 1, i0 + 1);
        const t = f - i0;
        return LAYOUTS[i0][index].x + (LAYOUTS[i1][index].x - LAYOUTS[i0][index].x) * t;
    });
    const y = useTransform(progress, (p) => {
        const f = stageF(p);
        const i0 = Math.floor(f);
        const i1 = Math.min(N - 1, i0 + 1);
        const t = f - i0;
        return LAYOUTS[i0][index].y + (LAYOUTS[i1][index].y - LAYOUTS[i0][index].y) * t;
    });
    const hub = index === 0;
    return (_jsxs("g", { children: [hub ? (_jsx(m.circle, { cx: x, cy: y, r: 22, fill: "rgb(10 143 216 / 0.1)", stroke: "#0A8FD8", strokeWidth: 1.5 })) : null, _jsx(m.circle, { cx: x, cy: y, r: hub ? 6 : 4.5, fill: hub || index % 2 === 1 ? '#F66C2A' : '#0A8FD8', animate: reduced ? undefined : { opacity: [0.6, 1, 0.6] }, transition: reduced ? undefined : { duration: 3.2, delay: index * 0.12, repeat: Infinity, ease: 'easeInOut' } })] }));
}
function Viewfinder({ progress, active, reduced, }) {
    const labels = LABELS[active];
    const x = useTransform(progress, [0, 0.2, 0.4, 0.6, 0.8, 1], reduced ? [0, 0, 0, 0, 0, 0] : [20, -10, 16, -12, 8, 0]);
    const scale = useTransform(progress, [0, 0.5, 1], reduced ? [1, 1, 1] : [0.97, 1.02, 1]);
    const rotate = useTransform(progress, [0, 0.35, 0.7, 1], reduced ? [0, 0, 0, 0] : [-0.8, 0.6, -0.5, 0]);
    return (_jsxs(m.div, { className: "relative mx-auto aspect-square w-full max-w-[min(28rem,72vw)]", style: { x, scale, rotate }, children: [_jsx("div", { className: "absolute inset-[6%] rounded-sm bg-white/80 shadow-[0_20px_60px_rgb(23_33_43_/_0.06)]" }), _jsx("span", { className: "absolute top-0 left-0 h-8 w-8 border-t-[2px] border-l-[2px] border-[#0A8FD8]", "aria-hidden": "true" }), _jsx("span", { className: "absolute top-0 right-0 h-8 w-8 border-t-[2px] border-r-[2px] border-[#0A8FD8]", "aria-hidden": "true" }), _jsx("span", { className: "absolute bottom-0 left-0 h-8 w-8 border-b-[2px] border-l-[2px] border-[#0A8FD8]", "aria-hidden": "true" }), _jsx("span", { className: "absolute right-0 bottom-0 h-8 w-8 border-r-[2px] border-b-[2px] border-[#0A8FD8]", "aria-hidden": "true" }), _jsxs("svg", { viewBox: "0 0 520 420", className: "relative z-[1] h-full w-full", "aria-hidden": "true", children: [EDGES.map(([a, b], i) => (_jsx(Edge, { a: a, b: b, progress: progress, accent: i % 3 === 0 }, `${a}-${b}`))), LAYOUTS[0].map((_, i) => (_jsx(Node, { index: i, progress: progress, reduced: reduced }, i)))] }), _jsx(AnimatePresence, { mode: "wait", children: _jsxs(m.div, { className: "pointer-events-none absolute inset-0 z-[2]", initial: reduced ? false : { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: reduced ? undefined : { opacity: 0, y: -6 }, transition: { duration: 0.35 }, children: [_jsx("span", { className: "absolute top-[16%] left-[10%] rounded-full border border-[#0A8FD8]/30 bg-white px-3 py-1 text-[0.7rem] font-medium text-[#0A8FD8] shadow-sm", children: labels[0] }), _jsx("span", { className: "absolute top-[28%] right-[12%] rounded-full border border-[#0A8FD8]/30 bg-white px-3 py-1 text-[0.7rem] font-medium text-[#0A8FD8] shadow-sm", children: labels[1] }), _jsx("span", { className: "absolute bottom-[24%] left-[42%] text-[0.75rem] font-medium text-[#4B5965]", children: labels[2] })] }, active) })] }));
}
/* -------------------------------------------------------------------------- */
/* Left copy + bottom pagination                                               */
/* -------------------------------------------------------------------------- */
function ChapterCopy({ active, reduced, }) {
    const item = caps[active];
    return (_jsx("div", { className: "relative z-10 max-w-[22rem] md:max-w-[26rem]", "aria-live": "polite", children: _jsx(AnimatePresence, { mode: "wait", children: _jsxs(m.div, { initial: reduced ? false : { opacity: 0, y: 20, filter: 'blur(4px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: reduced ? undefined : { opacity: 0, y: -14, filter: 'blur(3px)' }, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] }, children: [_jsx("p", { className: "text-[clamp(4.5rem,3rem+5vw,7rem)] leading-none font-semibold tracking-[-0.05em] text-[#0A8FD8]/35", "aria-hidden": "true", children: item.number }), _jsx("h2", { id: "what-we-build-title", className: "mt-2 max-w-[11ch] text-[clamp(1.85rem,1.3rem+1.5vw,2.65rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-[#17212B]", children: item.title }), _jsx("p", { className: "mt-4 max-w-[24rem] text-[1.05rem] leading-relaxed text-[#67737E]", children: item.body })] }, item.id) }) }));
}
function Pagination({ active }) {
    return (_jsx("ol", { className: "flex items-center justify-center gap-5 md:gap-7", "aria-label": "Capability chapters", children: caps.map((c, i) => (_jsx("li", { children: _jsx("span", { className: cn('text-[0.8rem] font-semibold tracking-[0.04em]', i === active ? 'text-[#0A8FD8]' : 'text-[#B0B8C0]'), "aria-current": i === active ? 'true' : undefined, children: c.number }) }, c.id))) }));
}
/* -------------------------------------------------------------------------- */
/* Variants                                                                    */
/* -------------------------------------------------------------------------- */
function ReducedWhatWeBuild() {
    const [active, setActive] = useState(0);
    const progress = useMotionValue(active / Math.max(1, N - 1));
    return (_jsx("section", { id: "what-we-build", className: "relative overflow-hidden bg-page-white py-20 md:py-28", "aria-labelledby": "what-we-build-title", children: _jsxs(Container, { variant: "page", className: "relative z-10 w-full", children: [_jsx("p", { className: "text-[0.75rem] font-semibold tracking-[0.14em] text-[#0A8FD8] uppercase", children: copy.eyebrow }), _jsx("p", { className: "mt-3 max-w-[36rem] text-body-large text-[#4B5965]", children: copy.body }), _jsxs("div", { className: "mt-12 grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]", children: [_jsxs("div", { children: [_jsx(ChapterCopy, { active: active, reduced: true }), _jsx("div", { className: "mt-10", children: _jsx(Pagination, { active: active }) }), _jsx("div", { className: "mt-6 flex flex-wrap gap-2", children: caps.map((c, i) => (_jsx("button", { type: "button", onClick: () => {
                                            setActive(i);
                                            progress.set(i / Math.max(1, N - 1));
                                        }, className: cn('rounded-full border px-3 py-1.5 text-caption font-semibold', 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus', i === active
                                            ? 'border-[#0A8FD8] text-[#0A8FD8]'
                                            : 'border-[#E4E9ED] text-[#67737E]'), children: c.number }, c.id))) })] }), _jsx(Viewfinder, { progress: progress, active: active, reduced: true })] })] }) }));
}
function MobileWhatWeBuild({ dense }) {
    const ref = useRef(null);
    const gid = useId().replace(/:/g, '');
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
    const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 28 });
    const [active, setActive] = useState(0);
    useMotionValueEvent(smooth, 'change', (v) => setActive(stage(v)));
    return (_jsx("section", { id: "what-we-build", ref: ref, className: "relative h-[400vh] overflow-x-clip bg-page-white", "aria-labelledby": "what-we-build-title", children: _jsxs("div", { className: "sticky top-0 flex min-h-svh flex-col justify-center py-12", children: [_jsx(FlowPaths, { progress: smooth, reduced: false, dense: dense, gid: gid }), _jsxs(Container, { variant: "page", className: "relative z-10 w-full", children: [_jsx(ChapterCopy, { active: active, reduced: false }), _jsx("div", { className: "mt-8 max-w-[20rem]", children: _jsx(Viewfinder, { progress: smooth, active: active, reduced: false }) }), _jsx("div", { className: "mt-10", children: _jsx(Pagination, { active: active }) })] }), _jsx("ol", { className: "sr-only", children: caps.map((c) => (_jsxs("li", { children: [c.number, ". ", c.title, ": ", c.body] }, c.id))) })] }) }));
}
/**
 * What We Build — matched to the Bizaffix light reference:
 * left chapter copy, crop-mark viewfinder, blue/orange flowing paths, bottom 01–06.
 */
export function WhatWeBuild() {
    const reduced = useReducedMotion() === true;
    const desktop = useMediaQuery('(min-width: 1024px)');
    const tablet = useMediaQuery('(min-width: 768px)');
    const gid = useId().replace(/:/g, '');
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end end'],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 28, mass: 0.4 });
    const [active, setActive] = useState(0);
    const pointerRaw = useMotionValue(0);
    const nudge = useSpring(pointerRaw, { stiffness: 100, damping: 22 });
    useMotionValueEvent(smooth, 'change', (v) => setActive(stage(v)));
    if (reduced)
        return _jsx(ReducedWhatWeBuild, {});
    if (!desktop)
        return _jsx(MobileWhatWeBuild, { dense: tablet });
    return (_jsx("section", { id: "what-we-build", ref: ref, className: "relative h-[580vh] overflow-x-clip bg-page-white", "aria-labelledby": "what-we-build-title", onPointerMove: (e) => {
            const r = e.currentTarget.getBoundingClientRect();
            pointerRaw.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        }, onPointerLeave: () => pointerRaw.set(0), children: _jsxs("div", { className: "sticky top-0 h-svh overflow-hidden", children: [_jsx(FlowPaths, { progress: smooth, reduced: false, dense: true, gid: gid }), _jsxs(Container, { variant: "page", className: "relative z-10 flex h-full flex-col justify-center", children: [_jsxs("div", { className: "grid items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-6 xl:gap-10", children: [_jsx(ChapterCopy, { active: active, reduced: false }), _jsx(m.div, { style: { x: nudge }, children: _jsx(Viewfinder, { progress: smooth, active: active, reduced: false }) })] }), _jsx("div", { className: "absolute inset-x-0 bottom-10", children: _jsx(Pagination, { active: active }) })] }), _jsx("ol", { className: "sr-only", children: caps.map((c) => (_jsxs("li", { children: [c.number, ". ", c.title, ": ", c.body] }, c.id))) })] }) }));
}
