import { useMemo, useState, type DragEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowUpRight,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  Send,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react'
import { Container } from '@/components/layout/Container.tsx'
import { jobPostings } from '@/content/careers.ts'
import { cvFileError, submitToHiringDesk } from '@/lib/hrIntake.ts'
import { cn } from '@/lib/cn.ts'
import type { JobPosting } from '@/types/careers.ts'

const departments = ['All', ...new Set(jobPostings.map((job) => job.department))]

function formatBytes(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function RoleApply({ job }: { job: JobPosting }) {
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fileProblem = cvFileError(file)
    if (fileProblem || !file) {
      setError(fileProblem)
      return
    }
    if (!name.trim() || !email.trim()) {
      setError('Please provide your name and email address.')
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
      setError(caught instanceof Error ? caught.message : 'The hiring desk could not take this CV.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
          <CheckCircle2 className="size-8 stroke-[2.2]" />
        </div>
        <h3 className="mt-4 text-2xl font-medium text-text">Application Received</h3>
        <p className="mx-auto mt-2 max-w-[32rem] text-body text-text-secondary">
          Thank you, <span className="font-semibold text-text">{name.trim()}</span>! Your CV has
          been submitted directly to our hiring team for the{' '}
          <span className="font-semibold text-text">{job.title}</span> role. We review every
          submission carefully and will get back to you within 48 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false)
            setFile(null)
            setName('')
            setEmail('')
            setNote('')
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border-strong bg-white px-5 py-2.5 text-body-small font-medium text-text shadow-xs hover:bg-surface-warm transition-all"
        >
          Submit another application
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-brand/20 bg-gradient-to-b from-brand-soft/20 via-surface to-surface p-6 sm:p-8 shadow-xs">
      <div className="flex items-start justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <h3 className="text-xl font-medium text-text">Apply for this role</h3>
          <p className="mt-1 text-body-small text-text-secondary">
            Direct review by founders & department leads · Response within 48h
          </p>
        </div>
        <div className="hidden sm:flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Sparkles className="size-4" />
        </div>
      </div>

      {/* CV Dropzone */}
      <div className="mt-6">
        <label className="block text-body-small font-medium text-text mb-2">
          Resume / Curriculum Vitae <span className="text-brand">*</span>
        </label>
        {file ? (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-brand/30 bg-brand-soft/40 p-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-body-small font-medium text-text">{file.name}</p>
                <p className="text-caption text-text-secondary">{formatBytes(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => takeFile(null)}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-white hover:text-text transition-colors"
              aria-label="Remove uploaded file"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={`cv-${job.id}`}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              'group flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-6 text-center transition-all',
              dragging
                ? 'border-brand bg-brand-soft/50 scale-[0.99]'
                : 'border-border-strong bg-white/70 hover:border-brand/70 hover:bg-brand-soft/20',
            )}
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand group-hover:scale-110 transition-transform">
              <UploadCloud className="size-6" />
            </div>
            <p className="mt-3 text-body-small font-medium text-text">
              <span className="text-brand underline decoration-brand/30 underline-offset-2">
                Click to browse
              </span>{' '}
              or drag & drop your CV
            </p>
            <p className="mt-1 text-caption text-text-muted">
              PDF, DOC, DOCX up to 6 MB
            </p>
            <input
              id={`cv-${job.id}`}
              name="cv"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(event) => takeFile(event.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`name-${job.id}`} className="block text-body-small font-medium text-text">
            Full name <span className="text-brand">*</span>
          </label>
          <input
            id={`name-${job.id}`}
            required
            name="name"
            placeholder="e.g. Sarah Jenkins"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-body text-text placeholder:text-text-muted/60 outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
        </div>
        <div>
          <label htmlFor={`email-${job.id}`} className="block text-body-small font-medium text-text">
            Email address <span className="text-brand">*</span>
          </label>
          <input
            id={`email-${job.id}`}
            required
            type="email"
            name="email"
            placeholder="sarah@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-body text-text placeholder:text-text-muted/60 outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={`note-${job.id}`} className="block text-body-small font-medium text-text">
          Portfolio, LinkedIn, or note <span className="text-text-muted font-normal">(optional)</span>
        </label>
        <textarea
          id={`note-${job.id}`}
          name="note"
          rows={3}
          placeholder="Links to your recent projects, Github/LinkedIn, or a brief note about why you're a great fit..."
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="mt-1.5 w-full resize-y rounded-xl border border-border bg-white px-4 py-2.5 text-body text-text placeholder:text-text-muted/60 outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10"
        />
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-body-small text-red-600" role="alert">
          {error}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-body-small font-semibold text-white shadow-md shadow-brand/25 transition-all hover:bg-brand-hover hover:shadow-lg disabled:opacity-60"
        >
          {sending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Submitting application...</span>
            </>
          ) : (
            <>
              <span>Send Application</span>
              <Send className="size-4" />
            </>
          )}
        </button>
        <p className="text-caption text-text-muted">
          Confidential · Only reviewed by hiring leads
        </p>
      </div>
    </form>
  )
}

export function CareerBoard({ activeSlug }: { activeSlug?: string }) {
  const navigate = useNavigate()
  const [department, setDepartment] = useState('All')

  const visible = useMemo(
    () => jobPostings.filter((job) => department === 'All' || job.department === department),
    [department],
  )
  const selected = visible.find((job) => job.slug === activeSlug) ?? visible[0]

  function choose(job: JobPosting) {
    navigate(`/careers/${job.slug}`)
  }

  function filterTo(next: string) {
    setDepartment(next)
    const jobs = jobPostings.filter((job) => next === 'All' || job.department === next)
    const still = jobs.find((job) => job.slug === activeSlug)
    if (!still && jobs[0]) navigate(`/careers/${jobs[0].slug}`, { replace: true })
  }

  return (
    <section id="open-positions" className="scroll-mt-28 bg-page-white pt-8 pb-24 md:pb-32" aria-label="Open roles">
      <Container variant="page" className="w-full">
        {/* Department Filter Segmented Control */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-6">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-surface-subtle/80 p-1.5 border border-border-subtle backdrop-blur-xs" role="group" aria-label="Departments">
            {departments.map((item) => {
              const on = item === department
              const count = item === 'All' ? jobPostings.length : jobPostings.filter((j) => j.department === item).length
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={on}
                  onClick={() => filterTo(item)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-4 py-2 text-body-small font-medium transition-all focus-visible:outline-2 focus-visible:outline-brand',
                    on
                      ? 'bg-brand text-white shadow-sm shadow-brand/25'
                      : 'text-text-secondary hover:text-text hover:bg-white/70',
                  )}
                >
                  <span>{item}</span>
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.2 text-[11px] font-semibold',
                      on ? 'bg-white/20 text-white' : 'bg-border/60 text-text-muted',
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="text-body-small font-medium text-text-secondary">
            Showing <span className="font-semibold text-text">{visible.length}</span> {visible.length === 1 ? 'open role' : 'open roles'}
          </p>
        </div>

        {/* Master / Detail Grid */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
          {/* Job List (Master Column) */}
          <ul className="space-y-3">
            {visible.map((job) => {
              const on = job.slug === selected?.slug
              return (
                <li key={job.id}>
                  <button
                    type="button"
                    onClick={() => choose(job)}
                    aria-current={on ? 'true' : undefined}
                    className={cn(
                      'group relative w-full rounded-2xl border p-5 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand',
                      on
                        ? 'border-brand bg-brand-soft/30 shadow-md ring-2 ring-brand/20'
                        : 'border-border-subtle bg-white hover:border-brand/40 hover:bg-surface-warm/40 hover:shadow-xs',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={cn('text-xl font-medium transition-colors', on ? 'text-brand' : 'text-text group-hover:text-brand')}>
                        {job.title}
                      </h3>
                      <ArrowUpRight
                        className={cn(
                          'size-5 shrink-0 transition-transform duration-200',
                          on
                            ? 'text-brand translate-x-0.5 -translate-y-0.5'
                            : 'text-text-muted group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                        )}
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-caption font-medium text-brand">
                        {job.department}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-surface-subtle px-2 py-0.5 text-caption text-text-secondary">
                        {job.employmentType}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-surface-subtle px-2 py-0.5 text-caption text-text-secondary">
                        {job.experience}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-body-small text-text-secondary leading-relaxed">
                      {job.description}
                    </p>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Job Detail & Application Desk (Detail Column) */}
          {selected ? (
            <article
              id="role-desk"
              key={selected.id}
              className="lg:sticky lg:top-[calc(var(--header-clearance)+1.5rem)] rounded-3xl border border-border-subtle bg-surface p-7 sm:p-9 shadow-[0_20px_50px_rgb(13_18_31/0.06)]"
            >
              {/* Header Info */}
              <div className="border-b border-border-subtle pb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                    <span className="size-1.5 rounded-full bg-brand" />
                    <span>{selected.department}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Actively Hiring</span>
                  </span>
                </div>

                <h2 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tight text-text">
                  {selected.title}
                </h2>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-body-small text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <Globe className="size-4 text-brand" />
                    <span>{selected.location}</span>
                  </div>
                  <span className="text-border-strong">·</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4 text-brand" />
                    <span>{selected.employmentType}</span>
                  </div>
                  <span className="text-border-strong">·</span>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="size-4 text-brand" />
                    <span>{selected.experience}</span>
                  </div>
                </div>

                <p className="mt-5 text-body text-text-secondary leading-relaxed">
                  {selected.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="py-6 border-b border-border-subtle">
                <h3 className="text-lg font-medium text-text">What you&apos;ll lead & build</h3>
                <ul className="mt-4 space-y-3">
                  {selected.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body-small text-text-secondary leading-relaxed">
                      <div className="mt-1 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <Check className="size-3 stroke-[2.5]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements if available */}
              {selected.requirements && selected.requirements.length > 0 ? (
                <div className="py-6 border-b border-border-subtle">
                  <h3 className="text-lg font-medium text-text">What we&apos;re looking for</h3>
                  <ul className="mt-4 space-y-3">
                    {selected.requirements.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-body-small text-text-secondary leading-relaxed">
                        <div className="mt-1 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                          <Check className="size-3 stroke-[2.5]" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Application Form Component */}
              <div className="pt-6">
                <RoleApply key={selected.id} job={selected} />
              </div>
            </article>
          ) : (
            <div className="rounded-3xl border border-dashed border-border-strong p-12 text-center">
              <p className="text-body text-text-secondary">No openings found in this department.</p>
              <button
                type="button"
                onClick={() => filterTo('All')}
                className="mt-4 inline-flex items-center rounded-full bg-brand px-5 py-2 text-body-small font-medium text-white shadow-xs"
              >
                View all roles
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
