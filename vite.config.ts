import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { hrIntakePlugin } from './src/server/hrIntakePlugin.ts'

// Dev server also accepts CVs at /api/hr/applications for the hiring desk.
export default defineConfig({
  plugins: [react(), tailwindcss(), hrIntakePlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
