import { TriadBand } from '@/components/ui/TriadBand.tsx'
import { homeContent } from '@/content/home.ts'

/**
 * Clean three-point care audience band — Providers, Patients, Payers.
 */
export function CareAudience() {
  return (
    <TriadBand
      id="care-audience"
      title="Who healthcare products serve"
      listLabel="Care audience"
      items={homeContent.careAudience.items}
    />
  )
}
