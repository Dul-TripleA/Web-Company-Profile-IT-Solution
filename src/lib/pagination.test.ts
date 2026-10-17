import { describe, expect, it } from 'vitest';
import { getPageWindow, parsePageParam } from './pagination';

describe('getPageWindow', () => {
  it('kosong bila hanya satu halaman atau kurang', () => {
    expect(getPageWindow(1, 1)).toEqual([]);
    expect(getPageWindow(1, 0)).toEqual([]);
  });

  it('menampilkan semua nomor bila sedikit', () => {
    expect(getPageWindow(2, 3)).toEqual([1, 2, 3]);
    expect(getPageWindow(1, 4)).toEqual([1, 2, 3, 4]);
  });

  it('meringkas nomor yang jauh dengan ellipsis', () => {
    expect(getPageWindow(1, 10)).toEqual([1, 2, 'ellipsis', 10]);
    expect(getPageWindow(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
    expect(getPageWindow(10, 10)).toEqual([1, 'ellipsis', 9, 10]);
  });

  it('celah satu nomor diisi nomornya, bukan ellipsis', () => {
    expect(getPageWindow(4, 6)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe('parsePageParam', () => {
  it('menerima bilangan bulat positif', () => {
    expect(parsePageParam('2')).toBe(2);
    expect(parsePageParam('1234')).toBe(1234);
  });

  it('menolak nol, negatif, desimal, nol di depan, kosong, dan teks', () => {
    for (const bad of ['0', '-1', '1.5', '02', '', 'abc', '1e3', ' 2', '12345']) {
      expect(parsePageParam(bad), bad).toBeNull();
    }
  });
});
