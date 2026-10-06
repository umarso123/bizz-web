import { createElement } from 'react';
import { cn } from '@/lib/cn.ts';
const backgroundClass = {
    default: 'bg-bg',
    subtle: 'bg-bg-subtle',
    muted: 'bg-bg-muted',
    warm: 'bg-surface-warm',
    'brand-subtle': 'bg-brand-subtle',
};
const spacingClass = {
    default: 'section-y',
    compact: 'py-12 md:py-16 lg:py-20',
    none: '',
};
export function Section({ as = 'section', background = 'default', spacing = 'default', className, children, ...props }) {
    return createElement(as, {
        ...props,
        className: cn(backgroundClass[background], spacingClass[spacing], className),
    }, children);
}
