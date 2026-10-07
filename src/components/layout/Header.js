import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { bookCall, primaryNavigation } from '@/app/navigation.ts';
import { BrandLogo } from '@/components/brand/BrandLogo.tsx';
import { cn } from '@/lib/cn.ts';
const desktopNavQuery = '(min-width: 960px)';
const menuId = 'site-menu';
const expandScrollThreshold = 80;
const containerVariants = {
    expanded: {
        y: 0,
        opacity: 1,
        width: 'auto',
        transition: {
            y: { type: 'spring', damping: 18, stiffness: 250 },
            opacity: { duration: 0.3 },
            width: { type: 'spring', damping: 22, stiffness: 260 },
            staggerChildren: 0.05,
            delayChildren: 0.08,
        },
    },
    collapsed: {
        y: 0,
        opacity: 1,
        width: '3.25rem',
        transition: {
            type: 'spring',
            damping: 22,
            stiffness: 280,
            when: 'afterChildren',
            staggerChildren: 0.04,
            staggerDirection: -1,
        },
    },
};
const itemVariants = {
    expanded: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', damping: 16, stiffness: 260 } },
    collapsed: { opacity: 0, x: -16, scale: 0.96, transition: { duration: 0.18 } },
};
const collapsedIconVariants = {
    expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.16 } },
    collapsed: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', damping: 16, stiffness: 300, delay: 0.12 },
    },
};
const sideEntrance = {
    initial: { y: -24, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { type: 'spring', damping: 18, stiffness: 260 },
};
function MenuIcon() {
    return (_jsx("svg", { width: "18", height: "18", viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true", children: _jsx("path", { d: "M3.5 6h13M3.5 10h13M3.5 14h13", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) }));
}
function CloseIcon() {
    return (_jsx("svg", { width: "18", height: "18", viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true", children: _jsx("path", { d: "M5 5l10 10M15 5L5 15", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) }));
}
const glassPill = 'border border-white/35 bg-transparent shadow-[0_8px_32px_rgb(13_18_31/0.05)] backdrop-blur-2xl backdrop-saturate-150';
const darkPill = 'border border-white/12 bg-[#16181f]/90 text-white shadow-[0_12px_40px_rgb(0_0_0/0.35)] backdrop-blur-2xl';
function Logo({ onDark = false }) {
    return (_jsx("div", { className: cn('rounded-full px-3.5 py-1.5', onDark ? 'border border-white/80 bg-white shadow-[0_8px_28px_rgb(0_0_0/0.22)]' : glassPill), children: _jsx(BrandLogo, { imgClassName: "h-7 w-auto" }) }));
}
function CallLink({ onClick, onDark = false }) {
    return (_jsx(Link, { to: bookCall.to, onClick: onClick, className: cn('inline-flex h-11 shrink-0 items-center rounded-button px-5 text-[0.9375rem] font-semibold tracking-[-0.01em] whitespace-nowrap no-underline shadow-md transition-colors duration-(--duration-standard) ease-standard', onDark
            ? 'bg-brand text-white hover:bg-brand-hover'
            : 'bg-button-primary text-text-inverse hover:bg-button-primary-hover'), children: bookCall.label }));
}
function linkClass(layout, active, onDark = false) {
    return cn('group relative items-center font-medium whitespace-nowrap no-underline transition-colors duration-(--duration-standard) ease-standard', onDark
        ? active
            ? 'text-white hover:text-white'
            : 'text-white/70 hover:text-white'
        : active
            ? 'text-text hover:text-text'
            : 'text-text-secondary hover:text-text', layout);
}
export function Header() {
    const reduced = useReducedMotion() === true;
    const { scrollY } = useScroll();
    const { pathname } = useLocation();
    const onDark = pathname === '/work';
    const [isExpanded, setExpanded] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.scrollY <= 150);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPath, setMenuPath] = useState(pathname);
    const lastScrollY = useRef(window.scrollY);
    const scrollPositionOnCollapse = useRef(window.scrollY);
    const menuButtonRef = useRef(null);
    if (menuPath !== pathname) {
        setMenuPath(pathname);
        setMenuOpen(false);
    }
    useMotionValueEvent(scrollY, 'change', (latest) => {
        const previous = lastScrollY.current;
        lastScrollY.current = latest;
        if (reduced)
            return;
        if (isExpanded && latest > previous && latest > 150) {
            setExpanded(false);
            setMenuOpen(false);
            scrollPositionOnCollapse.current = latest;
            return;
        }
        if (!isExpanded && latest < previous && scrollPositionOnCollapse.current - latest > expandScrollThreshold) {
            setExpanded(true);
        }
    });
    useEffect(() => {
        const media = window.matchMedia(desktopNavQuery);
        const onChange = () => {
            if (media.matches)
                setMenuOpen(false);
        };
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);
    useEffect(() => {
        if (!menuOpen)
            return;
        const onKeyDown = (event) => {
            if (event.key !== 'Escape')
                return;
            setMenuOpen(false);
            menuButtonRef.current?.focus();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [menuOpen]);
    function closeMenu() {
        setMenuOpen(false);
    }
    return (_jsxs("header", { className: "pointer-events-none fixed inset-x-0 top-0 z-50", children: [_jsxs("div", { className: "relative mx-auto flex h-[3.25rem] w-full max-w-(--container-page) items-center justify-between ps-(--page-gutter) pe-[max(var(--page-gutter),2.75rem)] pt-5", children: [_jsx(motion.div, { ...(reduced ? {} : sideEntrance), className: "pointer-events-auto", children: _jsx(Logo, { onDark: onDark }) }), _jsx(motion.div, { ...(reduced ? {} : sideEntrance), className: "pointer-events-auto", children: _jsx(CallLink, { onClick: closeMenu, onDark: onDark }) })] }), _jsxs("nav", { "aria-label": "Primary", className: "pointer-events-auto absolute top-5 left-1/2 -translate-x-1/2", children: [_jsxs(motion.div, { initial: reduced ? false : { y: -80, opacity: 0 }, animate: reduced ? undefined : isExpanded ? 'expanded' : 'collapsed', variants: reduced ? undefined : containerVariants, whileHover: !reduced && !isExpanded ? { scale: 1.06 } : undefined, whileTap: !reduced && !isExpanded ? { scale: 0.96 } : undefined, className: cn('relative hidden h-[3.25rem] items-center overflow-hidden rounded-full min-[960px]:flex', onDark ? darkPill : glassPill, isExpanded ? (onDark ? '' : 'border-white/50') : 'cursor-pointer', !onDark && !isExpanded && 'border-brand/25'), children: [_jsx("button", { type: "button", className: cn('absolute inset-0 z-10 flex items-center justify-center rounded-full', onDark ? 'text-white' : 'text-text', isExpanded && 'pointer-events-none'), "aria-label": "Open navigation", "aria-expanded": isExpanded, "aria-hidden": isExpanded || undefined, tabIndex: isExpanded ? -1 : 0, onClick: () => setExpanded(true), children: _jsx(motion.span, { "aria-hidden": "true", variants: collapsedIconVariants, animate: reduced ? undefined : isExpanded ? 'expanded' : 'collapsed', className: "flex items-center justify-center", children: _jsx(MenuIcon, {}) }) }), _jsx("div", { inert: !isExpanded ? true : undefined, className: cn('flex w-max items-center px-3', !isExpanded && 'pointer-events-none'), children: _jsx(motion.div, { variants: reduced ? undefined : itemVariants, children: _jsx("ul", { className: "flex items-center", children: primaryNavigation.map((item) => (_jsx("li", { children: _jsx(NavLink, { to: item.to, end: true, onClick: closeMenu, className: ({ isActive }) => linkClass('inline-flex px-2.5 py-1 text-[0.875rem] tracking-[-0.01em]', isActive, onDark), children: ({ isActive }) => (_jsxs(_Fragment, { children: [item.label, _jsx("span", { "aria-hidden": "true", className: cn('absolute -bottom-0.5 left-2.5 h-px w-[calc(100%-1.25rem)] origin-left bg-brand motion-safe:transition-transform motion-safe:duration-(--duration-slow) motion-safe:ease-standard', isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100') })] })) }) }, item.to))) }) }) })] }), _jsx("button", { ref: menuButtonRef, type: "button", className: cn('inline-flex size-[3.25rem] items-center justify-center rounded-full min-[960px]:hidden', onDark ? cn(darkPill, 'text-white') : cn(glassPill, 'text-text'), !onDark && menuOpen ? 'border-brand/35' : ''), "aria-expanded": menuOpen, "aria-controls": menuId, "aria-label": menuOpen ? 'Close menu' : 'Open menu', onClick: () => setMenuOpen((open) => !open), children: menuOpen ? _jsx(CloseIcon, {}) : _jsx(MenuIcon, {}) }), _jsx("div", { id: menuId, hidden: !menuOpen, inert: !menuOpen ? true : undefined, className: cn('absolute top-[calc(100%+0.5rem)] left-1/2 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl p-2 min-[960px]:hidden', onDark ? darkPill : glassPill), children: _jsx("ul", { className: "flex flex-col", children: primaryNavigation.map((item) => (_jsx("li", { children: _jsx(NavLink, { to: item.to, end: true, onClick: closeMenu, className: ({ isActive }) => linkClass('flex min-h-12 w-full rounded-lg px-3 text-[1.0625rem] tracking-[-0.02em]', isActive, onDark), children: ({ isActive }) => (_jsxs(_Fragment, { children: [_jsx("span", { "aria-hidden": "true", className: cn('mr-3 h-5 w-px origin-center bg-brand motion-safe:transition-transform motion-safe:duration-(--duration-slow) motion-safe:ease-standard', isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100') }), item.label] })) }) }, item.to))) }) })] })] }));
}
