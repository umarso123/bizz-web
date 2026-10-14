import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import {
  buildOptions,
  composeNote,
  contactIntents,
  defaultFormTitle,
  defaultSubmit,
  intentCopy,
  mailHref,
  studioEmail,
  timingOptions,
  type BuildId,
  type ContactIntent,
  type TimingId,
} from '@/content/contact.ts'
import { contactFrame } from '@/sections/contact/contactLayout.ts'
import { useContactScroll } from '@/sections/contact/useContactScroll.ts'
import { useMagnetic } from '@/sections/contact/useMagnetic.ts'
import { cn } from '@/lib/cn.ts'

type Errors = Partial<Record<'name' | 'email' | 'build' | 'message', string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: { name: string; email: string; build: BuildId | null; message: string }): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Enter your name.'
  if (!emailPattern.test(values.email.trim())) errors.email = 'Enter a valid email.'
  if (!values.build) errors.build = 'Choose what you want to build.'
  if (values.message.trim().length < 12) errors.message = 'Tell us a little about the project.'
  return errors
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="ms-2 size-3.5 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Choices<T extends string>({
  label,
  value,
  options,
  onChange,
  describedBy,
  invalid,
}: {
  label: string
  value: T | null
  options: readonly { id: T; label: string }[]
  onChange: (id: T) => void
  describedBy?: string
  invalid?: boolean
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextKey = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    const prevKey = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
    if (!nextKey && !prevKey) return
    event.preventDefault()
    const delta = nextKey ? 1 : -1
    const next = (index + delta + options.length) % options.length
    onChange(options[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div role="radiogroup" aria-label={label} aria-invalid={invalid || undefined} aria-describedby={describedBy}>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const selected = value === option.id
          const tab = selected || (value === null && index === 0) ? 0 : -1
          return (
            <button
              key={option.id}
              ref={(node) => {
                refs.current[index] = node
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={tab}
              className={cn(
                'min-h-11 cursor-pointer rounded-full border px-4 text-left text-sm font-medium transition-colors',
                selected
                  ? 'border-text bg-text text-text-inverse'
                  : 'border-border bg-surface text-text-secondary hover:border-border-strong hover:text-text',
              )}
              onClick={() => onChange(option.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ContactForm({
  intent,
  onIntent,
}: {
  intent: ContactIntent | null
  onIntent: (intent: ContactIntent) => void
}) {
  const scroll = useContactScroll()
  const scrollToNote = useRef(scroll)
  const magnetic = useMagnetic<HTMLButtonElement>()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [build, setBuild] = useState<BuildId | null>(null)
  const [message, setMessage] = useState('')
  const [timing, setTiming] = useState<TimingId | null>(null)
  const [when, setWhen] = useState('')
  const [active, setActive] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const errorTitleId = useId()

  const errors = attempted ? validate({ name, email, build, message }) : {}
  const intentMeta = intentCopy(intent)
  const note = composeNote({ intent, name, email, organization, build, message, timing, when })

  useEffect(() => {
    scrollToNote.current = scroll
  }, [scroll])

  useEffect(() => {
    if (!ready) return
    const timer = window.setTimeout(() => {
      document.getElementById('contact-note-ready')?.focus({ preventScroll: true })
      scrollToNote.current('contact-note-ready', -168, true)
    }, 40)
    return () => window.clearTimeout(timer)
  }, [ready])

  function focusField(id: string) {
    setActive(id)
  }

  function blurField(id: string) {
    setActive((current) => (current === id ? null : current))
  }

  function growMessage(node: HTMLTextAreaElement) {
    node.style.height = 'auto'
    node.style.height = `${Math.min(node.scrollHeight, 320)}px`
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate({ name, email, build, message })
    setAttempted(true)
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name) document.getElementById('contact-name')?.focus()
      else if (nextErrors.email) document.getElementById('contact-email')?.focus()
      else if (nextErrors.build) document.querySelector<HTMLButtonElement>('#contact-build-choices button')?.focus()
      else document.getElementById('contact-message')?.focus()
      return
    }
    setReady(true)
    setCopied(false)
    setCopyFailed(false)
  }

  async function copyNote() {
    try {
      await navigator.clipboard.writeText(note)
      setCopied(true)
      setCopyFailed(false)
    } catch {
      setCopied(false)
      setCopyFailed(true)
    }
  }

  function writeAnother() {
    setReady(false)
    window.setTimeout(() => {
      document.getElementById('contact-name')?.focus()
    }, 40)
  }

  return (
    <section data-scene="form" className="bg-page-brand pb-[clamp(4rem,10vh,7rem)]">
      <div className={contactFrame}>
        <div id="project-note" className="scroll-mt-28 max-w-[52rem] rounded-[1.75rem] bg-surface px-6 py-8 shadow-card sm:px-10 sm:py-12">
          {ready ? (
            <div>
              <h2 id="contact-note-ready" tabIndex={-1} className="text-3xl font-medium sm:text-4xl text-text outline-none">
                Your note is ready.
              </h2>
              <p className="mt-5 max-w-[36rem] text-body-large text-text-secondary">
                {studioEmail
                  ? 'Open it in your mail app, or copy it.'
                  : 'This site does not list a public studio address. Copy the note and send it to the address you already have.'}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                {studioEmail ? (
                  <a
                    href={mailHref(studioEmail, note)}
                    className="inline-flex min-h-(--button-height-desktop) items-center rounded-full bg-text px-7 text-body-small font-semibold text-text-inverse no-underline hover:bg-button-primary-hover"
                  >
                    Open in your mail
                  </a>
                ) : null}
                <button
                  type="button"
                  className="inline-flex min-h-(--button-height-desktop) cursor-pointer items-center rounded-full bg-text px-7 text-body-small font-semibold text-text-inverse hover:bg-button-primary-hover"
                  onClick={() => void copyNote()}
                >
                  {copied ? 'Copied' : 'Copy the note'}
                </button>
                <button type="button" className="cursor-pointer bg-transparent text-body text-text-secondary underline decoration-border underline-offset-4 hover:text-text" onClick={writeAnother}>
                  Write another note
                </button>
              </div>
              {copyFailed ? (
                <textarea readOnly value={note} className="mt-8 w-full resize-none rounded-2xl border border-border bg-bg p-4 text-body-small text-text" rows={8} aria-label="Your note" />
              ) : null}
            </div>
          ) : (
            <form noValidate aria-labelledby="project-note-title" onSubmit={onSubmit}>
              <h2 id="project-note-title" className="text-3xl font-medium sm:text-4xl text-text">
                {intentMeta?.formTitle ?? defaultFormTitle}
              </h2>
              <p className="mt-4 max-w-[34rem] text-body text-text-secondary">
                Name, email, the kind of work, and a short description are required.
              </p>

              <div className="mt-10">
                <p id={errorTitleId} className="text-body-small text-text-secondary">
                  This note is about
                </p>
                <div className="mt-3">
                  <Choices
                    label="This note is about"
                    value={intent}
                    options={contactIntents}
                    onChange={onIntent}
                  />
                </div>
              </div>

              <div className="mt-12 grid gap-10">
                <Field
                  index="01"
                  id="contact-name"
                  label="Your name"
                  autoComplete="name"
                  value={name}
                  active={active === 'name'}
                  error={errors.name}
                  onFocus={() => focusField('name')}
                  onBlur={() => blurField('name')}
                  onChange={setName}
                />
                <Field
                  index="02"
                  id="contact-email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  active={active === 'email'}
                  error={errors.email}
                  onFocus={() => focusField('email')}
                  onBlur={() => blurField('email')}
                  onChange={setEmail}
                />
                <Field
                  index="03"
                  id="contact-organization"
                  label="Organization"
                  hint="Optional"
                  autoComplete="organization"
                  value={organization}
                  active={active === 'organization'}
                  onFocus={() => focusField('organization')}
                  onBlur={() => blurField('organization')}
                  onChange={setOrganization}
                />

                <div
                  className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3"
                  onFocus={() => focusField('build')}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) blurField('build')
                  }}
                >
                  <span className={cn('pt-1 text-body-small tabular-nums', active === 'build' ? 'text-brand' : 'text-text-muted')} aria-hidden="true">
                    04
                  </span>
                  <div>
                    <p id="contact-build" className={cn('text-body', active === 'build' ? 'text-text' : 'text-text-secondary')}>
                      What are you looking to build?
                    </p>
                    <div id="contact-build-choices" className="mt-4">
                      <Choices
                        label="What are you looking to build?"
                        value={build}
                        options={buildOptions}
                        onChange={setBuild}
                        invalid={Boolean(errors.build)}
                        describedBy={errors.build ? 'contact-build-error' : undefined}
                      />
                    </div>
                    {errors.build ? (
                      <p id="contact-build-error" className="mt-2 text-body-small text-error">
                        {errors.build}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3">
                  <span className={cn('pt-1 text-body-small tabular-nums', active === 'message' ? 'text-brand' : 'text-text-muted')} aria-hidden="true">
                    05
                  </span>
                  <div>
                    <label htmlFor="contact-message" className={cn('block text-body', active === 'message' ? 'text-text' : 'text-text-secondary')}>
                      Tell us about the project
                    </label>
                    <textarea
                      ref={messageRef}
                      id="contact-message"
                      rows={4}
                      value={message}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      className={cn(
                        'mt-4 min-h-36 w-full resize-none overflow-hidden rounded-2xl border bg-bg px-4 py-3 text-base text-text caret-brand outline-none',
                        errors.message ? 'border-error' : 'border-border focus-visible:border-brand',
                      )}
                      onFocus={() => focusField('message')}
                      onBlur={() => blurField('message')}
                      onChange={(event) => {
                        setMessage(event.target.value)
                        growMessage(event.target)
                      }}
                    />
                    {errors.message ? (
                      <p id="contact-message-error" className="mt-2 text-body-small text-error">
                        {errors.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div
                  className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3"
                  onFocus={() => focusField('timing')}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) blurField('timing')
                  }}
                >
                  <span className={cn('pt-1 text-body-small tabular-nums', active === 'timing' ? 'text-brand' : 'text-text-muted')} aria-hidden="true">
                    06
                  </span>
                  <div>
                    <p className={cn('text-body', active === 'timing' ? 'text-text' : 'text-text-secondary')}>
                      When should it begin? <span className="text-text-muted">Optional</span>
                    </p>
                    <div className="mt-4">
                      <Choices
                        label="When should it begin?"
                        value={timing}
                        options={timingOptions}
                        onChange={setTiming}
                      />
                    </div>
                    <div className={cn('grid transition-[grid-template-rows] duration-300', timing === 'dated' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                      <div className="overflow-hidden" inert={timing === 'dated' ? undefined : true}>
                        <div className="relative pt-4">
                          <label htmlFor="contact-when" className="sr-only">
                            Roughly when
                          </label>
                          <input
                            id="contact-when"
                            value={when}
                            autoComplete="off"
                            placeholder="Roughly when"
                            className="w-full bg-transparent py-3 text-base text-text caret-brand outline-none placeholder:text-text-muted"
                            onFocus={() => focusField('timing')}
                            onChange={(event) => setWhen(event.target.value)}
                          />
                          <Line active={active === 'timing' && timing === 'dated'} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <button
                  ref={magnetic}
                  type="submit"
                  className="group inline-flex min-h-(--button-height-desktop) cursor-pointer items-center rounded-full bg-text px-7 text-body-small font-semibold text-text-inverse transition-[background-color,transform] duration-200 hover:bg-button-primary-hover"
                >
                  {intentMeta?.submit ?? defaultSubmit}
                  <Arrow />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Line({ active, invalid = false }: { active: boolean; invalid?: boolean }) {
  return (
    <>
      <span aria-hidden="true" className={cn('absolute right-0 bottom-0 left-0 h-px', invalid ? 'bg-error' : 'bg-border')} />
      <span
        aria-hidden="true"
        className={cn(
          'absolute right-0 bottom-0 left-0 h-0.5 origin-left motion-safe:transition-transform motion-safe:duration-300',
          invalid ? 'bg-error' : 'bg-brand',
          active ? 'scale-x-100' : 'scale-x-0',
        )}
      />
    </>
  )
}

function Field({
  index,
  id,
  label,
  hint,
  type = 'text',
  autoComplete,
  inputMode,
  value,
  active,
  error,
  onFocus,
  onBlur,
  onChange,
}: {
  index: string
  id: string
  label: string
  hint?: string
  type?: string
  autoComplete?: string
  inputMode?: 'email' | 'text'
  value: string
  active: boolean
  error?: string
  onFocus: () => void
  onBlur: () => void
  onChange: (value: string) => void
}) {
  const errorId = `${id}-error`
  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3">
      <span className={cn('pt-1 text-body-small tabular-nums', active ? 'text-brand' : 'text-text-muted')} aria-hidden="true">
        {index}
      </span>
      <div>
        <label htmlFor={id} className={cn('block text-body', active ? 'text-text' : 'text-text-secondary')}>
          {label}
          {hint ? <span className="ms-2 text-text-muted">{hint}</span> : null}
        </label>
        <div className="relative">
          <input
            id={id}
            type={type}
            value={value}
            autoComplete={autoComplete}
            inputMode={inputMode}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="w-full bg-transparent py-3 text-base text-text caret-brand outline-none"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(event) => onChange(event.target.value)}
          />
          <Line active={active} invalid={Boolean(error)} />
        </div>
        {error ? (
          <p id={errorId} className="mt-2 text-body-small text-error">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  )
}
