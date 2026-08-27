import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "../lib/validation";
import { register as registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const { user, token } = await registerUser(values);
      // Register immediately logs the user in — same as login, we
      // write straight to AuthContext rather than going through
      // React Query, since this is a one-off action, not cached data.
      setAuth(user, token);
      navigate("/projects");
    } catch (err) {
      setServerError("Could not create account. That email may already be in use.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-center mb-1">
          Create your account
        </h1>
        <p className="text-center text-sm text-ink/60 mb-6">
          Get started with TeamFlow
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...registerField("name")}
              className="w-full px-3 py-2 rounded-md border border-line focus:border-brand outline-none"
              placeholder="Ada Lovelace"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...registerField("email")}
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
              {...registerField("password")}
              className="w-full px-3 py-2 rounded-md border border-line focus:border-brand outline-none"
              placeholder="At least 8 characters"
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
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link to="/login" className="text-brand hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
