import { Container } from '@/components/layout/Container.tsx'

type PlaceholderPageProps = {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="section-y">
      <Container variant="page">
        <h1>{title}</h1>
      </Container>
    </main>
  )
}
