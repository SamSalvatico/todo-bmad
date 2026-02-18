export interface EmptyStateProps {
  // No required props - static message
}

export function EmptyState({}: EmptyStateProps = {}) {
  return (
    <div
      role="status"
      className="flex items-center justify-center min-h-screen bg-gray-50"
    >
      <div className="text-center px-6 py-8 max-w-md">
        <div className="mb-4 text-4xl">📝</div>
        <p className="text-gray-600 text-lg">No todos yet. Add one to get started!</p>
      </div>
    </div>
  );
}
