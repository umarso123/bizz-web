import { useEffect, useId, useState, type CSSProperties } from 'react'
import { Pin } from '@/components/ui/pushpin-tear-footer.tsx'
import { cn } from '@/lib/cn.ts'
import { grainTile } from '@/lib/paper.ts'
import { paperInk } from '@/lib/paper-theme.ts'

/** The footer's grain tile as a CSS url, for --ph-grain. Empty until mounted. */
export function usePaperGrain(seed = 42) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    setUrl(grainTile(seed))
  }, [seed])
  return url ? `url(${url})` : 'none'
}

/**
 * The footer's glossy pushpin. Position it with left/top (the needle point);
 * it leans with --tilt from the nearest ancestor that sets it.
 */
export function PaperPin({
  color = paperInk.blue,
  className,
  style,
}: {
  color?: string
  className?: string
  style?: CSSProperties
}) {
  const id = `pp${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <span aria-hidden="true" className={cn('ph-pin', className)} style={style}>
      <Pin base={color} id={id} />
    </span>
  )
}

/** Four crop marks at the corners of the nearest positioned ancestor. */
export function CropMarks({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
        <span key={corner} className="ph-crop" data-corner={corner} />
      ))}
    </span>
  )
}
