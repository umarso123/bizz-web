import { useEffect } from 'react'
import { useParams } from 'react-router'
import { PageHero } from '@/components/layout/PageHero.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { getJobBySlug } from '@/content/careers.ts'
import { CareersZoneLink, JobDetail } from '@/sections/careers/JobDetail.tsx'

/** /careers/:slug: one role, or a clear way back when the listing is gone. */
export function JobDetailPage() {
  const { slug = '' } = useParams()
  const job = getJobBySlug(slug)

  useEffect(() => {
    const previousTitle = document.title
    document.title = job ? `${job.title} | Bizaffix` : 'Role not found | Bizaffix'
    return () => {
      document.title = previousTitle
    }
  }, [job])

  if (!job) {
    return (
      <main className="studio-page bg-page-white">
        <PageHero
          zone={<CareersZoneLink />}
          title="This role isn’t open."
          titleId="job-title"
          intro="The listing you followed has closed or moved. Every role that’s open right now is on the careers page."
          actions={
            <Button to="/careers#open-positions" variant="primary" size="lg">
              View open positions
            </Button>
          }
        />
      </main>
    )
  }

  return <JobDetail job={job} />
}
