/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REPO_OWNER?: string;
  readonly VITE_REPO_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
