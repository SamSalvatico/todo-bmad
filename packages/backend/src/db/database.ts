import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Initialize SQLite database and create tables
 * @param dbPath - Path to SQLite database file
 * @returns Database instance
 */
export function initializeDatabase(dbPath: string): Database.Database {
  // Ensure parent directory exists
  const dbDir = dirname(dbPath);
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(dbPath);

  // Load and execute init.sql
  const initSql = readFileSync(join(__dirname, 'init.sql'), 'utf8');

  db.exec(initSql);

  return db;
}
