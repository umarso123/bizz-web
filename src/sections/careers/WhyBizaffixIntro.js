import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { careersCopy } from '@/content/careers.ts';
const headlineWords = careersCopy.why.headline.split(' ');
const bodySentences = careersCopy.why.body.split(/(?<=\.)\s+/).filter(Boolean);
export function WhyBizaffixIntro() {
    const reduced = useReducedMotion() === true;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.85', 'end 0.4'],
    });
    return (_jsxs("section", { ref: ref, className: "relative overflow-hidden bg-page-white py-28 md:py-40", "aria-labelledby": "why-bizaffix-title", children: [_jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent", "aria-hidden": "true" }), _jsxs(Container, { variant: "page", className: "relative w-full", children: [_jsx(Eyebrow, { tone: "brand", className: "uppercase tracking-[0.14em]", children: careersCopy.why.eyebrow }), _jsx("h2", { id: "why-bizaffix-title", className: "mt-8 max-w-[18ch] text-[clamp(2.25rem,1.2rem+3vw,4.25rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-text", children: headlineWords.map((word, index) => {
                            const start = index / headlineWords.length;
                            const end = start + 1 / headlineWords.length;
                            return (_jsx(WordReveal, { word: word, progress: scrollYProgress, start: start, end: Math.min(end + 0.08, 1), reduced: reduced }, `${word}-${index}`));
                        }) }), _jsx("div", { className: "mt-12 max-w-[40rem] space-y-5", children: bodySentences.map((sentence, index) => {
                            const start = 0.35 + index * 0.18;
                            return (_jsx(SentenceReveal, { text: sentence, progress: scrollYProgress, start: start, end: start + 0.2, reduced: reduced }, sentence));
                        }) })] })] }));
}
function WordReveal({ word, progress, start, end, reduced, }) {
    const opacity = useTransform(progress, [start, end], [0.18, 1]);
    const y = useTransform(progress, [start, end], [18, 0]);
    return (_jsx(m.span, { className: "mr-[0.28em] inline-block", style: { opacity: reduced ? 1 : opacity, y: reduced ? 0 : y }, children: word }));
}
function SentenceReveal({ text, progress, start, end, reduced, }) {
    const opacity = useTransform(progress, [start, end], [0, 1]);
    const y = useTransform(progress, [start, end], [24, 0]);
    return (_jsx(m.p, { className: "text-body-large text-text-secondary", style: { opacity: reduced ? 1 : opacity, y: reduced ? 0 : y }, children: text }));
}
