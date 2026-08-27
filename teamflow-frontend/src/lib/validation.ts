import { z } from "zod";

// Zod schemas describe the *shape and rules* of form data. React Hook
// Form uses these (via @hookform/resolvers/zod) to validate on submit
// and show error messages — we never hand-write if/else validation.

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"]),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;
