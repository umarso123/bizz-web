import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/cn.ts';
const variantClass = {
    neutral: 'border-border bg-bg-subtle text-text',
    brand: 'border-transparent bg-brand-soft text-brand-hover',
    success: 'border-transparent bg-success-soft text-success',
};
export function Badge({ variant = 'neutral', className, children, ...props }) {
    return (_jsx("span", { className: cn('inline-flex items-center rounded-pill border px-3 py-1 text-caption font-semibold', variantClass[variant], className), ...props, children: children }));
}
