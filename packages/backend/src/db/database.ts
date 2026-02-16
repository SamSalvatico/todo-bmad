import Database from 'better-sqlite3';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
  const initSql = readFileSync(
    join(__dirname, 'init.sql'),
    'utf8'
  );
  
  db.exec(initSql);
  
  return db;
}
