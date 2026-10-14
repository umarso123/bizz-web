import { m, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { careersCopy, teamMembers } from '@/content/careers.ts'
import { cn } from '@/lib/cn.ts'
import { Reveal } from '@/sections/home/Reveal.tsx'

function TeamCard({
  name,
  role,
  photoLabel,
  index,
  reduced,
}: {
  name: string
  role: string
  photoLabel: string
  index: number
  reduced: boolean
}) {
  return (
    <article className="group relative w-[14rem] shrink-0 snap-start md:w-[16rem]">
      <div
        className={cn(
          'relative aspect-[4/5] overflow-hidden rounded-xl border border-border-subtle',
          index % 2 === 0 ? 'bg-page-brand' : 'bg-page-white',
        )}
      >
        <div
          className="absolute inset-0 transition-transform duration-500 ease-standard group-hover:scale-[1.04]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-6 rounded-lg border border-white/40 bg-white/25 backdrop-blur-[1px]"
          aria-hidden="true"
        />
        <p className="absolute inset-x-0 bottom-4 px-4 text-center text-caption text-text-muted">
          {photoLabel}
        </p>
      </div>
      <div className="mt-4">
        <m.p
          className="text-base font-medium text-text"
          animate={reduced ? undefined : undefined}
          whileHover={reduced ? undefined : { x: 4 }}
        >
          <span className="inline-block transition-transform duration-300 ease-standard group-hover:translate-x-1">
            {name}
          </span>
        </m.p>
        <p className="mt-1 text-body-small text-text-secondary">{role}</p>
        <span
          aria-hidden="true"
          className="mt-3 block h-px w-0 bg-brand transition-all duration-300 ease-standard group-hover:w-10"
        />
      </div>
    </article>
  )
}

export function TeamStrip() {
  const reduced = useReducedMotion() === true
  const loop = [...teamMembers, ...teamMembers]

  return (
    <section className="overflow-hidden bg-page-white py-24 md:py-32" aria-labelledby="team-title">
      <Container variant="page" className="w-full">
        <Reveal className="max-w-[34rem]">
          <Eyebrow>
            {careersCopy.team.eyebrow}
          </Eyebrow>
          <h2
            id="team-title"
            className="mt-4 text-3xl font-medium sm:text-4xl text-text"
          >
            {careersCopy.team.headline}
          </h2>
        </Reveal>
      </Container>

      <div className="relative mt-14">

        {reduced ? (
          <div className="flex gap-6 overflow-x-auto px-[var(--page-gutter)] pb-4 snap-x">
            {teamMembers.map((member, index) => (
              <TeamCard
                key={member.id}
                name={member.name}
                role={member.role}
                photoLabel={member.photoLabel}
                index={index}
                reduced={reduced}
              />
            ))}
          </div>
        ) : (
          <m.div
            className="flex w-max gap-6"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 42, ease: 'linear', repeat: Infinity }}
          >
            {loop.map((member, index) => (
              <TeamCard
                key={`${member.id}-${index}`}
                name={member.name}
                role={member.role}
                photoLabel={member.photoLabel}
                index={index}
                reduced={reduced}
              />
            ))}
          </m.div>
        )}
      </div>
    </section>
  )
}
