import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { createApp } from '../app';

describe('Todo routes', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeEach(async () => {
    process.env.PORT = '3000';
    process.env.HOST = '0.0.0.0';
    process.env.NODE_ENV = 'development';
    process.env.DB_PATH = ':memory:';
    process.env.CORS_ORIGIN = 'http://localhost:5173';

    app = await createApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns an empty list initially', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/todos' });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual([]);
  });

  it('creates a todo and returns it', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: { text: 'Test todo' },
    });

    expect(createResponse.statusCode).toBe(201);
    const created = JSON.parse(createResponse.payload) as {
      id: number;
      text: string;
      completed: boolean;
    };
    expect(created.text).toBe('Test todo');
    expect(created.completed).toBe(false);
    expect(typeof created.id).toBe('number');

    const listResponse = await app.inject({ method: 'GET', url: '/api/todos' });
    const list = JSON.parse(listResponse.payload) as Array<{ id: number }>;
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(created.id);
  });

  it('updates completed state', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: { text: 'Toggle me' },
    });
    const created = JSON.parse(createResponse.payload) as { id: number };

    const patchResponse = await app.inject({
      method: 'PATCH',
      url: `/api/todos/${created.id}`,
      payload: { completed: true },
    });

    expect(patchResponse.statusCode).toBe(200);
    const updated = JSON.parse(patchResponse.payload) as { completed: boolean };
    expect(updated.completed).toBe(true);
  });

  it('returns 404 for missing todo on update', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/todos/999',
      payload: { completed: true },
    });

    expect(response.statusCode).toBe(404);
    const errorBody = JSON.parse(response.payload) as { statusCode: number; error: string };
    expect(errorBody.statusCode).toBe(404);
    expect(errorBody.error).toBe('Not Found');
  });

  it('returns 404 for invalid todo id on update', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/todos/invalid-id',
      payload: { completed: true },
    });

    expect(response.statusCode).toBe(404);
    const errorBody = JSON.parse(response.payload) as { statusCode: number; error: string };
    expect(errorBody.statusCode).toBe(404);
    expect(errorBody.error).toBe('Not Found');
  });

  it('deletes a todo', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: { text: 'Delete me' },
    });
    const created = JSON.parse(createResponse.payload) as { id: number };

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/api/todos/${created.id}`,
    });

    expect(deleteResponse.statusCode).toBe(204);
    expect(deleteResponse.payload).toBe('');

    const listResponse = await app.inject({ method: 'GET', url: '/api/todos' });
    const list = JSON.parse(listResponse.payload) as Array<{ id: number }>;
    expect(list).toHaveLength(0);
  });

  it('returns 404 for missing todo on delete', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/api/todos/999',
    });

    expect(response.statusCode).toBe(404);
    const errorBody = JSON.parse(response.payload) as { statusCode: number; error: string };
    expect(errorBody.statusCode).toBe(404);
    expect(errorBody.error).toBe('Not Found');
  });

  it('returns 404 for invalid todo id on delete', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/api/todos/invalid-id',
    });

    expect(response.statusCode).toBe(404);
    const errorBody = JSON.parse(response.payload) as { statusCode: number; error: string };
    expect(errorBody.statusCode).toBe(404);
    expect(errorBody.error).toBe('Not Found');
  });

  it('validates missing text on create', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    const errorBody = JSON.parse(response.payload) as {
      statusCode: number;
      error: string;
      message: string;
    };
    expect(errorBody.statusCode).toBe(400);
    expect(errorBody.error).toBe('Bad Request');
    expect(typeof errorBody.message).toBe('string');
  });

  it('validates text length on create', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: { text: 'a'.repeat(501) },
    });

    expect(response.statusCode).toBe(400);
  });

  it('sanitizes html input', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: { text: '<script>alert("x")</script>' },
    });

    expect(response.statusCode).toBe(201);
    const created = JSON.parse(response.payload) as { text: string };
    expect(created.text).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  });
});
