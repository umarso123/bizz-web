import { Link } from 'react-router'
import { bookCall } from '@/app/navigation.ts'
import { Container } from '@/components/layout/Container.tsx'
import { studioAddress, studioEmail, studioPhone, studioSocial } from '@/content/contact.ts'

const explore = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/#services' },
  { label: 'Work', to: '/work' },
  { label: 'Approach', to: '/#how-we-work' },
] as const

const company = [
  { label: 'Digital Health', to: '/#digital-health' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
] as const

const linkClass =
  'text-body-small text-text no-underline transition-colors duration-200 hover:text-brand'

function TalkArrow() {
  return (
    <span className="inline-flex size-[0.68em] shrink-0 items-center justify-center rounded-full bg-current">
      <svg viewBox="0 0 24 24" className="size-[0.4em] text-text-inverse" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3.8 10.85h9.15l-3.2-3.2 1.9-1.9L18.2 12l-6.55 6.25-1.9-1.9 3.2-3.2H3.8v-2.3Z"
        />
      </svg>
    </span>
  )
}

function TalkUnit({ clone = false }: { clone?: boolean }) {
  return (
    <div
      className="footer-talk-unit flex min-w-screen shrink-0 items-center justify-center"
      data-clone={clone ? '' : undefined}
      aria-hidden="true"
    >
      <span className="inline-flex items-center gap-[0.32em] text-[clamp(2.15rem,5.5vw,4.75rem)] leading-none font-semibold tracking-[-0.045em] whitespace-nowrap">
        <TalkArrow />
        Let’s Talk
        <TalkArrow />
      </span>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-page-white text-text">
      <Container variant="page" className="relative pt-16 pb-8 md:pt-24 md:pb-12">
        <nav aria-label="Footer" className="flex flex-wrap items-start justify-between gap-x-10 gap-y-10">
          <div className="flex flex-wrap gap-x-16 gap-y-10 sm:gap-x-28">
            <ul className="grid gap-3">
              {explore.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="grid gap-3">
              {company.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid gap-3">
            <li className="text-body-small text-text">{studioAddress}</li>
            <li>
              <a href={`mailto:${studioEmail}`} className={linkClass}>
                {studioEmail}
              </a>
            </li>
            <li>
              <a href={studioPhone.href} className={linkClass}>
                {studioPhone.label}
              </a>
            </li>
            {studioSocial.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={linkClass}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Link
        to={bookCall.to}
        aria-label="Let’s Talk"
        className="footer-talk group relative block cursor-pointer overflow-hidden py-6 text-brand no-underline transition-colors duration-300 hover:text-brand-hover focus-visible:text-brand-hover md:py-8"
      >
        <div className="footer-talk-track">
          <TalkUnit />
          <TalkUnit clone />
        </div>
      </Link>

      <Container variant="page" className="relative pt-6 pb-8 md:pt-8 md:pb-10">
        <div className="flex flex-col gap-3 text-caption text-text sm:flex-row sm:items-center sm:justify-between">
          <p>All Rights Reserved</p>
          <p>Bizaffix LLC © 2023</p>
          <p>From idea to reality</p>
        </div>
      </Container>
    </footer>
  )
}
