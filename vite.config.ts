import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { hrIntakePlugin } from './src/server/hrIntakePlugin.ts'
import { productionAssets } from './src/server/productionAssets.ts'

/** Vendor groups that change rarely: split out so a deploy only re-downloads app code. */
const VENDOR_CHUNKS: Record<string, RegExp> = {
  react: /node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/,
  motion: /node_modules[\\/](gsap|@gsap|lenis)[\\/]/,
  framer: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
  three: /node_modules[\\/](three|@react-three|three-stdlib|maath|camera-controls)[\\/]/,
}

// Dev and preview servers also accept CVs at /api/hr/applications for the hiring desk.
export default defineConfig({
  plugins: [react(), tailwindcss(), hrIntakePlugin(), productionAssets()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    // Under 4 KB, images inline as data URIs (saves a request); larger stay files.
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          for (const [name, test] of Object.entries(VENDOR_CHUNKS)) if (test.test(id)) return `vendor-${name}`
          return undefined
        },
      },
    },
  },
})
