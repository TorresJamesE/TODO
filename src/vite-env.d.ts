/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly NOTES_API_BASE_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
