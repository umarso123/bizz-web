import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/cn.ts';
const variantClass = {
    plain: 'bg-transparent',
    bordered: 'rounded-lg border border-border bg-surface',
    subtle: 'rounded-lg bg-bg-subtle',
    raised: 'rounded-lg border border-border bg-surface shadow-xs',
};
export function Surface({ as = 'div', variant = 'bordered', className, children, ...props }) {
    const Tag = as;
    return (_jsx(Tag, { className: cn(variantClass[variant], className), ...props, children: children }));
}
