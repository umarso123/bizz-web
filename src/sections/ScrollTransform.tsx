import type { ReactNode } from 'react'
import { useTransform, type MotionValue } from 'framer-motion'

type ScrollTransformProps = {
  progress: MotionValue<number>
  input: number[]
  output: number[]
  children: (value: MotionValue<number>) => ReactNode
}

export function ScrollTransform({ progress, input, output, children }: ScrollTransformProps) {
  const value = useTransform(progress, input, output)
  return children(value)
}
