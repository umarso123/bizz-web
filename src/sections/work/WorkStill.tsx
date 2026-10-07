import type { ReactNode } from 'react'
import { cn } from '@/lib/cn.ts'

/**
 * Product stills for the work index.
 * Paper field, ink structure, one warm mark. No blue fills.
 */
export function WorkStill({ slug }: { slug: string }) {
  switch (slug) {
    case 'clinical-decision-support':
      return <CdsStill />
    case 'telemedicine':
      return <TelemedicineStill />
    case 'health-information-exchange':
      return <HieStill />
    case 'electronic-health-records':
      return <EhrStill />
    case 'integration-interoperability':
      return <InteropStill />
    case 'optimized-strength':
      return <FitnessStill />
    case 'educational':
      return <EducationStill />
    case 'fintech':
      return <FintechStill />
    case 'ecommerce':
      return <CommerceStill />
    default:
      return <CdsStill />
  }
}

function Stage({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #e8eefc 0%, #fef6d8 46%, #cfe6ff 100%)' }}
    >
      {children}
    </div>
  )
}

function CdsStill() {
  return (
    <Stage>
      <div className="absolute -top-16 right-[-3rem] size-72 rounded-full bg-accent/40 blur-3xl" />
      <div className="absolute top-[10%] right-[6%] bottom-[12%] left-[6%] rounded-xl border border-border bg-surface p-4 shadow-[0_24px_50px_rgb(13_18_31/0.08)] md:p-5">
        <div className="flex items-center justify-between">
          <div className="h-2 w-28 rounded-full bg-[#5eb4f0]/15" />
          <div className="h-2 w-12 rounded-full bg-accent" />
        </div>
        <div className="mt-5 grid gap-2.5">
          <div className="h-9 rounded-xl bg-[#d7ecff]" />
          <div className="flex h-12 items-center gap-3 rounded-xl bg-[#5eb4f0] px-3.5">
            <span className="size-2.5 shrink-0 rounded-full bg-accent" />
            <span className="h-2 flex-1 rounded-full bg-surface/50" />
            <span className="h-2 w-10 rounded-full bg-accent" />
          </div>
          <div className="h-9 rounded-xl bg-[#d7ecff]" />
          <div className="grid grid-cols-[1.4fr_0.8fr] gap-2.5">
            <div className="h-16 rounded-xl bg-[#d7ecff]" />
            <div className="h-16 rounded-xl bg-accent-soft" />
          </div>
        </div>
      </div>
    </Stage>
  )
}

