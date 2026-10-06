import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m, useTransform } from 'framer-motion';
/**
 * Soft atmosphere + orange continuity line that later enters the product story.
 */
export function BackgroundAtmosphere({ progress, reduced, pointerX, pointerY, }) {
    const lineDraw = useTransform(progress, [0, 0.4, 0.75, 1], reduced ? [1, 1, 1, 1] : [0.35, 0.7, 1, 0.85]);
    const lineY = useTransform(progress, [0, 0.55, 0.9], reduced ? [0, 0, 0] : [0, -40, -120]);
    const glow = useTransform(progress, [0, 0.5, 1], reduced ? [0.5, 0.5, 0.5] : [0.35, 0.55, 0.2]);
    const decorX = useTransform(pointerX, (v) => v * 0.35);
    const decorY = useTransform(pointerY, (v) => v * 0.35);
    const decorXInv = useTransform(pointerX, (v) => v * -0.25);
    const decorYInv = useTransform(pointerY, (v) => v * -0.2);
    return (_jsxs("div", { className: "pointer-events-none absolute inset-0 overflow-hidden", "aria-hidden": "true", children: [_jsx(m.div, { className: "absolute -top-[10%] right-[5%] h-[55%] w-[45%] rounded-full", style: {
                    opacity: glow,
                    background: 'radial-gradient(ellipse at center, rgb(10 143 216 / 0.12), transparent 68%)',
                    x: decorX,
                    y: decorY,
                } }), _jsx(m.div, { className: "absolute bottom-[5%] left-[0%] h-[40%] w-[40%] rounded-full", style: {
                    opacity: glow,
                    background: 'radial-gradient(ellipse at center, rgb(246 108 42 / 0.1), transparent 70%)',
                    x: decorXInv,
                    y: decorYInv,
                } }), _jsxs(m.svg, { className: "absolute inset-0 h-full w-full", viewBox: "0 0 1440 900", preserveAspectRatio: "xMidYMid slice", style: { y: lineY }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "lz-orange-line", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#F66C2A", stopOpacity: "0" }), _jsx("stop", { offset: "30%", stopColor: "#F66C2A", stopOpacity: "0.55" }), _jsx("stop", { offset: "70%", stopColor: "#F66C2A", stopOpacity: "0.85" }), _jsx("stop", { offset: "100%", stopColor: "#F66C2A", stopOpacity: "0" })] }), _jsxs("linearGradient", { id: "lz-blue-line", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#0A8FD8", stopOpacity: "0" }), _jsx("stop", { offset: "45%", stopColor: "#0A8FD8", stopOpacity: "0.45" }), _jsx("stop", { offset: "100%", stopColor: "#0A8FD8", stopOpacity: "0" })] })] }), _jsx(m.path, { d: "M-80 620 C 220 500, 480 720, 780 560 S 1180 400, 1560 520", fill: "none", stroke: "url(#lz-orange-line)", strokeWidth: "2.2", strokeLinecap: "round", style: { pathLength: lineDraw, x: decorX } }), _jsx(m.path, { d: "M-40 560 C 260 460, 520 640, 820 500 S 1220 360, 1540 460", fill: "none", stroke: "url(#lz-blue-line)", strokeWidth: "1.4", strokeLinecap: "round", opacity: 0.7, style: { pathLength: lineDraw } }), [
                        [220, 540],
                        [480, 600],
                        [760, 520],
                        [1040, 460],
                        [1280, 500],
                    ].map(([cx, cy], i) => (_jsx(m.circle, { cx: cx, cy: cy, r: 2.5, fill: i % 2 === 0 ? '#F66C2A' : '#0A8FD8', animate: reduced ? undefined : { opacity: [0.35, 0.9, 0.35] }, transition: reduced ? undefined : { duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' } }, `${cx}-${cy}`)))] })] }));
}
