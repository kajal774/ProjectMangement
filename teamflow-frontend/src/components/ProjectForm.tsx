import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormValues } from "../lib/validation";
import { PROJECT_STATUSES } from "../types/project";

interface ProjectFormProps {
  defaultValues?: ProjectFormValues;
  onSubmit: (values: ProjectFormValues) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

// Used for both "create project" and "edit project" — the only
// difference between those two cases is what defaultValues and
// onSubmit the parent page passes in. The form itself doesn't know
// or care whether it's creating or editing.
//
// Flow: user types -> React Hook Form tracks the values internally
// (uncontrolled inputs via `register`) -> on submit, Zod validates
// against projectSchema -> if valid, onSubmit(values) is called with
// clean, typed data. If invalid, `errors` is populated and nothing
// is submitted.
export function ProjectForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      status: "PLANNING",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Project name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full px-3 py-2 rounded-md border border-line focus:border-brand outline-none"
          placeholder="Website redesign"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className="w-full px-3 py-2 rounded-md border border-line focus:border-brand outline-none"
          placeholder="What is this project about?"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className="w-full px-3 py-2 rounded-md border border-line focus:border-brand outline-none bg-white"
        >
          {PROJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-dark transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
