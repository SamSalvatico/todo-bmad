import type { Todo, CreateTodoRequest, ApiResult } from './types/todo';

/**
 * Normalize error messages by status code for user-friendly display.
 * AC 3-7: Map HTTP errors to friendly messages.
 */
function normalizeErrorByStatus(status: number, message: string, method: string): string {
  // AC 4: Backend unavailability (5xx)
  if (status >= 500) {
    return 'Server is unavailable. Please try again later.';
  }

  // AC 6: 404 on update/delete operations
  if (status === 404 && (method === 'PATCH' || method === 'DELETE')) {
    return 'Todo not found. It may have been deleted.';
  }

  // AC 5: Validation errors (400) - preserve backend message with special handling for empty text
  if (status === 400) {
    if (!message.trim()) {
      return 'Something went wrong. Please try again.';
    }
    // Normalize empty-text validation messages to consistent format
    const lowerMessage = message.toLowerCase();
    if (
      lowerMessage.includes('must not be empty') ||
      lowerMessage.includes('is required') ||
      lowerMessage.includes('cannot be empty')
    ) {
      return 'text must not be empty';
    }
    // Otherwise preserve backend validation message
    return message;
  }

  // AC 7: Unexpected errors - generic message for all other cases
  return 'Something went wrong. Please try again.';
}

/**
 * Centralized error extraction from HTTP responses
 */
async function extractError(response: Response, method: string): Promise<string> {
  let backendMessage = '';
  
  try {
    const body = await response.json();
    if (body.message) {
      backendMessage = body.message;
    }
  } catch {
    // JSON parsing failed, will use statusText or fallback
  }

  // If we have a backend message, use it for normalization; otherwise use statusText
  const rawMessage = backendMessage || (response.status === 400 ? '' : response.statusText) || '';
  
  // Normalize by status code
  return normalizeErrorByStatus(response.status, rawMessage, method);
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
    return { data: null, error: await extractError(response, 'GET') };
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
    return { data: null, error: await extractError(response, 'POST') };
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
    return { data: null, error: await extractError(response, 'PATCH') };
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
    return { data: null, error: await extractError(response, 'DELETE') };
  }

  // 204 No Content - successful deletion
  return { data: null, error: null };
}
