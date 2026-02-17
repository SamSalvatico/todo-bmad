import type { Todo, CreateTodoRequest, ApiResult } from './types/todo';

/**
 * Centralized error extraction from HTTP responses
 */
async function extractError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (body.message) {
      return body.message;
    }
  } catch {
    // JSON parsing failed, fall through to statusText
  }

  return response.statusText || 'Unexpected response from server.';
}

async function parseJson<T>(response: Response): Promise<ApiResult<T>> {
  try {
    const data = (await response.json()) as T;
    return { data, error: null };
  } catch {
    return { data: null, error: 'Unexpected response from server.' };
  }
}

/**
 * GET /api/todos - Fetch all todos
 */
export async function getTodos(): Promise<ApiResult<Todo[]>> {
  let response: Response;
  try {
    response = await fetch('/api/todos');
  } catch {
    return { data: null, error: 'Network error. Please try again.' };
  }

  if (!response.ok) {
    return { data: null, error: await extractError(response) };
  }

  return await parseJson<Todo[]>(response);
}

/**
 * POST /api/todos - Create a new todo
 */
export async function createTodo(text: string): Promise<ApiResult<Todo>> {
  let response: Response;
  try {
    response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text } as CreateTodoRequest),
    });
  } catch {
    return { data: null, error: 'Network error. Please try again.' };
  }

  if (!response.ok) {
    return { data: null, error: await extractError(response) };
  }

  return await parseJson<Todo>(response);
}

/**
 * PATCH /api/todos/:id - Update todo completion status
 */
export async function updateTodo(id: number, completed: boolean): Promise<ApiResult<Todo>> {
  let response: Response;
  try {
    response = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
  } catch {
    return { data: null, error: 'Network error. Please try again.' };
  }

  if (!response.ok) {
    return { data: null, error: await extractError(response) };
  }

  return await parseJson<Todo>(response);
}

/**
 * DELETE /api/todos/:id - Delete a todo
 */
export async function deleteTodo(id: number): Promise<ApiResult<null>> {
  let response: Response;
  try {
    response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
  } catch {
    return { data: null, error: 'Network error. Please try again.' };
  }

  if (!response.ok) {
    return { data: null, error: await extractError(response) };
  }

  // 204 No Content - successful deletion
  return { data: null, error: null };
}
