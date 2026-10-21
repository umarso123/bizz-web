import { SectionHeader } from '@/components/common/SectionHeader.tsx'
import { Container } from '@/components/layout/Container.tsx'
import { Reveal } from '@/components/motion/Reveal.tsx'
import { HexMonogram } from '@/components/ui/HexMonogram.tsx'
import { TextLink } from '@/components/ui/TextLink.tsx'
import { homeContent } from '@/content/home.ts'

/**
 * The people behind the work. Monograms stand in until real portraits arrive.
 */
export function Members() {
  const copy = homeContent.members
  const people = copy.people

  return (
    <section id="members" className="relative section-y" aria-labelledby="members-title">
      <Container variant="wide" className="relative w-full">
        <SectionHeader
          eyebrow={copy.eyebrow}
          meta={`${people.length} people`}
          title={copy.title}
          titleId="members-title"
          description={copy.body}
          action={<TextLink to="/careers">Work with us</TextLink>}
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {people.map((person, index) => (
            <Reveal as="li" key={person.id} variant="fade" delay={index * 110} className="flex flex-col gap-6 rounded-[20px] border border-border bg-white/80 p-6 backdrop-blur-sm transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-brand">
              <HexMonogram name={person.name} className="size-16" />
              <div>
                <p className="text-[1.125rem] leading-snug font-semibold text-text">{person.name}</p>
                <p className="mt-1.5 text-body-small text-text-secondary">{person.role}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
