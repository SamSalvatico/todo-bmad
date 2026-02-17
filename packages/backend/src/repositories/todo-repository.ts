import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type Database from 'better-sqlite3';
import type { Todo } from '../types/todo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type DbTodoRow = {
  id: number;
  text: string;
  completed: number;
  created_at: string;
};

const mapTodoRow = (row: DbTodoRow): Todo => ({
  id: row.id,
  text: row.text,
  completed: row.completed === 1,
  createdAt: row.created_at,
});

export class TodoRepository {
  constructor(private readonly db: Database.Database) {
    const initSql = readFileSync(join(__dirname, '../db/init.sql'), 'utf8');
    this.db.exec(initSql);
  }

  create(text: string): Todo {
    const insert = this.db.prepare('INSERT INTO todos (text, completed) VALUES (?, 0)');
    const result = insert.run(text);
    const row = this.db
      .prepare('SELECT id, text, completed, created_at FROM todos WHERE id = ?')
      .get(Number(result.lastInsertRowid)) as DbTodoRow | undefined;

    if (!row) {
      return {
        id: Number(result.lastInsertRowid),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      };
    }

    return mapTodoRow(row);
  }

  getAll(): Todo[] {
    const rows = this.db
      .prepare('SELECT id, text, completed, created_at FROM todos ORDER BY created_at DESC')
      .all() as DbTodoRow[];

    return rows.map(mapTodoRow);
  }

  update(id: number, completed: boolean): Todo | null {
    const result = this.db
      .prepare('UPDATE todos SET completed = ? WHERE id = ?')
      .run(completed ? 1 : 0, id);

    if (result.changes === 0) {
      return null;
    }

    const row = this.db
      .prepare('SELECT id, text, completed, created_at FROM todos WHERE id = ?')
      .get(id) as DbTodoRow | undefined;

    return row ? mapTodoRow(row) : null;
  }

  delete(id: number): boolean {
    const result = this.db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
