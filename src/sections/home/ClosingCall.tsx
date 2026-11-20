import { useId, useState, type FormEvent } from 'react'
import { Reveal, RevealLines } from '@/components/motion/Reveal.tsx'
import { PaperButton, PaperSection, PaperSubmit } from '@/components/paper/kit.tsx'
import { closing, type TextMeRequest } from '@/data/home.ts'

type Status = 'idle' | 'invalid' | 'submitting' | 'pending'

/** TODO(backend): send the number to the WhatsApp flow once it exists. */
async function requestText(request: TextMeRequest): Promise<void> {
  void request
}

/** Loose check only: a leading + and 8 to 15 digits, spaces and dashes allowed. */
function toE164(value: string): string | null {
  const digits = value.replace(/[\s\-().]/g, '')
  return /^\+\d{8,15}$/.test(digits) ? digits : null
}

function TextForm() {
  const ids = useId()
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const copy = closing.text

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const e164 = toE164(phone)
    if (!e164) {
      setStatus('invalid')
      return
    }
    setStatus('submitting')
    await requestText({ phone: e164 })
    setStatus('pending')
  }

  return (
    <form onSubmit={(event) => void submit(event)} noValidate>
      <label htmlFor={`${ids}-phone`} className="ph-label text-white/75">
        {copy.label}
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id={`${ids}-phone`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value)
            if (status !== 'submitting') setStatus('idle')
          }}
          placeholder={copy.placeholder}
          aria-invalid={status === 'invalid'}
          aria-describedby={`${ids}-msg`}
          className="ph-field h-12 flex-1 md:h-14"
        />
        <PaperSubmit tone="white" disabled={status === 'submitting'}>
          {copy.submit}
        </PaperSubmit>
      </div>
      <p id={`${ids}-msg`} aria-live="polite" className="mt-3 min-h-6 text-[0.9375rem]">
        {status === 'invalid' ? <span className="text-[var(--ph-yellow)]">{copy.invalid}</span> : null}
        {status === 'pending' ? <span className="text-white/85">{copy.pending}</span> : null}
      </p>
    </form>
  )
}

/**
 * 10: the closing call. A night panel inset in a white sheet, so the page never
 * stacks two full colour sheets (the footer starts right below).
 */
export function ClosingCall() {
  return (
    <PaperSection tone="white" grid={false} crop={false} labelledBy="closing-title">
      <Reveal variant="rise">
        <div className="ph-panel-night relative overflow-hidden px-6 py-12 md:px-16 md:py-20">
          <div aria-hidden="true" className="ph-closing-glow" />
          <div className="relative grid grid-cols-12 gap-6 gap-y-12">
            <h2 id="closing-title" className="ph-h2 col-span-12 text-white lg:col-span-7">
              <RevealLines lines={[...closing.titleLines]} />
            </h2>
            <p className="ph-body col-span-12 self-end text-white/85 lg:col-span-4 lg:col-start-9">{closing.body}</p>
            <div className="col-span-12 border-t border-white/15 pt-10 lg:col-span-6">
              <TextForm />
            </div>
            <div className="col-span-12 flex items-start border-white/15 pt-10 lg:col-span-5 lg:col-start-8 lg:justify-end lg:border-t">
              <PaperButton tone="white">{closing.bookCall}</PaperButton>
            </div>
          </div>
        </div>
      </Reveal>
    </PaperSection>
  )
}
