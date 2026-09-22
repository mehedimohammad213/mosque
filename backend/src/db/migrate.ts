import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool, query, getClient } from '../config/db';

const migrationsDir = path.join(__dirname, '../../sql/migrations');

async function ensureMigrationsTable(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id          SERIAL PRIMARY KEY,
      filename    VARCHAR(255) NOT NULL UNIQUE,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const result = await query<{ filename: string }>(
    'SELECT filename FROM schema_migrations ORDER BY filename'
  );
  return new Set(result.rows.map((row) => row.filename));
}

async function applyMigration(filename: string): Promise<void> {
  const filePath = path.join(migrationsDir, filename);
  const sql = fs.readFileSync(filePath, 'utf8');
  const client = await getClient();

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query(
      'INSERT INTO schema_migrations (filename) VALUES ($1)',
      [filename]
    );
    await client.query('COMMIT');
    console.log(`Applied: ${filename}`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function migrate(): Promise<void> {
  try {
    await ensureMigrationsTable();
    const applied = await getAppliedMigrations();
    const files = fs
      .readdirSync(migrationsDir)
      .filter((name) => name.endsWith('.sql'))
      .sort();

    let count = 0;
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skip (already applied): ${file}`);
        continue;
      }
      await applyMigration(file);
      count += 1;
    }

    if (count === 0) {
      console.log('No new migrations to apply.');
    } else {
      console.log(`Done. Applied ${count} migration(s).`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Migration failed:', message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
