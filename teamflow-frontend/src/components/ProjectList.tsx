import type { Project } from "../types/project";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  isError: boolean;
}

// This component's one job: turn a list of projects (plus loading/error
// flags from useQuery) into the right UI. It doesn't fetch anything
// itself — that separation makes it easy to reuse and to test with
// fake data.
export function ProjectList({ projects, isLoading, isError }: ProjectListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-28 rounded-lg border border-line bg-white animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
        Couldn't load projects. Check that the backend is running and try
        refreshing the page.
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-10 rounded-lg border border-dashed border-line text-center text-ink/60">
        No projects yet. Create your first one to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
