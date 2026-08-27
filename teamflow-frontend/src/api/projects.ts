import { apiClient } from "./apiClient";
import type { Project, ProjectInput, ProjectStatus } from "../types/project";

// GET /api/projects, optionally filtered by status.
// Passing `undefined` as a query param makes axios omit it entirely,
// so getProjects() with no argument just returns everything.
export async function getProjects(status?: ProjectStatus): Promise<Project[]> {
  const response = await apiClient.get<Project[]>("/projects", {
    params: { status },
  });
  return response.data;
}

export async function getProject(id: string): Promise<Project> {
  const response = await apiClient.get<Project>(`/projects/${id}`);
  return response.data;
}

export async function createProject(data: ProjectInput): Promise<Project> {
  const response = await apiClient.post<Project>("/projects", data);
  return response.data;
}

export async function updateProject(
  id: string,
  data: ProjectInput
): Promise<Project> {
  const response = await apiClient.put<Project>(`/projects/${id}`, data);
  return response.data;
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}
