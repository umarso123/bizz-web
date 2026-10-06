export type JobPosting = {
  id: string
  slug: string
  title: string
  department: string
  location: string
  employmentType: string
  experience: string
  description: string
  responsibilities: string[]
  requirements: string[]
  niceToHave: string[]
  applyUrl: string
  /** Placeholder listings illustrate structure until live openings replace them. */
  status: 'placeholder' | 'open'
}

export type CultureTheme = {
  id: string
  label: string
  detail: string
}

export type WorkStage = {
  id: string
  number: string
  title: string
  body: string
}

export type TeamMember = {
  id: string
  name: string
  role: string
  /** Placeholder until real team photography is supplied. */
  photoLabel: string
}

export type GallerySlot = {
  id: string
  label: string
  aspect: 'wide' | 'tall' | 'square' | 'large'
}
