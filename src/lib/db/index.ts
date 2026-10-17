import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getEnv } from '@/lib/env';
import * as schema from './schema';

type Db = ReturnType<typeof createDb>;

const globalForDb = globalThis as unknown as { db?: Db };

function createDb() {
  const env = getEnv();
  // prepare: false wajib di belakang PgBouncer mode transaksi (endpoint pooled Neon).
  const client = postgres(env.DATABASE_URL, { prepare: false, max: 10 });
  return drizzle(client, { schema, casing: 'snake_case' });
}

// Dibuat saat pertama dipakai; di dev disimpan di globalThis agar hot reload tidak
// membuka koneksi baru terus-menerus.
export function getDb(): Db {
  if (globalForDb.db) return globalForDb.db;
  const db = createDb();
  if (getEnv().NODE_ENV !== 'production') globalForDb.db = db;
  return db;
}
