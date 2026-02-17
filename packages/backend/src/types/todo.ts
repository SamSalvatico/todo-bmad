export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTodoRequest {
  text: string;
}

export interface UpdateTodoRequest {
  completed: boolean;
}
