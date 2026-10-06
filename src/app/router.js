import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from 'react-router';
import { SiteLayout } from '@/components/layout/SiteLayout.tsx';
import { CareersPage } from '@/pages/CareersPage.tsx';
import { FoundationPage } from '@/pages/FoundationPage.tsx';
import { HomePage } from '@/pages/HomePage.tsx';
import { JobDetailPage } from '@/pages/JobDetailPage.tsx';
import { PlaceholderPage } from '@/pages/PlaceholderPage.tsx';
import { ServicesPage } from '@/pages/ServicesPage.tsx';
/**
 * Public routes live here. The paths below are temporary central routes
 * until the URL audit. Do not invent legacy paths before that audit.
 */
export function AppRouter() {
    return (_jsx(Routes, { children: _jsxs(Route, { element: _jsx(SiteLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/services", element: _jsx(ServicesPage, {}) }), _jsx(Route, { path: "/healthcare", element: _jsx(PlaceholderPage, { title: "Digital Health" }) }), _jsx(Route, { path: "/digital-health", element: _jsx(PlaceholderPage, { title: "Digital Health" }) }), _jsx(Route, { path: "/work", element: _jsx(PlaceholderPage, { title: "Work" }) }), _jsx(Route, { path: "/insights", element: _jsx(PlaceholderPage, { title: "Insights" }) }), _jsx(Route, { path: "/about", element: _jsx(PlaceholderPage, { title: "About" }) }), _jsx(Route, { path: "/careers", element: _jsx(CareersPage, {}) }), _jsx(Route, { path: "/careers/:slug", element: _jsx(JobDetailPage, {}) }), _jsx(Route, { path: "/contact", element: _jsx(PlaceholderPage, { title: "Contact" }) }), _jsx(Route, { path: "/__design-system", element: _jsx(FoundationPage, {}) })] }) }));
}
