import { PaperSection } from '@/components/paper/kit.tsx'
import { clientLogos } from '@/data/home.ts'

/**
 * "Trusted by…" strip. Renders nothing while `clientLogos.logos` is empty, so it
 * can sit in the page now and switch on once real, approved clients are added.
 */
export function ClientLogos() {
  const { title, logos } = clientLogos
  if (logos.length === 0) return null
  return (
    <PaperSection tone="white" grid={false} crop={false} labelledBy="clients-title" className="py-12! md:py-16!">
      <p id="clients-title" className="ph-label text-center text-[var(--ph-grey)]">
        {title}
      </p>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {logos.map((logo) => (
          <li key={logo.name}>
            <img src={logo.src} alt={logo.name} className="h-7 w-auto opacity-70 grayscale transition-opacity hover:opacity-100" loading="lazy" />
          </li>
        ))}
      </ul>
    </PaperSection>
  )
}
