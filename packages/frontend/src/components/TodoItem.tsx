import type { FC } from 'react';
import type { Todo } from '../types/todo';

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete "${todo.text}"?`)) {
      onDelete(todo.id);
    }
  };

  return (
    <li className="flex items-center gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 last:border-b-0">
      <div className="flex items-center justify-center p-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Toggle todo: ${todo.text}`}
          className="w-5 h-5 text-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
      </div>
      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
        {todo.text}
      </span>
      <button
        type="button"
        onClick={handleDelete}
        aria-label={`Delete todo: ${todo.text}`}
        className="px-4 py-3 min-h-11 text-sm text-red-500 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Delete
      </button>
    </li>
  );
};
