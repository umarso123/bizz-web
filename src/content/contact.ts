/**
 * Contact page content.
 * Studio reach details confirmed for the public site.
 */

export const studioEmail = 'info@bizaffix.com'

export const studioPhone = {
  label: '+1 832-529-1569',
  href: 'tel:+18325291569',
} as const

export const studioAddress = 'Austin, Texas'

export const studioSocial = [
  { label: 'Facebook', href: 'https://www.facebook.com/bizaffix' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/bizaffix/posts/?feedView=all',
  },
] as const

export const contactIntro = {
  title: 'Let’s connect.',
  dek: 'From idea to reality. Share the work you want to make, and the conversation starts there.',
} as const

export const contactClose = {
  title: 'Have an idea worth building?',
  body: 'Want to collaborate? Reach out to us. Pick a time to talk it through, or look at the work first.',
  cta: 'Book a call',
  secondary: 'See the work',
  secondaryTo: '/work',
} as const

export const contactIntents = [
  {
    id: 'project',
    label: 'Start a project',
    note: 'A product, a site, or a system.',
    formTitle: 'Start a project',
  },
  {
    id: 'call',
    label: 'Book a call',
    note: 'Talk it through before anything is written down.',
    formTitle: 'Book a call',
  },
  {
    id: 'enquiry',
    label: 'General enquiry',
    note: 'A question, or a collaboration.',
    formTitle: 'A general enquiry',
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

/**
 * Form wording. Submitting prepares the note; nothing is sent until the
 * visitor opens it in their mail app or copies it. The words say exactly that.
 */
export const contactForm = {
  zone: 'Write to us',
  title: 'Tell us the work',
  intro: 'Name, email, the kind of work, and a short description are required. Everything else is optional.',
  submit: 'Prepare your note',
  submitHint: 'Nothing is sent yet. Next, open the note in your mail app or copy it.',
  previewTitle: 'Your note',
  previewDraft: 'Updates as you type',
  previewReady: 'Ready to send',
  readyTitle: 'Your note is ready.',
  readyBody: 'Open it in your mail app to send it, or copy it into the email you already use.',
  openMail: 'Open in your mail app',
  copy: 'Copy the note',
  copied: 'Copied',
  copiedStatus: 'The note is copied. Paste it into an email to the studio.',
  copyFailed: 'Copying didn’t work in this browser. Select the text below and copy it.',
  edit: 'Edit the note',
  bookingHint: 'Prefer to pick a time yourself?',
  bookingLink: 'Open the booking calendar',
} as const

export const noteSubject = 'A project for Bizaffix'

export const defaultFormTitle = contactForm.title
export const defaultSubmit = contactForm.submit

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
    subject: noteSubject,
    body,
  })
  return `mailto:${email}?${params.toString()}`
}
