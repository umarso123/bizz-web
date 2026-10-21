import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion/Reveal.tsx'
import { cn } from '@/lib/cn.ts'

export type Tint = 'lightblue' | 'cream' | 'periwinkle' | 'dark' | 'blue'

/*
 * Semi-opaque fills (85–92%) so the global background still shows faintly
 * through and the page reads as one connected surface.
 */
const tintClass: Record<Tint, string> = {
  lightblue: 'bg-[rgb(231_237_252/0.9)]', // #E7EDFC
  cream: 'bg-[rgb(255_252_240/0.9)]', // #FFFCF0
  periwinkle: 'bg-[linear-gradient(135deg,rgb(179_197_250/0.9),rgb(231_237_252/0.9))]', // #B3C5FA → #E7EDFC
  dark: 'bg-[radial-gradient(ellipse_70%_80%_at_85%_0%,rgb(35_78_209/0.55),transparent_70%),linear-gradient(rgb(20_36_95/0.92),rgb(20_36_95/0.92))] text-white', // #234ED1 glow on #14245F
  blue: 'bg-[linear-gradient(135deg,#234ED1,#14245F)] text-white',
}

type TintPanelProps = {
  tint: Tint
  className?: string
  children: ReactNode
}

/**
 * A section drawn as a large inset panel: up to 1360px wide, 32px corners
 * (24px on phones), 12–20px from the viewport edge. Settles in as it arrives.
 */
export function TintPanel({ tint, className, children }: TintPanelProps) {
  return (
    <div className="px-3 md:px-5">
      <Reveal
        variant="panel"
        className={cn('relative mx-auto w-full max-w-[1360px] overflow-hidden rounded-[24px] md:rounded-[32px]', tintClass[tint], className)}
      >
        {children}
      </Reveal>
    </div>
  )
}
