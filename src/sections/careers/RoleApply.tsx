import { useId, useState, type DragEvent, type FormEvent } from 'react'
import { CheckCircle2, FileText, UploadCloud, X } from 'lucide-react'
import { Button } from '@/components/ui/Button.tsx'
import { HexMark } from '@/components/ui/HexMark.tsx'
import { cvFileError, submitToHiringDesk } from '@/lib/hrIntake.ts'
import { cn } from '@/lib/cn.ts'
import type { JobPosting } from '@/types/careers.ts'

const labelClass = 'block text-body-small font-medium text-text'

const fieldClass =
  'mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-body text-text placeholder:text-text-muted outline-none transition-[border-color,box-shadow] duration-(--duration-standard) ease-standard hover:border-border-strong focus:border-brand focus:ring-4 focus:ring-brand/15'

function formatBytes(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * CV application for one role. Sends to the hiring desk (lib/hrIntake.ts).
 */
export function RoleApply({ job }: { job: JobPosting }) {
  const uid = useId()
  const ids = {
    heading: `${uid}-heading`,
    cv: `${uid}-cv`,
    name: `${uid}-name`,
    email: `${uid}-email`,
    note: `${uid}-note`,
  }
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  function takeFile(next: File | null) {
    setSent(false)
    setFile(next)
    setError(next ? cvFileError(next) : null)
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setDragging(false)
    takeFile(event.dataTransfer.files[0] ?? null)
  }

  function reset() {
    setSent(false)
    setFile(null)
    setName('')
    setEmail('')
    setNote('')
    setError(null)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fileProblem = cvFileError(file)
    if (fileProblem || !file) {
      setError(fileProblem)
      return
    }
    if (!name.trim() || !email.trim()) {
      setError('Add your name and email to send the application.')
      return
    }
    setSending(true)
    setError(null)
    try {
      await submitToHiringDesk({
        roleId: job.id,
        roleTitle: job.title,
        name,
        email,
        note,
        file,
      })
      setSent(true)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The hiring desk could not take this CV. Try again.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div role="status" className="rounded-xl border border-success/25 bg-success-soft p-6 sm:p-8">
        <CheckCircle2 className="size-7 text-success" aria-hidden="true" />
        <h2 className="mt-4 text-title text-text">Application sent</h2>
        <p className="mt-2 max-w-[32rem] text-body text-text-secondary">
          Thanks, {name.trim()}. Your CV for {job.title} is with the Bizaffix hiring team.
        </p>
        <Button variant="secondary" className="mt-6" onClick={reset}>
          Send another application
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-labelledby={ids.heading}
      className="rounded-xl border border-border bg-surface p-6 sm:p-8"
    >
      <div className="flex items-start gap-3">
        <HexMark variant="solid" size={14} className="mt-2" />
        <div>
          <h2 id={ids.heading} className="text-title text-text">
            Apply for this role
          </h2>
          <p className="mt-1.5 text-body-small text-text-secondary">
            Send your CV for {job.title}. It goes straight to the Bizaffix hiring team.
          </p>
        </div>
      </div>

      <div className="mt-7">
        <p className={labelClass}>CV</p>
        {file ? (
          <div className="mt-2 flex items-center justify-between gap-4 rounded-lg border border-border bg-bg-subtle p-4">
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="size-5 shrink-0 text-brand" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate text-body-small font-medium text-text">{file.name}</p>
                <p className="text-caption text-text-muted">{formatBytes(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => takeFile(null)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-pill text-text-secondary transition-colors hover:bg-bg-muted hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              aria-label={`Remove ${file.name}`}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={ids.cv}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              'mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-6 py-6 text-center transition-colors duration-(--duration-standard) ease-standard',
              'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand',
              dragging ? 'border-brand bg-brand-soft' : 'border-border-strong bg-bg-subtle hover:border-brand hover:bg-brand-soft/60',
            )}
          >
            <UploadCloud className="size-6 text-brand" aria-hidden="true" />
            <span className="mt-1 text-body-small font-medium text-text">Choose a CV file or drop it here</span>
            <span className="text-caption text-text-muted">PDF or Word, up to 6 MB</span>
            <input
              id={ids.cv}
              name="cv"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(event) => takeFile(event.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.name} className={labelClass}>
            Full name
          </label>
          <input
            id={ids.name}
            required
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={ids.email} className={labelClass}>
            Email
          </label>
          <input
            id={ids.email}
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={ids.note} className={labelClass}>
          Links or a note <span className="font-normal text-text-muted">(optional)</span>
        </label>
        <textarea
          id={ids.note}
          name="note"
          rows={3}
          placeholder="Portfolio, GitHub, or LinkedIn links, or a short note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className={cn(fieldClass, 'resize-y')}
        />
      </div>

      {error ? (
        <p role="alert" className="mt-5 rounded-lg bg-error-soft px-4 py-3 text-body-small text-error">
          {error}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-3">
        <Button type="submit" variant="primary" size="lg" loading={sending} className="w-full">
          {sending ? 'Sending application…' : 'Send application'}
        </Button>
        <p className="text-caption text-text-muted">Required: CV, full name, and email.</p>
      </div>
    </form>
  )
}
