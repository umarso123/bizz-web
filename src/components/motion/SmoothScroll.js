import { jsx as _jsx } from "react/jsx-runtime";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ReactLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
gsap.registerPlugin(ScrollTrigger, useGSAP);
export function SmoothScroll({ children }) {
    const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const lenisRef = useRef(null);
    const { pathname } = useLocation();
    useEffect(() => {
        if (reduced)
            return;
        const lenis = lenisRef.current?.lenis;
        if (!lenis)
            return;
        const onScroll = () => {
            ScrollTrigger.update();
        };
        lenis.on('scroll', onScroll);
        const tick = (time) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        return () => {
            lenis.off('scroll', onScroll);
            gsap.ticker.remove(tick);
        };
    }, [reduced]);
    useEffect(() => {
        if (reduced) {
            window.scrollTo(0, 0);
            return;
        }
        lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
    }, [pathname, reduced]);
    if (reduced)
        return children;
    return (_jsx(ReactLenis, { ref: lenisRef, root: true, options: {
            autoRaf: false,
            anchors: true,
            lerp: 0.075,
            smoothWheel: true,
        }, children: children }));
}
