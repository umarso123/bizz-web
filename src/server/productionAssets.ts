import { createReadStream, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'
import type { Plugin } from 'vite'

/** Text assets worth compressing. Images and fonts are already compressed. */
const COMPRESSIBLE = new Set(['.js', '.mjs', '.css', '.html', '.svg', '.json', '.txt', '.xml', '.webmanifest'])
const MIN_BYTES = 1024

const TYPES: Record<string, string> = {
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
}

function walk(dir: string, out: string[] = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path, out)
    else out.push(path)
  }
  return out
}

/**
 * Production asset delivery, without changing the server.
 *
 * The site is served by `vite preview` (the Dockerfile) because the HR intake API
 * lives on that server, so nginx/Caddy can't simply replace it. This plugin gives
 * preview what a static host would do:
 *  - build: writes a .br and a .gz next to every text asset (zlib, no dependency);
 *  - preview: serves the best precompressed variant the browser accepts, and marks
 *    hashed files under /assets/ as immutable for a year (HTML always revalidates).
 */
export function productionAssets(): Plugin {
  let outDir = 'dist'

  return {
    name: 'bizaffix:production-assets',

    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },

    closeBundle() {
      if (!existsSync(outDir)) return
      let raw = 0
      let br = 0
      for (const file of walk(outDir)) {
        if (!COMPRESSIBLE.has(extname(file))) continue
        const data = readFileSync(file)
        if (data.length < MIN_BYTES) continue
        const brotli = brotliCompressSync(data, {
          params: { [constants.BROTLI_PARAM_QUALITY]: 11, [constants.BROTLI_PARAM_SIZE_HINT]: data.length },
        })
        writeFileSync(`${file}.br`, brotli)
        writeFileSync(`${file}.gz`, gzipSync(data, { level: 9 }))
        raw += data.length
        br += brotli.length
      }
      this.info?.(`precompressed text assets: ${(raw / 1024).toFixed(0)} KB -> ${(br / 1024).toFixed(0)} KB brotli`)
    },

    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()
        const url = (req.url ?? '/').split('?')[0]
        if (url.startsWith('/api/')) return next()

        // Hashed build output never changes under the same name.
        if (url.startsWith('/assets/')) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        else if (url === '/' || url.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache')

        const ext = extname(url)
        if (!COMPRESSIBLE.has(ext)) return next()
        const file = normalize(join(outDir, decodeURIComponent(url)))
        if (!file.startsWith(outDir)) return next()

        const accepts = String(req.headers['accept-encoding'] ?? '')
        const variant = accepts.includes('br') && existsSync(`${file}.br`) ? 'br' : accepts.includes('gzip') && existsSync(`${file}.gz`) ? 'gzip' : null
        if (!variant) return next()

        const path = `${file}.${variant === 'br' ? 'br' : 'gz'}`
        res.setHeader('Content-Encoding', variant)
        res.setHeader('Content-Type', TYPES[ext] ?? 'application/octet-stream')
        res.setHeader('Content-Length', statSync(path).size)
        res.setHeader('Vary', 'Accept-Encoding')
        if (req.method === 'HEAD') return res.end()
        createReadStream(path).pipe(res)
      })
    },
  }
}
