const MAX_BYTES = 6 * 1024 * 1024
const ALLOWED_EXT = new Set(['pdf', 'doc', 'docx'])

export type CvApplication = {
  roleId: string
  roleTitle: string
  name: string
  email: string
  note: string
  file: File
}

function extensionOf(file: File) {
  const part = file.name.split('.').pop()?.toLowerCase() ?? ''
  return part
}

export function cvFileError(file: File | null) {
  if (!file) return 'Add a CV to continue.'
  if (!ALLOWED_EXT.has(extensionOf(file))) return 'Use a PDF or Word file.'
  if (file.size > MAX_BYTES) return 'CV must be under 6 MB.'
  return null
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/** Sends the CV to the hiring desk. The HR app reads what this endpoint stores. */
export async function submitToHiringDesk(application: CvApplication) {
  const fileError = cvFileError(application.file)
  if (fileError) throw new Error(fileError)

  const fileBase64 = await fileToBase64(application.file)
  const response = await fetch('/api/hr/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roleId: application.roleId,
      roleTitle: application.roleTitle,
      name: application.name.trim(),
      email: application.email.trim(),
      note: application.note.trim(),
      fileName: application.file.name,
      fileType: application.file.type,
      fileBase64,
    }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(payload?.error ?? 'The hiring desk could not take this CV.')
  }
}
