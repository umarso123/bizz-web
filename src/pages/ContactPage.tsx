import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { useEffect, useState, type FormEvent } from 'react'
import { Container } from '@/components/layout/Container.tsx'
import { Button } from '@/components/ui/Button.tsx'
import {
  contactIntro,
  mailHref,
  studioAddress,
  studioEmail,
  studioPhone,
  studioSocial,
} from '@/content/contact.ts'
import { cn } from '@/lib/cn.ts'

const houseSpring = { type: 'spring' as const, stiffness: 140, damping: 20, mass: 0.8 }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fieldClass =
  'mt-1 w-full border-0 border-b border-border bg-transparent py-2.5 text-body text-text outline-none transition-colors placeholder:text-text-muted focus:border-brand'

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path
        d="M6.5 4.5h2.2l1.2 3.2-1.4 1.2a12 12 0 0 0 5.6 5.6l1.2-1.4 3.2 1.2v2.2a1.8 1.8 0 0 1-1.8 1.8A14.5 14.5 0 0 1 4.7 6.3a1.8 1.8 0 0 1 1.8-1.8Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" strokeLinejoin="round" />
    </svg>
  )
}

function SocialMark({ label }: { label: string }) {
  if (label === 'Facebook') {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        <path d="M14 9h2.5V6.2C16 6.1 15 6 13.8 6A3.6 3.6 0 0 0 10 9.7V12H7.5v3H10v7h3.5v-7H16l.5-3H13.5V9.8c0-.5.2-.8.5-.8Z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M6.4 9.2v9.3H3.5V9.2h2.9ZM5 4.5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4ZM20.5 18.5h-2.9v-4.5c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.6H11.4V9.2h2.8v1.3c.4-.7 1.4-1.5 2.8-1.5 3 0 3.5 2 3.5 4.5v5Z" />
    </svg>
  )
}

