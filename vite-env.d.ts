interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_GEMINI_API_KEY?: string;
  // Add more VITE_ environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
