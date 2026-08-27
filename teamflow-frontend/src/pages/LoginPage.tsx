import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../lib/validation";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";

// Auth pages don't use React Query (useMutation) for the login call
// itself, on purpose: login isn't "server state" we want cached or
// invalidated later, it's a one-off action whose result (the token)
// needs to go straight into AuthContext. Plain async/await with
// useState for the loading/error flags is simpler here and easier to
// follow than wrapping it in a mutation.
export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const { user, token } = await login(values);
      setAuth(user, token);
      navigate("/projects");
    } catch (err) {
      setServerError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-center mb-1">
          Welcome back
        </h1>
        <p className="text-center text-sm text-ink/60 mb-6">
          Log in to TeamFlow
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 rounded-md border border-line focus:border-brand outline-none"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 rounded-md border border-line focus:border-brand outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-600" role="alert">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          No account?{" "}
          <Link to="/register" className="text-brand hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
