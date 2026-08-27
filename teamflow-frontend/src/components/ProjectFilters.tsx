import type { ProjectStatus } from "../types/project";
import { PROJECT_STATUSES } from "../types/project";

interface ProjectFiltersProps {
  activeStatus: ProjectStatus | undefined;
  onChange: (status: ProjectStatus | undefined) => void;
}

// Controlled component: it has no state of its own. The parent
// (ProjectsPage) owns `activeStatus` and passes down what's currently
// selected plus a callback for when the user picks a new one. This is
// the same "lift state up" pattern you'd use for any filter/tab UI.
export function ProjectFilters({ activeStatus, onChange }: ProjectFiltersProps) {
  const options: Array<{ label: string; value: ProjectStatus | undefined }> = [
    { label: "All", value: undefined },
    ...PROJECT_STATUSES.map((status) => ({
      label: status.replace("_", " "),
      value: status,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === activeStatus;
        return (
          <button
            key={option.label}
            onClick={() => onChange(option.value)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              isActive
                ? "bg-brand text-white border-brand"
                : "border-line text-ink/70 hover:border-brand"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
