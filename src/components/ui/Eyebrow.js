import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/cn.ts';
const toneClass = {
    default: 'text-text-muted',
    brand: 'text-brand-hover',
};
export function Eyebrow({ as = 'p', tone = 'default', className, children, ...props }) {
    const Tag = as;
    return (_jsx(Tag, { className: cn('text-eyebrow', toneClass[tone], className), ...props, children: children }));
}
