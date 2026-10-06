import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router';
import { cn } from '@/lib/cn.ts';
import { omitKeys } from '@/lib/omit.ts';
function textLinkClassName(className) {
    return cn('inline-flex min-h-(--button-height) max-w-full items-center gap-1 text-body-small font-semibold text-brand-hover underline decoration-current underline-offset-[0.22em] transition-colors duration-(--duration-standard) ease-standard hover:text-brand-active', className);
}
const sharedKeys = ['trailingIcon', 'className', 'children'];
export function TextLink(props) {
    const { trailingIcon, className, children } = props;
    const classes = textLinkClassName(className);
    const content = (_jsxs(_Fragment, { children: [_jsx("span", { children: children }), trailingIcon ? (_jsx("span", { "aria-hidden": "true", className: "inline-flex shrink-0", children: trailingIcon })) : null] }));
    if ('to' in props && props.to) {
        const linkProps = omitKeys(props, sharedKeys);
        return (_jsx(Link, { ...linkProps, className: classes, children: content }));
    }
    const anchorProps = omitKeys(props, sharedKeys);
    const safeRel = anchorProps.target === '_blank' && !anchorProps.rel ? 'noreferrer noopener' : anchorProps.rel;
    return (_jsx("a", { ...anchorProps, rel: safeRel, className: classes, children: content }));
}
