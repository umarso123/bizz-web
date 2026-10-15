/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOOK_CALL_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
