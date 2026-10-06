import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router';
import { cn } from '@/lib/cn.ts';
import { omitKeys } from '@/lib/omit.ts';
const variantClass = {
    primary: 'bg-button-primary text-text-inverse hover:bg-button-primary-hover active:bg-button-primary-active',
    secondary: 'border border-[#7F8D99] bg-surface text-text hover:border-text-subtle hover:bg-bg-subtle active:bg-bg-muted',
    subtle: 'bg-bg-subtle text-text hover:bg-bg-muted active:bg-bg-muted',
    ghost: 'bg-transparent text-text hover:bg-bg-subtle active:bg-bg-muted',
};
const sizeClass = {
    md: 'min-h-(--button-height) min-w-(--button-height) px-(--button-padding-inline)',
    lg: 'min-h-(--button-height-desktop) min-w-(--button-height-desktop) px-6',
};
function buttonClassName(variant, size, className) {
    return cn('inline-flex max-w-full shrink-0 items-center justify-center gap-2 rounded-button text-center text-body-small font-semibold no-underline transition-colors duration-(--duration-standard) ease-standard disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60 data-loading:opacity-70', variantClass[variant], sizeClass[size], className);
}
const sharedKeys = [
    'variant',
    'size',
    'leadingIcon',
    'trailingIcon',
    'loading',
    'disabled',
    'className',
    'children',
];
function ButtonContent({ leadingIcon, trailingIcon, children, }) {
    return (_jsxs(_Fragment, { children: [leadingIcon ? (_jsx("span", { "aria-hidden": "true", className: "inline-flex shrink-0", children: leadingIcon })) : null, _jsx("span", { children: children }), trailingIcon ? (_jsx("span", { "aria-hidden": "true", className: "inline-flex shrink-0", children: trailingIcon })) : null] }));
}
function isRouteButton(props) {
    return 'to' in props && typeof props.to === 'string';
}
function isAnchorButton(props) {
    return 'href' in props && typeof props.href === 'string';
}
export function Button(props) {
    const { variant = 'primary', size = 'md', leadingIcon, trailingIcon, loading = false, disabled = false, className, children, } = props;
    const isDisabled = disabled || loading;
    const classes = buttonClassName(variant, size, className);
    const content = (_jsx(ButtonContent, { leadingIcon: leadingIcon, trailingIcon: trailingIcon, children: children }));
    if (isRouteButton(props)) {
        const linkProps = omitKeys(props, sharedKeys);
        return (_jsx(Link, { ...linkProps, className: classes, "aria-disabled": isDisabled || undefined, "aria-busy": loading || undefined, "data-loading": loading ? '' : undefined, tabIndex: isDisabled ? -1 : linkProps.tabIndex, onClick: (event) => {
                if (isDisabled)
                    event.preventDefault();
                linkProps.onClick?.(event);
            }, children: content }));
    }
    if (isAnchorButton(props)) {
        const anchorProps = omitKeys(props, sharedKeys);
        const safeRel = anchorProps.target === '_blank' && !anchorProps.rel ? 'noreferrer noopener' : anchorProps.rel;
        return (_jsx("a", { ...anchorProps, href: isDisabled ? undefined : anchorProps.href, rel: safeRel, className: classes, "aria-disabled": isDisabled || undefined, "aria-busy": loading || undefined, "data-loading": loading ? '' : undefined, tabIndex: isDisabled ? -1 : anchorProps.tabIndex, onClick: (event) => {
                if (isDisabled)
                    event.preventDefault();
                anchorProps.onClick?.(event);
            }, children: content }));
    }
    const buttonProps = omitKeys(props, sharedKeys);
    const buttonType = buttonProps.type === 'submit' || buttonProps.type === 'reset' ? buttonProps.type : 'button';
    return (_jsx("button", { ...buttonProps, type: buttonType, className: classes, disabled: isDisabled, "aria-busy": loading || undefined, "data-loading": loading ? '' : undefined, children: content }));
}
