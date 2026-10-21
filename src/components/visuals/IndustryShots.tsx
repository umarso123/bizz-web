import { cn } from '@/lib/cn.ts'
import { Avatar, Chip, Hex, Icon, Phone, ShotStage, TabBar, ui } from '@/components/visuals/devices.tsx'

/*
 * Visuals for the other industries where no published board exists.
 * Sample data only; nothing here is a client screen.
 */

type ShotProps = { tone?: 'ward' | 'night' }

const floating = 'shadow-[0_1.8cqw_3.5cqw_-1.6cqw_rgb(13_18_31/0.3)]'

/* ------------------------------------ Fintech ----------------------------------- */

function BankingScreen() {
  return (
    <div className="flex h-full flex-col gap-[0.9cqw] bg-bg-subtle px-[1.2cqw] pt-[3.6cqw] pb-[1.2cqw] text-text">
      <div className="flex items-center justify-between">
        <p className={cn(ui.lg, 'font-semibold')}>Accounts</p>
        <Avatar initials="DL" className={cn('size-[2cqw]', ui.xs)} />
      </div>
      <div className="rounded-[1cqw] bg-surface-brand-deep bg-[radial-gradient(ellipse_80%_80%_at_100%_0%,rgb(47_91_234/0.8),transparent_70%)] p-[1.1cqw] text-text-inverse">
        <p className={cn(ui.xs, 'text-text-inverse-muted')}>Available balance</p>
        <p className={cn(ui.xl, 'mt-[0.25cqw] font-semibold tabular-nums')}>$12,480.20</p>
        <p className={cn(ui.xs, 'mt-[0.9cqw] text-text-inverse-muted tabular-nums')}>Everyday account, 4821</p>
      </div>
      <div className="grid grid-cols-3 gap-[0.5cqw]">
        {['Send', 'Pay', 'Save'].map((action) => (
          <span key={action} className={cn(ui.panel, ui.xs, 'flex flex-col items-center gap-[0.3cqw] py-[0.6cqw] font-semibold')}>
            <span className="size-[1.4cqw] rounded-full bg-brand-soft" />
            {action}
          </span>
        ))}
      </div>
      <div>
        <p className={cn(ui.sm, 'font-semibold')}>Recent</p>
        <ul className="mt-[0.4cqw] grid gap-[0.45cqw]">
          {[
            { name: 'Pharmacy', amount: '-24.90' },
            { name: 'Salary', amount: '+3,200.00' },
            { name: 'Groceries', amount: '-86.15' },
          ].map((row) => (
            <li key={row.name} className={cn(ui.xs, 'flex items-center justify-between')}>
              <span className="flex items-center gap-[0.45cqw] text-text-secondary">
                <span className="size-[1.2cqw] rounded-full bg-bg-muted" />
                {row.name}
              </span>
              <span className={cn('font-semibold tabular-nums', row.amount.startsWith('+') ? 'text-success' : 'text-text')}>
                {row.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <TabBar
        items={[
          { label: 'Home', icon: 'home' },
          { label: 'Cards', icon: 'card' },
          { label: 'Insights', icon: 'chart' },
          { label: 'Profile', icon: 'user' },
        ]}
      />
    </div>
  )
}

export function FintechShot({ tone }: ShotProps) {
  const bars = [0.42, 0.66, 0.5, 0.78, 0.58, 0.92, 0.64]
  return (
    <ShotStage label="a banking app on a phone with a monthly spending chart" tone={tone}>
      <Phone className="top-[11%] left-[16%] w-[25%]">
        <BankingScreen />
      </Phone>
      <div className={cn(ui.panel, floating, 'absolute top-[16%] right-[8%] w-[42%] p-[1.4cqw]')}>
        <div className="flex items-center justify-between">
          <p className={cn(ui.md, 'font-semibold text-text')}>Spending this month</p>
          <Chip tone="brand">Weekly</Chip>
        </div>
        <div className="mt-[1.2cqw] flex h-[13cqw] items-end gap-[0.8cqw]">
          {bars.map((height, index) => (
            <span
              key={index}
              className={cn('flex-1 rounded-t-[0.4cqw]', index === 5 ? 'bg-accent' : 'bg-brand')}
              style={{ height: `${height * 100}%` }}
            />
          ))}
        </div>
        <div className={cn(ui.xs, 'mt-[0.5cqw] flex justify-between text-text-muted')}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <span key={index} className="flex-1 text-center">
              {day}
            </span>
          ))}
        </div>
      </div>
      <div className={cn(floating, 'absolute right-[14%] bottom-[12%] flex items-center gap-[0.7cqw] rounded-full border border-border-subtle bg-surface py-[0.6cqw] ps-[0.7cqw] pe-[1.3cqw]')}>
        <span className="grid size-[2cqw] place-items-center rounded-full bg-success-soft text-success">
          <Icon name="check" className="size-[1.1cqw]" />
        </span>
        <span className={cn(ui.sm, 'font-semibold whitespace-nowrap text-text')}>Payment sent</span>
        <Chip tone="brand">
          <Icon name="lock" className="size-[0.8cqw]" />
          Secure
        </Chip>
      </div>
    </ShotStage>
  )
}

/* ------------------------------------ Fitness ------------------------------------ */

function TrainingScreen() {
  const ring = 2 * Math.PI * 15.5
  return (
    <div className="flex h-full flex-col gap-[0.9cqw] bg-surface-dark px-[1.2cqw] pt-[3.6cqw] pb-[1.2cqw] text-text-inverse">
      <div>
        <p className={cn(ui.xs, 'text-text-inverse-muted')}>Today’s plan</p>
        <p className={cn(ui.lg, 'font-semibold')}>Upper body</p>
      </div>
      <div className="relative mx-auto aspect-square w-[64%]">
        <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="3.2" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray={`${ring * 0.8} ${ring}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(ui.xl, 'font-semibold tabular-nums')}>4 of 5</span>
          <span className={cn(ui.xs, 'text-text-inverse-muted')}>sessions</span>
        </div>
      </div>
      <ul className="grid gap-[0.5cqw]">
        {[
          { name: 'Bench press', sets: '4 × 8' },
          { name: 'Pull-ups', sets: '3 × 10' },
          { name: 'Shoulder press', sets: '3 × 12' },
        ].map((row, index) => (
          <li key={row.name} className={cn(ui.xs, 'flex items-center justify-between rounded-[0.6cqw] bg-white/8 px-[0.7cqw] py-[0.5cqw]')}>
            <span className="flex items-center gap-[0.45cqw]">
              <span className={cn('size-[0.8cqw] rounded-full', index === 0 ? 'bg-accent' : 'bg-white/30')} />
              {row.name}
            </span>
            <span className="font-semibold tabular-nums">{row.sets}</span>
          </li>
        ))}
      </ul>
      <TabBar
        dark
        items={[
          { label: 'Today', icon: 'bolt' },
          { label: 'Plan', icon: 'calendar' },
          { label: 'Progress', icon: 'chart' },
          { label: 'Profile', icon: 'user' },
        ]}
      />
    </div>
  )
}

export function FitnessShot({ tone }: ShotProps) {
  const week = [0.5, 0.72, 0, 0.84, 0.66, 0.9, 0]
  return (
    <ShotStage label="a personalised training plan on a phone with weekly progress" tone={tone}>
      <Phone className="top-[11%] left-[16%] w-[25%]">
        <TrainingScreen />
      </Phone>
      <div className={cn(ui.panel, floating, 'absolute top-[18%] right-[8%] w-[42%] p-[1.4cqw]')}>
        <div className="flex items-center gap-[0.6cqw]">
          <Hex tone="accent" className="size-[1.5cqw]" />
          <p className={cn(ui.md, 'font-semibold text-text')}>Your week</p>
          <Chip tone="success" className="ml-auto">
            On track
          </Chip>
        </div>
        <div className="mt-[1.2cqw] flex h-[11cqw] items-end gap-[0.8cqw]">
          {week.map((height, index) => (
            <span
              key={index}
              className={cn('flex-1 rounded-t-[0.4cqw]', height === 0 ? 'h-[0.4cqw] bg-border' : index === 5 ? 'bg-accent' : 'bg-brand')}
              style={height === 0 ? undefined : { height: `${height * 100}%` }}
            />
          ))}
        </div>
        <div className={cn(ui.xs, 'mt-[0.5cqw] flex justify-between text-text-muted')}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <span key={index} className="flex-1 text-center">
              {day}
            </span>
          ))}
        </div>
      </div>
      <div className={cn(floating, 'absolute right-[12%] bottom-[12%] flex items-center gap-[0.7cqw] rounded-full border border-border-subtle bg-surface py-[0.6cqw] ps-[0.7cqw] pe-[1.3cqw]')}>
        <span className="grid size-[2cqw] place-items-center rounded-full bg-brand-soft text-brand-hover">
          <Icon name="check" className="size-[1.1cqw]" />
        </span>
        <span className={cn(ui.sm, 'font-semibold whitespace-nowrap text-text')}>Plan updated for next week</span>
      </div>
    </ShotStage>
  )
}
