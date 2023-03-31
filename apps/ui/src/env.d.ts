/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOMOLOGY_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
