import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

const MAX_BYTES = 6 * 1024 * 1024
const ALLOWED_EXT = new Set(['.pdf', '.doc', '.docx'])

type ApplicationBody = {
  roleId?: string
  roleTitle?: string
  name?: string
  email?: string
  note?: string
  fileName?: string
  fileType?: string
  fileBase64?: string
}

function readBody(req: IncomingMessage) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BYTES * 1.4) {
        reject(new Error('too-large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function send(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

/**
 * Accepts a CV from the careers page and stores it for the HR desk.
 * Files land in data/hr-inbox, which an HR app can read. The folder is not committed.
 */
export function hrIntakePlugin(): Plugin {
  const inbox = path.resolve(process.cwd(), 'data/hr-inbox')
  const attached = new WeakSet<object>()

  async function handle(req: IncomingMessage, res: ServerResponse) {
    try {
      const raw = await readBody(req)
      const body = JSON.parse(raw.toString('utf8')) as ApplicationBody
      const name = body.name?.trim() ?? ''
      const email = body.email?.trim() ?? ''
      const roleId = body.roleId?.trim() ?? ''
      const roleTitle = body.roleTitle?.trim() ?? ''
      const fileName = path.basename(body.fileName?.trim() ?? '')
      const ext = path.extname(fileName).toLowerCase()

      if (!name || !email || !roleId || !roleTitle || !fileName || !body.fileBase64) {
        send(res, 400, { ok: false, error: 'Missing application details.' })
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        send(res, 400, { ok: false, error: 'Enter a valid email.' })
        return
      }
      if (!ALLOWED_EXT.has(ext)) {
        send(res, 400, { ok: false, error: 'Use a PDF or Word CV.' })
        return
      }

      const file = Buffer.from(body.fileBase64, 'base64')
      if (file.length === 0 || file.length > MAX_BYTES) {
        send(res, 400, { ok: false, error: 'CV must be under 6 MB.' })
        return
      }

      const id = `${Date.now()}-${roleId.replace(/[^a-z0-9-]/gi, '')}`
      await mkdir(inbox, { recursive: true })
      await writeFile(path.join(inbox, `${id}${ext}`), file)
      await writeFile(
        path.join(inbox, `${id}.json`),
        JSON.stringify(
          {
            id,
            roleId,
            roleTitle,
            name,
            email,
            note: body.note?.trim() ?? '',
            fileName,
            fileType: body.fileType ?? '',
            receivedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      )
      send(res, 201, { ok: true, id })
    } catch (error) {
      const tooLarge = error instanceof Error && error.message === 'too-large'
      send(res, tooLarge ? 413 : 500, {
        ok: false,
        error: tooLarge ? 'CV must be under 6 MB.' : 'The hiring desk could not take this CV.',
      })
    }
  }

  function attach(middlewares: { use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void }) {
    if (attached.has(middlewares)) return
    attached.add(middlewares)
    middlewares.use((req, res, next) => {
      const url = req.url?.split('?')[0] ?? ''
      if (url !== '/api/hr/applications') {
        next()
        return
      }
      if (req.method !== 'POST') {
        send(res, 405, { ok: false, error: 'POST a CV.' })
        return
      }
      void handle(req, res)
    })
  }

  return {
    name: 'hr-intake',
    configureServer(server) {
      attach(server.middlewares)
      return () => attach(server.middlewares)
    },
    configurePreviewServer(server) {
      attach(server.middlewares)
    },
  }
}
