import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router';
import { bookCall } from '@/app/navigation.ts';
function scallopPath() {
    const bumps = 16;
    const cx = 50;
    const cy = 50;
    const inner = 38;
    const outer = 49;
    const commands = [];
    for (let index = 0; index < bumps; index += 1) {
        const start = (index / bumps) * Math.PI * 2;
        const peak = ((index + 0.5) / bumps) * Math.PI * 2;
        const end = ((index + 1) / bumps) * Math.PI * 2;
        const x0 = cx + Math.cos(start) * inner;
        const y0 = cy + Math.sin(start) * inner;
        const x1 = cx + Math.cos(peak) * outer;
        const y1 = cy + Math.sin(peak) * outer;
        const x2 = cx + Math.cos(end) * inner;
        const y2 = cy + Math.sin(end) * inner;
        commands.push(index === 0 ? `M ${x0} ${y0}` : '');
        commands.push(`Q ${x1} ${y1} ${x2} ${y2}`);
    }
    return `${commands.filter(Boolean).join(' ')} Z`;
}
const scallop = scallopPath();
export function ConnectBanner() {
    return (_jsx("section", { className: "bg-page-white py-10 md:py-14", "aria-label": "Reach out", children: _jsx("div", { className: "mx-auto w-full max-w-[96rem] px-(--page-gutter)", children: _jsxs(Link, { to: bookCall.to, className: "flex flex-col items-start gap-6 rounded-[2.75rem] bg-brand px-7 py-7 no-underline transition-transform duration-300 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-10 sm:py-8 md:px-14 md:py-9", children: [_jsx("p", { className: "max-w-[46rem] text-[clamp(1.45rem,2.5vw,2.55rem)] leading-[1.05] font-bold tracking-tighter text-white uppercase", children: "Want to collaborate? Reach out to us. Let\u2019s connect." }), _jsxs("span", { className: "relative grid size-28 shrink-0 place-items-center sm:size-32 md:size-36", children: [_jsx("svg", { viewBox: "0 0 100 100", className: "absolute inset-0 h-full w-full", "aria-hidden": "true", children: _jsx("path", { d: scallop, fill: "#F5C84C" }) }), _jsxs("span", { className: "relative px-4 text-center text-[0.78rem] leading-[1.05] font-bold tracking-tighter text-text uppercase md:text-[0.9rem]", children: ["Book", _jsx("br", {}), "a call"] })] })] }) }) }));
}
