import { connect, removeFixtures } from './blog-fixtures';

export default async function globalTeardown() {
  const sql = connect();
  if (!sql) return;
  try {
    await removeFixtures(sql);
  } finally {
    await sql.end();
  }
}
