import type { FastifyInstance } from 'fastify';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

describe('Config validation', () => {
  it('should load environment configuration', async () => {
    const app: FastifyInstance = await createApp();

    expect(app.config).toBeDefined();
    expect(app.config.PORT).toBeDefined();
    expect(app.config.HOST).toBeDefined();
    expect(app.config.NODE_ENV).toBeDefined();
    expect(app.config.DB_PATH).toBeDefined();
    expect(app.config.CORS_ORIGIN).toBeDefined();

    await app.close();
  });

  it('should use default values when env vars are not set', async () => {
    const app: FastifyInstance = await createApp();

    // These should have default values from schema
    expect(app.config.PORT).toBe(3000);
    expect(app.config.HOST).toBe('0.0.0.0');
    // NODE_ENV may be set by test runner, so just verify it's a string
    expect(typeof app.config.NODE_ENV).toBe('string');
    expect(app.config.DB_PATH).toBe('./data/todos.db');
    expect(app.config.CORS_ORIGIN).toBe('http://localhost:5173');

    await app.close();
  });

  it('should validate config types', async () => {
    const app: FastifyInstance = await createApp();

    expect(typeof app.config.PORT).toBe('number');
    expect(typeof app.config.HOST).toBe('string');
    expect(typeof app.config.NODE_ENV).toBe('string');
    expect(typeof app.config.DB_PATH).toBe('string');
    expect(typeof app.config.CORS_ORIGIN).toBe('string');

    await app.close();
  });
});
