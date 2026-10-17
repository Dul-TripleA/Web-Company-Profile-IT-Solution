import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('menggabungkan kelas dengan spasi', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('membuang nilai falsy', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('mendukung kelas bersyarat', () => {
    const isActive = true;
    expect(cn('base', isActive && 'active')).toBe('base active');
  });
});
