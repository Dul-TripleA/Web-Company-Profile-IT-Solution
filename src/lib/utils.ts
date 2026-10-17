type ClassValue = string | false | null | undefined;

/** Menggabungkan nama kelas; nilai falsy dibuang. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
