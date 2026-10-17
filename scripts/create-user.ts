import postgres from 'postgres';
import { hashPassword } from '../src/features/admin/password';
import { userSchema } from '../src/features/admin/user-schema';

// Membuat akun admin. Jalankan: bun run admin:create (DATABASE_URL dibaca dari .env oleh Bun).
// Password tidak ditampilkan saat diketik dan tidak disimpan di mana pun selain sebagai hash.

function readHidden(label: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(label);
    const stdin = process.stdin;
    if (!stdin.isTTY) {
      // Dijalankan lewat pipa (mis. otomasi): baca satu baris apa adanya.
      stdin.once('data', (chunk) => resolve(String(chunk).trim()));
      return;
    }
    stdin.setRawMode(true);
    stdin.resume();
    let value = '';
    stdin.on('data', function onData(chunk) {
      for (const char of String(chunk)) {
        if (char === '\r' || char === '\n') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off('data', onData);
          process.stdout.write('\n');
          resolve(value);
          return;
        }
        if (char === '\u0003') process.exit(1);
        if (char === '\u007f') value = value.slice(0, -1);
        else value += char;
      }
    });
  });
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL belum diisi di .env');
  process.exit(1);
}

const parsed = userSchema.safeParse({
  email: prompt('Email:') ?? '',
  username: prompt('Username:') ?? '',
  firstName: prompt('Nama depan:') ?? '',
  lastName: prompt('Nama belakang (boleh kosong):') || undefined,
  password: await readHidden('Password (min. 12 karakter): '),
});
if (!parsed.success) {
  for (const issue of parsed.error.issues)
    console.error(`- ${issue.path.join('.')}: ${issue.message}`);
  process.exit(1);
}

const { email, username, firstName, lastName, password } = parsed.data;
const sql = postgres(url, { prepare: false, max: 1 });
try {
  await sql`
    insert into users (email, username, first_name, last_name, password_hash)
    values (${email}, ${username}, ${firstName}, ${lastName ?? null}, ${await hashPassword(password)})`;
  console.log(`Akun "${username}" dibuat. Masuk di /admin/login.`);
} catch (error) {
  const code = (error as { code?: string }).code;
  console.error(code === '23505' ? 'Email atau username sudah dipakai.' : 'Gagal membuat akun.');
  process.exitCode = 1;
} finally {
  await sql.end();
}
