import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LazyMotion, domAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { Container } from '@/components/layout/Container.tsx';
import { Button } from '@/components/ui/Button.tsx';
import { getJobBySlug } from '@/content/careers.ts';
import { JobDetail } from '@/sections/careers/JobDetail.tsx';
export function JobDetailPage() {
    const { slug = '' } = useParams();
    const job = getJobBySlug(slug);
    useEffect(() => {
        const previousTitle = document.title;
        document.title = job ? `${job.title} · Careers · Bizaffix` : 'Role not found · Bizaffix';
        return () => {
            document.title = previousTitle;
        };
    }, [job]);
    if (!job) {
        return (_jsx("main", { className: "bg-page-white py-24 md:py-32", children: _jsxs(Container, { variant: "page", className: "w-full", children: [_jsx("h1", { className: "text-page-title text-text", children: "Role not found" }), _jsx("p", { className: "mt-4 max-w-[36rem] text-body-large text-text-secondary", children: "This listing is unavailable. Browse open positions on the careers page." }), _jsx("div", { className: "mt-8", children: _jsx(Button, { to: "/careers#open-positions", size: "lg", children: "View open positions" }) }), _jsx("p", { className: "mt-6", children: _jsx(Link, { to: "/careers", className: "text-body-small font-semibold text-brand-hover no-underline", children: "Back to Careers" }) })] }) }));
    }
    return (_jsx(LazyMotion, { features: domAnimation, children: _jsx(JobDetail, { job: job }) }));
}
