import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/cn.ts';
const variantClass = {
    page: 'container-page',
    wide: 'container-wide',
    reading: 'container-reading',
};
export function Container({ as = 'div', variant = 'page', className, children, ...props }) {
    const Tag = as;
    return (_jsx(Tag, { className: cn(variantClass[variant], className), ...props, children: children }));
}
