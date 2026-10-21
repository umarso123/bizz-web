import { cn } from '@/lib/cn.ts'
import { Avatar, Hex, Icon, Phone, ShotStage } from '@/components/visuals/devices.tsx'

/*
 * One illustration per process step, showing the step itself (not a product):
 * a workshop board, user research, a priority matrix, wireframe to UI, a test run.
 * These sit in small step cards, so they use few, large parts and a bigger type
 * scale than the product shots. Brand colours only; sample content.
 */

const t = {
  sm: 'text-[length:2.6cqw] leading-[1.2]',
  md: 'text-[length:3.2cqw] leading-[1.15]',
  lg: 'text-[length:4.2cqw] leading-[1.05] tracking-[-0.01em]',
} as const

const card = 'absolute rounded-[2cqw] border border-border bg-surface shadow-[0_2.4cqw_4.8cqw_-2.4cqw_rgb(13_18_31/0.28)]'

function Lines({ count = 2, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid gap-[1.1cqw]', className)}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={cn('h-[1.1cqw] rounded-full bg-text/15', i === count - 1 ? 'w-3/5' : 'w-full')} />
      ))}
    </div>
  )
}

function Note({ className, tone, title }: { className: string; tone: string; title: string }) {
  return (
    <div className={cn('absolute rounded-[1.2cqw] p-[2.2cqw] shadow-[0_1.8cqw_3.6cqw_-1.8cqw_rgb(13_18_31/0.35)]', tone, className)}>
      <p className={cn(t.md, 'font-semibold text-text')}>{title}</p>
      <Lines count={3} className="mt-[1.8cqw]" />
    </div>
  )
}

/** Understanding: a workshop board of goals, users and the problem, with the team around it. */
export function UnderstandingScene() {
  return (
    <ShotStage label="a workshop board with the goals, users and problem behind a product idea">
      <div className={cn(card, 'top-[6%] left-[5%] h-[86%] w-[90%] bg-surface/85 p-[3cqw]')}>
        <p className={cn(t.lg, 'font-semibold text-text')}>Discovery workshop</p>
        <p className={cn(t.sm, 'mt-[0.6cqw] text-text-muted')}>What should this product change?</p>
      </div>
      <Note className="top-[30%] left-[10%] w-[25%] -rotate-3" tone="bg-accent" title="Goals" />
      <Note className="top-[33%] left-[38%] w-[25%] rotate-2" tone="bg-periwinkle" title="Users" />
      <Note className="top-[29%] left-[66%] w-[25%] -rotate-1 border border-border" tone="bg-cream" title="Problem" />
      {/* The team, talking it through */}
      <div className="absolute bottom-[16%] left-[10%] flex items-center">
        <span className={cn('grid size-[7cqw] place-items-center rounded-full bg-brand font-semibold text-text-inverse ring-[0.5cqw] ring-surface', t.sm)}>AF</span>
        {['TH', 'SA'].map((initials) => (
          <Avatar key={initials} initials={initials} className={cn('-ms-[1.4cqw] size-[7cqw] ring-[0.5cqw] ring-surface', t.sm)} />
        ))}
      </div>
      <span className={cn('absolute bottom-[17%] left-[33%] rounded-[2cqw] rounded-bl-[0.4cqw] bg-brand px-[2.4cqw] py-[1.4cqw] font-semibold text-text-inverse', t.sm)}>
        Who is it for?
      </span>
    </ShotStage>
  )
}

