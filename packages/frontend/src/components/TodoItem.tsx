import { FC } from 'react';
import { Todo } from '../types/todo';

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
    <li className="flex items-center gap-3 p-3 border-b border-gray-200 hover:bg-gray-50 last:border-b-0">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
      />
      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
        {todo.text}
      </span>
      <button
        onClick={handleDelete}
        aria-label={`Delete ${todo.text}`}
        className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Delete
      </button>
    </li>
  );
};
