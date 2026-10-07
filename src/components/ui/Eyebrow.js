import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/cn.ts';
export function Eyebrow({ as = 'p', tone: _tone, inverse = false, className, children, ...props }) {
    void _tone;
    const Tag = as;
    return (_jsx(Tag, { className: cn('text-eyebrow', inverse ? 'text-white' : 'text-brand', className), ...props, children: children }));
}
