import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router';
import { ConnectBanner } from '@/components/layout/ConnectBanner.tsx';
import { Footer } from '@/components/layout/Footer.tsx';
import { Header } from '@/components/layout/Header.tsx';
export function SiteLayout() {
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx("div", { className: "pt-(--header-clearance)", children: _jsx(Outlet, {}) }), _jsx(ConnectBanner, {}), _jsx(Footer, {})] }));
}
