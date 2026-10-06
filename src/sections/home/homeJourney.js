import { useMotionValue, useSpring } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { homeContent } from '@/content/home.ts';
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => typeof window === 'undefined' ? false : window.matchMedia(query).matches);
    useEffect(() => {
        const media = window.matchMedia(query);
        const onChange = () => setMatches(media.matches);
        onChange();
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, [query]);
    return matches;
}
export function useMagnetic(strength = 0.22, disabled = false) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.35 });
    const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.35 });
    const onPointerMove = useCallback((event) => {
        if (disabled || !ref.current)
            return;
        const rect = ref.current.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * strength);
        y.set((event.clientY - rect.top - rect.height / 2) * strength);
    }, [disabled, strength, x, y]);
    const onPointerLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);
    return { ref, x: springX, y: springY, onPointerMove, onPointerLeave };
}
export function useTilt(max = 4, disabled = false) {
    const ref = useRef(null);
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const rotateX = useSpring(rawX, { stiffness: 220, damping: 24, mass: 0.35 });
    const rotateY = useSpring(rawY, { stiffness: 220, damping: 24, mass: 0.35 });
    const onPointerMove = useCallback((event) => {
        if (disabled || !ref.current)
            return;
        const rect = ref.current.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        rawX.set(-py * max * 2);
        rawY.set(px * max * 2);
    }, [disabled, max, rawX, rawY]);
    const onPointerLeave = useCallback(() => {
        rawX.set(0);
        rawY.set(0);
    }, [rawX, rawY]);
    return { ref, rotateX, rotateY, onPointerMove, onPointerLeave };
}
/** @deprecated Prefer homeContent — kept for any residual imports during migration */
export const homeJourney = {
    ecosystem: homeContent.whatWeBuild,
    nodes: homeContent.whatWeBuild.capabilities.map((c) => ({
        id: c.id,
        label: c.title,
        short: c.short,
        detail: c.body,
    })),
    capabilities: homeContent.whatWeBuild.capabilities,
    expertise: homeContent.specialization,
    process: homeContent.process.stages,
    work: homeContent.work,
    why: {
        eyebrow: homeContent.why.eyebrow,
        words: homeContent.why.concepts.map((c) => c.word),
        lines: homeContent.why.concepts.map((c) => c.line),
    },
    insights: homeContent.insights,
    cta: homeContent.cta,
    industries: homeContent.industries,
    services: homeContent.services,
};
