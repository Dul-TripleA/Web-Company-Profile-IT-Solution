export const CONTACT_FIELDS = ['name', 'email', 'phone', 'service', 'message'] as const;

/** Maksimal pesan per IP dalam jendela waktu di bawah. */
export const RATE_LIMIT_MAX_MESSAGES = 3;
export const RATE_LIMIT_WINDOW_MINUTES = 10;
