import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projects";
import type { ProjectInput, ProjectStatus } from "../types/project";

// --- Query keys -------------------------------------------------------
// React Query caches data by "query key". Using a small helper object
// keeps keys consistent everywhere instead of hand-typing arrays and
// risking typos that would silently create a second, disconnected
// cache entry.
export const projectKeys = {
  all: ["projects"] as const,
  list: (status?: ProjectStatus) => [...projectKeys.all, { status }] as const,
  detail: (id: string) => [...projectKeys.all, id] as const,
};

// --- Reads --------------------------------------------------------------

// useQuery handles loading/error/caching for us. Any component that
// calls useProjectsList(status) with the same status shares one
// cached result — no duplicate network requests.
export function useProjectsList(status?: ProjectStatus) {
  return useQuery({
    queryKey: projectKeys.list(status),
    queryFn: () => getProjects(status),
  });
}

export function useProjectDetail(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject(id),
    enabled: Boolean(id), // don't fire the request if id is empty
  });
}

// --- Writes ---------------------------------------------------------
// useMutation is for anything that changes server data (POST/PUT/DELETE).
// After a mutation succeeds, we tell React Query the cached project
// list is out of date via invalidateQueries — that triggers an
// automatic refetch so the UI reflects the change without a manual
// reload or optimistic-update bookkeeping.

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectInput) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectInput) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
