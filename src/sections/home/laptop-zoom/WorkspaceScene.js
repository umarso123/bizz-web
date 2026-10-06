import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m } from 'framer-motion';
import { Desk } from '@/sections/home/laptop-zoom/Desk.tsx';
import { Laptop } from '@/sections/home/laptop-zoom/Laptop.tsx';
/**
 * Laptop + desk only — sharp HTML/CSS product UI, no illustration.
 */
export function WorkspaceScene({ screenRef, bezelOpacity, baseOpacity, screenRadius, deskOpacity, living = true, className, }) {
    return (_jsx("div", { className: className, children: _jsxs("div", { className: "relative mx-auto w-full max-w-[40rem]", children: [_jsxs("div", { className: "relative z-20", children: [_jsx(Laptop, { screenRef: screenRef, bezelOpacity: bezelOpacity, baseOpacity: baseOpacity, screenRadius: screenRadius, living: living }), _jsx(m.div, { className: "pointer-events-none absolute inset-x-[12%] -bottom-0.5 h-3 rounded-[100%]", style: {
                                opacity: baseOpacity,
                                background: 'radial-gradient(ellipse at center, rgb(23 33 43 / 0.16), transparent 72%)',
                            }, "aria-hidden": "true" })] }), _jsx("div", { className: "relative z-10 -mt-px", children: _jsx(Desk, { opacity: deskOpacity }) })] }) }));
}
