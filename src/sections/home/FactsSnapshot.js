import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { homeContent } from '@/content/home.ts';
import { cn } from '@/lib/cn.ts';
gsap.registerPlugin(ScrollTrigger, useGSAP);
const scenes = {
    focus: 'bg-[radial-gradient(90%_80%_at_100%_0%,rgba(255,255,255,0.28),transparent_42%),linear-gradient(155deg,#0E2A3A_0%,#0A8FD8_64%,#7fd0f2_100%)]',
    rating: 'bg-[radial-gradient(68%_58%_at_50%_38%,#ffffff_0%,transparent_68%),linear-gradient(180deg,#F3EEE6_0%,#D9D0C2_100%)]',
    services: 'bg-[radial-gradient(80%_70%_at_0%_100%,rgba(10,143,216,0.5),transparent_52%),linear-gradient(165deg,#161616_0%,#2A3138_100%)]',
};
function signedDelta(index, focus, count) {
    let delta = index - focus;
    delta = ((delta % count) + count) % count;
    if (delta > count / 2)
        delta -= count;
    return delta;
}
/** Slot positions are percentages of each card, so scroll updates never read layout. */
function placeCards(cards, focus) {
    const count = cards.length;
    cards.forEach((card, index) => {
        const delta = signedDelta(index, focus, count);
        const abs = Math.abs(delta);
        const sign = Math.sign(delta);
        let shift = 0;
        let scale = 1;
        let z = 30;
        let drop = 0;
        if (abs <= 1) {
            shift = sign * 50 * abs;
            scale = 1 - abs * 0.13;
            z = Math.round(40 - abs * 24);
            drop = abs * 1.5;
        }
        else {
            const t = Math.min((abs - 1) / 0.5, 1);
            shift = sign * 50 * (1 - t);
            scale = 0.87 - t * 0.1;
            z = Math.max(1, Math.round(16 - t * 14));
            drop = 1.5 * (1 - t);
        }
        const xPercent = -50 + shift;
        const yPercent = -50 + drop;
        const slot = `${xPercent.toFixed(2)}|${yPercent.toFixed(2)}|${scale.toFixed(3)}|${z}`;
        if (card.dataset.slot === slot)
            return;
        card.dataset.slot = slot;
        gsap.set(card, {
            xPercent,
            yPercent,
            scale,
            zIndex: z,
            force3D: true,
        });
    });
}
function CardFace({ card }) {
    const dark = card.tone === 'dark';
    const media = card.media;
    const lead = card.title ?? card.eyebrow;
    const ink = dark ? 'text-white' : 'text-[#171717]';
    return (_jsxs(_Fragment, { children: [media?.src ? (_jsx("video", { className: "absolute inset-0 h-full w-full object-cover", src: media.src, poster: media.poster ?? undefined, autoPlay: true, muted: true, loop: true, playsInline: true, "aria-label": lead })) : (_jsx("div", { className: cn('absolute inset-0', scenes[card.id] ?? scenes.focus), "aria-hidden": "true" })), card.kind === 'circle' ? (_jsx("div", { className: "absolute inset-0 flex items-center justify-center pb-8", children: _jsx("div", { className: "grid aspect-square w-[42%] min-w-28 place-items-center rounded-full bg-white shadow-[0_18px_50px_rgb(23_33_43/0.12)]", children: _jsx("p", { className: "text-[clamp(2.2rem,3.4vw,3.75rem)] leading-none font-semibold tracking-tighter text-[#171717]", children: card.value }) }) })) : (_jsxs("div", { className: "absolute inset-0 flex flex-col justify-end px-5 pb-20 md:px-7 md:pb-24", children: [_jsx("p", { className: cn('text-[clamp(3.25rem,4.5vw,5.5rem)] leading-none font-semibold tracking-tighter', ink), children: card.value }), card.title ? (_jsx("p", { className: cn('mt-2 text-[clamp(1.15rem,1.4vw,1.5rem)] font-semibold tracking-tighter', ink), children: card.title })) : null] })), _jsx("div", { className: "pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-linear-to-t from-black/80 via-black/35 to-transparent" }), _jsxs("p", { className: "absolute inset-x-0 bottom-0 z-10 flex items-start gap-2.5 px-5 pb-5 text-white md:px-6 md:pb-6", children: [_jsx("span", { className: "mt-[0.45em] size-1.5 shrink-0 rounded-full bg-white", "aria-hidden": "true" }), _jsxs("span", { className: "line-clamp-2 text-[0.92rem] leading-snug font-medium tracking-tight", children: [lead, " \u2014 ", card.caption] })] })] }));
}
const restingShift = [-50, 0, -100];
/**
 * Overlapping fact cards. Scroll sends the front card behind the stack
 * and brings the next card forward.
 */
export function FactsSnapshot() {
    const reduced = useReducedMotion() === true;
    const sectionRef = useRef(null);
    const copy = homeContent.facts;
    useGSAP(() => {
        const root = sectionRef.current;
        if (!root)
            return;
        const cards = gsap.utils.toArray('.fact-card', root);
        if (cards.length < 2)
            return;
        const steps = cards.length - 1;
        let placing = false;
        const layout = (progress) => {
            if (placing)
                return;
            placing = true;
            placeCards(cards, progress * steps);
            placing = false;
        };
        layout(0);
        if (reduced)
            return;
        let frame = 0;
        let latest = 0;
        const schedule = (progress) => {
            latest = progress;
            if (frame)
                return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                layout(latest);
            });
        };
        ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => schedule(self.progress),
        });
        return () => cancelAnimationFrame(frame);
    }, { scope: sectionRef, dependencies: [reduced] });
    return (_jsx("section", { id: "facts", ref: sectionRef, className: cn('relative overflow-clip bg-[#F4F0E8] [overflow-anchor:none]', reduced ? 'min-h-svh' : 'h-[300vh]'), "aria-labelledby": "facts-title", children: _jsxs("div", { className: cn('flex flex-col justify-center overflow-clip bg-[#F4F0E8] sticky-section', reduced ? 'min-h-svh' : 'sticky top-0 h-svh'), children: [_jsx(Container, { variant: "wide", className: "relative w-full", children: _jsxs("div", { className: "mx-auto max-w-160 text-center", children: [_jsx("h2", { id: "facts-title", className: "text-section-title text-[#171717]", children: copy.title }), _jsx("p", { className: "mt-3 text-body text-[#171717]/65 md:mt-4", children: copy.subtitle })] }) }), _jsx("div", { className: "fact-stage relative mt-8 h-[min(36vh,250px)] w-full sm:mt-10 sm:h-[min(44vh,370px)] lg:h-[min(52vh,460px)]", children: copy.cards.map((card, index) => (_jsx("article", { className: "fact-card absolute top-1/2 left-1/2 h-full w-[min(74vw,300px)] overflow-hidden rounded-[1.7rem] shadow-[0_24px_60px_rgb(40_32_24/0.16)] sm:w-[min(58vw,460px)] lg:w-[min(44vw,600px)]", style: {
                            zIndex: index === 0 ? 30 : 12,
                            transform: `translate(${restingShift[index] ?? -50}%, -50%) scale(${index === 0 ? 1 : 0.87})`,
                        }, children: _jsx(CardFace, { card: card }) }, card.id))) })] }) }));
}
