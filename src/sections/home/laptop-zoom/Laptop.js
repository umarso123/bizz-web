import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m, useTransform } from 'framer-motion';
import { HealthcareProductUI } from '@/sections/home/laptop-zoom/HealthcareProductUI.tsx';
/**
 * CSS/HTML laptop — `.screen-content` is independently transformable for zoom takeover.
 */
export function Laptop({ screenRef, bezelOpacity, baseOpacity, screenRadius, living = true, className, }) {
    const bezelPad = useTransform(bezelOpacity, [0, 1], ['0.15%', '1.9%']);
    const notchOpacity = bezelOpacity;
    return (_jsx("div", { className: className, style: { perspective: '1200px' }, children: _jsxs("div", { className: "laptop relative w-full", style: { transformStyle: 'preserve-3d' }, children: [_jsx("div", { className: "laptop-screen relative mx-auto w-[92%]", children: _jsxs(m.div, { className: "screen-bezel relative overflow-hidden border border-[#2A3540] bg-[#1A222A] shadow-[0_22px_55px_rgb(23_33_43_/_0.24)]", style: {
                            borderRadius: screenRadius,
                            padding: bezelPad,
                        }, children: [_jsx(m.div, { className: "mx-auto mb-[1%] h-[3px] w-[11%] rounded-full bg-[#3A4652]", style: { opacity: notchOpacity } }), _jsxs("div", { ref: screenRef, className: "screen-content relative aspect-[16/10] w-full overflow-hidden bg-white", style: { borderRadius: 4 }, children: [_jsx(HealthcareProductUI, { living: living }), _jsx("div", { className: "pointer-events-none absolute inset-0", style: {
                                            backgroundImage: 'linear-gradient(125deg, rgb(255 255 255 / 0.16), transparent 40%, transparent 60%, rgb(10 143 216 / 0.05))',
                                        }, "aria-hidden": "true" })] })] }) }), _jsx(m.div, { className: "relative z-[1] mx-auto -mt-px h-[5px] w-[94%] rounded-sm bg-gradient-to-b from-[#3A4652] to-[#1A222A]", style: { opacity: baseOpacity } }), _jsxs(m.div, { className: "laptop-base relative mx-auto w-full", style: { opacity: baseOpacity }, children: [_jsx("div", { className: "h-[11px] w-full rounded-b-[11px] bg-gradient-to-b from-[#2A3540] via-[#1C252E] to-[#12181F] shadow-[0_14px_30px_rgb(23_33_43_/_0.22)]" }), _jsx("div", { className: "absolute inset-x-[20%] top-[3px] h-[2px] rounded-full bg-[#0A8FD8]/30" })] })] }) }));
}
