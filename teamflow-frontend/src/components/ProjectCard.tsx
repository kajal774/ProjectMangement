import { Link } from "react-router-dom";
import type { Project } from "../types/project";

// Maps each status to a badge color. A plain object lookup is easier
// to read (and extend later) than a chain of if/else or switch.
const STATUS_STYLES: Record<Project["status"], string> = {
  PLANNING: "bg-amber-100 text-amber-800",
  ACTIVE: "bg-brand-light text-brand-dark",
  ON_HOLD: "bg-gray-100 text-gray-700",
  COMPLETED: "bg-emerald-100 text-emerald-800",
};

// A single, focused component: given a project, render its card.
// It doesn't fetch data or know about routing logic beyond linking
// to its own detail page — that keeps it easy to reuse and test.
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block p-5 rounded-lg border border-line bg-white hover:border-brand transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg text-ink">{project.name}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[project.status]}`}
        >
          {project.status.replace("_", " ")}
        </span>
      </div>
      <p className="mt-2 text-sm text-ink/70 line-clamp-2">
        {project.description}
      </p>
    </Link>
  );
}
