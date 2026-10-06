import { jsx as _jsx } from "react/jsx-runtime";
import { AppRouter } from '@/app/router.tsx';
import { SmoothScroll } from '@/components/motion/SmoothScroll.tsx';
export function App() {
    return (_jsx(SmoothScroll, { children: _jsx(AppRouter, {}) }));
}
