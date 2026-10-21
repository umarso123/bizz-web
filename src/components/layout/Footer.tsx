import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { footerNavigation } from '@/app/navigation.ts'
import { BrandLogo } from '@/components/brand/BrandLogo.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { Reveal } from '@/components/motion/Reveal.tsx'
import { BookCallLink } from '@/components/ui/BookCallLink.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { studioAddress, studioEmail, studioPhone, studioSocial } from '@/content/contact.ts'
import { homeContent } from '@/content/home.ts'

const linkClass =
  'text-body-small text-white/85 no-underline decoration-accent underline-offset-[0.3em] transition-colors duration-200 hover:text-white hover:underline'

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-eyebrow text-white/45">{title}</p>
      <ul className="mt-4 grid gap-2.5">{children}</ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative mt-3 overflow-hidden bg-[#0D121F] text-white">
      <Reveal variant="fade">
      <Container variant="wide" className="relative pt-16 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <BrandLogo imgClassName="h-7 w-auto brightness-0 invert" />
            <p className="mt-6 max-w-[22rem] text-body text-white/65">{homeContent.footer.tagline}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
            <Group title="Explore">
              {footerNavigation.explore.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </Group>
            <Group title="Company">
              {footerNavigation.company.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </Group>
            <Group title="Industries">
              {homeContent.industries.map((industry) => (
                <li key={industry} className="text-body-small text-white/65">
                  {industry}
                </li>
              ))}
            </Group>
            <Group title="Contact">
              <li className="text-body-small text-white/65">{studioAddress}</li>
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
                  <a href={item.href} className={linkClass} rel="noreferrer noopener" target="_blank">
                    {item.label}
                  </a>
                </li>
              ))}
            </Group>
          </nav>
        </div>

        {/* The last sign on the route */}
        <BookCallLink
          aria-label="Let's connect: book a call"
          className="group mt-16 flex items-end justify-between gap-6 border-t border-white/10 pt-8 text-white no-underline hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:mt-24 md:pt-10"
        >
          <span className="text-[clamp(3.25rem,11vw,10.5rem)] leading-[0.86] font-semibold tracking-[-0.045em] [font-stretch:75%] transition-colors duration-300 group-hover:text-accent">
            Let’s connect
          </span>
          <span className="mb-[0.6em] hidden shrink-0 items-center gap-3 text-body-small font-semibold sm:inline-flex">
            Book a call
            <HexMark
              variant="station"
              size={22}
              className="transition-transform duration-500 ease-standard group-hover:rotate-90 [&_polygon]:transition-colors group-hover:[&_polygon]:fill-accent"
            />
          </span>
        </BookCallLink>

        <div className="flex flex-col gap-2 py-8 text-caption text-white/45 sm:flex-row sm:items-center sm:justify-between md:py-10">
          <p className="text-caption">Bizaffix LLC © {new Date().getFullYear()}. All rights reserved.</p>
          <p className="text-caption">From idea to reality</p>
        </div>
      </Container>
      </Reveal>
    </footer>
  )
}
