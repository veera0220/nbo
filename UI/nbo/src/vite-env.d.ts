/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
}

// Ensure ImportMeta has env property
interface ImportMeta {
  readonly env: ImportMetaEnv
}

