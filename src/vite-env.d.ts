interface ImportMetaEnv {
  readonly VITE_COMPANY_PHONE: string;
  readonly VITE_COMPANY_EMAIL: string;
  readonly VITE_COMPANY_ADDRESS: string;
  readonly VITE_COMPANY_WEBSITE: string;
  readonly VITE_COMPANY_CONSULTOR_CONTACT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
