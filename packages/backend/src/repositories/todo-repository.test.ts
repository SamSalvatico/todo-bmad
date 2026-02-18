import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TodoRepository } from './todo-repository';

describe('TodoRepository', () => {
  let db: Database.Database;
  let repository: TodoRepository;

  beforeEach(() => {
    db = new Database(':memory:');
    repository = new TodoRepository(db);
  });

  afterEach(() => {
    db.close();
  });

  it('creates todos with camelCase fields', () => {
    const todo = repository.create('Write tests');

    expect(todo.id).toBeTypeOf('number');
    expect(todo.text).toBe('Write tests');
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeTypeOf('string');
  });

  it('returns all todos ordered by created_at desc', () => {
    const insert = db.prepare('INSERT INTO todos (text, completed, created_at) VALUES (?, ?, ?)');

    insert.run('First', 0, '2026-02-16T08:00:00Z');
    insert.run('Second', 1, '2026-02-17T08:00:00Z');

    const todos = repository.getAll();

    expect(todos.map((todo) => todo.text)).toEqual(['Second', 'First']);
  });

  it('updates completion status and returns updated todo', () => {
    const todo = repository.create('Ship feature');

    const updated = repository.update(todo.id, true);

    expect(updated).not.toBeNull();
    expect(updated?.completed).toBe(true);
    expect(updated?.id).toBe(todo.id);
  });

  it('returns null when updating missing todo', () => {
    expect(repository.update(9999, true)).toBeNull();
  });

  it('deletes todos and reports success', () => {
    const todo = repository.create('Remove me');

    expect(repository.delete(todo.id)).toBe(true);
    expect(repository.delete(todo.id)).toBe(false);
  });

  it('rejects empty text on create', () => {
    expect(() => repository.create('')).toThrow('Text cannot be empty');
    expect(() => repository.create('   ')).toThrow('Text cannot be empty');
  });

  it('always uses database timestamp for created todo', () => {
    const todo = repository.create('Test timestamp');

    expect(todo.createdAt).toBeTypeOf('string');
    // Verify it matches SQLite format (ISO 8601)
    expect(new Date(todo.createdAt)).toBeInstanceOf(Date);
  });
});
