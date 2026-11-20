// Vite loads vite.config.js before vite.config.ts. Keep one source of truth:
// all configuration lives in vite.config.ts (Vite bundles the config, so this import works).
export { default } from './vite.config.ts'
