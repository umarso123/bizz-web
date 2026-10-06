import { jsx as _jsx } from "react/jsx-runtime";
import { Container } from '@/components/layout/Container.tsx';
export function PlaceholderPage({ title }) {
    return (_jsx("main", { className: "section-y", children: _jsx(Container, { variant: "page", children: _jsx("h1", { children: title }) }) }));
}
