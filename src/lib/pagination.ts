export type PageItem = number | 'ellipsis';

/** Nomor halaman yang ditampilkan: awal, akhir, dan sekitar halaman aktif; sisanya diringkas. */
export function getPageWindow(current: number, total: number, siblings = 1): PageItem[] {
  if (total <= 1) return [];
  const keep = new Set<number>([1, total]);
  for (let page = current - siblings; page <= current + siblings; page += 1) {
    if (page >= 1 && page <= total) keep.add(page);
  }
  const sorted = [...keep].sort((a, b) => a - b);
  const items: PageItem[] = [];
  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined) {
      if (page - previous === 2) items.push(previous + 1);
      else if (page - previous > 2) items.push('ellipsis');
    }
    items.push(page);
  });
  return items;
}

/** Nomor halaman dari URL (`/blog/page/2`): bilangan bulat positif tanpa nol di depan, atau null. */
export function parsePageParam(value: string): number | null {
  return /^[1-9]\d{0,3}$/.test(value) ? Number(value) : null;
}
