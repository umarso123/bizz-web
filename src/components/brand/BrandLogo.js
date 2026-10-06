import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from 'react-router';
import { cn } from '@/lib/cn.ts';
const LOGO_SRC = '/images/brand/bizaffix-logo.png';
export function BrandLogo({ className, imgClassName = 'h-7 w-auto md:h-8', to = '/', }) {
    return (_jsx(Link, { to: to, className: cn('inline-flex items-center no-underline', className), children: _jsx("img", { src: LOGO_SRC, alt: "Bizaffix", width: 180, height: 40, className: cn('block object-contain object-left', imgClassName), decoding: "async" }) }));
}
