import { useEffect } from 'react'
import { useParams } from 'react-router'
import { Container } from '@/components/layout/Container.tsx'
import { Eyebrow } from '@/components/ui/Eyebrow.tsx'
import { careersCopy, jobPostings } from '@/content/careers.ts'
import { CareerBoard } from '@/sections/careers/CareerBoard.tsx'

export function CareersPage() {
  const { slug } = useParams()

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Careers · Bizaffix'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <main className="bg-page-white">
      <section className="atmosphere-hero -mt-(--header-clearance) pt-[calc(var(--header-clearance)+2.5rem)] pb-10 md:pb-14">
        <Container variant="wide" className="w-full">
          <Eyebrow>{careersCopy.hero.eyebrow}</Eyebrow>
          <h1 className="mt-4 max-w-[12ch] text-display text-text">{careersCopy.hero.headline}</h1>
          <p className="mt-5 max-w-[34rem] text-body-large text-text-secondary">{careersCopy.hero.body}</p>
          <p className="mt-8 text-body text-text-secondary">
            {jobPostings.length} openings. Choose a role and drop a CV. It goes straight to the hiring desk.
          </p>
        </Container>
      </section>
      <CareerBoard activeSlug={slug} />
    </main>
  )
}
