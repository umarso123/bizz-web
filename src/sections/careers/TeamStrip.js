import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { m, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/layout/Container.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { careersCopy, teamMembers } from '@/content/careers.ts';
import { cn } from '@/lib/cn.ts';
import { Reveal } from '@/sections/home/Reveal.tsx';
function TeamCard({ name, role, photoLabel, index, reduced, }) {
    return (_jsxs("article", { className: "group relative w-[14rem] shrink-0 snap-start md:w-[16rem]", children: [_jsxs("div", { className: cn('relative aspect-[4/5] overflow-hidden rounded-xl border border-border-subtle bg-bg-muted'), children: [_jsx("div", { className: "absolute inset-0 transition-transform duration-500 ease-standard group-hover:scale-[1.04]", style: {
                            backgroundImage: index % 2 === 0
                                ? 'linear-gradient(160deg, rgb(10 143 216 / 0.18), rgb(244 247 249) 60%)'
                                : 'linear-gradient(200deg, rgb(246 108 42 / 0.14), rgb(248 250 252) 65%)',
                        }, "aria-hidden": "true" }), _jsx("div", { className: "absolute inset-6 rounded-lg border border-white/40 bg-white/25 backdrop-blur-[1px]", "aria-hidden": "true" }), _jsx("p", { className: "absolute inset-x-0 bottom-4 px-4 text-center text-caption text-text-muted", children: photoLabel })] }), _jsxs("div", { className: "mt-4", children: [_jsx(m.p, { className: "text-[1.05rem] font-semibold tracking-[-0.02em] text-text", animate: reduced ? undefined : undefined, whileHover: reduced ? undefined : { x: 4 }, children: _jsx("span", { className: "inline-block transition-transform duration-300 ease-standard group-hover:translate-x-1", children: name }) }), _jsx("p", { className: "mt-1 text-body-small text-text-secondary", children: role }), _jsx("span", { "aria-hidden": "true", className: "mt-3 block h-px w-0 bg-brand transition-all duration-300 ease-standard group-hover:w-10" })] })] }));
}
export function TeamStrip() {
    const reduced = useReducedMotion() === true;
    const loop = [...teamMembers, ...teamMembers];
    return (_jsxs("section", { className: "overflow-hidden bg-bg py-24 md:py-32", "aria-labelledby": "team-title", children: [_jsx(Container, { variant: "page", className: "w-full", children: _jsxs(Reveal, { className: "max-w-[34rem]", children: [_jsx(Eyebrow, { tone: "brand", className: "uppercase tracking-[0.14em]", children: careersCopy.team.eyebrow }), _jsx("h2", { id: "team-title", className: "mt-4 text-[clamp(2rem,1.3rem+2vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.025em] text-text", children: careersCopy.team.headline })] }) }), _jsxs("div", { className: "relative mt-14", children: [_jsx("div", { className: "pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent md:w-28", "aria-hidden": "true" }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent md:w-28", "aria-hidden": "true" }), reduced ? (_jsx("div", { className: "flex gap-6 overflow-x-auto px-[var(--page-gutter)] pb-4 snap-x", children: teamMembers.map((member, index) => (_jsx(TeamCard, { name: member.name, role: member.role, photoLabel: member.photoLabel, index: index, reduced: reduced }, member.id))) })) : (_jsx(m.div, { className: "flex w-max gap-6", animate: { x: ['0%', '-50%'] }, transition: { duration: 42, ease: 'linear', repeat: Infinity }, children: loop.map((member, index) => (_jsx(TeamCard, { name: member.name, role: member.role, photoLabel: member.photoLabel, index: index, reduced: reduced }, `${member.id}-${index}`))) }))] })] }));
}
