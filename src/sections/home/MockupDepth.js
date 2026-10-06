import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
const kinds = ['schedule', 'field', 'record', 'visit', 'message', 'device', 'note'];
const openSlots = [
    { x: -1, y: -0.42, s: 0.72, r: -8, z: 2 },
    { x: -0.78, y: 0.78, s: 0.84, r: 7, z: 4 },
    { x: -0.46, y: -1, s: 0.62, r: -4, z: 1 },
    { x: 0, y: 1, s: 0.9, r: 0, z: 5 },
    { x: 0.46, y: -1, s: 0.64, r: 6, z: 3 },
    { x: 0.78, y: 0.72, s: 0.86, r: -6, z: 6 },
    { x: 1, y: -0.28, s: 0.74, r: 5, z: 4 },
];
const cards = kinds.map((kind, index) => {
    const offset = index - 3;
    return {
        kind,
        from: { x: offset * 34, y: offset * 18, s: 0.9, r: offset * -8, z: index + 1 },
        to: openSlots[index],
    };
});
function clamp01(value) {
    return Math.min(1, Math.max(0, value));
}
function openAmount(progress) {
    const t = clamp01(progress / 0.58);
    return 1 - (1 - t) ** 3;
}
function ScheduleFace() {
    return (_jsxs("div", { className: "flex h-full flex-col bg-white p-3", children: [_jsx("div", { className: "mb-2 h-2 w-16 rounded-full bg-[#0A8FD8]/30" }), _jsxs("div", { className: "grid flex-1 grid-cols-2 gap-2", children: [_jsx("div", { className: "rounded-md bg-[#F4F7F9]" }), _jsx("div", { className: "rounded-md border border-[#F66C2A]/50" }), _jsx("div", { className: "col-span-2 rounded-md bg-[#E7F5FC]" })] })] }));
}
function FieldFace() {
    return (_jsxs("div", { className: "flex h-full items-end gap-1.5 bg-[#F66C2A] p-3", children: [_jsx("span", { className: "h-8 flex-1 rounded-sm bg-[#17212B]/80" }), _jsx("span", { className: "h-14 flex-1 rounded-sm bg-white" }), _jsx("span", { className: "h-10 flex-1 rounded-sm bg-[#17212B]/55" }), _jsx("span", { className: "h-16 flex-1 rounded-sm bg-white/80" })] }));
}
function RecordFace() {
    return (_jsxs("div", { className: "flex h-full flex-col justify-center gap-2 bg-[#17212B] px-3", children: [_jsx("div", { className: "h-2 w-3/5 rounded-full bg-white/80" }), _jsx("div", { className: "h-2 w-2/5 rounded-full bg-white/35" }), _jsx("div", { className: "mt-1 h-8 rounded-md bg-white/10" })] }));
}
function VisitFace() {
    return (_jsxs("div", { className: "flex h-full flex-col bg-white p-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "size-6 rounded-full bg-[#F66C2A]" }), _jsx("span", { className: "h-2 w-16 rounded-full bg-[#E4E9ED]" })] }), _jsx("div", { className: "mt-3 h-2 w-24 rounded-full bg-[#17212B]" }), _jsx("div", { className: "mt-2 h-2 w-14 rounded-full bg-[#CBD4DB]" }), _jsx("div", { className: "mt-auto h-6 rounded-md bg-[#E7F5FC]" })] }));
}
function MessageFace() {
    return (_jsxs("div", { className: "flex h-full flex-col justify-end gap-2 bg-[#F8FAFC] p-3", children: [_jsx("div", { className: "h-6 w-4/5 rounded-md bg-white" }), _jsx("div", { className: "ml-auto h-6 w-3/5 rounded-md bg-[#0A8FD8]" }), _jsx("div", { className: "h-6 w-2/3 rounded-md bg-white" })] }));
}
function DeviceFace() {
    return (_jsxs("div", { className: "grid h-full grid-cols-[1.1fr_0.9fr] bg-white", children: [_jsx("div", { className: "m-3 rounded-lg bg-[#17212B]" }), _jsxs("div", { className: "flex flex-col justify-center gap-2 pr-3", children: [_jsx("div", { className: "h-2 w-10 rounded-full bg-[#F66C2A]" }), _jsx("div", { className: "h-2 w-14 rounded-full bg-[#E4E9ED]" }), _jsx("div", { className: "h-8 rounded-md bg-[#F4F7F9]" })] })] }));
}
function NoteFace() {
    return (_jsxs("div", { className: "flex h-full flex-col justify-between bg-white p-3", children: [_jsx("div", { className: "h-2 w-12 rounded-full bg-[#0A8FD8]" }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("div", { className: "h-2 rounded-full bg-[#E4E9ED]" }), _jsx("div", { className: "h-2 w-4/5 rounded-full bg-[#E4E9ED]" }), _jsx("div", { className: "h-2 w-3/5 rounded-full bg-[#F66C2A]/70" })] })] }));
}
const faces = {
    schedule: ScheduleFace,
    field: FieldFace,
    record: RecordFace,
    visit: VisitFace,
    message: MessageFace,
    device: DeviceFace,
    note: NoteFace,
};
function DepthCard({ card, progress, reachX, reachY, }) {
    const x = useTransform(() => {
        const t = openAmount(progress.get());
        return card.from.x + (card.to.x * reachX.get() - card.from.x) * t;
    });
    const y = useTransform(() => {
        const t = openAmount(progress.get());
        return card.from.y + (card.to.y * reachY.get() - card.from.y) * t;
    });
    const scale = useTransform(() => {
        const t = openAmount(progress.get());
        return card.from.s + (card.to.s - card.from.s) * t;
    });
    const rotate = useTransform(() => {
        const t = openAmount(progress.get());
        return card.from.r + (card.to.r - card.from.r) * t;
    });
    const zIndex = useTransform(() => {
        const t = openAmount(progress.get());
        return Math.round(card.from.z + (card.to.z - card.from.z) * t);
    });
    const Face = faces[card.kind];
    return (_jsx(m.div, { style: { x, y, scale, rotate, zIndex }, className: "absolute top-1/2 left-1/2", children: _jsx("div", { className: "h-[7.75rem] w-[12.5rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-white bg-white shadow-md", children: _jsx(Face, {}) }) }));
}
function StageCopy({ progress }) {
    const opacity = useTransform(() => clamp01((openAmount(progress.get()) - 0.2) / 0.8));
    const y = useTransform(() => (1 - openAmount(progress.get())) * 16);
    return (_jsx(m.div, { style: { opacity, y }, className: "pointer-events-none absolute inset-0 z-20 grid place-items-center px-6 text-center", children: _jsxs("div", { className: "max-w-[40rem]", children: [_jsx("h2", { id: "mockup-depth-title", className: "text-display text-[#C5CED6]", children: "From idea to reality." }), _jsx("p", { className: "mx-auto mt-4 max-w-[28rem] text-body text-text-secondary", children: "Website, UI/UX, product, and dashboard surfaces shaped for the work." })] }) }));
}
function StillStage() {
    return (_jsxs("div", { className: "bg-surface-warm px-(--page-gutter) py-20", children: [_jsxs("div", { className: "mx-auto max-w-[40rem] text-center", children: [_jsx("h2", { id: "mockup-depth-title", className: "text-section-title text-text", children: "From idea to reality." }), _jsx("p", { className: "mt-4 text-body text-text-secondary", children: "Website, UI/UX, product, and dashboard surfaces shaped for the work." })] }), _jsx("div", { className: "mx-auto mt-10 flex max-w-(--container-page) gap-4 overflow-x-auto pb-2", children: cards.map((card) => {
                    const Face = faces[card.kind];
                    return (_jsx("div", { className: "h-[7.75rem] w-[12.5rem] shrink-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm", children: _jsx(Face, {}) }, card.kind));
                }) })] }));
}
export function MockupDepth() {
    const reduced = useReducedMotion() === true;
    const [wide, setWide] = useState(() => window.matchMedia('(min-width: 960px)').matches);
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end end'],
    });
    const reachX = useMotionValue(420);
    const reachY = useMotionValue(180);
    const stageRef = useRef(null);
    useEffect(() => {
        const media = window.matchMedia('(min-width: 960px)');
        const onChange = () => setWide(media.matches);
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage)
            return;
        const measure = () => {
            const box = stage.getBoundingClientRect();
            reachX.set(Math.max(180, box.width / 2 - 132));
            reachY.set(Math.max(96, box.height / 2 - 118));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(stage);
        return () => observer.disconnect();
    }, [reachX, reachY, wide]);
    if (reduced || !wide)
        return _jsx(StillStage, {});
    return (_jsx("section", { id: "mockups", ref: ref, "aria-labelledby": "mockup-depth-title", className: "relative h-[320vh] bg-surface-warm", children: _jsxs("div", { ref: stageRef, className: "sticky top-20 h-[calc(100svh-5rem)] overflow-hidden", children: [_jsx(StageCopy, { progress: scrollYProgress }), _jsx("div", { className: "absolute inset-0", "aria-hidden": "true", children: cards.map((card) => (_jsx(DepthCard, { card: card, progress: scrollYProgress, reachX: reachX, reachY: reachY }, card.kind))) })] }) }));
}
