import { FC } from 'react';
import { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoList: FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-gray-500 text-center">No todos yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <ul
      className="space-y-0 border border-gray-200 rounded-lg overflow-hidden shadow-sm"
      aria-label="Todo list"
    >
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
};
