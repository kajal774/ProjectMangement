// ProjectStatus mirrors the Java enum on the backend (ProjectStatus.java).
// Using a union of string literals instead of a TS `enum` keeps this a
// plain value you can compare with `===`, which matches how the JSON
// actually arrives from the API (as a string).
export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED";

export const PROJECT_STATUSES: ProjectStatus[] = [
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
];

// This is the DTO shape returned by GET /api/projects and
// GET /api/projects/{id} — i.e. ProjectResponse.java on the backend.
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string; // ISO date string, e.g. "2026-08-27T10:15:00Z"
}

// Shape sent to POST /api/projects and PUT /api/projects/{id}.
// Separate from `Project` because the request never includes
// server-generated fields like id/createdAt.
export interface ProjectInput {
  name: string;
  description: string;
  status: ProjectStatus;
}
