import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { cn } from '@/lib/cn.ts';
export function SectionHeader({ eyebrow, eyebrowTone = 'default', title, titleAs = 'h2', titleId, description, align = 'left', width = 'full', action, className, }) {
    const TitleTag = titleAs;
    const centered = align === 'center';
    const capped = centered || width === 'reading';
    return (_jsxs("div", { className: cn('flex flex-col gap-6', centered && 'items-center text-center', !centered && action ? 'sm:flex-row sm:items-end sm:justify-between' : undefined, className), children: [_jsxs("div", { className: cn('flex min-w-0 flex-col gap-3', capped && 'max-w-reading', centered && 'items-center'), children: [eyebrow ? (typeof eyebrow === 'string' || typeof eyebrow === 'number' ? (_jsx(Eyebrow, { tone: eyebrowTone, children: eyebrow })) : (eyebrow)) : null, _jsx(TitleTag, { id: titleId, children: title }), description ? _jsx("p", { className: "measure text-text-secondary", children: description }) : null] }), action ? _jsx("div", { className: cn('shrink-0', centered && 'flex justify-center'), children: action }) : null] }));
}
