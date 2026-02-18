export interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps = {}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center min-h-screen bg-gray-50"
    >
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border border-blue-300 border-t-blue-600"></div>
        </div>
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
}