/** Research: user interviews under a magnifying glass, with an insight pulled out. */
export function ResearchScene() {
  const people = [
    { initials: 'JK', role: 'Clinic manager', className: 'top-[8%] left-[5%]' },
    { initials: 'RS', role: 'Physician', className: 'top-[48%] left-[14%]' },
  ]
  return (
    <ShotStage label="user interview cards being studied, with a key insight highlighted">
      {people.map((person) => (
        <div key={person.initials} className={cn(card, 'w-[50%] p-[2.6cqw]', person.className)}>
          <div className="flex items-center gap-[1.6cqw]">
            <Avatar initials={person.initials} className={cn('size-[6.4cqw]', t.sm)} />
            <div>
              <p className={cn(t.md, 'font-semibold text-text')}>Interview</p>
              <p className={cn(t.sm, 'text-text-muted')}>{person.role}</p>
            </div>
          </div>
          <div className="mt-[2cqw] grid gap-[1.1cqw]">
            <span className="h-[1.1cqw] w-full rounded-full bg-bg-muted" />
            <span className="h-[1.6cqw] w-full rounded-full bg-accent" />
            <span className="h-[1.1cqw] w-2/3 rounded-full bg-bg-muted" />
          </div>
        </div>
      ))}
      {/* Magnifying glass over the highlighted line */}
      <div className="absolute top-[52%] left-[40%] size-[22cqw] rounded-full border-[1.4cqw] border-brand bg-brand-soft/30" />
      <span className="absolute top-[82%] left-[57%] h-[2cqw] w-[13cqw] origin-left rotate-[40deg] rounded-full bg-brand" />
      {/* The insight */}
      <div className={cn(card, 'top-[12%] right-[5%] w-[34%] p-[2.4cqw]')}>
        <span className="flex items-center gap-[1cqw]">
          <Hex tone="accent" className="size-[3cqw]" />
          <span className={cn(t.sm, 'font-semibold text-text-muted uppercase')}>Insight</span>
        </span>
        <p className={cn(t.md, 'mt-[1.4cqw] font-semibold text-text')}>“Too many logins slow the clinic down.”</p>
      </div>
    </ShotStage>
  )
}

/** Analysis: an impact-versus-effort matrix that turns findings into priorities. */
export function AnalysisScene() {
  const dots = [
    { x: 24, y: 28, label: 'Secure login', tone: 'bg-brand', size: 5 },
    { x: 34, y: 42, label: 'Mobile app', tone: 'bg-brand', size: 6 },
    { x: 72, y: 30, label: 'Integrations', tone: 'bg-periwinkle', size: 4.4 },
    { x: 66, y: 74, label: 'Legacy export', tone: 'bg-border-strong', size: 3.6 },
  ]
  return (
    <ShotStage label="a priority matrix sorting product ideas by impact and effort">
      <div className={cn(card, 'top-[6%] left-[5%] h-[88%] w-[90%] p-[3cqw]')}>
        <div className="flex items-center justify-between">
          <p className={cn(t.lg, 'font-semibold text-text')}>Priorities</p>
          <span className={cn(t.sm, 'flex items-center gap-[1cqw] rounded-full bg-success-soft px-[1.8cqw] py-[0.8cqw] font-semibold text-success')}>
            <Icon name="check" className="size-[2.4cqw]" />
            Scope agreed
          </span>
        </div>
        <div className="relative mt-[2.4cqw] h-[76%] overflow-hidden rounded-[1.4cqw] border border-border">
          <span className="absolute top-0 left-0 h-1/2 w-1/2 bg-accent-soft" />
          <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
          <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
          <span className={cn(t.sm, 'absolute top-[1.6cqw] left-[1.8cqw] font-semibold text-text')}>Do first</span>
          <span className={cn(t.sm, 'absolute right-[1.8cqw] bottom-[1.4cqw] text-text-muted')}>More effort →</span>
          {dots.map((dot) => (
            <span
              key={dot.label}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-[1.2cqw]"
              style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
            >
              <span className={cn('rounded-full ring-[0.6cqw] ring-surface', dot.tone)} style={{ width: `${dot.size}cqw`, height: `${dot.size}cqw` }} />
              <span className={cn(t.sm, 'font-semibold whitespace-nowrap text-text')}>{dot.label}</span>
            </span>
          ))}
        </div>
      </div>
    </ShotStage>
  )
}

