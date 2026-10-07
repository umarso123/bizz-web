import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { bookCall } from '@/app/navigation.ts';
import { homeContent } from '@/content/home.ts';
gsap.registerPlugin(ScrollTrigger, useGSAP);
/** The zoomed sticker opens into this color, and the following hero uses it as its background. */
export const floatingPortalColor = '#e8eefc';
const line = '#f5c84c';
const ink = '#0d121f';
const type = '#eef2fc';
const brand = '#2f5bea';
const brandDeep = '#2549c9';
const lineOne = `${homeContent.hero.titleLead} ${homeContent.hero.titleMid}`;
const lineTwo = `${homeContent.hero.titleEnd} ${homeContent.hero.titleAccent}`;
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
        const path = gsap.utils
            .toArray('[data-scribble]', root)
            .find((candidate) => candidate.getClientRects().length > 0);
        const svg = path?.ownerSVGElement ?? null;
        const fadeEls = gsap.utils.toArray('[data-fade]', root);
        const nodes = svg ? gsap.utils.toArray('[data-node]', svg) : [];
        if (path && svg) {
            const length = path.getTotalLength();
            nodes.forEach((node, index) => {
                const point = path.getPointAtLength((length * (index + 1)) / (nodes.length + 1));
                node.setAttribute('cx', String(point.x));
                node.setAttribute('cy', String(point.y));
            });
            const pen = svg?.querySelector('[data-pen-anchor]');
            if (pen) {
                const point = path.getPointAtLength(length * 0.46);
                pen.setAttribute('transform', `translate(${point.x} ${point.y})`);
            }
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
                y: index % 2 === 0 ? -22 : 18,
                x: index % 3 === 0 ? 12 : -10,
                rotation: index % 2 === 0 ? 6 : -7,
                duration: 2.5 + (index % 5) * 0.35,
                delay: index * 0.12,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });
        });
        const specialize = root.querySelector('[data-specialize]');
        const trigger = ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
        });
        const apply = () => {
            const zoomT = gsap.utils.clamp(0, 1, trigger.progress / 0.6);
            const t = gsap.parseEase('power2.inOut')(zoomT);
            const w = zoom.offsetWidth;
            const h = zoom.offsetHeight;
            if (w < 1 || h < 1)
                return;
            const cx = zoom.offsetLeft + w / 2;
            const cy = zoom.offsetTop + h / 2;
            const startR = Math.min(w, h) / 2;
            const endR = Math.hypot(stage.clientWidth, stage.clientHeight) / 2;
            const radius = startR + (endR - startR) * t;
            const bob = Math.sin(gsap.ticker.time * 2.05) * 10 * (1 - t);
            const x = cx + (stage.clientWidth / 2 - cx) * t;
            const y = cy + (stage.clientHeight / 2 - cy) * t + bob;
            gsap.set(zoom, { opacity: 1 - Math.min(1, t / 0.16) });
            gsap.set(fadeEls, { opacity: 1 - Math.min(1, Math.max(0, (t - 0.08) / 0.5)) });
            if (specialize) {
                gsap.set(specialize, { clipPath: `circle(${radius}px at ${x}px ${y}px)` });
                const shown = t > 0.22;
                specialize.inert = !shown;
                specialize.setAttribute('aria-hidden', shown ? 'false' : 'true');
            }
        };
        gsap.ticker.add(apply);
        apply();
        return () => {
            gsap.ticker.remove(apply);
        };
    }, { scope: rootRef });
    return (_jsxs(_Fragment, { children: [_jsx("section", { ref: rootRef, className: `relative -mt-(--header-clearance) bg-page-dark ${reduced ? 'min-h-svh' : 'h-[380vh]'}`, children: _jsxs("div", { ref: stageRef, className: "sticky top-0 h-svh overflow-hidden", children: [_jsx("div", { "aria-hidden": "true", "data-fade": true, className: "pointer-events-none absolute inset-0", style: {
                                background: 'radial-gradient(ellipse at 50% 46%, rgb(47 91 234 / 0.38), transparent 58%)',
                            } }), _jsxs("h1", { "data-fade": true, className: "pointer-events-none absolute inset-x-0 top-[47%] z-10 -translate-y-1/2 px-[2.5vw] text-center leading-[0.78] font-black tracking-[-0.06em] uppercase", style: { color: type }, children: [_jsx("span", { className: "block whitespace-nowrap", style: { fontSize: 'clamp(3.4rem, 14.6vw, 13.4rem)' }, children: lineOne }), _jsx("span", { className: "mt-[-0.05em] block whitespace-nowrap", style: { fontSize: 'clamp(2.65rem, 10.15vw, 9.6rem)' }, children: lineTwo })] }), _jsx(Scribble, { className: "max-sm:hidden", viewBox: "0 0 1440 900", nodes: 8, d: "M-30 250C140 40 300 70 280 250C260 430 60 500 150 300C250 80 520 90 600 280C690 490 430 640 640 540C850 440 780 160 1020 230C1240 290 1160 540 1320 450C1480 360 1360 680 1140 730C900 790 980 900 1220 860" }), _jsx(Scribble, { className: "sm:hidden", viewBox: "0 0 390 844", nodes: 6, d: "M-16 240C70 70 190 80 220 230C260 420 70 470 130 300C190 140 310 220 290 400C270 580 90 660 160 740C230 820 360 760 370 600" }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[16%] left-[8%] z-30 max-sm:top-[13%] max-sm:left-[4%]", children: _jsx("div", { className: "grid size-[6.6rem] place-items-center px-3 text-center shadow-lg max-sm:size-[5.4rem]", style: {
                                    background: line,
                                    color: ink,
                                    borderRadius: '58% 42% 60% 40% / 40% 58% 42% 60%',
                                }, children: _jsxs("span", { children: [_jsx("span", { className: "block text-[1.35rem] leading-none font-black max-sm:text-[1.05rem]", children: "5/5" }), _jsx("span", { className: "mt-1 block text-[0.68rem] leading-tight font-semibold max-sm:text-[0.6rem]", children: "overall platforms" })] }) }) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[33%] right-[16%] z-30 max-sm:top-[28%] max-sm:right-[3%]", children: _jsx("div", { className: "rounded-full px-4 py-2 text-[0.92rem] font-bold shadow-lg max-sm:px-3 max-sm:text-[0.78rem]", style: { background: line, color: ink }, children: homeContent.hero.primaryCta }) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[18%] right-[4%] z-30 max-sm:top-[16%] max-sm:right-[2%]", children: _jsx("div", { className: "grid size-[6.4rem] place-items-center rounded-full px-3 text-center text-[0.95rem] leading-tight font-bold shadow-lg max-sm:size-[5.1rem] max-sm:text-[0.78rem]", style: { background: brand, color: '#ffffff' }, children: "iOS" }) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[63%] left-[4%] z-30 max-sm:top-[57%] max-sm:left-[2%]", children: _jsx("div", { className: "-rotate-6 rounded-full px-4 py-2.5 text-[0.92rem] font-bold shadow-lg max-sm:px-3 max-sm:text-[0.75rem]", style: { background: brandDeep, color: '#ffffff' }, children: "Web Development" }) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[68%] right-[6%] z-30 max-sm:top-[62%] max-sm:right-[2%]", children: _jsx("div", { className: "rotate-3 px-4 py-2.5 text-[0.92rem] font-bold shadow-lg max-sm:px-3 max-sm:text-[0.75rem]", style: { background: type, color: ink, borderRadius: '1.1rem 0.45rem 1rem 0.4rem' }, children: "Flutter" }) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute top-[7%] right-[14%] z-30 max-sm:top-[8%] max-sm:right-[8%]", children: _jsx(YouMark, {}) }), _jsx("div", { "data-float": true, "data-fade": true, className: "absolute right-[9%] bottom-[16%] z-30 max-sm:right-[6%] max-sm:bottom-[22%]", children: _jsx(YouMark, {}) }), _jsxs("div", { ref: zoomRef, className: "absolute top-[73%] left-[24%] z-50 size-[9.4rem] max-sm:top-[76%] max-sm:left-[28%] max-sm:size-[7.4rem]", children: [_jsx("div", { className: "size-full rounded-full", style: { backgroundColor: floatingPortalColor } }), _jsx("div", { "data-zoom-label": true, className: "absolute inset-0 grid place-items-center rounded-full px-3 text-center shadow-lg ring-2 ring-[#ffffff]/70", children: _jsx("span", { className: "text-[1.02rem] leading-tight font-bold text-text max-sm:text-[0.85rem]", children: "Healthcare" }) })] }), _jsxs("div", { "data-fade": true, className: "absolute bottom-[6%] left-1/2 z-30 flex max-w-[calc(100%-1.25rem)] -translate-x-1/2 items-center gap-1 rounded-full bg-[#0E1A24] p-1.5 shadow-lg max-sm:bottom-[8%]", children: [_jsxs("span", { className: "hidden items-center gap-2 px-3 text-[0.8125rem] font-medium whitespace-nowrap sm:inline-flex", style: { color: '#ffffff' }, children: [_jsx("span", { className: "size-1.5 rounded-full", style: { background: line } }), "Healthcare"] }), _jsx(Link, { to: bookCall.to, className: "rounded-full px-4 py-2 text-[0.8125rem] font-semibold whitespace-nowrap no-underline shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-[0.875rem]", style: { backgroundColor: line, color: ink, textDecoration: 'none' }, children: homeContent.hero.primaryCta }), _jsx(Link, { to: "/#featured-projects", className: "rounded-full px-3 py-2 text-[0.8125rem] font-medium whitespace-nowrap no-underline outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-[0.875rem]", style: { color: '#ffffff', textDecoration: 'none' }, children: homeContent.hero.secondaryCta })] }), _jsx(HealthcareFocus, {})] }) }), reduced ? (_jsx("section", { className: "px-[clamp(1.25rem,5vw,6rem)] py-24", style: { backgroundColor: floatingPortalColor }, children: _jsx(HealthcareFocus, { visible: true }) })) : null] }));
}
const floatingKeywords = [
    { label: 'HealthTech Solutions', className: 'top-[2%] left-[18%]', opacity: 0.42 },
    { label: 'FemTech Software', className: 'top-[8%] left-[58%]', opacity: 0.95 },
    { label: 'Medical Software Development', className: 'top-[18%] left-[0%]', opacity: 0.55 },
    { label: 'mHealth Applications', className: 'top-[24%] left-[42%]', opacity: 1 },
    { label: 'Patient-Facing Apps', className: 'top-[34%] left-[70%]', opacity: 0.48 },
    { label: 'Connected Health Tech', className: 'top-[40%] left-[12%]', opacity: 0.88 },
    { label: 'Clinically Reviewed Content', className: 'top-[48%] left-[48%]', opacity: 0.5 },
    { label: 'Healthcare Branding', className: 'top-[12%] left-[78%]', opacity: 0.72 },
    { label: 'HIPAA Compliance', className: 'top-[56%] left-[2%]', opacity: 0.9 },
    { label: 'GDPR / DSGVO Privacy', className: 'top-[62%] left-[38%]', opacity: 0.44 },
    { label: 'ISO 13485 Standards', className: 'top-[58%] left-[68%]', opacity: 0.8 },
    { label: 'FDA Regulatory Alignment', className: 'top-[72%] left-[18%]', opacity: 0.52 },
    { label: 'Data Privacy Protocols', className: 'top-[76%] left-[54%]', opacity: 1 },
    { label: 'Secure Cloud Engineering', className: 'top-[84%] left-[6%]', opacity: 0.6 },
    { label: 'Protected Health Information (PHI)', className: 'top-[86%] left-[44%]', opacity: 0.4 },
    { label: 'Compliance-First Framework', className: 'top-[70%] left-[78%]', opacity: 0.75 },
];
function HealthcareFocus({ visible = false }) {
    return (_jsxs("div", { "data-specialize": visible ? undefined : '', "aria-hidden": visible ? undefined : true, className: visible
            ? 'grid items-center gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]'
            : 'pointer-events-none absolute inset-0 z-40 grid items-center gap-8 px-[clamp(1.25rem,4vw,5rem)] pt-(--header-clearance) lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]', style: visible ? undefined : { backgroundColor: floatingPortalColor, clipPath: 'circle(0px at 30% 80%)' }, children: [_jsxs("div", { children: [_jsxs("p", { className: "mb-4 inline-flex items-center gap-2 rounded-full border border-text/10 bg-[#ffffff]/70 px-3 py-1 text-[0.75rem] font-semibold tracking-[0.14em] text-text uppercase", children: [_jsx("span", { className: "size-1.5 rounded-full", style: { background: line } }), "Healthcare"] }), _jsxs("h2", { className: "max-w-[12ch] leading-[0.96] font-semibold tracking-[-0.045em] text-text", style: { fontSize: 'clamp(2.35rem, 4.2vw, 4.4rem)' }, children: ["We specialize", _jsx("br", {}), "in healthcare"] })] }), _jsx("div", { className: "relative min-h-[20rem] sm:min-h-[26rem] lg:min-h-[34rem]", children: floatingKeywords.map((item, index) => (_jsxs("p", { "data-float": true, className: `absolute max-w-[14rem] text-[clamp(0.88rem,1.15vw,1.2rem)] leading-tight font-semibold tracking-[-0.03em] text-text max-sm:max-w-[11rem] ${item.className}`, style: { opacity: item.opacity }, children: [_jsx("span", { className: "mr-2 inline-block size-2 translate-y-[-0.12em] rounded-full align-middle", style: { background: index % 2 === 0 ? brand : line } }), item.label] }, item.label))) })] }));
}
function YouMark() {
    return (_jsxs("div", { className: "flex items-start", children: [_jsx("svg", { width: "22", height: "22", viewBox: "0 0 22 22", "aria-hidden": "true", className: "-mt-0.5 shrink-0", children: _jsx("path", { d: "M3 2.2 17.2 10l-6 .7 3.1 6.5-2.5 1.2-3.2-6.6L3.2 16V2.2Z", fill: line }) }), _jsx("span", { className: "rounded-full px-2.5 py-1 text-[0.8125rem] font-bold shadow-md", style: { background: line, color: ink }, children: "You" })] }));
}
function Scribble({ d, viewBox, className, nodes, }) {
    return (_jsxs("svg", { "data-fade": true, "aria-hidden": "true", className: `pointer-events-none absolute inset-0 z-20 h-full w-full ${className}`, viewBox: viewBox, preserveAspectRatio: "xMidYMid slice", fill: "none", children: [_jsx("path", { "data-scribble": true, d: d, stroke: line, strokeWidth: "5", strokeLinecap: "round" }), Array.from({ length: nodes }, (_, index) => (_jsx("circle", { "data-node": true, cx: "0", cy: "0", r: "6", fill: line }, index))), _jsx("g", { "data-pen-anchor": true, children: _jsxs("g", { "data-float": true, children: [_jsx("path", { d: "M0 6c8 14 10 32 0 52-10-20-8-38 0-52z", fill: ink, stroke: line, strokeWidth: "2.4" }), _jsx("path", { d: "M0 18v22", stroke: line, strokeWidth: "1.7", strokeLinecap: "round" }), _jsx("circle", { cy: "12", r: "2.6", fill: line })] }) })] }));
}
