import { PILL } from './ui';

export type PostState = 'published' | 'scheduled' | 'draft';

export function postState(status: string, publishedAt: Date | null, now = Date.now()): PostState {
  if (status === 'DRAFT') return 'draft';
  return publishedAt && publishedAt.getTime() > now ? 'scheduled' : 'published';
}

const POST_STYLES: Record<PostState, { label: string; className: string }> = {
  published: { label: 'Terbit', className: 'bg-green-100 text-green-900' },
  scheduled: { label: 'Terjadwal', className: 'bg-amber-100 text-amber-900' },
  draft: { label: 'Draft', className: 'bg-slate-200 text-slate-800' },
};

export function PostStatusPill({ state }: { state: PostState }) {
  const style = POST_STYLES[state];
  return <span className={`${PILL} ${style.className}`}>{style.label}</span>;
}

export function MessageStatusPill({ handled }: { handled: boolean }) {
  return handled ? (
    <span className={`${PILL} bg-slate-200 text-slate-800`}>Sudah ditangani</span>
  ) : (
    <span className={`${PILL} bg-orange-100 text-orange-900`}>Belum ditangani</span>
  );
}
