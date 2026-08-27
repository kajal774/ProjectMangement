import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

// Wrap any page element with this to require login.
// Example usage in App.tsx:
//   <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
//
// If there's no token, we redirect to /login instead of rendering the
// page (and instead of letting a failed API call surface the problem
// later — this catches it at the routing level).
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
