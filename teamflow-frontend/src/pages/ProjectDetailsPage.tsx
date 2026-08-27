import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { ProjectForm } from "../components/ProjectForm";
import {
  useProjectDetail,
  useUpdateProject,
  useDeleteProject,
} from "../hooks/useProjects";
import type { ProjectFormValues } from "../lib/validation";

export function ProjectDetailsPage() {
  // useParams reads the `:id` segment from the route path
  // (see App.tsx: <Route path="/projects/:id" ... />).
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const { data: project, isLoading, isError } = useProjectDetail(id!);
  const updateProject = useUpdateProject(id!);
  const deleteProject = useDeleteProject();

  function handleUpdate(values: ProjectFormValues) {
    updateProject.mutate(values, {
      onSuccess: () => setIsEditing(false),
    });
  }

  function handleDelete() {
    if (!id) return;
    const confirmed = window.confirm(
      "Delete this project? This cannot be undone."
    );
    if (!confirmed) return;

    deleteProject.mutate(id, {
      onSuccess: () => navigate("/projects"),
    });
  }

  if (isLoading) {
    return (
      <Layout>
        <p className="text-ink/60">Loading project…</p>
      </Layout>
    );
  }

  if (isError || !project) {
    return (
      <Layout>
        <div className="p-6 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          Couldn't find that project.
        </div>
        <Link to="/projects" className="mt-4 inline-block text-brand hover:underline">
          Back to projects
        </Link>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link to="/projects" className="text-sm text-brand hover:underline">
        ← Back to projects
      </Link>

      {isEditing ? (
        <div className="mt-4 p-5 rounded-lg border border-line bg-white">
          <ProjectForm
            defaultValues={{
              name: project.name,
              description: project.description,
              status: project.status,
            }}
            onSubmit={handleUpdate}
            isSubmitting={updateProject.isPending}
            submitLabel="Save changes"
          />
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-2xl">{project.name}</h1>
            <span className="text-xs px-2 py-1 rounded-full bg-brand-light text-brand-dark whitespace-nowrap">
              {project.status.replace("_", " ")}
            </span>
          </div>
          <p className="mt-3 text-ink/80 whitespace-pre-wrap">
            {project.description}
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-md border border-line hover:bg-brand-light transition-colors text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteProject.isPending}
              className="px-4 py-2 rounded-md border border-red-200 text-red-700 hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
            >
              {deleteProject.isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
