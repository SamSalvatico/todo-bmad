import { forwardRef } from 'react';

export interface TodoInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  submitLabel?: string;
}

export const TodoInput = forwardRef<HTMLInputElement, TodoInputProps>(
  ({ value, onChange, onSubmit, disabled, submitLabel = 'Add' }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && value.trim()) {
        onSubmit();
      }
    };

    const handleSubmitClick = () => {
      if (value.trim()) {
        onSubmit();
      }
    };

    return (
      <div className="flex gap-2 mb-4">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          disabled={disabled}
          autoComplete="off"
          enterKeyHint="done"
          aria-label="Add new todo"
          className="flex-1 px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSubmitClick}
          disabled={disabled || !value.trim()}
          className="px-4 py-3 min-h-11 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {submitLabel}
        </button>
      </div>
    );
  }
);

TodoInput.displayName = 'TodoInput';
