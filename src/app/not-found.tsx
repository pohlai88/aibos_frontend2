// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="text-6xl">🔍</div>
      <h1 className="text-2xl font-bold text-zinc-800">Page Not Found</h1>
      <p className="text-zinc-600 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a 
        href="/dashboard" 
        className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
