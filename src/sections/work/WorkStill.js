import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/cn.ts';
/**
 * Composed product stills for the work index.
 * Each scene is a different room, so the grid does not read as one repeated card.
 */
export function WorkStill({ slug }) {
    switch (slug) {
        case 'clinical-decision-support':
            return _jsx(CdsStill, {});
        case 'telemedicine':
            return _jsx(TelemedicineStill, {});
        case 'health-information-exchange':
            return _jsx(HieStill, {});
        case 'electronic-health-records':
            return _jsx(EhrStill, {});
        case 'integration-interoperability':
            return _jsx(InteropStill, {});
        case 'optimized-strength':
            return _jsx(FitnessStill, {});
        case 'educational':
            return _jsx(EducationStill, {});
        case 'fintech':
            return _jsx(FintechStill, {});
        case 'ecommerce':
            return _jsx(CommerceStill, {});
        default:
            return _jsx(CdsStill, {});
    }
}
function Stage({ className, children }) {
    return (_jsx("div", { "aria-hidden": "true", className: cn('absolute inset-0 overflow-hidden', className), children: children }));
}
function CdsStill() {
    return (_jsxs(Stage, { className: "bg-[#0b2422]", children: [_jsx("div", { className: "absolute -top-20 right-[-4rem] size-80 rounded-full bg-[#3f9d92]/35 blur-3xl" }), _jsxs("div", { className: "absolute top-[14%] right-[9%] bottom-[16%] left-[9%] rounded-[1.35rem] border border-white/10 bg-[#071614]/80 p-4 shadow-[0_24px_50px_rgb(0_0_0/0.35)] md:p-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "h-2 w-28 rounded-full bg-white/25" }), _jsx("div", { className: "h-2 w-12 rounded-full bg-[#8ee0d4]" })] }), _jsxs("div", { className: "mt-5 grid gap-2.5", children: [_jsx("div", { className: "h-9 rounded-xl bg-white/7" }), _jsxs("div", { className: "flex h-12 items-center gap-3 rounded-xl bg-[#1a4c45] px-3.5", children: [_jsx("span", { className: "size-2.5 shrink-0 rounded-full bg-[#9cf0e4]" }), _jsx("span", { className: "h-2 flex-1 rounded-full bg-white/35" }), _jsx("span", { className: "h-2 w-10 rounded-full bg-[#8ee0d4]/80" })] }), _jsx("div", { className: "h-9 rounded-xl bg-white/7" }), _jsxs("div", { className: "grid grid-cols-[1.4fr_0.8fr] gap-2.5", children: [_jsx("div", { className: "h-16 rounded-xl bg-white/6" }), _jsx("div", { className: "h-16 rounded-xl bg-[#143833]" })] })] })] })] }));
}
function TelemedicineStill() {
    return (_jsxs(Stage, { className: "bg-[#17233c]", children: [_jsx("div", { className: "absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0c1424] to-transparent" }), _jsxs("div", { className: "absolute top-[16%] right-[10%] left-[10%] grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "relative aspect-4/5 overflow-hidden rounded-[1.25rem] bg-[#243656]", children: [_jsx("div", { className: "absolute inset-x-6 top-8 h-16 rounded-full bg-[#8ea4c8]/30 blur-xl" }), _jsx("div", { className: "absolute bottom-4 left-4 h-2 w-16 rounded-full bg-white/50" })] }), _jsxs("div", { className: "relative aspect-4/5 overflow-hidden rounded-[1.25rem] bg-[#1c2c48]", children: [_jsx("div", { className: "absolute top-6 right-5 size-3 rounded-full bg-[#7dcea0]" }), _jsx("div", { className: "absolute inset-x-5 bottom-8 h-10 rounded-2xl bg-white/10" })] })] }), _jsxs("div", { className: "absolute right-[18%] bottom-[14%] left-[18%] flex h-11 items-center justify-center gap-3 rounded-full bg-black/40 backdrop-blur-md", children: [_jsx("span", { className: "size-3 rounded-full bg-white/70" }), _jsx("span", { className: "size-3 rounded-full bg-[#e26b6b]" }), _jsx("span", { className: "h-2 w-16 rounded-full bg-white/30" })] })] }));
}
function HieStill() {
    return (_jsxs(Stage, { className: "bg-[#10141c]", children: [_jsx("div", { className: "absolute top-1/2 right-[12%] left-[12%] h-px -translate-y-1/2 bg-white/15" }), _jsx("div", { className: "absolute top-[22%] right-[14%] left-[14%] grid grid-cols-3 gap-3", children: [
                    'bg-[#1c2433]',
                    'bg-[#243044]',
                    'bg-[#1a2838]',
                ].map((tone) => (_jsx("div", { className: cn('h-28 rounded-2xl border border-white/10', tone) }, tone))) }), _jsxs("div", { className: "absolute right-[18%] bottom-[18%] left-[18%] grid grid-cols-3 gap-4", children: [_jsx("div", { className: "h-2 rounded-full bg-[#7eb6ff]/80" }), _jsx("div", { className: "h-2 rounded-full bg-white/25" }), _jsx("div", { className: "h-2 rounded-full bg-[#f5c84c]/90" })] })] }));
}
function EhrStill() {
    return (_jsxs(Stage, { className: "bg-[#f4e7cf]", children: [_jsx("div", { className: "absolute -top-10 -left-8 size-56 rounded-full bg-[#f5c84c]/50 blur-3xl" }), _jsxs("div", { className: "absolute top-[12%] right-[8%] bottom-[14%] left-[8%] rounded-[1.4rem] bg-white p-5 shadow-[0_22px_40px_rgb(90_60_20/0.16)]", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-9 rounded-xl bg-[#2f5bea]" }), _jsx("div", { className: "h-2.5 w-32 rounded-full bg-[#12141a]/15" })] }), _jsxs("div", { className: "mt-6 grid gap-3", children: [_jsx("div", { className: "h-3 w-full rounded-full bg-[#12141a]/8" }), _jsx("div", { className: "h-3 w-4/5 rounded-full bg-[#12141a]/8" }), _jsxs("div", { className: "mt-2 grid grid-cols-2 gap-3", children: [_jsx("div", { className: "h-20 rounded-2xl bg-[#eef2fc]" }), _jsx("div", { className: "h-20 rounded-2xl bg-[#fef6d8]" })] })] })] })] }));
}
function InteropStill() {
    return (_jsxs(Stage, { className: "bg-[#12151c]", children: [_jsx("div", { className: "absolute top-[28%] left-[12%] h-36 w-[38%] rounded-[1.25rem] border border-white/10 bg-[#1c2230]" }), _jsx("div", { className: "absolute top-[40%] right-[12%] h-36 w-[38%] rounded-[1.25rem] border border-[#8eb4ff]/30 bg-[#182033]" }), _jsx("div", { className: "absolute top-1/2 left-[42%] h-px w-[16%] bg-[#8eb4ff]" }), _jsx("div", { className: "absolute top-[calc(50%-5px)] left-[48%] size-2.5 rounded-full bg-[#f5c84c]" })] }));
}
function FitnessStill() {
    return (_jsxs(Stage, { className: "bg-[#243028]", children: [_jsx("div", { className: "absolute -right-8 bottom-0 size-72 rounded-full bg-[#c5d5b8]/20 blur-2xl" }), _jsxs("div", { className: "absolute top-[18%] bottom-[16%] left-[14%] w-[46%] rounded-[1.5rem] border border-white/10 bg-[#1a241c]/80 p-4", children: [_jsx("div", { className: "h-2 w-20 rounded-full bg-white/30" }), _jsx("div", { className: "mt-6 flex items-end gap-2", children: [40, 68, 52, 84, 60].map((height) => (_jsx("span", { className: "w-full rounded-t-md bg-[#d7e4c8]", style: { height: `${height}px` } }, height))) })] }), _jsx("div", { className: "absolute top-[22%] right-[12%] grid size-36 place-items-center rounded-[2rem] border border-white/15 bg-[#1b261e]", children: _jsx("div", { className: "size-20 rounded-full border-[10px] border-[#d7e4c8]/30 border-t-[#e7f0dc]" }) })] }));
}
function EducationStill() {
    return (_jsx(Stage, { className: "bg-[#efe4d2]", children: _jsxs("div", { className: "absolute top-[16%] right-[12%] bottom-[18%] left-[12%] rounded-[1.5rem] bg-white p-5 shadow-[0_18px_40px_rgb(60_40_10/0.12)]", children: [_jsx("div", { className: "h-3 w-24 rounded-full bg-[#2f5bea]" }), _jsx("div", { className: "mt-5 h-2.5 w-3/4 rounded-full bg-[#12141a]/12" }), _jsx("div", { className: "mt-3 h-2.5 w-1/2 rounded-full bg-[#12141a]/10" }), _jsxs("div", { className: "mt-8 grid grid-cols-3 gap-2", children: [_jsx("div", { className: "h-14 rounded-xl bg-[#e8eefc]" }), _jsx("div", { className: "h-14 rounded-xl bg-[#fef6d8]" }), _jsx("div", { className: "h-14 rounded-xl bg-[#e7f3ec]" })] })] }) }));
}
function FintechStill() {
    return (_jsxs(Stage, { className: "bg-[#0e1218]", children: [_jsxs("div", { className: "absolute top-8 right-8 left-8 flex items-end gap-3", children: [_jsx("div", { className: "h-2 flex-1 rounded-full bg-white/15" }), _jsx("div", { className: "h-2 w-16 rounded-full bg-[#f5c84c]" })] }), _jsx("div", { className: "absolute right-[12%] bottom-[18%] left-[12%] flex h-[58%] items-end gap-3", children: [46, 72, 58, 88, 64, 96, 70].map((height, index) => (_jsx("span", { className: cn('w-full rounded-t-lg', index === 5 ? 'bg-[#f5c84c]' : 'bg-[#2f5bea]'), style: { height: `${height}%` } }, height))) })] }));
}
function CommerceStill() {
    return (_jsxs(Stage, { className: "bg-[#1a1614]", children: [_jsx("div", { className: "absolute -top-8 left-10 size-48 rounded-full bg-[#e7b56a]/25 blur-3xl" }), _jsxs("div", { className: "absolute top-[18%] right-[14%] bottom-[20%] left-[14%] grid grid-cols-[1.2fr_0.8fr] gap-3", children: [_jsx("div", { className: "rounded-[1.35rem] bg-[#2a241f]" }), _jsxs("div", { className: "grid gap-3", children: [_jsx("div", { className: "rounded-[1.15rem] bg-[#f3e6d4]" }), _jsxs("div", { className: "rounded-[1.15rem] border border-white/10 bg-[#241f1c] p-3", children: [_jsx("div", { className: "h-2 w-12 rounded-full bg-white/40" }), _jsx("div", { className: "mt-3 h-2 w-20 rounded-full bg-[#f5c84c]" })] })] })] })] }));
}
