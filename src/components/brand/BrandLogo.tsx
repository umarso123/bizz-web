import { Link } from 'react-router'
import { cn } from '@/lib/cn.ts'

const LOGO_SRC = '/images/brand/bizaffix-logo.png'

type BrandLogoProps = {
  className?: string
  /** Image height class — keep aspect, don’t stretch */
  imgClassName?: string
  to?: string
}

export function BrandLogo({
  className,
  imgClassName = 'h-7 w-auto md:h-8',
  to = '/',
}: BrandLogoProps) {
  return (
    <Link to={to} className={cn('inline-flex items-center no-underline', className)}>
      <img
        src={LOGO_SRC}
        alt="Bizaffix"
        width={180}
        height={40}
        className={cn('block object-contain object-left', imgClassName)}
        decoding="async"
      />
    </Link>
  )
}
