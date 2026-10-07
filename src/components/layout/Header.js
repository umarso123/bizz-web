import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { bookCall, primaryNavigation } from '@/app/navigation.ts';
import { BrandLogo } from '@/components/brand/BrandLogo.tsx';
import { cn } from '@/lib/cn.ts';
const menuId = 'site-menu';
const desktopNavQuery = '(min-width: 960px)';
const bar = 'border border-white/80 bg-white/80 shadow-[0_10px_40px_rgb(13_18_31/0.08)] backdrop-blur-xl';
function MenuIcon() {
    return (_jsx("svg", { width: "18", height: "18", viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true", children: _jsx("path", { d: "M3.5 6h13M3.5 10h13M3.5 14h13", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) }));
}
function CloseIcon() {
    return (_jsx("svg", { width: "18", height: "18", viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true", children: _jsx("path", { d: "M5 5l10 10M15 5L5 15", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) }));
}
function navClass(active, layout) {
    return cn('font-medium tracking-[-0.01em] no-underline transition-colors duration-(--duration-standard) ease-standard', 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand', active ? 'text-text' : 'text-text-secondary hover:text-text', layout);
}
export function Header() {
    const { pathname } = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPath, setMenuPath] = useState(pathname);
    const menuButtonRef = useRef(null);
    if (menuPath !== pathname) {
        setMenuPath(pathname);
        setMenuOpen(false);
    }
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
    return (_jsx("header", { className: "pointer-events-none fixed inset-x-0 top-0 z-50", children: _jsxs("div", { className: "px-3 pt-3 md:px-5 md:pt-4", children: [_jsxs("div", { className: cn('pointer-events-auto relative mx-auto flex h-14 max-w-[90rem] items-center justify-between gap-3 rounded-full ps-4 pe-2 md:h-[4.25rem] md:ps-5 md:pe-2.5', bar), children: [_jsx(BrandLogo, { imgClassName: "h-6 w-auto md:h-7" }), _jsx("nav", { "aria-label": "Primary", className: "absolute left-1/2 hidden -translate-x-1/2 min-[960px]:block", children: _jsx("ul", { className: "flex items-center", children: primaryNavigation.map((item) => (_jsx("li", { children: _jsx(NavLink, { to: item.to, end: true, className: ({ isActive }) => navClass(isActive, 'inline-flex px-3 py-2 text-[0.9375rem]'), children: item.label }) }, item.to))) }) }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Link, { to: bookCall.to, className: "inline-flex h-10 items-center rounded-full bg-button-primary px-4 text-[0.875rem] font-semibold tracking-[-0.01em] whitespace-nowrap text-text-inverse no-underline transition-colors duration-(--duration-standard) ease-standard hover:bg-button-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:h-11 md:px-5 md:text-[0.9375rem]", children: bookCall.label }), _jsx("button", { ref: menuButtonRef, type: "button", className: "inline-flex size-10 items-center justify-center rounded-full text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand min-[960px]:hidden", "aria-expanded": menuOpen, "aria-controls": menuId, "aria-label": menuOpen ? 'Close menu' : 'Open menu', onClick: () => setMenuOpen((open) => !open), children: menuOpen ? _jsx(CloseIcon, {}) : _jsx(MenuIcon, {}) })] })] }), _jsx("div", { id: menuId, hidden: !menuOpen, className: cn('pointer-events-auto mx-auto mt-2 w-full max-w-[90rem] rounded-[1.5rem] p-2 min-[960px]:hidden', bar), children: _jsx("ul", { className: "flex flex-col", children: primaryNavigation.map((item) => (_jsx("li", { children: _jsx(NavLink, { to: item.to, end: true, onClick: () => setMenuOpen(false), className: ({ isActive }) => navClass(isActive, cn('flex min-h-12 items-center rounded-2xl px-4 text-[1.0625rem]', isActive ? 'bg-brand-soft' : 'hover:bg-bg-subtle')), children: item.label }) }, item.to))) }) })] }) }));
}
