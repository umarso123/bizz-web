import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { bookCall, primaryNavigation } from '@/app/navigation.ts'
import { BrandLogo } from '@/components/brand/BrandLogo.tsx'
import { cn } from '@/lib/cn.ts'

const menuId = 'site-menu'
const desktopNavQuery = '(min-width: 960px)'

const bar =
  'border border-white/80 bg-white/80 shadow-[0_10px_40px_rgb(13_18_31/0.08)] backdrop-blur-xl'

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
  if (hashIndex === -1) return pathname === to
  const path = to.slice(0, hashIndex) || '/'
  return pathname === path && hash === to.slice(hashIndex)
}

export function Header() {
  const { pathname, hash } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

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

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="px-2.5 pt-3 sm:px-3 md:px-5 md:pt-4">
        <div
          className={cn(
            'pointer-events-auto relative mx-auto flex h-14 max-w-[90rem] items-center justify-between gap-2 rounded-full ps-3 pe-1.5 sm:gap-3 sm:ps-4 sm:pe-2 md:h-[4.25rem] md:ps-5 md:pe-2.5',
            bar,
          )}
        >
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
                      'inline-flex px-3 py-2 text-[0.9375rem]',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <Link
              to={bookCall.to}
              className="inline-flex h-9 items-center rounded-full bg-button-primary px-3 text-[0.8125rem] font-semibold tracking-[-0.01em] whitespace-nowrap text-text-inverse no-underline transition-colors duration-(--duration-standard) ease-standard hover:bg-button-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:h-10 sm:px-4 sm:text-[0.875rem] md:h-11 md:px-5 md:text-[0.9375rem]"
            >
              {bookCall.label}
            </Link>
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
            'pointer-events-auto mx-auto mt-2 w-full max-w-[90rem] rounded-[1.5rem] p-2 min-[960px]:hidden',
            bar,
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
