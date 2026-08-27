import { Link, useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

// One shared header + content wrapper for every authenticated page.
// Keeping this separate from individual pages means the nav only has
// to be built once.
export function Layout({ children }: { children: ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-line bg-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl text-brand-dark">
            TeamFlow
          </Link>
          {isAuthenticated && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-ink/70">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md border border-line hover:bg-brand-light transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
