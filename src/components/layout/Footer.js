import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router';
import { bookCall } from '@/app/navigation.ts';
import { Container } from '@/components/layout/Container.tsx';
const explore = [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/#services' },
    { label: 'Work', to: '/work' },
    { label: 'Approach', to: '/#approach' },
];
const company = [
    { label: 'Digital Health', to: '/#digital-health' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/contact' },
];
const social = [
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
];
const linkClass = 'text-body-small text-text no-underline transition-colors duration-200 hover:text-brand';
function TalkArrow() {
    return (_jsx("span", { className: "inline-flex size-[0.68em] shrink-0 items-center justify-center rounded-full bg-current", children: _jsx("svg", { viewBox: "0 0 24 24", className: "size-[0.4em] text-text-inverse", "aria-hidden": "true", children: _jsx("path", { fill: "currentColor", d: "M3.8 10.85h9.15l-3.2-3.2 1.9-1.9L18.2 12l-6.55 6.25-1.9-1.9 3.2-3.2H3.8v-2.3Z" }) }) }));
}
function TalkUnit({ clone = false }) {
    return (_jsx("div", { className: "footer-talk-unit flex min-w-screen shrink-0 items-center justify-center", "data-clone": clone ? '' : undefined, "aria-hidden": "true", children: _jsxs("span", { className: "inline-flex items-center gap-[0.32em] text-[clamp(3.25rem,12vw,12.5rem)] leading-none font-semibold tracking-[-0.045em] whitespace-nowrap", children: [_jsx(TalkArrow, {}), "Let\u2019s Talk", _jsx(TalkArrow, {})] }) }));
}
export function Footer() {
    return (_jsxs("footer", { className: "relative overflow-hidden bg-page-white text-text", children: [_jsx(Container, { variant: "page", className: "relative pt-16 pb-8 md:pt-24 md:pb-12", children: _jsxs("nav", { "aria-label": "Footer", className: "flex flex-wrap items-start justify-between gap-x-10 gap-y-10", children: [_jsxs("div", { className: "flex flex-wrap gap-x-16 gap-y-10 sm:gap-x-28", children: [_jsx("ul", { className: "grid gap-3", children: explore.map((item) => (_jsx("li", { children: _jsx(Link, { to: item.to, className: linkClass, children: item.label }) }, item.to))) }), _jsx("ul", { className: "grid gap-3", children: company.map((item) => (_jsx("li", { children: _jsx(Link, { to: item.to, className: linkClass, children: item.label }) }, item.to))) })] }), _jsx("ul", { className: "grid gap-3", children: social.map((item) => (_jsx("li", { children: _jsx("a", { href: item.href, className: linkClass, rel: "noreferrer noopener", target: "_blank", children: item.label }) }, item.label))) })] }) }), _jsx(Link, { to: bookCall.to, "aria-label": "Let\u2019s Talk", className: "footer-talk group relative block cursor-pointer overflow-hidden py-6 text-brand no-underline transition-colors duration-300 hover:text-brand-hover focus-visible:text-brand-hover md:py-8", children: _jsxs("div", { className: "footer-talk-track", children: [_jsx(TalkUnit, {}), _jsx(TalkUnit, { clone: true })] }) }), _jsx(Container, { variant: "page", className: "relative pt-6 pb-8 md:pt-8 md:pb-10", children: _jsxs("div", { className: "flex flex-col gap-3 text-caption text-text sm:flex-row sm:items-center sm:justify-between", children: [_jsx("p", { children: "All Rights Reserved" }), _jsx("p", { children: "Bizaffix LLC \u00A9 2023" }), _jsx("p", { children: "From idea to reality" })] }) })] }));
}
