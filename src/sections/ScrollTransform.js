import { useTransform } from 'framer-motion';
export function ScrollTransform({ progress, input, output, children }) {
    const value = useTransform(progress, input, output);
    return children(value);
}
