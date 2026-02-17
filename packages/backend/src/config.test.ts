import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from './app.js';

const originalEnv = { ...process.env };

const resetEnv = () => {
  for (const key of Object.keys(process.env)) {
    delete process.env[key];
  }
  Object.assign(process.env, originalEnv);
};

const createAppWithTempDb = async () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'todo-bmad-test-'));
  const dbPath = join(tempDir, 'todos.db');
  process.env.DB_PATH = dbPath;

  const app = await createApp();

  return {
    app,
    dbPath,
    cleanup: () => {
      rmSync(tempDir, { recursive: true, force: true });
    },
  };
};

beforeEach(() => {
  resetEnv();
});

afterEach(() => {
  resetEnv();
});

describe('Config validation', () => {
  it('should load environment configuration', async () => {
    const { app, cleanup } = await createAppWithTempDb();

    expect(app.config).toBeDefined();
    expect(app.config.PORT).toBeDefined();
    expect(app.config.HOST).toBeDefined();
    expect(app.config.NODE_ENV).toBeDefined();
    expect(app.config.DB_PATH).toBeDefined();
    expect(app.config.CORS_ORIGIN).toBeDefined();

    await app.close();
    cleanup();
  });

  it('should use default values when env vars are not set', async () => {
    const { app, cleanup, dbPath } = await createAppWithTempDb();

    // These should have default values from schema
    expect(app.config.PORT).toBe(3000);
    expect(app.config.HOST).toBe('0.0.0.0');
    // NODE_ENV may be set by test runner, so just verify it's a string
    expect(typeof app.config.NODE_ENV).toBe('string');
    expect(app.config.DB_PATH).toBe(dbPath);
    expect(app.config.CORS_ORIGIN).toBe('http://localhost:5173');

    await app.close();
    cleanup();
  });

  it('should validate config types', async () => {
    const { app, cleanup } = await createAppWithTempDb();

    expect(typeof app.config.PORT).toBe('number');
    expect(typeof app.config.HOST).toBe('string');
    expect(typeof app.config.NODE_ENV).toBe('string');
    expect(typeof app.config.DB_PATH).toBe('string');
    expect(typeof app.config.CORS_ORIGIN).toBe('string');

    await app.close();
    cleanup();
  });

  it('should reject invalid environment values', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'todo-bmad-test-'));
    process.env.DB_PATH = join(tempDir, 'todos.db');
    process.env.PORT = 'not-a-number';

    await expect(createApp()).rejects.toThrow();

    rmSync(tempDir, { recursive: true, force: true });
  });
});
