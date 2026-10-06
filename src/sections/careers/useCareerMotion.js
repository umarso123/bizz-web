import { useMotionValue, useSpring } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined')
            return false;
        return window.matchMedia(query).matches;
    });
    useEffect(() => {
        const media = window.matchMedia(query);
        const onChange = () => setMatches(media.matches);
        onChange();
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, [query]);
    return matches;
}
export function useMagnetic({ strength = 0.28, disabled = false } = {}) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
    const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });
    const onPointerMove = useCallback((event) => {
        if (disabled || !ref.current)
            return;
        const rect = ref.current.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;
        x.set(offsetX * strength);
        y.set(offsetY * strength);
    }, [disabled, strength, x, y]);
    const onPointerLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);
    return { ref, x: springX, y: springY, onPointerMove, onPointerLeave };
}
export function useTilt({ max = 4, disabled = false } = {}) {
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
export function usePointerParallax(disabled = false) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const smoothX = useSpring(x, { stiffness: 80, damping: 20, mass: 0.4 });
    const smoothY = useSpring(y, { stiffness: 80, damping: 20, mass: 0.4 });
    useEffect(() => {
        if (disabled) {
            x.set(0);
            y.set(0);
            return;
        }
        const onMove = (event) => {
            const nx = (event.clientX / window.innerWidth - 0.5) * 2;
            const ny = (event.clientY / window.innerHeight - 0.5) * 2;
            x.set(nx);
            y.set(ny);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    }, [disabled, x, y]);
    return { x: smoothX, y: smoothY };
}
