import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { m, useMotionValueEvent, useReducedMotion, useScroll, useTransform, } from 'framer-motion';
import { useId, useRef, useState } from 'react';
import { Link } from 'react-router';
import { servicesPage } from '@/content/services.ts';
import { useMediaQuery } from '@/sections/home/homeJourney.ts';
const services = servicesPage.services;
const count = services.length;
const chips = {
    android: ['Mobile solutions', 'Business needs'],
    ios: ['Your vision', 'Mobile experiences'],
    flutter: ['Future of mobile', 'Cutting-edge solutions'],
    web: ['Websites', 'Drive results'],
    fullstack: ['Front and back-end', 'Web presence'],
    cloud: ['Scalable cloud', 'Cloud solutions'],
};
const arcRadius = 560;
const arcStep = 0.34;
function travel(portion) {
    if (typeof window === 'undefined')
        return portion * 900;
    return window.innerHeight * portion;
}
function ServiceMark({ kind }) {
    const uid = useId().replace(/:/g, '');
    const soft = `${uid}-soft`;
    const shade = `${uid}-shade`;
    return (_jsxs("svg", { viewBox: "0 0 640 640", className: "h-full w-full", "aria-hidden": "true", children: [_jsxs("defs", { children: [_jsxs("radialGradient", { id: shade, cx: "38%", cy: "32%", r: "70%", children: [_jsx("stop", { offset: "0%", stopColor: "#ffffff" }), _jsx("stop", { offset: "48%", stopColor: "#efefec" }), _jsx("stop", { offset: "100%", stopColor: "#c9c9c4" })] }), _jsx("filter", { id: soft, x: "-30%", y: "-30%", width: "160%", height: "160%", children: _jsx("feDropShadow", { dx: "0", dy: "22", stdDeviation: "16", floodColor: "#1c1c1a", floodOpacity: "0.14" }) })] }), _jsxs("g", { filter: `url(#${soft})`, fill: `url(#${shade})`, stroke: "#ffffff", strokeWidth: "2.5", children: [kind === 'android' && _jsx(Bloom, {}), kind === 'ios' && _jsx(Discs, {}), kind === 'flutter' && _jsx(Burst, {}), kind === 'web' && _jsx(Sheets, {}), kind === 'fullstack' && _jsx(Twist, {}), kind === 'cloud' && _jsx(Cluster, {})] })] }));
}
function Bloom() {
    return (_jsxs(_Fragment, { children: [Array.from({ length: 10 }, (_, index) => (_jsx("ellipse", { cx: "330", cy: "250", rx: "72", ry: "156", transform: `rotate(${index * 36} 320 320)` }, index))), _jsx("circle", { cx: "320", cy: "320", r: "34" })] }));
}
function Discs() {
    return (_jsx(_Fragment, { children: [0, 1, 2, 3, 4].map((index) => (_jsx("ellipse", { cx: "330", cy: 210 + index * 58, rx: 168 - index * 8, ry: "46" }, index))) }));
}
function Burst() {
    return (_jsxs(_Fragment, { children: [Array.from({ length: 8 }, (_, index) => (_jsx("path", { d: "M320 168c18 62 38 92 92 110-54 18-74 48-92 110-18-62-38-92-92-110 54-18 74-48 92-110Z", transform: `rotate(${index * 45} 320 320)` }, index))), _jsx("circle", { cx: "320", cy: "320", r: "28" })] }));
}
function Sheets() {
    return (_jsxs(_Fragment, { children: [_jsx("rect", { x: "168", y: "168", width: "250", height: "300", rx: "36", transform: "rotate(-16 293 318)" }), _jsx("rect", { x: "214", y: "150", width: "250", height: "300", rx: "36", transform: "rotate(-4 339 300)" }), _jsx("rect", { x: "250", y: "176", width: "236", height: "286", rx: "34", transform: "rotate(8 368 319)" })] }));
}
function Twist() {
    return (_jsx(_Fragment, { children: Array.from({ length: 9 }, (_, index) => (_jsx("ellipse", { cx: "320", cy: 188 + index * 32, rx: 46 + Math.sin(index * 0.7) * 78, ry: "22", transform: `rotate(${-28 + index * 7} 320 ${188 + index * 32})` }, index))) }));
}
function Cluster() {
    const bubbles = [
        { cx: 250, cy: 250, r: 92 },
        { cx: 390, cy: 230, r: 78 },
        { cx: 330, cy: 360, r: 110 },
        { cx: 210, cy: 380, r: 64 },
        { cx: 450, cy: 360, r: 70 },
        { cx: 320, cy: 250, r: 48 },
    ];
    return (_jsx(_Fragment, { children: bubbles.map((bubble) => (_jsx("circle", { ...bubble }, `${bubble.cx}-${bubble.cy}`))) }));
}
function ArcNumber({ index, focus, }) {
    const x = useTransform(focus, (value) => (Math.cos((index - value) * arcStep) - 1) * arcRadius);
    const y = useTransform(focus, (value) => Math.sin((index - value) * arcStep) * arcRadius);
    const opacity = useTransform(focus, (value) => {
        const distance = Math.abs(index - value);
        if (distance > 2.2)
            return 0;
        return Math.max(0, 1 - distance * 0.38);
    });
    const color = useTransform(focus, (value) => (Math.abs(index - value) < 0.45 ? '#171717' : '#C8C8C2'));
    const dot = useTransform(focus, (value) => (Math.abs(index - value) < 0.45 ? 1 : 0));
    return (_jsx(m.div, { style: { x, y, opacity }, className: "pointer-events-none absolute top-[34%] left-[18rem]", "aria-hidden": "true", children: _jsxs("div", { className: "relative -translate-x-1/2 -translate-y-1/2", children: [_jsx(m.span, { style: { opacity: dot }, className: "absolute top-1/2 right-[calc(100%+0.85rem)] size-2.5 -translate-y-1/2 rounded-full bg-[#F66C2A]" }), _jsx(m.span, { style: { color }, className: "block text-[1.85rem] leading-none font-medium tracking-[-0.04em] font-[Georgia,Palatino,serif]", children: String(index + 1).padStart(2, '0') })] }) }));
}
function ServiceCopy({ service, chipsForService, }) {
    return (_jsxs("div", { children: [_jsx("h2", { className: "max-w-[14ch] text-[clamp(3.1rem,4.7vw,5.35rem)] leading-[0.94] font-medium tracking-[-0.035em] text-[#171717] font-[Georgia,Palatino,serif]", children: _jsx(Link, { to: `/services#${service.slug}`, className: "text-[#171717] no-underline hover:text-[#171717]", children: service.title }) }), _jsx("p", { className: "mt-6 max-w-[28rem] text-[1.05rem] leading-relaxed text-[#6d6d68]", children: service.body }), _jsx("ul", { className: "mt-8 flex flex-wrap gap-2.5", children: chipsForService.map((chip) => (_jsx("li", { className: "rounded-full border border-[#171717]/8 bg-[#fff] px-4 py-2 text-[0.92rem] text-[#2a2a28] shadow-[0_1px_1px_rgb(23_33_43/0.04)]", children: chip }, chip))) })] }));
}
function ServiceSlide({ index, focus, service, }) {
    const y = useTransform(focus, (value) => (index - value) * travel(0.82));
    const opacity = useTransform(focus, (value) => {
        const distance = Math.abs(index - value);
        if (distance > 1.05)
            return 0;
        return 1 - Math.max(0, distance - 0.15) * 0.35;
    });
    const filter = useTransform(focus, (value) => {
        const distance = Math.abs(index - value);
        const amount = distance < 0.42 ? 0 : Math.min(8, (distance - 0.42) * 12);
        return `blur(${amount}px)`;
    });
    return (_jsx(m.div, { style: { y, opacity, filter }, className: "absolute inset-x-0 top-0", children: _jsx(ServiceCopy, { service: service, chipsForService: chips[service.id] }) }));
}
function FloatingMark({ index, focus, kind, }) {
    const opacity = useTransform(focus, (value) => {
        const distance = Math.abs(index - value);
        if (distance > 0.55)
            return 0;
        return 1 - distance * 1.4;
    });
    return (_jsx(m.div, { style: { opacity }, className: "absolute inset-0", children: _jsx(m.div, { className: "h-full w-full", animate: { y: [0, -28, 0], rotate: [0, 1.8, 0, -1.8, 0] }, transition: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }, children: _jsx(ServiceMark, { kind: kind }) }) }));
}
function ServiceStack() {
    return (_jsx("section", { id: "services", className: "bg-[#F6F6F4] section-y", "aria-label": "Services", children: _jsx("div", { className: "mx-auto w-full max-w-[90rem] px-(--page-gutter)", children: _jsx("ol", { className: "space-y-20 md:space-y-28", children: services.map((service, index) => (_jsxs("li", { className: "grid items-center gap-8 border-t border-[#171717]/8 pt-10 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-12", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[1.35rem] text-[#171717] font-[Georgia,Palatino,serif]", children: String(index + 1).padStart(2, '0') }), _jsx("div", { className: "mt-4", children: _jsx(ServiceCopy, { service: service, chipsForService: chips[service.id] }) })] }), _jsx("div", { className: "mx-auto h-56 w-56 md:h-64 md:w-64", children: _jsx(ServiceMark, { kind: service.id }) })] }, service.id))) }) }) }));
}
export function ServiceOrbit() {
    const reduced = useReducedMotion() === true;
    const desktop = useMediaQuery('(min-width: 960px)');
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end end'],
    });
    const focus = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0, 0, count - 1, count - 1]);
    const [active, setActive] = useState(0);
    useMotionValueEvent(focus, 'change', (value) => {
        setActive(Math.min(count - 1, Math.max(0, Math.round(value))));
    });
    if (!desktop || reduced)
        return _jsx(ServiceStack, {});
    const service = services[active];
    return (_jsx("section", { ref: ref, id: "services", className: "relative h-[620vh] bg-[#F6F6F4]", "aria-label": "Services", children: _jsxs("div", { className: "sticky top-0 h-svh overflow-hidden", children: [_jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute top-[34%] left-[18rem] size-[1120px] -translate-x-full -translate-y-1/2 rounded-full border border-[#E1E1DC]" }), _jsxs("div", { "aria-hidden": "true", className: "absolute top-[34%] left-0 z-20 flex h-48 w-12 -translate-y-1/2 flex-col items-center bg-[#171717] pt-3.5 text-[#fff]", children: [_jsx("span", { className: "text-[1.15rem] leading-none font-medium font-[Georgia,Palatino,serif]", children: "S." }), _jsx("span", { className: "mt-4 text-[0.68rem] font-semibold tracking-[0.18em] uppercase [writing-mode:vertical-rl] rotate-180", children: "Services" })] }), services.map((item, index) => (_jsx(ArcNumber, { index: index, focus: focus }, item.id))), _jsx("div", { className: "pointer-events-none absolute top-[18%] bottom-[14%] left-[26rem] w-[min(38rem,40vw)] overflow-hidden", children: _jsx("div", { className: "pointer-events-auto relative h-full", children: services.map((item, index) => (_jsx(ServiceSlide, { index: index, focus: focus, service: item }, item.id))) }) }), _jsx("div", { className: "pointer-events-none absolute top-[8%] right-[-8%] h-[84%] w-[40%] overflow-hidden", children: services.map((item, index) => (_jsx(FloatingMark, { index: index, focus: focus, kind: item.id }, item.id))) }), _jsx("p", { className: "sr-only", "aria-live": "polite", children: service.title })] }) }));
}
