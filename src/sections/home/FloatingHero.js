import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { bookCall } from '@/app/navigation.ts';
import { homeContent } from '@/content/home.ts';
gsap.registerPlugin(ScrollTrigger, useGSAP);
/** The zoomed sticker opens into this color, and the following hero uses it as its background. */
export const floatingPortalColor = '#E8F5FC';
const line = '#D6F25C';
const ink = '#16082E';
const type = '#D9CCF8';
const titleWords = homeContent.hero.title.split(' ');
const lineOne = titleWords.slice(0, 2).join(' ');
const lineTwo = titleWords.slice(2).join(' ');
export function FloatingHero() {
    const rootRef = useRef(null);
    const stageRef = useRef(null);
    const zoomRef = useRef(null);
    const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    useGSAP(() => {
        const root = rootRef.current;
        const stage = stageRef.current;
        const zoom = zoomRef.current;
        if (!root || !stage || !zoom || reduced)
            return;
        const path = root.querySelector('[data-scribble]');
        const label = zoom.querySelector('[data-zoom-label]');
        const fadeEls = gsap.utils.toArray('[data-fade]', root);
        const nodes = gsap.utils.toArray('[data-node]', root);
        if (path) {
            const length = path.getTotalLength();
            nodes.forEach((node, index) => {
                const point = path.getPointAtLength((length * (index + 1)) / (nodes.length + 1));
                node.setAttribute('cx', String(point.x));
                node.setAttribute('cy', String(point.y));
            });
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(path, {
                strokeDashoffset: 0,
                duration: 2.4,
                ease: 'power2.out',
            });
        }
        gsap.to(nodes, {
            scale: 1.45,
            transformOrigin: 'center',
            duration: 1.15,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            stagger: { each: 0.18 },
        });
        gsap.utils.toArray('[data-float]', root).forEach((el, index) => {
            gsap.to(el, {
                y: index % 2 === 0 ? -16 : 14,
                x: index % 3 === 0 ? 8 : -7,
                rotation: index % 2 === 0 ? 4 : -5,
                duration: 2.7 + (index % 5) * 0.38,
                delay: index * 0.14,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });
        });
        const trigger = ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
        });
        const apply = () => {
            const raw = gsap.utils.clamp(0, 1, (trigger.progress - 0.06) / 0.94);
            const t = gsap.parseEase('power2.inOut')(raw);
            const w = zoom.offsetWidth;
            const h = zoom.offsetHeight;
            if (w < 1 || h < 1)
                return;
            const cx = zoom.offsetLeft + w / 2;
            const cy = zoom.offsetTop + h / 2;
            const cover = (Math.hypot(stage.clientWidth, stage.clientHeight) / Math.min(w, h)) * 1.2;
            const bob = Math.sin(gsap.ticker.time * 2.05) * 12 * (1 - t);
            const drift = Math.cos(gsap.ticker.time * 1.35) * 6 * (1 - t);
            gsap.set(zoom, {
                x: (stage.clientWidth / 2 - cx) * t + drift,
                y: (stage.clientHeight / 2 - cy) * t + bob,
                scale: 1 + (cover - 1) * t,
                force3D: true,
            });
            if (label)
                gsap.set(label, { opacity: 1 - Math.min(1, t / 0.42) });
            gsap.set(fadeEls, { opacity: 1 - Math.min(1, Math.max(0, (t - 0.08) / 0.5)) });
        };
        gsap.ticker.add(apply);
        apply();
        return () => {
            gsap.ticker.remove(apply);
        };
    }, { scope: rootRef });
    return (_jsx("section", { ref: rootRef, className: `relative -mt-(--header-clearance) bg-[#16082E] ${reduced ? 'min-h-svh' : 'h-[260vh]'}`, children: _jsxs("div", { ref: stageRef, className: "sticky top-0 h-svh overflow-hidden", children: [_jsx("div", { "aria-hidden": "true", "data-fade": true, className: "pointer-events-none absolute inset-0", style: {
                        background: 'radial-gradient(ellipse at 50% 46%, rgb(92 48 168 / 0.45), transparent 58%)',
                    } }), _jsxs("h1", { "data-fade": true, className: "pointer-events-none absolute inset-x-0 top-[47%] z-10 -translate-y-1/2 px-[2.5vw] text-center leading-[0.78] font-black tracking-[-0.06em] uppercase", style: { color: type }, children: [_jsx("span", { className: "block whitespace-nowrap", style: { fontSize: 'clamp(3.4rem, 14.6vw, 13.4rem)' }, children: lineOne }), _jsx("span", { className: "-mt-[0.05em] block whitespace-nowrap", style: { fontSize: 'clamp(2.65rem, 10.15vw, 9.6rem)' }, children: lineTwo })] }), _jsxs("svg", { "data-fade": true, "aria-hidden": "true", className: "pointer-events-none absolute inset-0 z-20 h-full w-full", viewBox: "0 0 1440 900", preserveAspectRatio: "xMidYMid slice", fill: "none", children: [_jsx("path", { "data-scribble": true, d: "M-80 390C40 360 90 150 250 190C430 236 360 470 540 430C730 388 690 180 900 220C1110 260 1040 480 1200 420C1360 360 1290 590 1100 630C900 672 980 830 1180 850C1360 868 1540 700 1470 540", stroke: line, strokeWidth: "3.5", strokeLinecap: "round" }), Array.from({ length: 7 }, (_, index) => (_jsx("circle", { "data-node": true, cx: "0", cy: "0", r: "5.5", fill: line }, index)))] }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[16%] left-[5%] z-30 max-sm:top-[13%] max-sm:left-[3%]", children: _jsx("div", { className: "grid size-[6.6rem] place-items-center px-3 text-center text-white shadow-lg max-sm:size-[5.4rem]", style: {
                            background: '#FF4B88',
                            borderRadius: '58% 42% 60% 40% / 40% 58% 42% 60%',
                        }, children: _jsxs("span", { children: [_jsx("span", { className: "block text-[1.35rem] leading-none font-black max-sm:text-[1.05rem]", children: "5/5" }), _jsx("span", { className: "mt-1 block text-[0.68rem] leading-tight font-semibold max-sm:text-[0.6rem]", children: "overall platforms" })] }) }) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[33%] right-[16%] z-30 max-sm:top-[28%] max-sm:right-[3%]", children: _jsx("div", { className: "rounded-full px-4 py-2 text-[0.92rem] font-bold shadow-lg max-sm:px-3 max-sm:text-[0.78rem]", style: { background: line, color: ink }, children: homeContent.hero.primaryCta }) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[18%] right-[4%] z-30 max-sm:top-[16%] max-sm:right-[2%]", children: _jsx("div", { className: "grid size-[6.4rem] place-items-center rounded-full bg-[#F2382F] px-3 text-center text-[0.95rem] leading-tight font-bold text-white shadow-lg max-sm:size-[5.1rem] max-sm:text-[0.78rem]", children: "iOS" }) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[63%] left-[4%] z-30 max-sm:top-[57%] max-sm:left-[2%]", children: _jsx("div", { className: "-rotate-6 rounded-full bg-[#3D7CFF] px-4 py-2.5 text-[0.92rem] font-bold text-white shadow-lg max-sm:px-3 max-sm:text-[0.75rem]", children: "Web Development" }) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[68%] right-[6%] z-30 max-sm:top-[62%] max-sm:right-[2%]", children: _jsx("div", { className: "rotate-3 px-4 py-2.5 text-[0.92rem] font-bold text-white shadow-lg max-sm:px-3 max-sm:text-[0.75rem]", style: { background: '#6C46F5', borderRadius: '1.1rem 0.45rem 1rem 0.4rem' }, children: "Flutter" }) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[7%] right-[14%] z-30 max-sm:top-[8%] max-sm:right-[8%]", children: _jsx(YouMark, {}) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute right-[9%] bottom-[16%] z-30 max-sm:right-[6%] max-sm:bottom-[20%]", children: _jsx(YouMark, {}) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[47%] left-[43%] z-30 max-sm:top-[44%] max-sm:left-[38%]", children: _jsx(PenNib, {}) }), _jsxs("div", { ref: zoomRef, className: "absolute top-[73%] left-[24%] z-40 size-[9.4rem] max-sm:top-[76%] max-sm:left-[28%] max-sm:size-[7.4rem]", children: [_jsx("div", { className: "size-full rounded-full", style: { backgroundColor: floatingPortalColor } }), _jsx("div", { "data-zoom-label": true, className: "absolute inset-0 grid place-items-center rounded-full px-3 text-center shadow-lg ring-2 ring-white/70", children: _jsx("span", { className: "text-[1.02rem] leading-tight font-bold text-[#17212b] max-sm:text-[0.85rem]", children: "Healthcare" }) })] }), _jsxs("div", { "data-fade": true, className: "absolute bottom-[4.5%] left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#241433]/85 p-1.5 shadow-lg backdrop-blur-md max-sm:bottom-[3%]", children: [_jsxs("span", { className: "hidden items-center gap-2 px-3 text-[0.8125rem] font-medium text-white/90 sm:inline-flex", children: [_jsx("span", { className: "size-1.5 rounded-full", style: { background: line } }), "Healthcare"] }), _jsx(Link, { to: bookCall.to, className: "rounded-full bg-white px-4 py-2 text-[0.875rem] font-semibold text-[#17212b] no-underline outline-none focus-visible:ring-2 focus-visible:ring-[#D6F25C]", children: homeContent.hero.primaryCta }), _jsx(Link, { to: "/work", className: "rounded-full px-3 py-2 text-[0.875rem] font-medium text-white/90 no-underline outline-none focus-visible:ring-2 focus-visible:ring-[#D6F25C]", children: homeContent.hero.secondaryCta })] })] }) }));
}
function YouMark() {
    return (_jsxs("div", { className: "flex items-start", children: [_jsx("svg", { width: "22", height: "22", viewBox: "0 0 22 22", "aria-hidden": "true", className: "-mt-0.5 shrink-0", children: _jsx("path", { d: "M3 2.2 17.2 10l-6 .7 3.1 6.5-2.5 1.2-3.2-6.6L3.2 16V2.2Z", fill: line }) }), _jsx("span", { className: "rounded-full px-2.5 py-1 text-[0.8125rem] font-bold shadow-md", style: { background: line, color: ink }, children: "You" })] }));
}
function PenNib() {
    return (_jsxs("svg", { width: "46", height: "46", viewBox: "0 0 46 46", "aria-hidden": "true", className: "-rotate-12", children: [_jsx("path", { d: "M10 31c7-2 11-9 13-18 1.2 9 6.5 15 15 17-7 1.2-11 6-13 12-2.2-6.2-6.6-10-15-11Z", fill: "#14081F", stroke: line, strokeWidth: "1.6", strokeLinejoin: "round" }), _jsx("path", { d: "M23 16c.3 4.2.1 8.2-.2 12", stroke: line, strokeWidth: "1.3", strokeLinecap: "round" })] }));
}
