// Akun admin KHUSUS tes E2E. Dibuat oleh global-setup dan dihapus oleh global-teardown;
// tidak terkait akun sungguhan.
export const E2E_ADMIN = {
  email: 'zz-e2e-admin@example.test',
  username: 'zz_e2e_admin',
  firstName: 'Penguji',
  password: 'e2e-password-bukan-rahasia',
} as const;
