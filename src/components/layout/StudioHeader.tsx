import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router'
import { bookCall, primaryNavigation } from '@/app/navigation.ts'
import { BrandLogo } from '@/components/brand/BrandLogo.tsx'
import { cn } from '@/lib/cn.ts'
import { PillButton } from '@/sections/studio/kit.tsx'

const menuId = 'studio-menu'

/**
 * The homepage header: three floating pieces, no bar. The logo on a white pill,
 * the nav in one white pill with a highlight that slides to the hovered link,
 * and the navy Book a call pill. It tucks away while reading down and comes
 * back on any scroll up. Under 960px the nav becomes a full-screen blue menu.
 */
export function StudioHeader() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [tucked, setTucked] = useState(false)
  const [hover, setHover] = useState<{ left: number; width: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [menuPath, setMenuPath] = useState(pathname)

  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        if (y < 140) setTucked(false)
        else if (y > last + 6) setTucked(true)
        else if (y < last - 6) setTucked(false)
        last = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const pill = 'pointer-events-auto rounded-full bg-white shadow-[0_1px_2px_rgb(10_26_58/0.08),0_10px_30px_-14px_rgb(10_26_58/0.35)]'

  return (
    <header
      className={cn(
        'sh pointer-events-none fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
        tucked && !open && '-translate-y-[140%]',
      )}
      onFocus={() => setTucked(false)}
    >
      <div className="flex items-center justify-between gap-3 px-3 pt-3 sm:px-5 sm:pt-4">
        <div className={cn(pill, 'flex h-12 items-center px-5 md:h-[3.25rem]')}>
          <BrandLogo imgClassName="h-6 w-auto md:h-7" />
        </div>

        <nav aria-label="Primary" className="hidden min-[960px]:block">
          <ul className={cn(pill, 'relative flex h-[3.25rem] items-center p-1.5')} onMouseLeave={() => setHover(null)}>
            <span
              aria-hidden="true"
              className="absolute top-1.5 bottom-1.5 rounded-full bg-[var(--sh-mist)] transition-[left,width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ left: hover?.left ?? 0, width: hover?.width ?? 0, opacity: hover ? 1 : 0 } as CSSProperties}
            />
            {primaryNavigation.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onMouseEnter={(event) => setHover({ left: event.currentTarget.offsetLeft, width: event.currentTarget.offsetWidth })}
                  className="relative inline-flex h-10 items-center rounded-full px-4 text-[0.9375rem] font-medium tracking-[-0.015em] text-[var(--sh-ink)] no-underline hover:text-[var(--sh-blue)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sh-blue)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pointer-events-auto flex items-center gap-2">
          <PillButton className="max-sm:hidden">{bookCall.label}</PillButton>
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
            className={cn(pill, 'relative z-10 inline-flex h-12 items-center gap-2.5 px-5 text-[0.9375rem] font-medium min-[960px]:hidden')}
          >
            {open ? 'Close' : 'Menu'}
            <span aria-hidden="true" className="relative block h-2.5 w-4">
              <span className={cn('absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-500', open ? 'top-1 rotate-45' : 'top-0')} />
              <span className={cn('absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-500', open ? 'top-1 -rotate-45' : 'top-2')} />
            </span>
          </button>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="pointer-events-auto fixed inset-0 z-[-1] flex flex-col justify-end bg-[var(--sh-blue)] px-5 pt-24 pb-10 text-white min-[960px]:hidden"
      >
        <ul className="flex flex-col">
          {primaryNavigation.map((item, i) => (
            <li key={item.to} className="overflow-hidden">
              <Link
                to={item.to}
                onClick={() => setOpen(false)}
                className="sh-display block py-1 text-[clamp(3rem,14vw,5.5rem)] text-white no-underline [animation:sh-menu-in_0.8s_cubic-bezier(0.22,1,0.36,1)_both] hover:text-[var(--sh-yellow)]"
                style={{ animationDelay: `${80 + i * 55}ms` }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <PillButton tone="light">{bookCall.label}</PillButton>
        </div>
      </div>
    </header>
  )
}
