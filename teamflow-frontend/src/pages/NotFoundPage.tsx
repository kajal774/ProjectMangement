import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-3xl mb-2">Page not found</h1>
      <p className="text-ink/60 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="text-brand hover:underline">
        Go home
      </Link>
    </div>
  );
}
