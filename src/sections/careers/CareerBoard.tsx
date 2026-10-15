import { useMemo, useState, type DragEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
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

function Meta({ job }: { job: JobPosting }) {
  const bits = [job.location, job.employmentType, job.experience]
  return (
    <p className="flex flex-wrap gap-x-4 gap-y-1 text-body-small text-text-secondary">
      {bits.map((bit) => (
        <span key={bit}>{bit}</span>
      ))}
    </p>
  )
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
      setError('Add your name and email.')
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
      <div className="mt-8 border-t border-border pt-8">
        <p className="text-title">CV received</p>
        <p className="mt-3 max-w-[32rem] text-body text-text-secondary">
          {name.trim()} is with the hiring team for {job.title}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <label
        htmlFor={`cv-${job.id}`}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex min-h-40 cursor-pointer flex-col justify-end border px-5 py-6',
          dragging || file
            ? 'border-accent bg-accent-soft'
            : 'border-border bg-page-white',
        )}
      >
        <span className="text-title">{file ? file.name : 'Drop a CV here'}</span>
        <span className="mt-2 text-body-small text-text-secondary">
          {file ? formatBytes(file.size) : 'PDF or Word, up to 6 MB. Or choose a file.'}
        </span>
        <input
          id={`cv-${job.id}`}
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={(event) => takeFile(event.target.files?.[0] ?? null)}
        />
      </label>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-body-small text-text-secondary">Name</span>
          <input
            required
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full border-b border-border bg-transparent py-2 text-body text-text outline-none focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="text-body-small text-text-secondary">Email</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full border-b border-border bg-transparent py-2 text-body text-text outline-none focus:border-brand"
          />
        </label>
      </div>
      <label className="mt-5 block">
        <span className="text-body-small text-text-secondary">Note</span>
        <textarea
          name="note"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="mt-1 w-full resize-y border-b border-border bg-transparent py-2 text-body text-text outline-none focus:border-brand"
        />
      </label>

      {error ? (
        <p className="mt-4 text-body-small text-error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="mt-6 inline-flex min-h-12 items-center rounded-full bg-button-primary px-6 text-body-small font-semibold text-text-inverse hover:bg-button-primary-hover disabled:opacity-60"
      >
        {sending ? 'Sending' : 'Send CV'}
      </button>
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
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border">
          <div className="flex flex-wrap gap-x-6" role="group" aria-label="Departments">
            {departments.map((item) => {
              const on = item === department
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={on}
                  onClick={() => filterTo(item)}
                  className={cn(
                    '-mb-px border-b px-0.5 py-3 text-body focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand',
                    on
                      ? 'border-accent text-text'
                      : 'border-transparent text-text-secondary',
                  )}
                >
                  {item}
                </button>
              )
            })}
          </div>
          <p className="pb-3 text-body-small text-text-secondary">
            {visible.length} {visible.length === 1 ? 'role' : 'roles'}
          </p>
        </div>

        <div className="mt-2 grid items-start gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <ul>
            {visible.map((job) => {
              const on = job.slug === selected?.slug
              return (
                <li key={job.id} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => choose(job)}
                    aria-current={on ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-start gap-3 border-l py-5 pr-1 pl-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:py-6',
                      on ? 'border-accent' : 'border-transparent',
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-xl font-medium text-text md:text-2xl">
                        {job.title}
                      </span>
                      <span className="mt-2 block">
                        <Meta job={job} />
                      </span>
                    </span>
                    <span className="shrink-0 pt-1 text-caption text-text-secondary">{job.department}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          {selected ? (
            <article
              id="role-desk"
              key={selected.id}
              className="pt-5 lg:sticky lg:top-[calc(var(--header-clearance)+1.25rem)]"
            >
              <p className="text-caption text-brand">{selected.department}</p>
              <div className="mt-4 rounded-[1.75rem] border border-border-subtle bg-surface px-6 py-8 shadow-[0_24px_60px_rgb(47_91_234/0.08)] ring-1 ring-brand/10 md:px-8">
                <h2 className="text-2xl font-medium md:text-3xl">{selected.title}</h2>
                <div className="mt-3">
                  <Meta job={selected} />
                </div>
                <p className="mt-5 text-body text-text-secondary">{selected.description}</p>
                <RoleApply key={selected.id} job={selected} />
                <ul className="mt-10 space-y-3 border-l border-border pl-4">
                  {selected.responsibilities.map((item) => (
                    <li key={item} className="text-body-small text-text-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ) : (
            <p className="text-body text-text-secondary">No openings in this group.</p>
          )}
        </div>
      </Container>
    </section>
  )
}
