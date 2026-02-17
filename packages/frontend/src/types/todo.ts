export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTodoRequest {
  text: string;
}

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}
