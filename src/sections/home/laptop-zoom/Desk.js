import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m } from 'framer-motion';
/**
 * Clean editorial desk — laptop rests on this surface.
 */
export function Desk({ opacity = 1, className }) {
    return (_jsx(m.div, { className: className, style: { opacity }, "aria-hidden": "true", children: _jsxs("div", { className: "relative mx-auto w-[118%]", style: { marginLeft: '-9%' }, children: [_jsx("div", { className: "relative h-[18px] w-full rounded-[3px]", style: {
                        background: 'linear-gradient(180deg, #F4F1EC 0%, #E8E2D8 42%, #D9D2C6 100%)',
                        boxShadow: '0 1px 0 rgb(255 255 255 / 0.65) inset, 0 18px 40px rgb(23 33 43 / 0.1)',
                    } }), _jsx("div", { className: "mx-auto h-[10px] w-[99%] rounded-b-[4px]", style: {
                        background: 'linear-gradient(180deg, #C8BFB2 0%, #B5AA9A 100%)',
                        boxShadow: '0 10px 24px rgb(23 33 43 / 0.08)',
                    } }), _jsx("div", { className: "pointer-events-none absolute -bottom-3 left-[8%] right-[8%] h-6 rounded-[100%]", style: {
                        background: 'radial-gradient(ellipse at center, rgb(23 33 43 / 0.12), transparent 70%)',
                    } }), _jsxs("div", { className: "absolute -top-[3px] right-[8%] h-[14px] w-[42px] rounded-[2px]", style: {
                        background: 'linear-gradient(135deg, #FFFFFF, #EEF1F3)',
                        boxShadow: '0 2px 6px rgb(23 33 43 / 0.08)',
                        border: '1px solid rgb(228 233 237 / 0.9)',
                    }, children: [_jsx("span", { className: "absolute top-1 left-1 h-[2px] w-5 rounded-full bg-[#0A8FD8]/35" }), _jsx("span", { className: "absolute top-[7px] left-1 h-[2px] w-3 rounded-full bg-[#F66C2A]/40" })] })] }) }));
}
