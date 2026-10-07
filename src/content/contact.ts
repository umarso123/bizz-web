/**
 * Contact page content.
 * Studio email is intentionally unset: the legacy site does not publish a public address.
 * Set `studioEmail` when that address is confirmed. Do not guess one.
 */

export const signalColor = '#F66C2A'

/** Replace with the confirmed public studio address. Null means the page will not invent one. */
export const studioEmail: string | null = null

export const contactIntro = {
  titleLead: "Let's build",
  titleRest: "what's next.",
  dek: 'From idea to reality. Share the work you want to make, and the conversation starts there.',
} as const

export const contactClose = {
  titleLead: 'Have an idea',
  titleRest: 'worth building?',
  cta: 'Book a call',
  secondary: 'See the work',
  secondaryTo: '/work',
} as const

export const contactIntents = [
  {
    id: 'project',
    label: 'Start a project',
    note: 'A product, a site, or a system',
    formTitle: 'Start a project',
    submit: 'Start the project',
  },
  {
    id: 'call',
    label: 'Book a call',
    note: 'Talk it through',
    formTitle: 'Book a call',
    submit: 'Request the call',
  },
  {
    id: 'write',
    label: 'Write',
    note: 'Compose a note',
    formTitle: 'Write to the studio',
    submit: 'Send the note',
  },
  {
    id: 'enquiry',
    label: 'General enquiry',
    note: 'A question, or a collaboration',
    formTitle: 'A general enquiry',
    submit: 'Send the enquiry',
  },
] as const

export type ContactIntent = (typeof contactIntents)[number]['id']

export const buildOptions = [
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'website', label: 'Website' },
  { id: 'mobile', label: 'Mobile app' },
  { id: 'product', label: 'Product' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'uiux', label: 'UI/UX' },
  { id: 'logo', label: 'Logo' },
] as const

export type BuildId = (typeof buildOptions)[number]['id']

export const timingOptions = [
  { id: 'shaping', label: 'Still shaping it' },
  { id: 'ready', label: 'Ready to begin' },
  { id: 'dated', label: 'A date in mind' },
] as const

export type TimingId = (typeof timingOptions)[number]['id']

export const defaultFormTitle = 'Tell us the work'
export const defaultSubmit = 'Send the note'

export type NoteInput = {
  intent: ContactIntent | null
  name: string
  email: string
  organization: string
  build: BuildId | null
  message: string
  timing: TimingId | null
  when: string
}

export function intentCopy(intent: ContactIntent | null) {
  return contactIntents.find((item) => item.id === intent) ?? null
}

export function composeNote(input: NoteInput) {
  const intent = intentCopy(input.intent)
  const build = buildOptions.find((item) => item.id === input.build)
  const timing = timingOptions.find((item) => item.id === input.timing)
  const lines = [
    intent ? `About: ${intent.label}` : null,
    `Name: ${input.name.trim()}`,
    `Email: ${input.email.trim()}`,
    input.organization.trim() ? `Organization: ${input.organization.trim()}` : null,
    build ? `Build: ${build.label}` : null,
    timing ? `Timing: ${timing.label}` : null,
    input.when.trim() ? `When: ${input.when.trim()}` : null,
    '',
    input.message.trim(),
  ]
  return lines.filter((line) => line !== null).join('\n')
}

export function mailHref(email: string, note: string) {
  const body = note.length > 1800 ? `${note.slice(0, 1800)}…` : note
  const params = new URLSearchParams({
    subject: 'A project for Bizaffix',
    body,
  })
  return `mailto:${email}?${params.toString()}`
}
