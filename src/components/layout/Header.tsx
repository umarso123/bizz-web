import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router'
import { bookCall, primaryNavigation } from '@/app/navigation.ts'
import { BrandLogo } from '@/components/brand/BrandLogo.tsx'
import { PaperPin, usePaperGrain } from '@/components/paper/paper.tsx'
import { BookCallLink } from '@/components/ui/BookCallLink.tsx'
import { cn } from '@/lib/cn.ts'

const menuId = 'site-menu'
const desktopNavQuery = '(min-width: 960px)'

/** Frame shared by the bar and the mobile menu; the surface (fill and blur) is set per state. */
const barFrame = 'border border-white/80 shadow-[0_1px_0_rgb(255_255_255/0.9)_inset,0_12px_40px_rgb(13_18_31/0.08)] backdrop-saturate-150'
const bar = `${barFrame} bg-white/70 backdrop-blur-2xl`

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3.5 6h13M3.5 10h13M3.5 14h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function navClass(active: boolean, layout: string) {
  return cn(
    'font-medium tracking-[-0.01em] no-underline transition-colors duration-(--duration-standard) ease-standard',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    active ? 'text-text' : 'text-text-secondary hover:text-text',
    layout,
  )
}

function linkIsActive(to: string, pathname: string, hash: string) {
  const hashIndex = to.indexOf('#')
  if (hashIndex === -1) return pathname === to || pathname.startsWith(`${to}/`)
  const path = to.slice(0, hashIndex) || '/'
  return pathname === path && hash === to.slice(hashIndex)
}

export function Header() {
  const { pathname, hash } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  // The homepage wears the paper theme; every other page keeps this header as it was.
  const paper = pathname === '/'
  const grain = usePaperGrain()

  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    const media = window.matchMedia(desktopNavQuery)
    const onChange = () => {
      if (media.matches) setMenuOpen(false)
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  // Tuck the bar away while reading down; bring it back on any scroll up.
  const [tucked, setTucked] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 24)
        if (y < 120) setTucked(false)
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

  return (
    <header
      className={cn(
        'pointer-events-none fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
        tucked && !menuOpen && '-translate-y-[140%]',
        paper && 'paper-home',
      )}
      onFocus={() => setTucked(false)}
    >
      <div className="flex flex-col items-center px-3 pt-3 sm:px-4 md:px-5 md:pt-3.5">
        <div
          className={cn(
            'pointer-events-auto relative flex h-12 w-full items-center justify-between gap-2 ps-3 pe-1.5 transition-[height,background-color,box-shadow,max-width,border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-3 sm:ps-4 sm:pe-2 md:ps-5 md:pe-2',
            paper
              ? // Homepage: a white paper strip pinned at the top; a frosted pill once scrolled
                scrolled
                ? // From 960px the button is the last thing in the pill: an even 2px inset all round so its rounded end runs parallel to the pill's
                  'max-w-[60rem] rounded-full bg-white/80 min-[960px]:pe-0.5! shadow-[0_2px_4px_rgb(10_26_58/0.12),0_14px_32px_-12px_rgb(10_26_58/0.3)] backdrop-blur-xl md:h-12'
                : 'ph-grain max-w-[72rem] rounded-[3px] bg-white shadow-[0_2px_3px_rgb(10_26_58/0.2),0_18px_32px_-16px_rgb(10_26_58/0.4)] md:h-14 md:ps-16'
              : cn(
                  'rounded-full',
                  barFrame,
                  // Shrinks a little and frosts more once the page has scrolled
                  scrolled ? 'max-w-[64rem] bg-white/85 backdrop-blur-3xl md:h-12' : 'max-w-[72rem] bg-white/70 backdrop-blur-2xl md:h-14',
                ),
          )}
          style={paper ? ({ '--ph-grain': grain } as CSSProperties) : undefined}
        >
          {paper && !scrolled ? <PaperPin className="top-[34px] left-[24px] hidden h-9 w-[18px] md:block" /> : null}
          <BrandLogo imgClassName="h-5 w-auto max-w-[6.5rem] sm:h-6 sm:max-w-none md:h-7" />

          <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 min-[960px]:block">
            <ul className="flex items-center">
              {primaryNavigation.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={linkIsActive(item.to, pathname, hash) ? 'page' : undefined}
                    className={navClass(
                      linkIsActive(item.to, pathname, hash),
                      paper ? 'ph-label relative inline-flex px-3 py-2' : 'relative inline-flex px-3 py-2 text-[0.9375rem]',
                    )}
                  >
                    {item.label}
                    {/* You are here: the gold station under the current zone */}
                    {linkIsActive(item.to, pathname, hash) ? (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 rotate-45 rounded-[1px] bg-accent"
                      />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            {paper ? (
              // A blue sheet with a torn left edge; in the pill its right end rounds to follow the pill's curve
              <BookCallLink
                className={cn(
                  'ph-torn-btn inline-flex h-9 items-center bg-[#234ED1] pe-4 [--ph-torn-pad:1rem] md:[--ph-torn-pad:1.25rem] text-[0.875rem] font-medium tracking-[-0.01em] whitespace-nowrap text-white no-underline shadow-[0_2px_3px_rgb(10_26_58/0.25)] transition-[background-color,transform,border-radius] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:bg-[#1c41b5] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#234ED1] sm:h-10 md:h-11 md:ps-6 md:pe-5 md:text-[0.9375rem]',
                  scrolled && 'min-[960px]:rounded-r-full!',
                )}
              >
                {bookCall.label}
              </BookCallLink>
            ) : (
              <BookCallLink className="inline-flex h-9 items-center rounded-full bg-button-brand px-3 text-[0.8125rem] font-semibold tracking-[-0.01em] whitespace-nowrap text-text-inverse no-underline transition-colors duration-(--duration-standard) ease-standard hover:bg-button-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:h-10 sm:px-4 sm:text-[0.875rem] md:h-11 md:px-5 md:text-[0.9375rem]">
                {bookCall.label}
              </BookCallLink>
            )}
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand min-[960px]:hidden"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        <div
          id={menuId}
          hidden={!menuOpen}
          className={cn(
            'pointer-events-auto mx-auto mt-2 w-full max-w-[72rem] p-2 min-[960px]:hidden',
            paper
              ? 'rounded-[3px] bg-white shadow-[0_2px_3px_rgb(10_26_58/0.2),0_18px_32px_-16px_rgb(10_26_58/0.4)]'
              : cn('rounded-[1.5rem]', bar),
          )}
        >
          <ul className="flex flex-col">
            {primaryNavigation.map((item) => {
              const active = linkIsActive(item.to, pathname, hash)
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={navClass(
                      active,
                      cn(
                        'flex min-h-12 items-center rounded-2xl px-4 text-[1.0625rem]',
                        active ? 'bg-brand-soft' : 'hover:bg-bg-subtle',
                      ),
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </header>
  )
}
