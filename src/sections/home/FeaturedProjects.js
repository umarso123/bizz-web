import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, } from 'react';
import { Link } from 'react-router';
import { Container } from '@/components/layout/Container.tsx';
import { featuredProjectsContent, } from '@/content/featured-projects.ts';
import { useMediaQuery } from '@/sections/home/homeJourney.ts';
import { cn } from '@/lib/cn.ts';
gsap.registerPlugin(ScrollTrigger, useGSAP);
const BLUE = '#2F5BEA';
const ORANGE = '#F5C84C';
const LERP = 0.085;
const BREATH_AMP = 0.004;
function clamp(n, min = 0, max = 1) {
    return Math.min(max, Math.max(min, n));
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
/** Map scroll focus → layered sheet poses (incoming from below). */
function poseForDelta(delta, index, depthSoft) {
    if (delta > 0) {
        const enter = clamp(delta);
        const deep = depthSoft ? 0.55 : 1;
        return {
            y: enter * 108,
            scale: 1 - enter * 0.07 * deep,
            rotate: enter * 2.4 * deep,
            opacity: 1 - enter * 0.18,
            blur: enter * (depthSoft ? 3 : 5.5),
            z: 40 + index,
        };
    }
    const exit = clamp(Math.abs(delta));
    const deep = depthSoft ? 0.5 : 1;
    return {
        y: -exit * 12 * deep,
        scale: 1 - exit * 0.09 * deep,
        rotate: -exit * 1.15 * deep,
        opacity: 1 - exit * 0.42,
        blur: exit * (depthSoft ? 1.5 : 2.8),
        z: 20 + index,
    };
}
function ProjectImage({ project }) {
    const [failed, setFailed] = useState(false);
    const [loaded, setLoaded] = useState(false);
    return (_jsxs("div", { className: "absolute inset-0 overflow-hidden bg-[#0E5F90]", children: [_jsx("div", { "aria-hidden": "true", className: "absolute inset-0", style: {
                    background: `
            radial-gradient(ellipse at 28% 22%, rgb(255 255 255 / 0.18), transparent 52%),
            radial-gradient(ellipse at 78% 78%, rgb(245 200 76 / 0.16), transparent 48%),
            linear-gradient(145deg, #2f5bea 0%, #2549c9 48%, #1a2f8a 100%)
          `,
                } }), !failed ? (_jsx("img", { src: project.image, alt: project.alt, className: cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', loaded ? 'opacity-100' : 'opacity-0'), loading: "lazy", decoding: "async", draggable: false, onLoad: () => setLoaded(true), onError: () => setFailed(true) })) : null, failed || !loaded ? (_jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center", children: [_jsx("p", { className: "text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-semibold tracking-tighter text-white/90", children: project.number }), _jsx("p", { className: "text-[clamp(1.25rem,2.4vw,2rem)] leading-none font-semibold tracking-tight text-white", children: project.name }), _jsx("p", { className: "text-[0.72rem] font-medium tracking-[0.18em] text-white/55 uppercase", children: project.category })] })) : null] }));
}
function SectionChrome({ title, viewAllLabel, viewAllTo, headerRef, }) {
    return (_jsxs("div", { ref: headerRef, className: "flex items-end justify-between gap-6", children: [_jsx("h2", { id: "featured-projects-title", className: "text-[clamp(1.85rem,1.15rem+2.2vw,3.15rem)] leading-none font-semibold tracking-tighter text-white", children: title }), _jsxs(Link, { to: viewAllTo, className: "group inline-flex shrink-0 items-center gap-2.5 text-[0.92rem] font-medium text-white/90 no-underline transition-colors hover:text-white", children: [_jsx("span", { className: "hidden sm:inline", children: viewAllLabel }), _jsx("span", { "aria-hidden": "true", className: "inline-block transition-transform duration-300 group-hover:translate-x-0.5", children: "\u2192" })] })] }));
}
function Atmosphere() {
    return (_jsxs(_Fragment, { children: [_jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-0", style: {
                    background: `
            radial-gradient(ellipse 70% 55% at 18% 12%, rgb(255 255 255 / 0.16), transparent 58%),
            radial-gradient(ellipse 55% 45% at 88% 78%, rgb(245 200 76 / 0.1), transparent 55%),
            radial-gradient(ellipse 40% 35% at 55% 48%, rgb(255 255 255 / 0.07), transparent 60%)
          `,
                } }), _jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute bottom-[16%] left-[5%] hidden h-px w-24 bg-white/25 lg:block" }), _jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute bottom-[15.55%] left-[5%] hidden size-1.5 -translate-x-1/2 rounded-full lg:block", style: { backgroundColor: ORANGE } })] }));
}
function MobileFeatured({ projects, copy, }) {
    return (_jsxs("section", { id: "featured-projects", className: "relative overflow-hidden rounded-t-[2rem] py-12 md:rounded-t-[2.75rem] md:py-16", style: { backgroundColor: BLUE }, "aria-labelledby": "featured-projects-title", children: [_jsx(Atmosphere, {}), _jsxs(Container, { variant: "wide", className: "relative z-10 w-full", children: [_jsx(SectionChrome, { title: copy.title, viewAllLabel: copy.viewAllLabel, viewAllTo: copy.viewAllTo }), _jsx("ul", { className: "mt-8 space-y-10", children: projects.map((project) => (_jsxs("li", { className: "relative", children: [_jsx("div", { className: "overflow-hidden rounded-[1.75rem] shadow-[0_28px_70px_rgb(6_50_90/0.32)] ring-1 ring-white/15", children: _jsx("div", { className: "relative aspect-16/10 w-full", children: _jsx(ProjectImage, { project: project }) }) }), _jsxs("div", { className: "mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-white", children: [_jsx("span", { className: "text-[0.78rem] font-semibold tracking-[0.14em] text-white/70", children: project.number }), _jsx("h3", { className: "text-[1.2rem] font-semibold tracking-tight", children: project.name }), _jsx("span", { className: "text-[0.78rem] text-white/60", children: project.category })] }), _jsx("p", { className: "mt-2 max-w-xl text-[0.95rem] leading-snug text-white/75", children: project.description }), _jsxs(Link, { to: project.href, className: "mt-3 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-white no-underline", children: [copy.caseStudyLabel, _jsx("span", { "aria-hidden": "true", children: "\u2192" })] })] }, project.id))) })] })] }));
}
function ReducedFeatured({ projects, copy, }) {
    return (_jsxs("section", { id: "featured-projects", className: "relative overflow-hidden rounded-t-[2.5rem] py-14 md:rounded-t-[3.25rem] md:py-20", style: { backgroundColor: BLUE }, "aria-labelledby": "featured-projects-title", children: [_jsx(Atmosphere, {}), _jsxs(Container, { variant: "wide", className: "relative z-10 w-full", children: [_jsx(SectionChrome, { title: copy.title, viewAllLabel: copy.viewAllLabel, viewAllTo: copy.viewAllTo }), _jsx("div", { className: "mt-10 grid gap-8 lg:grid-cols-2", children: projects.map((project) => (_jsxs("article", { children: [_jsx("div", { className: "overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_rgb(6_50_90/0.28)] ring-1 ring-white/15", children: _jsx("div", { className: "relative aspect-16/10", children: _jsx(ProjectImage, { project: project }) }) }), _jsxs("div", { className: "mt-4 text-white", children: [_jsxs("p", { className: "text-[0.75rem] font-semibold tracking-[0.14em] text-white/65", children: [project.number, " \u00B7 ", project.category] }), _jsx("h3", { className: "mt-1 text-title", children: project.name }), _jsx("p", { className: "mt-2 text-body-small text-white/75", children: project.description }), _jsxs(Link, { to: project.href, className: "mt-3 inline-flex text-body-small font-semibold text-white no-underline", children: [copy.caseStudyLabel, " \u2192"] })] })] }, project.id))) })] })] }));
}
/**
 * Immersive featured projects stage.
 * Tall scroll → sticky viewport → each next project enters from below.
 */
export function FeaturedProjects() {
    const reduced = useReducedMotion() === true;
    const isMobile = useMediaQuery('(max-width: 767px)');
    const softDepth = useMediaQuery('(max-width: 1023px)');
    const copy = featuredProjectsContent;
    const projects = copy.projects;
    const count = projects.length;
    const sectionRef = useRef(null);
    const frameRef = useRef(null);
    const headerRef = useRef(null);
    const layersRef = useRef([]);
    const mediaRefs = useRef([]);
    const counterRef = useRef(null);
    const progressRef = useRef(null);
    const orbitRef = useRef(null);
    const [active, setActive] = useState(0);
    const targetProgress = useRef(0);
    const currentProgress = useRef(0);
    const activeIndex = useRef(0);
    const tilt = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
    const rafRef = useRef(0);
    const breath = useRef(0);
    const paint = useCallback((focus, time) => {
        const depthSoft = softDepth;
        breath.current = Math.sin(time * 0.0011) * BREATH_AMP;
        layersRef.current.forEach((layer, i) => {
            if (!layer)
                return;
            const pose = poseForDelta(i - focus, i, depthSoft);
            const isActive = Math.abs(i - focus) < 0.55;
            const scale = pose.scale + (isActive ? breath.current : 0);
            gsap.set(layer, {
                yPercent: pose.y,
                scale,
                rotate: pose.rotate,
                opacity: pose.opacity,
                filter: pose.blur > 0.15 ? `blur(${pose.blur}px)` : 'none',
                zIndex: pose.z,
                force3D: true,
            });
            const media = mediaRefs.current[i];
            if (media && isActive) {
                gsap.set(media, {
                    yPercent: (i - focus) * -1.8,
                    scale: 1.04,
                    force3D: true,
                });
            }
            else if (media) {
                gsap.set(media, { yPercent: 0, scale: 1.03, force3D: true });
            }
        });
        const t = tilt.current;
        t.x = lerp(t.x, t.tx, 0.12);
        t.y = lerp(t.y, t.ty, 0.12);
        if (frameRef.current) {
            gsap.set(frameRef.current, {
                rotateX: t.x,
                rotateY: t.y,
                transformPerspective: 1200,
                force3D: true,
            });
        }
        if (progressRef.current) {
            const pct = count <= 1 ? 1 : focus / (count - 1);
            progressRef.current.style.transform = `scaleX(${clamp(pct)})`;
        }
        if (orbitRef.current) {
            const pct = count <= 1 ? 0 : focus / (count - 1);
            gsap.set(orbitRef.current, { rotate: pct * 28, force3D: true });
        }
        if (counterRef.current) {
            const idx = clamp(Math.round(focus), 0, count - 1);
            const label = projects[idx]?.number ?? '01';
            if (counterRef.current.textContent !== label) {
                counterRef.current.textContent = label;
            }
        }
        const nextIndex = clamp(Math.round(focus), 0, count - 1);
        if (nextIndex !== activeIndex.current) {
            activeIndex.current = nextIndex;
            setActive(nextIndex);
        }
    }, [count, projects, softDepth]);
    useGSAP(() => {
        const root = sectionRef.current;
        if (!root || reduced || isMobile || count < 1)
            return;
        gsap.set(layersRef.current.filter(Boolean), { clearProps: 'transform,filter,opacity' });
        paint(0, 0);
        if (headerRef.current) {
            gsap.fromTo(headerRef.current, { y: 18, opacity: 0 }, {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: root,
                    start: 'top 75%',
                    once: true,
                },
            });
        }
        if (frameRef.current) {
            gsap.fromTo(frameRef.current, { scale: 0.96, opacity: 0.72 }, {
                scale: 1,
                opacity: 1,
                duration: 0.75,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: root,
                    start: 'top 70%',
                    once: true,
                },
            });
        }
        const trigger = ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: false,
            onUpdate: (self) => {
                targetProgress.current = self.progress;
            },
            invalidateOnRefresh: true,
        });
        const tick = (time) => {
            currentProgress.current = lerp(currentProgress.current, targetProgress.current, LERP);
            const focus = currentProgress.current * Math.max(count - 1, 0);
            paint(focus, time);
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => {
            cancelAnimationFrame(rafRef.current);
            trigger.kill();
        };
    }, {
        scope: sectionRef,
        dependencies: [reduced, isMobile, count, paint],
    });
    const onPointerMove = useCallback((event) => {
        if (reduced || isMobile || softDepth || !frameRef.current)
            return;
        const rect = frameRef.current.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        tilt.current.tx = -py * 3.2;
        tilt.current.ty = px * 3.2;
    }, [isMobile, reduced, softDepth]);
    const onPointerLeave = useCallback(() => {
        tilt.current.tx = 0;
        tilt.current.ty = 0;
    }, []);
    useEffect(() => {
        activeIndex.current = active;
    }, [active]);
    if (reduced) {
        return _jsx(ReducedFeatured, { projects: projects, copy: copy });
    }
    if (isMobile) {
        return _jsx(MobileFeatured, { projects: projects, copy: copy });
    }
    const activeProject = projects[active] ?? projects[0];
    const scrollHeight = `${Math.max(count, 1) * 100}vh`;
    return (_jsx("section", { id: "featured-projects", ref: sectionRef, className: "relative overflow-x-clip [overflow-anchor:none]", style: { height: scrollHeight }, "aria-labelledby": "featured-projects-title", children: _jsxs("div", { className: "sticky top-0 flex h-svh flex-col overflow-hidden rounded-t-[2.5rem] md:rounded-t-[3.25rem] sticky-section", style: { backgroundColor: BLUE }, children: [_jsx(Atmosphere, {}), _jsxs("svg", { ref: orbitRef, "aria-hidden": "true", className: "pointer-events-none absolute top-[14%] right-[5%] z-0 hidden h-44 w-44 opacity-40 xl:block", viewBox: "0 0 176 176", fill: "none", children: [_jsx("circle", { cx: "88", cy: "88", r: "70", stroke: "white", strokeOpacity: "0.28", strokeWidth: "0.7" }), _jsx("circle", { cx: "88", cy: "88", r: "48", stroke: "white", strokeOpacity: "0.16", strokeWidth: "0.6" }), _jsx("circle", { cx: "138", cy: "42", r: "2.4", fill: ORANGE })] }), _jsxs(Container, { variant: "wide", className: "relative z-20 w-full pt-7 md:pt-9 lg:pt-11", children: [_jsx(SectionChrome, { headerRef: headerRef, title: copy.title, viewAllLabel: copy.viewAllLabel, viewAllTo: copy.viewAllTo }), _jsxs("div", { className: "mt-4 flex items-center gap-4 md:mt-5", children: [_jsxs("p", { className: "font-mono text-[0.78rem] tracking-[0.08em] text-white/80 tabular-nums", children: [_jsx("span", { ref: counterRef, children: activeProject?.number ?? '01' }), _jsxs("span", { className: "text-white/40", children: [" / 0", count] })] }), _jsx("div", { className: "h-px max-w-40 flex-1 overflow-hidden bg-white/20", children: _jsx("div", { ref: progressRef, className: "h-full origin-left bg-white", style: {
                                            transform: 'scaleX(0)',
                                            boxShadow: `0 0 0 0.5px ${ORANGE}`,
                                        } }) }), _jsx("span", { "aria-hidden": "true", className: "size-1.5 rounded-full", style: { backgroundColor: ORANGE } })] })] }), _jsx("div", { className: "relative z-10 flex min-h-0 flex-1 flex-col justify-center px-4 pb-5 sm:px-6 md:pb-7 lg:px-8", children: _jsx("div", { className: "mx-auto w-full max-w-[min(92vw,78rem)]", style: { perspective: '1400px' }, children: _jsx("div", { ref: frameRef, className: "relative mx-auto w-full will-change-transform", style: {
                                height: 'min(68vh, 640px)',
                                maxWidth: '1280px',
                                transformStyle: 'preserve-3d',
                            }, onPointerMove: onPointerMove, onPointerLeave: onPointerLeave, children: projects.map((project, index) => (_jsx("article", { ref: (node) => {
                                    layersRef.current[index] = node;
                                }, className: "absolute inset-0 overflow-hidden rounded-[1.85rem] shadow-[0_32px_80px_rgb(6_40_80/0.38)] ring-1 ring-white/18 md:rounded-[2.15rem]", style: {
                                    zIndex: index + 1,
                                    transformOrigin: '50% 50%',
                                    backfaceVisibility: 'hidden',
                                }, "aria-hidden": index !== active, children: _jsx("div", { ref: (node) => {
                                        mediaRefs.current[index] = node;
                                    }, className: "absolute inset-[-4%] will-change-transform", children: _jsx(ProjectImage, { project: project }) }) }, project.id))) }) }) })] }) }));
}
