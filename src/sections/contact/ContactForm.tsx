import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { getBookCallTarget } from '@/app/navigation.ts'
import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import {
  buildOptions,
  composeNote,
  contactForm,
  contactIntents,
  intentCopy,
  mailHref,
  noteSubject,
  studioEmail,
  timingOptions,
  type BuildId,
  type ContactIntent,
  type TimingId,
} from '@/content/contact.ts'
import { useContactScroll } from '@/sections/contact/useContactScroll.ts'
import { cn } from '@/lib/cn.ts'

type Errors = Partial<Record<'name' | 'email' | 'build' | 'message', string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: { name: string; email: string; build: BuildId | null; message: string }): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Enter your name.'
  if (!emailPattern.test(values.email.trim())) errors.email = 'Enter a valid email, like name@company.com.'
  if (!values.build) errors.build = 'Choose what you want to build.'
  if (values.message.trim().length < 12) errors.message = 'Tell us a little about the project, in a sentence or two.'
  return errors
}

const inputBase =
  'mt-2 block w-full rounded-lg border bg-surface px-4 py-3 text-body text-text caret-brand transition-colors duration-(--duration-standard) ease-standard placeholder:text-text-muted focus:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

function inputClass(invalid: boolean) {
  return cn(inputBase, invalid ? 'border-error' : 'border-border hover:border-border-strong')
}

/** "Required" is spelled out on screen; assistive tech hears it from aria-required. */
function Need({ required }: { required: boolean }) {
  return (
    <span className="shrink-0 text-caption font-normal text-text-muted" aria-hidden={required || undefined}>
      {required ? 'Required' : 'Optional'}
    </span>
  )
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 text-body-small text-error">
      {children}
    </p>
  )
}

function Field({
  id,
  label,
  required = false,
  type = 'text',
  autoComplete,
  inputMode,
  value,
  error,
  onChange,
}: {
  id: string
  label: string
  required?: boolean
  type?: string
  autoComplete?: string
  inputMode?: 'email' | 'text' | 'tel'
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-body-small font-medium text-text">
        {label}
        <Need required={required} />
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={inputClass(Boolean(error))}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </div>
  )
}

/** A labelled group of pill radio chips. Arrow keys move the choice, as with native radios. */
function Choices<T extends string>({
  id,
  label,
  required = false,
  value,
  options,
  onChange,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  value: T | null
  options: readonly { id: T; label: string }[]
  onChange: (id: T) => void
  error?: string
  children?: ReactNode
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const labelId = `${id}-label`
  const errorId = `${id}-error`

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextKey = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    const prevKey = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
    if (!nextKey && !prevKey) return
    event.preventDefault()
    const next = (index + (nextKey ? 1 : -1) + options.length) % options.length
    const option = options[next]
    if (!option) return
    onChange(option.id)
    refs.current[next]?.focus()
  }

  return (
    <div>
      <p id={labelId} className="flex items-baseline justify-between gap-3 text-body-small font-medium text-text">
        {label}
        <Need required={required} />
      </p>
      <div
        id={id}
        role="radiogroup"
        aria-labelledby={labelId}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-3 flex flex-wrap gap-2"
      >
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
                'inline-flex min-h-11 cursor-pointer items-center rounded-pill border px-4 text-body-small font-medium transition-colors duration-(--duration-standard) ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                selected
                  ? 'border-text bg-text text-text-inverse'
                  : cn(
                      'bg-surface text-text hover:border-border-strong hover:bg-bg-subtle',
                      error ? 'border-error' : 'border-border',
                    ),
              )}
              onClick={() => onChange(option.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
      {children}
    </div>
  )
}

type PreviewRow = { label: string; value: string; placeholder?: string }

/**
 * The note exactly as the studio will receive it, built from the same fields
 * composeNote uses. Required lines show what is still missing.
 */
