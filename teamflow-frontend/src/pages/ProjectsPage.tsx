import { useState } from "react";
import { Layout } from "../components/Layout";
import { ProjectList } from "../components/ProjectList";
import { ProjectFilters } from "../components/ProjectFilters";
import { ProjectForm } from "../components/ProjectForm";
import { useProjectsList, useCreateProject } from "../hooks/useProjects";
import type { ProjectStatus } from "../types/project";
import type { ProjectFormValues } from "../lib/validation";

// Data flow on this page, end to end:
//
// User clicks a filter chip
//   -> setStatusFilter updates local state
//   -> useProjectsList(status) re-runs with the new query key
//   -> React Query either serves a cached result instantly or
//      fetches GET /api/projects?status=... from Spring Boot
//   -> ProjectList renders loading / error / data based on the hook's flags
//
// User submits the "new project" form
//   -> useCreateProject().mutate(values) sends POST /api/projects
//   -> on success, the mutation invalidates the "projects" query key
//   -> useProjectsList automatically refetches, so the new project
//      appears without any manual state updates on this page
export function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: projects, isLoading, isError } = useProjectsList(statusFilter);
  const createProject = useCreateProject();

  function handleCreate(values: ProjectFormValues) {
    createProject.mutate(values, {
      onSuccess: () => setIsFormOpen(false),
    });
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Projects</h1>
        <button
          onClick={() => setIsFormOpen((open) => !open)}
          className="px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-dark transition-colors text-sm"
        >
          {isFormOpen ? "Cancel" : "New project"}
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-8 p-5 rounded-lg border border-line bg-white">
          <ProjectForm
            onSubmit={handleCreate}
            isSubmitting={createProject.isPending}
            submitLabel="Create project"
          />
          {createProject.isError && (
            <p className="mt-3 text-sm text-red-600">
              Couldn't create the project. Please try again.
            </p>
          )}
        </div>
      )}

      <div className="mb-5">
        <ProjectFilters activeStatus={statusFilter} onChange={setStatusFilter} />
      </div>

      <ProjectList
        projects={projects ?? []}
        isLoading={isLoading}
        isError={isError}
      />
    </Layout>
  );
}
