// src/components/ui/ErrorBanner.tsx

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  type?: 'error' | 'warning';
}

export function ErrorBanner({ 
  title = 'Something went wrong', 
  message, 
  onRetry, 
  type = 'error' 
}: ErrorBannerProps) {
  const baseClasses = "rounded-lg p-4 border";
  const typeClasses = type === 'error' 
    ? "bg-red-50 border-red-200 text-red-800" 
    : "bg-yellow-50 border-yellow-200 text-yellow-800";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {type === 'error' ? (
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">{title}</h3>
            <div className="mt-1 text-sm">
              {message}
            </div>
          </div>
        </div>
        {onRetry && (
          <div className="flex-shrink-0">
            <button
              onClick={onRetry}
              className={`text-sm font-medium ${
                type === 'error'
                  ? 'text-red-800 hover:text-red-900'
                  : 'text-yellow-800 hover:text-yellow-900'
              }`}
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function InlineError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading data</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
