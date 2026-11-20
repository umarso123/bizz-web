import { Plus, X } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperSection, PaperSubmit } from '@/components/paper/kit.tsx'
import { compliance, type ComplianceAssessmentRequest, type ProductKind } from '@/data/home.ts'

const MIN_DESCRIPTION = 12

type Status = 'idle' | 'invalid' | 'submitting' | 'pending'

/**
 * TODO(backend): send the request to the assessment service once it exists.
 * There is deliberately no scoring here; the report comes from that service.
 */
async function requestAssessment(request: ComplianceAssessmentRequest): Promise<void> {
  void request
}

function normaliseUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function AssessmentForm() {
  const { form } = compliance
  const ids = useId()
  const [kind, setKind] = useState<ProductKind>('education')
  const [description, setDescription] = useState('')
  const [showLink, setShowLink] = useState(false)
  const [link, setLink] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const tooShort = description.trim().length < MIN_DESCRIPTION

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (tooShort) {
      setStatus('invalid')
      return
    }
    setStatus('submitting')
    await requestAssessment({ kind, description: description.trim(), productUrl: showLink ? normaliseUrl(link) : null })
    setStatus('pending')
  }

  return (
    <form onSubmit={(event) => void submit(event)} noValidate className="ph-panel-night flex h-full flex-col p-6 md:p-10" aria-labelledby={`${ids}-title`}>
      <span aria-hidden="true" className="text-[2rem] leading-none text-[var(--ph-yellow)]">
        ✳
      </span>
      <h3 id={`${ids}-title`} className="ph-h3 mt-6 max-w-[16ch] text-white">
        {form.title}
      </h3>

      <fieldset className="mt-10">
        <legend className="sr-only">Product type</legend>
        <div className="inline-flex flex-wrap gap-2">
          {form.kinds.map((option) => (
            <label key={option.id} className="ph-toggle">
              <input
                type="radio"
                name={`${ids}-kind`}
                value={option.id}
                checked={kind === option.id}
                onChange={() => setKind(option.id)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label htmlFor={`${ids}-desc`} className="sr-only">
        Product description
      </label>
      <textarea
        id={`${ids}-desc`}
        rows={4}
        value={description}
        onChange={(event) => {
          setDescription(event.target.value)
          if (status !== 'submitting') setStatus('idle')
        }}
        placeholder={form.placeholder}
        aria-invalid={status === 'invalid'}
        aria-describedby={status === 'invalid' ? `${ids}-err` : undefined}
        className="ph-field mt-4 min-h-32 resize-y"
      />

      {showLink ? (
        <div className="mt-3 flex items-center gap-2">
          <label htmlFor={`${ids}-url`} className="sr-only">
            Product link
          </label>
          <input
            id={`${ids}-url`}
            type="url"
            inputMode="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder={form.linkPlaceholder}
            className="ph-field h-11 flex-1"
          />
          <button
            type="button"
            onClick={() => {
              setShowLink(false)
              setLink('')
            }}
            className="grid size-11 place-items-center rounded-[3px] text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Remove product link"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        {showLink ? (
          <span />
        ) : (
          <button type="button" onClick={() => setShowLink(true)} className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-white/85 hover:text-white">
            <Plus aria-hidden="true" className="size-4" />
            {form.addLink}
          </button>
        )}
        <PaperSubmit tone="white" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : form.submit}
        </PaperSubmit>
      </div>

      <p aria-live="polite" className="mt-4 min-h-6 text-[0.9375rem]">
        {status === 'invalid' ? (
          <span id={`${ids}-err`} className="text-[var(--ph-yellow)]">
            {form.tooShort}
          </span>
        ) : status === 'pending' ? (
          <span className="text-white/85">{form.pending}</span>
        ) : null}
      </p>

      <div className="mt-auto border-t border-white/15 pt-6">
        <p className="ph-label text-white/75">Try an example</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {form.examples[kind].map((example) => (
            <li key={example}>
              <button type="button" onClick={() => setDescription(example)} className="ph-chip-dark">
                {example}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </form>
  )
}

/** 06: the free compliance gap assessment, explained on the left, started on the right. */
export function ComplianceCheck() {
  return (
    <PaperSection tone="lightBlue" grid={false} id="compliance" labelledBy="compliance-title">
      <div className="grid grid-cols-12 gap-6 lg:gap-x-16">
        <div className="col-span-12 flex flex-col lg:col-span-5">
          <p className="ph-label text-[var(--ph-blue)]">{compliance.label}</p>
          <h2 id="compliance-title" className="ph-h2 mt-6">
            <RevealLines lines={[compliance.title]} />
          </h2>
          <Reveal delay={120}>
            <p className="ph-lead mt-6 text-[var(--ph-grey)]">{compliance.body}</p>
          </Reveal>
          <ol className="mt-10 border-t border-[rgb(13_18_31/0.12)]">
            {compliance.areas.map((area, index) => (
              <Reveal as="li" key={area} delay={160 + index * 80} className="flex items-baseline gap-6 border-b border-[rgb(13_18_31/0.12)] py-4">
                <span className="ph-label text-[var(--ph-blue)]">{String(index + 1).padStart(2, '0')}</span>
                <span className="ph-body font-medium">{area}</span>
              </Reveal>
            ))}
          </ol>
          <p className="ph-label mt-auto pt-10 text-[var(--ph-grey)]">{compliance.footnote}</p>
        </div>
        <Reveal delay={200} className="col-span-12 lg:col-span-7">
          <AssessmentForm />
        </Reveal>
      </div>
    </PaperSection>
  )
}
