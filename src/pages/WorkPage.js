import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Container } from '@/components/layout/Container.tsx';
import { workBuiltContent, workIndustries, workPageContent } from '@/content/work.ts';
import { cn } from '@/lib/cn.ts';
import { WorkStill } from '@/sections/work/WorkStill.tsx';
const ease = [0.22, 1, 0.36, 1];
const filters = ['All', ...workIndustries];
function ArrowMark() {
    return (_jsx("svg", { viewBox: "0 0 24 24", className: "size-4", "aria-hidden": "true", children: _jsx("path", { d: "M7 17 17 7M9 7h8v8", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
/**
 * Portfolio index modeled on the dark works gallery:
 * centered title, industry filters, large media cards, then a light story band.
 */
export function WorkPage() {
    const reduced = useReducedMotion() === true;
    const copy = workPageContent;
    const [filter, setFilter] = useState('All');
    const studies = filter === 'All' ? copy.studies : copy.studies.filter((study) => study.industry === filter);
    useEffect(() => {
        const previous = document.title;
        document.title = 'Case studies · Bizaffix';
        return () => {
            document.title = previous;
        };
    }, []);
    return (_jsx(LazyMotion, { features: domAnimation, children: _jsxs("main", { className: "relative -mt-(--header-clearance) bg-[#07080c] text-white", children: [_jsxs("section", { className: "relative overflow-hidden pt-(--header-clearance)", "aria-labelledby": "work-title", children: [_jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-0", style: {
                                backgroundImage: 'linear-gradient(to right, rgb(255 255 255 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.045) 1px, transparent 1px)',
                                backgroundSize: '72px 72px',
                                maskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black 40%, transparent 100%)',
                            } }), _jsxs(Container, { variant: "wide", className: "relative z-10 pt-14 pb-16 md:pt-20 md:pb-24", children: [_jsxs(m.div, { className: "mx-auto max-w-3xl text-center", initial: reduced ? false : { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, ease }, children: [_jsx("h1", { id: "work-title", className: "text-[clamp(3.25rem,1.6rem+6vw,6.25rem)] leading-[0.95] font-semibold tracking-[-0.045em]", children: copy.title }), _jsx("p", { className: "mx-auto mt-5 max-w-[34rem] text-[1.125rem] leading-relaxed text-white/58", children: copy.intro })] }), _jsxs("div", { role: "group", "aria-label": copy.filtersLabel, className: "mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2 md:mt-12", children: [filters.map((item) => {
                                            const selected = item === filter;
                                            return (_jsx("button", { type: "button", "aria-pressed": selected, onClick: () => setFilter(item), className: cn('inline-flex h-10 items-center rounded-full px-4 text-[0.9375rem] font-medium transition-colors', 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white', selected
                                                    ? 'bg-white text-[#12141a]'
                                                    : 'border border-white/10 bg-white/6 text-white/80 hover:bg-white/12'), children: item }, item));
                                        }), _jsx("p", { className: "sr-only", "aria-live": "polite", children: studies.length === 1 ? '1 case study' : `${studies.length} case studies` })] }), studies.length === 0 ? (_jsx("p", { className: "mt-16 text-center text-white/60", children: copy.emptyLabel })) : (_jsx("ul", { className: "mt-12 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5", children: studies.map((study) => (_jsx("li", { children: _jsxs(Link, { to: `/work/${study.slug}`, className: "group flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#12141a] no-underline outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080c]", children: [_jsxs("div", { className: "relative aspect-16/10", children: [_jsx(WorkStill, { slug: study.slug }), _jsx(StudyPhoto, { src: study.image, alt: "" }), _jsxs("span", { className: "absolute bottom-4 left-4 inline-flex max-w-[calc(100%-5.5rem)] items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-[0.8125rem] font-medium text-white backdrop-blur-md", children: [_jsx("span", { "aria-hidden": "true", className: "size-1.5 shrink-0 rounded-full bg-white/80" }), _jsx("span", { className: "truncate", children: study.category })] }), _jsx("span", { "aria-hidden": "true", className: cn('absolute right-4 bottom-4 grid size-11 place-items-center rounded-full shadow-[0_8px_20px_rgb(0_0_0/0.25)] transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none', study.media === 'day' ? 'bg-[#12141a] text-white' : 'bg-white text-[#12141a]'), children: _jsx(ArrowMark, {}) })] }), _jsxs("div", { className: "px-6 pt-5 pb-6", children: [_jsx("h2", { className: "text-[1.65rem] leading-tight font-semibold tracking-[-0.03em] text-white", children: study.title }), _jsx("p", { className: "mt-2 max-w-[48ch] text-[1.02rem] leading-relaxed text-white/62", children: study.summary })] })] }) }, study.slug))) }))] })] }), _jsx("section", { className: "bg-page-white text-text", "aria-labelledby": "built-title", children: _jsxs(Container, { variant: "wide", className: "py-20 md:py-28", children: [_jsxs("div", { className: "max-w-[16ch]", children: [_jsx("h2", { id: "built-title", className: "font-[Iowan_Old_Style,Palatino_Linotype,Palatino,Georgia,serif] text-[clamp(2.8rem,1.4rem+4vw,5rem)] leading-[0.98] font-medium tracking-[-0.03em]", children: workBuiltContent.title }), _jsx("p", { className: "mt-5 max-w-[36ch] text-body-large text-text-secondary", children: workBuiltContent.lede })] }), _jsx("ul", { className: "mt-10 grid gap-4 md:mt-12 md:grid-cols-[1.15fr_0.85fr] md:gap-5", children: workBuiltContent.stories.map((story) => {
                                    const blue = story.tone === 'blue';
                                    return (_jsx("li", { children: _jsxs(Link, { to: `/work/${story.slug}`, className: cn('group flex h-full min-h-[28rem] flex-col justify-between rounded-[1.75rem] p-7 no-underline outline-none md:min-h-[32rem] md:p-9', 'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2', blue ? 'bg-brand text-white' : 'bg-[#10151c] text-white'), children: [_jsx("div", { className: "flex justify-end", children: _jsx("span", { className: cn('rounded-full px-3 py-1 text-[0.8125rem] font-medium', blue ? 'bg-white/16 text-white' : 'bg-white/10 text-white/85'), children: story.industry }) }), _jsx("p", { className: "max-w-[10ch] text-[clamp(2.6rem,1.5rem+2.6vw,4rem)] leading-[0.96] font-semibold tracking-[-0.045em]", children: story.title }), _jsxs("div", { className: "flex items-end justify-between gap-6", children: [_jsx("p", { className: cn('max-w-[40ch] text-[1.02rem] leading-relaxed', blue ? 'text-white/82' : 'text-white/68'), children: story.body }), _jsx("span", { "aria-hidden": "true", className: cn('grid size-11 shrink-0 place-items-center rounded-full transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none', blue ? 'bg-white/16 text-white' : 'bg-white/10 text-white'), children: _jsx(ArrowMark, {}) })] })] }) }, story.slug));
                                }) })] }) })] }) }));
}
function StudyPhoto({ src, alt }) {
    const [visible, setVisible] = useState(false);
    if (!src)
        return null;
    return (_jsx("img", { src: src, alt: alt, className: cn('pointer-events-none absolute inset-0 h-full w-full object-cover', visible ? 'opacity-100' : 'opacity-0'), onLoad: () => setVisible(true), onError: () => setVisible(false) }));
}
