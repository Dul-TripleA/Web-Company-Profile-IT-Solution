import { connect, insertFixtures } from './blog-fixtures';

// Tes blog butuh database. Tanpa DATABASE_URL (mis. di CI) fixture tidak dibuat dan tes blog dilewati.
export default async function globalSetup() {
  const sql = connect();
  if (!sql) {
    console.log('E2E blog: DATABASE_URL tidak tersedia, tes blog dilewati.');
    return;
  }
  try {
    await insertFixtures(sql);
  } finally {
    await sql.end();
  }
}
