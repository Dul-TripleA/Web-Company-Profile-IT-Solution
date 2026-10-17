/** Hasil Server Action form admin. Teks galat langsung berbahasa Indonesia (admin tidak dua bahasa). */
export type AdminFormState = {
  saved?: boolean;
  message?: string;
  fieldErrors: Record<string, string>;
  values?: Record<string, string>;
};

export const initialAdminFormState: AdminFormState = { fieldErrors: {} };
