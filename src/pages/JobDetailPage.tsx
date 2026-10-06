import { LazyMotion, domAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { Container } from '@/components/layout/Container.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { getJobBySlug } from '@/content/careers.ts'
import { JobDetail } from '@/sections/careers/JobDetail.tsx'

export function JobDetailPage() {
  const { slug = '' } = useParams()
  const job = getJobBySlug(slug)

  useEffect(() => {
    const previousTitle = document.title
    document.title = job ? `${job.title} · Careers · Bizaffix` : 'Role not found · Bizaffix'
    return () => {
      document.title = previousTitle
    }
  }, [job])

  if (!job) {
    return (
      <main className="bg-page-white py-24 md:py-32">
        <Container variant="page" className="w-full">
          <h1 className="text-page-title text-text">Role not found</h1>
          <p className="mt-4 max-w-[36rem] text-body-large text-text-secondary">
            This listing is unavailable. Browse open positions on the careers page.
          </p>
          <div className="mt-8">
            <Button to="/careers#open-positions" size="lg">
              View open positions
            </Button>
          </div>
          <p className="mt-6">
            <Link to="/careers" className="text-body-small font-semibold text-brand-hover no-underline">
              Back to Careers
            </Link>
          </p>
        </Container>
      </main>
    )
  }

  return (
    <LazyMotion features={domAnimation}>
      <JobDetail job={job} />
    </LazyMotion>
  )
}