function TelemedicineStill() {
  return (
    <Stage>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-bg-muted to-transparent" />
      <div className="absolute top-[12%] right-[6%] left-[6%] grid grid-cols-2 gap-3">
        <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-[#5eb4f0]">
          <div className="absolute inset-x-6 top-8 h-16 rounded-full bg-surface/25 blur-xl" />
          <div className="absolute bottom-4 left-4 h-2 w-16 rounded-full bg-surface/70" />
        </div>
        <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-border bg-surface">
          <div className="absolute top-6 right-5 size-3 rounded-full bg-accent" />
          <div className="absolute inset-x-5 bottom-8 h-10 rounded-2xl bg-[#d7ecff]" />
        </div>
      </div>
      <div className="absolute right-[14%] bottom-[12%] left-[14%] flex h-11 items-center justify-center gap-3 rounded-full border border-border bg-surface/80 backdrop-blur-md">
        <span className="size-3 rounded-full bg-[#5eb4f0]/80" />
        <span className="size-3 rounded-full bg-[#5eb4f0]/25" />
        <span className="h-2 w-16 rounded-full bg-accent" />
      </div>
    </Stage>
  )
}

function HieStill() {
  return (
    <Stage>
      <div className="absolute top-1/2 right-[8%] left-[8%] h-px -translate-y-1/2 bg-[#5eb4f0]/20" />
      <div className="absolute top-[18%] right-[8%] left-[8%] grid grid-cols-3 gap-3">
        {['bg-surface', 'bg-[#5eb4f0]', 'bg-surface'].map((tone, index) => (
          <div key={tone + index} className={cn('h-32 rounded-xl border border-border', tone)} />
        ))}
      </div>
      <div className="absolute right-[12%] bottom-[16%] left-[12%] grid grid-cols-3 gap-4">
        <div className="h-2 rounded-full bg-[#5eb4f0]" />
        <div className="h-2 rounded-full bg-[#5eb4f0]/20" />
        <div className="h-2 rounded-full bg-accent" />
      </div>
    </Stage>
  )
}

function EhrStill() {
  return (
    <Stage>
      <div className="absolute -top-10 -left-8 size-56 rounded-full bg-accent/45 blur-3xl" />
      <div className="absolute top-[8%] right-[5%] bottom-[10%] left-[5%] rounded-xl border border-border bg-surface p-5 shadow-[0_22px_40px_rgb(13_18_31/0.08)]">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-[#5eb4f0]" />
          <div className="h-2.5 w-32 rounded-full bg-[#5eb4f0]/15" />
        </div>
        <div className="mt-6 grid gap-3">
          <div className="h-3 w-full rounded-full bg-[#5eb4f0]/10" />
          <div className="h-3 w-4/5 rounded-full bg-[#5eb4f0]/10" />
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div className="h-20 rounded-xl bg-[#d7ecff]" />
            <div className="h-20 rounded-xl bg-accent-soft" />
          </div>
        </div>
      </div>
    </Stage>
  )
}

function InteropStill() {
  return (
    <Stage>
      <div className="absolute top-[24%] left-[8%] h-40 w-[40%] rounded-xl border border-border bg-surface" />
      <div className="absolute top-[36%] right-[8%] h-40 w-[40%] rounded-xl bg-[#5eb4f0]" />
      <div className="absolute top-1/2 left-[42%] h-px w-[16%] bg-accent" />
      <div className="absolute top-[calc(50%-5px)] left-[48%] size-2.5 rounded-full bg-accent" />
    </Stage>
  )
}

function FitnessStill() {
  return (
    <Stage>
      <div className="absolute -right-8 bottom-0 size-72 rounded-full bg-accent/30 blur-2xl" />
      <div className="absolute top-[14%] bottom-[12%] left-[8%] w-[48%] rounded-xl border border-border bg-surface p-4">
        <div className="h-2 w-20 rounded-full bg-[#5eb4f0]/20" />
        <div className="mt-6 flex items-end gap-2">
          {[40, 68, 52, 84, 60].map((height, index) => (
            <span
              key={height}
              className={cn('w-full rounded-t-md', index === 3 ? 'bg-accent' : 'bg-[#5eb4f0]/80')}
              style={{ height: `${height}px` }}
            />
          ))}
        </div>
      </div>
      <div className="absolute top-[18%] right-[8%] grid size-36 place-items-center rounded-[2rem] border border-border bg-surface">
        <div className="size-20 rounded-full border-10 border-text/10 border-t-accent" />
      </div>
    </Stage>
  )
}

function EducationStill() {
  return (
    <Stage>
      <div className="absolute top-[10%] right-[6%] bottom-[12%] left-[6%] rounded-xl border border-border bg-surface p-5 shadow-[0_18px_40px_rgb(13_18_31/0.06)]">
        <div className="h-3 w-24 rounded-full bg-[#5eb4f0]" />
        <div className="mt-5 h-2.5 w-3/4 rounded-full bg-[#5eb4f0]/12" />
        <div className="mt-3 h-2.5 w-1/2 rounded-full bg-[#5eb4f0]/10" />
        <div className="mt-8 grid grid-cols-3 gap-2">
          <div className="h-16 rounded-xl bg-[#d7ecff]" />
          <div className="h-16 rounded-xl bg-accent-soft" />
          <div className="h-16 rounded-xl bg-surface-warm" />
        </div>
      </div>
    </Stage>
  )
}

function FintechStill() {
  return (
    <Stage>
      <div className="absolute top-6 right-6 left-6 flex items-end gap-3">
        <div className="h-2 flex-1 rounded-full bg-[#5eb4f0]/15" />
        <div className="h-2 w-16 rounded-full bg-accent" />
      </div>
      <div className="absolute right-[6%] bottom-[12%] left-[6%] flex h-[62%] items-end gap-3">
        {[46, 72, 58, 88, 64, 96, 70].map((height, index) => (
          <span
            key={height}
            className={cn('w-full rounded-t-lg', index === 5 ? 'bg-accent' : 'bg-[#5eb4f0]')}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </Stage>
  )
}

function CommerceStill() {
  return (
    <Stage>
      <div className="absolute -top-8 left-8 size-48 rounded-full bg-accent/35 blur-3xl" />
      <div className="absolute top-[12%] right-[8%] bottom-[14%] left-[8%] grid grid-cols-[1.2fr_0.8fr] gap-3">
        <div className="rounded-xl bg-[#5eb4f0]" />
        <div className="grid gap-3">
          <div className="rounded-xl bg-accent-soft" />
          <div className="rounded-xl border border-border bg-surface p-3">
            <div className="h-2 w-12 rounded-full bg-[#5eb4f0]/20" />
            <div className="mt-3 h-2 w-20 rounded-full bg-accent" />
          </div>
        </div>
      </div>
    </Stage>
  )
}
