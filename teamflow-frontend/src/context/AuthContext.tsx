import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "../types/auth";

// Why a Context here and not just React Query?
// The logged-in user isn't "server state" we refetch — it's local
// session state derived from the JWT we already have. Context is the
// right tool for "many components need this same small piece of
// state" (Navbar shows the user's name, ProtectedRoute checks if
// there's a user at all, etc).

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "teamflow_token";
const USER_KEY = "teamflow_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage so a page refresh doesn't log the
  // user out. This runs once, on first render, via useState's
  // lazy initializer form.
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  function setAuth(newUser: User, newToken: string) {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  }

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token),
    setAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook so components do `useAuth()` instead of
// `useContext(AuthContext)` everywhere, and get a helpful error
// instead of `undefined` if someone forgets the provider.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
