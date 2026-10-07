import { createElement } from 'react';
import { cn } from '@/lib/cn.ts';
const backgroundClass = {
    white: 'bg-page-white',
    brand: 'bg-page-brand',
    dark: 'bg-page-dark',
};
const spacingClass = {
    default: 'section-y',
    compact: 'py-12 md:py-16 lg:py-20',
    none: '',
};
export function Section({ as = 'section', background = 'white', spacing = 'default', className, children, ...props }) {
    return createElement(as, {
        ...props,
        className: cn(backgroundClass[background], spacingClass[spacing], className),
    }, children);
}
