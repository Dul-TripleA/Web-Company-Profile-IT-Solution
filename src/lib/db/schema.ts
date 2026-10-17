import { sql } from 'drizzle-orm';
import { boolean, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Tabel ditambahkan per fitur (docs/DATABASE.md bagian 3), bersama migrasinya.

export const contactMessages = pgTable(
  'contact_messages',
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull(),
    phone: text(),
    service: text(),
    message: text().notNull(),
    handled: boolean().notNull().default(false),
    // SHA-256 dari IP + garam; hanya untuk rate limit, IP asli tidak disimpan.
    ipHash: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('contact_unhandled_idx')
      .on(t.createdAt.desc())
      .where(sql`${t.handled} = false`),
    index('contact_rate_limit_idx').on(t.ipHash, t.createdAt.desc()),
  ],
);