/** Design: a wireframe becoming a finished interface, with the brand tokens beside it. */
export function DesignScene() {
  return (
    <ShotStage label="a wireframe turning into a finished interface, with colour and type tokens">
      {/* Wireframe */}
      <div className="absolute top-[12%] left-[5%] h-[76%] w-[36%] rounded-[2cqw] border-[0.4cqw] border-dashed border-border-strong bg-surface/70 p-[2.4cqw]">
        <span className="block h-[3cqw] w-1/2 rounded-[0.6cqw] bg-bg-muted" />
        <span className="mt-[2.2cqw] block h-[18cqw] w-full rounded-[1cqw] border-[0.3cqw] border-dashed border-border-strong" />
        <Lines count={2} className="mt-[2.4cqw] opacity-60" />
        <span className="mt-[2.4cqw] block h-[5cqw] w-3/5 rounded-full border-[0.3cqw] border-dashed border-border-strong" />
      </div>
      <span className="absolute top-[45%] left-[42.5%] z-10 grid size-[7cqw] place-items-center rounded-full bg-brand text-text-inverse shadow-lg">
        <Icon name="arrow" className="size-[3.6cqw]" />
      </span>
      {/* Finished UI */}
      <div className={cn(card, 'top-[6%] left-[51%] h-[88%] w-[38%] overflow-hidden')}>
        <div className="h-[42%] bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] p-[2.6cqw]">
          <p className={cn(t.lg, 'font-semibold text-text-inverse')}>Welcome back</p>
          <p className={cn(t.sm, 'mt-[0.6cqw] text-text-inverse-muted')}>Your plan for today</p>
        </div>
        <div className="p-[2.6cqw]">
          <div className="flex items-center gap-[1.4cqw]">
            <Avatar initials="JK" className={cn('size-[6cqw]', t.sm)} />
            <Lines count={2} className="flex-1" />
          </div>
          <span className={cn(t.sm, 'mt-[3cqw] block rounded-full bg-brand py-[1.4cqw] text-center font-semibold text-text-inverse')}>
            Continue
          </span>
        </div>
      </div>
      {/* Tokens */}
      <div className={cn(card, 'right-[2%] bottom-[8%] w-[17%] p-[1.8cqw]')}>
        <p className="text-[length:6cqw] leading-none font-semibold text-text">Aa</p>
        <div className="mt-[1.4cqw] grid grid-cols-2 gap-[1cqw]">
          {['bg-brand', 'bg-cyan', 'bg-periwinkle', 'bg-accent'].map((tone) => (
            <span key={tone} className={cn('aspect-square rounded-[0.8cqw]', tone)} />
          ))}
        </div>
      </div>
    </ShotStage>
  )
}

/** Testing: a test run passing, with the build checked on a phone. */
export function TestingScene() {
  const checks = ['Sign in works', 'Forms validate', 'Data saves securely', 'Works on mobile']
  return (
    <ShotStage label="a test run with every check passing, and the app verified on a phone">
      <div className={cn(card, 'top-[7%] left-[5%] w-[62%] p-[3cqw]')}>
        <div className="flex items-center justify-between">
          <p className={cn(t.lg, 'font-semibold text-text')}>Test run</p>
          <span className={cn(t.sm, 'rounded-full bg-success-soft px-[1.8cqw] py-[0.8cqw] font-semibold text-success')}>4/4 passed</span>
        </div>
        <ul className="mt-[2.4cqw] grid gap-[1.4cqw]">
          {checks.map((check) => (
            <li key={check} className="flex items-center gap-[1.6cqw] rounded-[1.2cqw] bg-bg-subtle px-[1.8cqw] py-[1.5cqw]">
              <span className="grid size-[4cqw] shrink-0 place-items-center rounded-full bg-success text-text-inverse">
                <Icon name="check" className="size-[2.6cqw]" />
              </span>
              <span className={cn(t.md, 'text-text')}>{check}</span>
            </li>
          ))}
        </ul>
      </div>
      <Phone className="top-[10%] right-[6%] w-[24%]">
        <div className="flex h-full flex-col items-center justify-center gap-[1.6cqw] bg-bg-subtle px-[1.6cqw] text-center">
          <span className="grid size-[9cqw] place-items-center rounded-full bg-success-soft text-success">
            <Icon name="check" className="size-[5cqw]" />
          </span>
          <p className={cn(t.md, 'font-semibold text-text')}>Ready to launch</p>
        </div>
      </Phone>
    </ShotStage>
  )
}