export function ContactPage() {
  const reduced = useReducedMotion() === true
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Contact · Bizaffix'
    return () => {
      document.title = previousTitle
    }
  }, [])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = `${firstName.trim()} ${lastName.trim()}`.trim()
    if (name.length < 2) {
      setError('Enter your name.')
      return
    }
    if (!emailPattern.test(email.trim())) {
      setError('Enter a valid email.')
      return
    }
    if (message.trim().length < 12) {
      setError('Tell us a little about what you need.')
      return
    }
    setError(null)
    const note = [
      `Name: ${name}`,
      `Email: ${email.trim()}`,
      phone.trim() ? `Phone: ${phone.trim()}` : null,
      '',
      message.trim(),
    ]
      .filter((line) => line !== null)
      .join('\n')
    window.location.href = mailHref(studioEmail, note)
  }

  return (
    <LazyMotion features={domAnimation}>
      <main id="contact" className="studio-page relative overflow-x-clip bg-page-white">
        <section
          className="relative -mt-(--header-clearance) min-h-[calc(100svh-var(--header-clearance))] overflow-hidden pt-(--header-clearance)"
          aria-labelledby="contact-title"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 70% 60% at 12% 20%, rgb(47 91 234 / 0.12), transparent 55%),
                radial-gradient(ellipse 55% 50% at 92% 78%, rgb(201 215 248 / 0.7), transparent 58%),
                radial-gradient(ellipse 40% 36% at 70% 18%, rgb(245 200 76 / 0.14), transparent 50%),
                var(--color-page-white)
              `,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 right-[8%] size-40 rounded-full bg-brand/10 blur-2xl md:size-56"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[12%] left-[6%] size-28 rounded-full bg-mist/80 blur-xl md:size-36"
          />

          <Container variant="page" className="relative w-full py-14 md:py-20 lg:py-24">
            <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 xl:gap-20">
              <m.div
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={houseSpring}
              >
                <h1 id="contact-title" className="text-4xl font-medium text-text sm:text-5xl lg:text-6xl">
                  Contact
                </h1>
                <p className="mt-4 max-w-[30rem] text-body-large text-text-secondary">{contactIntro.dek}</p>

                <form onSubmit={onSubmit} className="mt-10 max-w-xl" noValidate>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-body-small text-text-secondary">First name</span>
                      <input
                        name="firstName"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="Your first name"
                        className={fieldClass}
                      />
                    </label>
                    <label className="block">
                      <span className="text-body-small text-text-secondary">Last name</span>
                      <input
                        name="lastName"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder="Your last name"
                        className={fieldClass}
                      />
                    </label>
                  </div>

                  <label className="mt-6 block">
                    <span className="text-body-small text-text-secondary">Email address</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@company.com"
                      className={fieldClass}
                    />
                  </label>

                  <label className="mt-6 block">
                    <span className="text-body-small text-text-secondary">Phone number</span>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder={studioPhone.label}
                      className={fieldClass}
                    />
                  </label>

                  <label className="mt-6 block">
                    <span className="text-body-small text-text-secondary">Comment or message</span>
                    <textarea
                      name="message"
                      rows={3}
                      required
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Tell us about the work"
                      className={cn(fieldClass, 'resize-y')}
                    />
                  </label>

                  {error ? (
                    <p className="mt-4 text-body-small text-error" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <div className="mt-8">
                    <Button type="submit" size="lg" variant="brand">
                      Send
                    </Button>
                  </div>
                </form>
              </m.div>

              <m.aside
                className="relative mx-auto w-full max-w-md lg:max-w-none"
                initial={reduced ? false : { opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...houseSpring, delay: reduced ? 0 : 0.08 }}
                aria-label="Studio details"
              >
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-[3rem] bg-page-brand md:-inset-6 md:rounded-[3.5rem]"
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-6 -bottom-8 size-36 rounded-full bg-brand/20 blur-2xl md:size-48"
                />
                <div
                  aria-hidden="true"
                  className="absolute -top-8 -left-4 size-24 rounded-full bg-accent/25 blur-xl"
                />
                <div className="relative overflow-hidden rounded-[2.25rem] bg-surface/95 px-8 py-10 shadow-[0_28px_70px_rgb(47_91_234/0.14)] ring-1 ring-brand/10 backdrop-blur-sm md:rounded-[2.75rem] md:px-10 md:py-12">
                  <div className="mx-auto max-w-xs">
                    <span className="mb-5 block h-1.5 w-12 rounded-full bg-brand" aria-hidden="true" />
                    <p className="text-3xl font-medium tracking-[-0.03em] text-text md:text-4xl">Bizaffix</p>
                    <p className="mt-3 text-body text-text-secondary">From idea to reality.</p>

                    <ul className="mt-10 space-y-6">
                      <li className="flex items-start gap-3 text-body text-text">
                        <span className="mt-0.5 text-brand">
                          <MapPinIcon />
                        </span>
                        <span>{studioAddress}</span>
                      </li>
                      <li>
                        <a
                          href={studioPhone.href}
                          className="flex items-start gap-3 text-body text-text no-underline transition-colors hover:text-brand"
                        >
                          <span className="mt-0.5 text-brand">
                            <PhoneIcon />
                          </span>
                          <span>{studioPhone.label}</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href={`mailto:${studioEmail}`}
                          className="flex items-start gap-3 text-body text-text no-underline transition-colors hover:text-brand"
                        >
                          <span className="mt-0.5 text-brand">
                            <MailIcon />
                          </span>
                          <span>{studioEmail}</span>
                        </a>
                      </li>
                    </ul>

                    <div className="mt-10 flex flex-wrap gap-3">
                      {studioSocial.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={item.label}
                          className="inline-flex size-11 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                        >
                          <SocialMark label={item.label} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </m.aside>
            </div>
          </Container>
        </section>
      </main>
    </LazyMotion>
  )
}