function NoteSheet({ rows, message, ready }: { rows: PreviewRow[]; message: string; ready: boolean }) {
  const shown = rows.filter((row) => row.value || row.placeholder)
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-5 py-4 sm:px-6">
        <p className="text-body-small font-semibold text-text">{contactForm.previewTitle}</p>
        <p className="inline-flex items-center gap-2 text-caption text-text-secondary">
          <HexMark variant={ready ? 'active' : 'station'} size={12} />
          {ready ? contactForm.previewReady : contactForm.previewDraft}
        </p>
      </div>
      <dl className="grid gap-1.5 border-b border-border-subtle px-5 py-4 text-body-small sm:px-6">
        <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
          <dt className="text-text-muted">To</dt>
          <dd className="break-words text-text">{studioEmail}</dd>
        </div>
        <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
          <dt className="text-text-muted">Subject</dt>
          <dd className="text-text">{noteSubject}</dd>
        </div>
      </dl>
      <div className="px-5 py-5 sm:px-6">
        <dl className="grid gap-1.5 text-body-small">
          {shown.map((row) => (
            <div key={row.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
              <dt className="text-text-muted">{row.label}</dt>
              <dd className={cn('break-words', row.value ? 'text-text' : 'text-text-subtle')}>
                {row.value || row.placeholder}
              </dd>
            </div>
          ))}
        </dl>
        <p
          className={cn(
            'mt-4 border-t border-dashed border-border pt-4 text-body-small whitespace-pre-wrap break-words',
            message.trim() ? 'text-text' : 'text-text-subtle',
          )}
        >
          {message.trim() || 'A short description of the project.'}
        </p>
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
  const scrollRef = useRef(scroll)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [build, setBuild] = useState<BuildId | null>(null)
  const [message, setMessage] = useState('')
  const [timing, setTiming] = useState<TimingId | null>(null)
  const [when, setWhen] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)

  const errors = attempted ? validate({ name, email, build, message }) : {}
  const intentMeta = intentCopy(intent)
  // "Roughly when" only counts while "A date in mind" is the chosen timing.
  const whenValue = timing === 'dated' ? when : ''
  const note = composeNote({ intent, name, email, organization, build, message, timing, when: whenValue })
  const booking = getBookCallTarget()

  const previewRows: PreviewRow[] = [
    { label: 'About', value: intentMeta?.label ?? '' },
    { label: 'Name', value: name.trim(), placeholder: 'Your name' },
    { label: 'Email', value: email.trim(), placeholder: 'Your email' },
    { label: 'Organization', value: organization.trim() },
    { label: 'Build', value: buildOptions.find((item) => item.id === build)?.label ?? '', placeholder: 'What you want to build' },
    { label: 'Timing', value: timingOptions.find((item) => item.id === timing)?.label ?? '' },
    { label: 'When', value: whenValue.trim() },
  ]

  useEffect(() => {
    scrollRef.current = scroll
  }, [scroll])

  useEffect(() => {
    if (!ready) return
    const timer = window.setTimeout(() => {
      document.getElementById('contact-note-ready')?.focus({ preventScroll: true })
      scrollRef.current('project-note-card', -128, true)
    }, 40)
    return () => window.clearTimeout(timer)
  }, [ready])

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
      else if (nextErrors.build) document.querySelector<HTMLButtonElement>('#contact-build button')?.focus()
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

  function editNote() {
    setReady(false)
    window.setTimeout(() => {
      document.getElementById('contact-name')?.focus()
    }, 40)
  }

  return (
    <section
      id="project-note"
      className="border-t border-border-subtle bg-bg-subtle section-y"
      aria-labelledby="project-note-title"
    >
      <Container variant="wide" className="w-full">
        <SectionHeader
          eyebrow={contactForm.zone}
          titleId="project-note-title"
          title={intentMeta?.formTitle ?? contactForm.title}
          description={contactForm.intro}
        />

        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-12 lg:items-start lg:gap-8">
          <div
            id="project-note-card"
            className="rounded-xl border border-border bg-surface px-5 py-8 sm:px-8 sm:py-10 md:px-10 lg:col-span-7"
          >
            {ready ? (
              <div>
                <p className="inline-flex items-center gap-2 text-eyebrow text-text-secondary">
                  <HexMark variant="active" size={14} />
                  {contactForm.previewReady}
                </p>
                <h3 id="contact-note-ready" tabIndex={-1} className="mt-4 text-title text-text outline-none">
                  {contactForm.readyTitle}
                </h3>
                <p className="mt-3 max-w-[34rem] text-body text-text-secondary">{contactForm.readyBody}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button href={mailHref(studioEmail, note)} size="lg">
                    {contactForm.openMail}
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => void copyNote()}>
                    {copied ? contactForm.copied : contactForm.copy}
                  </Button>
                  <Button variant="ghost" size="lg" onClick={editNote}>
                    {contactForm.edit}
                  </Button>
                </div>
                <p className="mt-4 text-body-small text-text-secondary" aria-live="polite">
                  {copied ? contactForm.copiedStatus : ''}
                </p>
                {copyFailed ? (
                  <div className="mt-4">
                    <p className="text-body-small text-error" role="alert">
                      {contactForm.copyFailed}
                    </p>
                    <textarea
                      readOnly
                      value={note}
                      rows={9}
                      aria-label="Your note"
                      className="mt-3 block w-full resize-y rounded-lg border border-border bg-bg-subtle p-4 text-body-small text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      onFocus={(event) => event.currentTarget.select()}
                    />
                  </div>
                ) : null}
                {/* The preview column is hidden on small screens; show the note here instead. */}
                <div className="mt-8 lg:hidden">
                  <NoteSheet rows={previewRows} message={message} ready />
                </div>
              </div>
            ) : (
              <form noValidate aria-labelledby="project-note-title" onSubmit={onSubmit} className="grid gap-9">
                <Choices
                  id="contact-intent"
                  label="This note is about"
                  value={intent}
                  options={contactIntents}
                  onChange={onIntent}
                >
                  {intentMeta ? (
                    <p className="mt-3 text-body-small text-text-secondary">{intentMeta.note}</p>
                  ) : null}
                  {intent === 'call' && booking.kind === 'external' ? (
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-body-small text-text-secondary">
                      {contactForm.bookingHint}
                      <TextLink href={booking.href} target="_blank" tone="brand">
                        {contactForm.bookingLink}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </TextLink>
                    </p>
                  ) : null}
                </Choices>

                <div className="grid gap-9 sm:grid-cols-2 sm:gap-6">
                  <Field
                    id="contact-name"
                    label="Your name"
                    required
                    autoComplete="name"
                    value={name}
                    error={errors.name}
                    onChange={setName}
                  />
                  <Field
                    id="contact-email"
                    label="Email"
                    required
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    error={errors.email}
                    onChange={setEmail}
                  />
                </div>

                <Field
                  id="contact-organization"
                  label="Organization"
                  autoComplete="organization"
                  value={organization}
                  onChange={setOrganization}
                />

                <Choices
                  id="contact-build"
                  label="What are you looking to build?"
                  required
                  value={build}
                  options={buildOptions}
                  onChange={setBuild}
                  error={errors.build}
                />

                <div>
                  <label
                    htmlFor="contact-message"
                    className="flex items-baseline justify-between gap-3 text-body-small font-medium text-text"
                  >
                    Tell us about the project
                    <Need required />
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    aria-required
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    className={cn(inputClass(Boolean(errors.message)), 'min-h-36 resize-none overflow-y-auto')}
                    onChange={(event) => {
                      setMessage(event.target.value)
                      growMessage(event.target)
                    }}
                  />
                  {errors.message ? <ErrorText id="contact-message-error">{errors.message}</ErrorText> : null}
                </div>

                <Choices
                  id="contact-timing"
                  label="When should it begin?"
                  value={timing}
                  options={timingOptions}
                  onChange={setTiming}
                >
                  <div
                    className={cn(
                      'grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300',
                      timing === 'dated' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="overflow-hidden" inert={timing === 'dated' ? undefined : true}>
                      <div className="px-0.5 pt-4 pb-1">
                        <label htmlFor="contact-when" className="text-body-small font-medium text-text">
                          Roughly when
                        </label>
                        <input
                          id="contact-when"
                          value={when}
                          autoComplete="off"
                          placeholder="For example, early next quarter"
                          className={inputClass(false)}
                          onChange={(event) => setWhen(event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </Choices>

                <div className="flex flex-col items-start gap-4 border-t border-border-subtle pt-8 sm:flex-row sm:items-center sm:gap-6">
                  <Button type="submit" size="lg">
                    {contactForm.submit}
                  </Button>
                  <p className="max-w-[24rem] text-body-small text-text-secondary">{contactForm.submitHint}</p>
                </div>
              </form>
            )}
          </div>

          <aside aria-label="Preview of your note" className="hidden lg:sticky lg:top-28 lg:col-span-5 lg:block">
            <div className="rounded-xl shadow-float">
              <NoteSheet rows={previewRows} message={message} ready={ready} />
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}
