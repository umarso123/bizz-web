import { cn } from '@/lib/cn.ts'
import { Avatar, Chip, Hex, Icon, Laptop, Phone, ShotStage, Spark, TabBar, Tablet, ui } from '@/components/visuals/devices.tsx'

/*
 * Healthcare product visuals: what each of the five solutions looks like in use.
 * Sample data only (generic names and readings); nothing here is a client screen.
 */

type ShotProps = { tone?: 'ward' | 'night' }

/* --------------------------- Clinical decision support --------------------------- */

const navItems = ['Overview', 'Patients', 'Orders', 'Alerts', 'Reports'] as const

function CdsScreen() {
  return (
    <div className="grid h-full grid-cols-[17%_1fr] text-text">
      <aside className="flex flex-col gap-[0.45cqw] border-r border-border-subtle bg-bg-subtle px-[0.9cqw] py-[1.3cqw]">
        <div className="mb-[0.9cqw] flex items-center gap-[0.5cqw]">
          <Hex className="size-[1.5cqw]" />
          <span className={cn(ui.md, 'font-semibold')}>Clinic</span>
        </div>
        {navItems.map((item, index) => (
          <span
            key={item}
            className={cn(
              'flex items-center justify-between rounded-[0.45cqw] px-[0.65cqw] py-[0.42cqw]',
              ui.sm,
              index === 0 ? 'bg-brand-soft font-semibold text-brand-hover' : 'text-text-secondary',
            )}
          >
            {item}
            {item === 'Alerts' ? (
              <span className="grid size-[1.15cqw] place-items-center rounded-full bg-accent text-[length:0.7cqw] font-bold text-text">
                2
              </span>
            ) : null}
          </span>
        ))}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-col gap-[1cqw] p-[1.4cqw]">
        <div className="flex items-center gap-[0.8cqw]">
          <Avatar initials="AM" className={cn('size-[2.7cqw]', ui.sm)} />
          <div className="min-w-0 flex-1">
            <p className={cn(ui.lg, 'font-semibold')}>A. Morgan</p>
            <p className={cn(ui.xs, 'text-text-muted')}>58 yrs, cardiology follow-up</p>
          </div>
          <Chip tone="success">
            <span className="size-[0.5cqw] rounded-full bg-success" />
            Visit in progress
          </Chip>
        </div>

        <div className="grid grid-cols-3 gap-[0.8cqw]">
          {[
            { label: 'Heart rate', value: '72', unit: 'bpm', line: [0.5, 0.55, 0.45, 0.6, 0.52, 0.58, 0.5] },
            { label: 'Blood pressure', value: '128/82', unit: 'mmHg', line: [0.4, 0.45, 0.5, 0.48, 0.6, 0.62, 0.66] },
            { label: 'Oxygen', value: '97', unit: '%', line: [0.7, 0.72, 0.7, 0.74, 0.73, 0.75, 0.74] },
          ].map((tile) => (
            <div key={tile.label} className={cn(ui.panel, 'p-[0.9cqw]')}>
              <p className={cn(ui.xs, 'text-text-muted')}>{tile.label}</p>
              <p className="mt-[0.3cqw] flex items-baseline gap-[0.3cqw]">
                <span className={cn(ui.xl, 'font-semibold tabular-nums')}>{tile.value}</span>
                <span className={cn(ui.xs, 'text-text-muted')}>{tile.unit}</span>
              </p>
              <Spark values={tile.line} className="mt-[0.5cqw] h-[1.9cqw]" />
            </div>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1.45fr_1fr] gap-[0.8cqw]">
          <div className={cn(ui.panel, 'flex min-h-0 flex-col p-[0.9cqw]')}>
            <div className="flex items-center justify-between">
              <p className={cn(ui.sm, 'font-semibold')}>LDL trend</p>
              <Chip tone="accent">Above target</Chip>
            </div>
            <div className="relative mt-[0.6cqw] min-h-0 flex-1">
              <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <line x1="0" y1="34" x2="200" y2="34" stroke="var(--color-text-muted)" strokeDasharray="4 4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <polyline
                  points="4,62 34,58 66,55 100,48 133,40 164,30 192,24"
                  fill="none"
                  stroke="var(--color-brand)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              {/* Readings above target: round markers in HTML so the stretched chart can't distort them */}
              {[
                [164, 30],
                [192, 24],
              ].map(([x, y]) => (
                <span
                  key={x}
                  className="absolute size-[1cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.18cqw] border-text bg-accent"
                  style={{ left: `${(x / 200) * 100}%`, top: `${(y / 80) * 100}%` }}
                />
              ))}
            </div>
            <div className={cn(ui.xs, 'mt-[0.4cqw] flex justify-between text-text-muted')}>
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
            </div>
          </div>
          <div className={cn(ui.panel, 'p-[0.9cqw]')}>
            <p className={cn(ui.sm, 'font-semibold')}>Care plan</p>
            <ul className="mt-[0.6cqw] grid gap-[0.55cqw]">
              {[
                { item: 'Lipid panel ordered', done: true },
                { item: 'Diet counselling', done: true },
                { item: 'Medication review', done: false },
              ].map((row) => (
                <li key={row.item} className={cn(ui.xs, 'flex items-center gap-[0.5cqw] text-text-secondary')}>
                  <span
                    className={cn(
                      'grid size-[1.2cqw] place-items-center rounded-[0.3cqw] border',
                      row.done ? 'border-brand bg-brand text-text-inverse' : 'border-border-strong',
                    )}
                  >
                    {row.done ? <Icon name="check" className="size-[0.85cqw]" /> : null}
                  </span>
                  {row.item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function RecommendationCard({ className }: { className?: string }) {
  return (
    <div className={cn('absolute rounded-[1.1cqw] border border-border-subtle bg-surface p-[1.3cqw] shadow-[0_2cqw_4cqw_-1.6cqw_rgb(20_36_95/0.4)]', className)}>
      <div className="flex items-center gap-[0.55cqw]">
        <Hex tone="accent" className="size-[1.4cqw]" />
        <p className={cn(ui.sm, 'font-semibold text-text')}>Recommendation</p>
        <Chip tone="brand" className="ml-auto">
          Evidence-based
        </Chip>
      </div>
      <p className={cn(ui.lg, 'mt-[0.8cqw] font-semibold text-text')}>Review statin therapy</p>
      <p className={cn(ui.sm, 'mt-[0.35cqw] text-text-secondary')}>LDL is above target on the last two results.</p>
      <div className="mt-[1cqw] flex gap-[0.6cqw]">
        <span className={cn(ui.sm, 'rounded-full bg-text px-[1.1cqw] py-[0.45cqw] font-semibold text-text-inverse')}>Accept</span>
        <span className={cn(ui.sm, 'rounded-full border border-border-strong px-[1.1cqw] py-[0.45cqw] font-semibold text-text')}>Dismiss</span>
      </div>
    </div>
  )
}

export function CdsShot({ tone }: ShotProps) {
  return (
    <ShotStage label="a clinical decision support dashboard with an evidence-based recommendation" tone={tone}>
      <Laptop className="top-[5%] left-[3%] w-[76%]">
        <CdsScreen />
      </Laptop>
      <RecommendationCard className="right-[2%] bottom-[5%] w-[35%]" />
    </ShotStage>
  )
}

/* ---------------------------------- Telemedicine --------------------------------- */

function Person({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={cn('flex flex-col items-center', className)} aria-hidden="true">
      <span
        className={cn(
          'aspect-square w-[42%] rounded-full',
          light ? 'bg-[linear-gradient(160deg,var(--color-accent-soft),var(--color-accent-deep))]' : 'bg-[linear-gradient(160deg,var(--color-mist),var(--color-brand))]',
        )}
      />
      <span
        className={cn(
          'mt-[6%] h-[48%] w-full rounded-t-[999px]',
          light ? 'bg-[linear-gradient(180deg,var(--color-accent),var(--color-accent-deep))]' : 'bg-[linear-gradient(180deg,var(--color-brand),var(--color-brand-active))]',
        )}
      />
    </div>
  )
}

function VideoVisitScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-surface-brand-deep bg-[radial-gradient(ellipse_70%_70%_at_50%_30%,rgb(47_91_234/0.55),transparent_70%)]">
      <Person className="absolute bottom-0 left-1/2 aspect-[1/0.95] w-[40%] -translate-x-1/2" />
      <div className="absolute top-[4%] left-[3.5%] flex items-center gap-[0.6cqw] rounded-full bg-white/12 px-[0.9cqw] py-[0.45cqw] backdrop-blur-sm">
        <span className="size-[0.6cqw] rounded-full bg-error" />
        <span className={cn(ui.sm, 'font-semibold text-text-inverse')}>Dr. R. Shah</span>
        <span className={cn(ui.xs, 'text-text-inverse-muted')}>Live</span>
      </div>
      <div className="absolute top-[4%] right-[3.5%] aspect-[3/4] w-[18%] overflow-hidden rounded-[0.8cqw] border border-white/25 bg-surface-dark">
        <Person light className="absolute bottom-0 left-1/2 aspect-[1/0.95] w-[78%] -translate-x-1/2" />
      </div>
      <div className="absolute bottom-[5%] left-1/2 flex -translate-x-1/2 items-center gap-[0.9cqw] rounded-full bg-white/12 p-[0.6cqw] backdrop-blur-sm">
        {(['mic', 'camera', 'chat'] as const).map((name) => (
          <span key={name} className="grid size-[2.6cqw] place-items-center rounded-full bg-white/15 text-text-inverse">
            <Icon name={name} className="size-[1.3cqw]" />
          </span>
        ))}
        <span className="grid size-[2.6cqw] place-items-center rounded-full bg-error text-text-inverse">
          <Icon name="end" className="size-[1.4cqw]" />
        </span>
      </div>
    </div>
  )
}

function VisitPhoneScreen() {
  return (
    <div className="flex h-full flex-col gap-[0.9cqw] bg-bg-subtle px-[1.2cqw] pt-[3.6cqw] pb-[1.2cqw] text-text">
      <div>
        <p className={cn(ui.lg, 'font-semibold')}>Today</p>
        <p className={cn(ui.xs, 'text-text-muted')}>Your care, in one place</p>
      </div>
      <div className={cn(ui.panel, 'p-[0.9cqw]')}>
        <p className={cn(ui.xs, 'text-text-muted')}>Video visit</p>
        <p className={cn(ui.xl, 'mt-[0.2cqw] font-semibold tabular-nums')}>10:30 AM</p>
        <div className="mt-[0.7cqw] flex items-center gap-[0.5cqw]">
          <Avatar initials="RS" className={cn('size-[2cqw]', ui.xs)} />
          <div>
            <p className={cn(ui.xs, 'font-semibold')}>Dr. R. Shah</p>
            <p className={cn('text-[length:0.7cqw] text-text-muted')}>Cardiology</p>
          </div>
        </div>
        <span className={cn(ui.sm, 'mt-[0.9cqw] block rounded-full bg-brand py-[0.55cqw] text-center font-semibold text-text-inverse')}>
          Join visit
        </span>
      </div>
      <ul className="grid gap-[0.5cqw]">
        {['Check-in complete', 'Forms complete', 'Pharmacy on file'].map((item) => (
          <li key={item} className={cn(ui.xs, 'flex items-center gap-[0.45cqw] text-text-secondary')}>
            <span className="grid size-[1.1cqw] place-items-center rounded-full bg-success-soft text-success">
              <Icon name="check" className="size-[0.75cqw]" />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <TabBar
        items={[
          { label: 'Home', icon: 'home' },
          { label: 'Visits', icon: 'calendar' },
          { label: 'Messages', icon: 'chat' },
          { label: 'Profile', icon: 'user' },
        ]}
        active={1}
      />
    </div>
  )
}

export function TelemedicineShot({ tone }: ShotProps) {
  return (
    <ShotStage label="a telemedicine video visit on a tablet and the patient's visit screen on a phone" tone={tone}>
      <Tablet className="top-[9%] left-[3%] w-[71%]">
        <VideoVisitScreen />
      </Tablet>
      <Phone className="right-[4%] bottom-[4%] w-[22%]">
        <VisitPhoneScreen />
      </Phone>
    </ShotStage>
  )
}

/* --------------------------- Health information exchange -------------------------- */

const exchangeNodes = [
  { label: 'Clinic', note: 'Visit records', x: 22, y: 24 },
  { label: 'Hospital', note: 'Admissions', x: 78, y: 24 },
  { label: 'Lab', note: 'Results', x: 78, y: 70 },
  { label: 'Pharmacy', note: 'Prescriptions', x: 22, y: 70 },
] as const

const HUB = { x: 50, y: 47 }

export function HieShot({ tone }: ShotProps) {
  // Composition is 100 × 68.75 units (16:11); node y values are percent of height.
  const toY = (percent: number) => (percent / 100) * 68.75
  return (
    <ShotStage label="a health information exchange connecting a clinic, hospital, lab and pharmacy" tone={tone}>
      <svg viewBox="0 0 100 68.75" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {exchangeNodes.map((node) => (
          <line
            key={node.label}
            x1={HUB.x}
            y1={toY(HUB.y)}
            x2={node.x}
            y2={toY(node.y)}
            stroke="var(--color-brand)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        ))}
        {/* Records on the move */}
        {[exchangeNodes[0], exchangeNodes[2]].map((node) => {
          const x = (HUB.x + node.x) / 2
          const y = (toY(HUB.y) + toY(node.y)) / 2
          return <rect key={node.label} x={x - 1.1} y={y - 1.1} width="2.2" height="2.2" transform={`rotate(45 ${x} ${y})`} fill="var(--color-accent)" stroke="var(--color-text)" strokeWidth="0.35" />
        })}
      </svg>

      {/* The exchange: the hexagon sits exactly where the lines meet */}
      <div
        className="absolute grid size-[13cqw] -translate-x-1/2 -translate-y-1/2 place-items-center"
        style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
      >
        <Hex className="absolute inset-0 size-full drop-shadow-[0_1.4cqw_2cqw_rgb(47_91_234/0.35)]" />
        <Icon name="lock" className="relative size-[4cqw] text-text-inverse" />
        <span className={cn(ui.lg, 'absolute top-full left-1/2 mt-[0.7cqw] -translate-x-1/2 font-semibold whitespace-nowrap text-text')}>
          Exchange
        </span>
      </div>

      {exchangeNodes.map((node) => (
        <div
          key={node.label}
          className={cn(ui.panel, 'absolute w-[19cqw] -translate-x-1/2 -translate-y-1/2 px-[1.3cqw] py-[1.1cqw] shadow-[0_1.4cqw_3cqw_-1.4cqw_rgb(13_18_31/0.25)]')}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <div className="flex items-center gap-[0.8cqw]">
            <Hex tone="station" className="size-[2cqw]" />
            <div>
              <p className={cn(ui.lg, 'font-semibold whitespace-nowrap text-text')}>{node.label}</p>
              <p className={cn(ui.sm, 'whitespace-nowrap text-text-muted')}>{node.note}</p>
            </div>
          </div>
          <div className="mt-[0.9cqw] grid gap-[0.45cqw]">
            <span className="h-[0.55cqw] w-full rounded-full bg-bg-muted" />
            <span className="h-[0.55cqw] w-3/5 rounded-full bg-bg-muted" />
          </div>
        </div>
      ))}

      <div className="absolute bottom-[3%] left-1/2 flex -translate-x-1/2 items-center gap-[0.8cqw] rounded-full border border-border-subtle bg-surface py-[0.6cqw] ps-[0.7cqw] pe-[1.2cqw] shadow-[0_1.4cqw_3cqw_-1.4cqw_rgb(13_18_31/0.25)]">
        <span className="grid size-[1.9cqw] place-items-center rounded-full bg-success-soft text-success">
          <Icon name="check" className="size-[1.1cqw]" />
        </span>
        <span className={cn(ui.md, 'font-semibold whitespace-nowrap text-text')}>Lab results shared with Clinic</span>
        <Chip tone="brand">
          <Icon name="lock" className="size-[0.8cqw]" />
          Encrypted
        </Chip>
      </div>
    </ShotStage>
  )
}

/* ---------------------------- Electronic health records --------------------------- */

const recordTabs = ['Summary', 'Medications', 'Labs', 'Visits', 'Notes'] as const

function EhrScreen() {
  return (
    <div className="flex h-full flex-col text-text">
      <div className="flex items-center gap-[1cqw] border-b border-border-subtle px-[1.8cqw] pt-[1.5cqw] pb-[1.1cqw]">
        <Avatar initials="JK" className={cn('size-[3.6cqw]', ui.md)} />
        <div className="flex-1">
          <p className={cn(ui.xl, 'font-semibold')}>J. Kim</p>
          <p className={cn(ui.sm, 'mt-[0.2cqw] text-text-muted')}>Born 04/12/1979, record 40213</p>
        </div>
        <Chip tone="warning">1 allergy</Chip>
        <Chip tone="success">
          <Icon name="lock" className="size-[0.8cqw]" />
          Secure
        </Chip>
      </div>
      <div className="flex gap-[1.8cqw] border-b border-border-subtle px-[1.8cqw]">
        {recordTabs.map((tab, index) => (
          <span
            key={tab}
            className={cn(
              ui.md,
              'border-b-[0.25cqw] py-[0.75cqw]',
              index === 0 ? 'border-brand font-semibold text-text' : 'border-transparent text-text-muted',
            )}
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-[auto_1fr_auto] gap-[1cqw] p-[1.4cqw]">
        {[
          { label: 'Blood pressure', value: '132/84', line: [0.62, 0.58, 0.6, 0.52, 0.5, 0.46] },
          { label: 'HbA1c', value: '6.1%', line: [0.7, 0.66, 0.6, 0.55, 0.52, 0.5] },
          { label: 'Weight', value: '78 kg', line: [0.6, 0.58, 0.57, 0.55, 0.54, 0.52] },
        ].map((tile) => (
          <div key={tile.label} className={cn(ui.panel, 'flex items-end justify-between gap-[0.8cqw] px-[1.1cqw] py-[0.9cqw]')}>
            <div className="shrink-0">
              <p className={cn(ui.xs, 'whitespace-nowrap text-text-muted')}>{tile.label}</p>
              <p className={cn(ui.lg, 'mt-[0.2cqw] font-semibold whitespace-nowrap tabular-nums')}>{tile.value}</p>
            </div>
            <Spark values={tile.line} className="h-[2.2cqw] min-w-0 flex-1" />
          </div>
        ))}

        <div className={cn(ui.panel, 'col-span-2 p-[1.2cqw]')}>
          <p className={cn(ui.md, 'font-semibold')}>Conditions</p>
          <ul className="mt-[0.8cqw] grid gap-[0.75cqw]">
            {[
              { name: 'Type 2 diabetes', status: 'Active' },
              { name: 'Hypertension', status: 'Active' },
              { name: 'Vitamin D deficiency', status: 'Watching' },
              { name: 'Seasonal allergy', status: 'Resolved' },
            ].map((row) => (
              <li key={row.name} className={cn(ui.sm, 'flex items-center justify-between gap-[0.6cqw] text-text-secondary')}>
                {row.name}
                <Chip tone={row.status === 'Active' ? 'brand' : row.status === 'Watching' ? 'accent' : 'neutral'}>
                  {row.status}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
        <div className={cn(ui.panel, 'p-[1.2cqw]')}>
          <p className={cn(ui.md, 'font-semibold')}>Medications</p>
          <ul className="mt-[0.8cqw] grid gap-[0.75cqw]">
            {[
              { name: 'Metformin', dose: '500 mg' },
              { name: 'Lisinopril', dose: '10 mg' },
              { name: 'Atorvastatin', dose: '20 mg' },
            ].map((row) => (
              <li key={row.name} className={cn(ui.sm, 'flex items-center justify-between text-text-secondary')}>
                {row.name}
                <span className="font-semibold text-text tabular-nums">{row.dose}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visit history drawn as a route */}
        <div className={cn(ui.panel, 'col-span-3 px-[1.6cqw] py-[1cqw]')}>
          <p className={cn(ui.md, 'font-semibold')}>Visit history</p>
          <div className="relative mt-[1.1cqw] grid grid-cols-4">
            <span aria-hidden="true" className="absolute top-[1cqw] right-[12.5%] left-[12.5%] h-[0.4cqw] -translate-y-1/2 rounded-full bg-brand" />
            {['Jan 12', 'Mar 3', 'Jun 18', 'Today'].map((date, index) => (
              <div key={date} className="relative flex flex-col items-center gap-[0.45cqw]">
                <Hex tone={index === 3 ? 'accent' : 'station'} className="size-[2cqw]" />
                <span className={cn(ui.sm, index === 3 ? 'font-semibold text-text' : 'text-text-muted')}>{date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function EhrShot({ tone }: ShotProps) {
  return (
    <ShotStage label="an electronic health record with conditions, medications and visit history" tone={tone}>
      <Tablet wide className="top-[12%] left-[9%] w-[82%]">
        <EhrScreen />
      </Tablet>
      <div className="absolute top-[3%] right-[3%] flex items-center gap-[0.6cqw] rounded-full border border-border-subtle bg-surface py-[0.55cqw] ps-[0.6cqw] pe-[1.1cqw] shadow-[0_1.4cqw_3cqw_-1.4cqw_rgb(13_18_31/0.25)]">
        <span className="grid size-[1.8cqw] place-items-center rounded-full bg-success-soft text-success">
          <Icon name="check" className="size-[1cqw]" />
        </span>
        <span className={cn(ui.sm, 'font-semibold whitespace-nowrap text-text')}>Note saved</span>
      </div>
    </ShotStage>
  )
}

/* --------------------------- Integration and interoperability --------------------------- */

const fields = [
  { label: 'Patient ID', left: '40213', right: '40213' },
  { label: 'Name', left: 'J. Kim', right: 'Kim, J.' },
  { label: 'Date of birth', left: '04/12/1979', right: '1979-04-12' },
  { label: 'Latest result', left: 'HbA1c 6.1%', right: 'HbA1c 6.1%' },
] as const

function SystemPanel({ name, side, className }: { name: string; side: 'left' | 'right'; className?: string }) {
  return (
    <div className={cn(ui.panel, 'absolute overflow-hidden shadow-[0_1.8cqw_3.5cqw_-1.6cqw_rgb(13_18_31/0.3)]', className)}>
      <div className={cn('flex h-[4.2cqw] items-center justify-between px-[1.3cqw]', side === 'left' ? 'bg-bg-subtle' : 'bg-brand text-text-inverse')}>
        <p className={cn(ui.lg, 'font-semibold')}>{name}</p>
        <span className={cn('size-[0.8cqw] rounded-full', side === 'left' ? 'bg-success' : 'bg-accent')} />
      </div>
      <ul>
        {fields.map((field) => (
          <li key={field.label} className="box-border flex h-[5.6cqw] flex-col justify-center border-t border-border-subtle px-[1.3cqw]">
            <span className={cn(ui.sm, 'text-text-muted')}>{field.label}</span>
            <span className={cn(ui.md, 'font-semibold text-text tabular-nums')}>{side === 'left' ? field.left : field.right}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function InteropShot({ tone }: ShotProps) {
  // Rows sit at fixed heights inside both panels, so the links can meet them.
  const top = 26 // panel top, % of height
  const header = 4.2 // cqw
  const row = 5.6 // cqw
  const toUnits = (index: number) => (top / 100) * 68.75 + header + row * index + row / 2
  return (
    <ShotStage label="two health systems kept in sync, with matching fields linked between them" tone={tone}>
      <SystemPanel name="Clinic system" side="left" className="top-[26%] left-[4%] w-[35%]" />
      <SystemPanel name="Lab system" side="right" className="top-[26%] right-[4%] w-[35%]" />

      <svg viewBox="0 0 100 68.75" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {fields.map((field, index) => {
          const y = toUnits(index)
          return (
            <g key={field.label}>
              <path d={`M 39 ${y} L 61 ${y}`} fill="none" stroke="var(--color-brand)" strokeWidth="0.8" strokeLinecap="round" />
              <circle cx="39" cy={y} r="0.9" fill="var(--color-brand)" />
              <circle cx="61" cy={y} r="0.9" fill="var(--color-brand)" />
            </g>
          )
        })}
      </svg>
      {fields.map((field, index) => (
        <span
          key={field.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: '50%', top: `${(toUnits(index) / 68.75) * 100}%` }}
        >
          <Hex tone={index === 3 ? 'accent' : 'station'} className="size-[2cqw]" />
        </span>
      ))}

      <div className="absolute top-[8%] left-1/2 flex -translate-x-1/2 items-center gap-[0.7cqw] rounded-full border border-border-subtle bg-surface px-[1.3cqw] py-[0.6cqw] shadow-[0_1.2cqw_2.4cqw_-1.2cqw_rgb(13_18_31/0.25)]">
        <span className="size-[0.8cqw] rounded-full bg-success" />
        <span className={cn(ui.md, 'font-semibold whitespace-nowrap text-text')}>Sync on</span>
      </div>
      <p className={cn(ui.md, 'absolute bottom-[7%] left-1/2 -translate-x-1/2 whitespace-nowrap text-text-secondary')}>
        All records in sync
      </p>
    </ShotStage>
  )
}

/* ---------------------------------- Care workspace --------------------------------- */

/** The healthcare industry at a glance: the clinician's desk and the patient's phone. */
export function CareWorkspaceShot({ tone }: ShotProps) {
  return (
    <ShotStage label="a clinician dashboard on a laptop beside a patient's visit screen on a phone" tone={tone}>
      <Laptop className="top-[6%] left-[3%] w-[76%]">
        <CdsScreen />
      </Laptop>
      <Phone className="right-[3%] bottom-[3%] w-[21%]">
        <VisitPhoneScreen />
      </Phone>
    </ShotStage>
  )
}
