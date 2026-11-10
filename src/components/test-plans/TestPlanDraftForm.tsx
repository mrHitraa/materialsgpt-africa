import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ErrorState } from "@/components/common/states";
import { supabase } from "@/integrations/supabase/client";
import { friendlyDbError, materialsQuery } from "@/lib/data/queries";
import { fieldErrors } from "@/lib/data/schemas";
import { testPlanDraftSchema } from "@/lib/data/test-plan-schemas";
import { projectContext } from "@/lib/project-context";

const fields = [
  {
    name: "candidate_materials",
    label: "Research scope materials *",
    rows: 2,
    defaultValue: "",
  },
  {
    name: "salt_composition",
    label: "Project salt composition *",
    rows: 2,
    defaultValue: "",
  },
  {
    name: "target_temperature",
    label: "Project target temperature *",
    rows: 2,
    defaultValue: "",
  },
  {
    name: "lab_capabilities",
    label: "Laboratory capabilities and limits *",
    rows: 3,
    defaultValue:
      "TBD — furnace range, atmosphere control, salt handling, and equipment availability",
  },
  {
    name: "coupon_specifications",
    label: "Coupon dimensions, preparation, and quantity *",
    rows: 3,
    defaultValue: "TBD — confirm with laboratory team",
  },
  {
    name: "test_mode",
    label: "Exposure mode and cycle profile *",
    rows: 3,
    defaultValue: "TBD — static/isothermal or thermal cycling; do not infer a cycle profile",
  },
  {
    name: "atmosphere",
    label: "Test atmosphere *",
    rows: 2,
    defaultValue: "TBD — confirm gas composition, flow, and monitoring if applicable",
  },
  {
    name: "exposure_duration",
    label: "Exposure durations and measurement schedule *",
    rows: 2,
    defaultValue: "TBD — agree with laboratory team",
  },
  {
    name: "replicate_count",
    label: "Replicates and sample allocation *",
    rows: 2,
    defaultValue: "TBD — determine from lab capacity and study design",
  },
  {
    name: "controls",
    label: "Control and comparison arms *",
    rows: 2,
    defaultValue: "TBD — define controls before protocol approval",
  },
  {
    name: "characterization_methods",
    label: "Measurements and characterization methods *",
    rows: 3,
    defaultValue: "TBD — confirm available methods and reporting units",
  },
  {
    name: "safety_review",
    label: "Salt handling, hazards, and safety review *",
    rows: 3,
    defaultValue: "TBD — laboratory safety review required before work",
  },
  {
    name: "open_questions",
    label: "Open questions and approvals required *",
    rows: 3,
    defaultValue:
      "Confirm lab constraints, test setpoints/profile, coupon design, durations, replicates, controls, measurements, and safety review. No experiment is approved by this draft.",
  },
] as const;

export function TestPlanDraftForm() {
  const { data: materials } = useSuspenseQuery(materialsQuery);
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const confirmedNames = ["IN625", "P91", "316L"].flatMap((scopeName) => {
    const material = materials.find(
      (candidate) =>
        candidate.active &&
        (candidate.name.toLowerCase() === scopeName.toLowerCase() ||
          (scopeName === "IN625" && /inconel\s*625/i.test(candidate.name))),
    );
    return material ? [material.name] : [];
  });
  const scopeDefaults: Record<string, string> = {
    candidate_materials:
      confirmedNames.length === 3
        ? `${confirmedNames.join(", ")} (confirmed research scope; test selection TBD)`
        : "TBD — configure confirmed research scope candidates in Materials",
    salt_composition: projectContext.salt.components
      .map(({ compound, wtPercent }) => `${wtPercent} wt% ${compound}`)
      .join(" / "),
    target_temperature: `Approximately ${projectContext.temperatureC} °C (project target; lab setpoint TBD)`,
  };

  const mutation = useMutation({
    mutationFn: async (values: Record<string, FormDataEntryValue>) => {
      const parsed = testPlanDraftSchema.safeParse(values);
      if (!parsed.success) {
        setErrors(fieldErrors(parsed.error));
        throw new Error("Please fix the highlighted fields.");
      }

      const { error } = await supabase.from("test_plan_drafts").insert({
        ...parsed.data,
        status: "draft",
        is_demo: false,
      });
      if (error) throw new Error(friendlyDbError(error.message));
    },
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["test_plan_drafts"] });
      queryClient.invalidateQueries({ queryKey: ["overview_counts"] });
    },
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setSuccess(false);
    const form = event.currentTarget;
    mutation.mutate(Object.fromEntries(new FormData(form)), {
      onSuccess: () => form.reset(),
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-lg border bg-card p-5">
      <div>
        <h2 className="text-sm font-semibold">Create a draft plan</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          The confirmed research scope is prefilled. Laboratory procedures and settings remain TBD
          until the lab team supplies and approves them. Saving this draft does not authorize
          experimental work.
        </p>
      </div>
      <label className="block text-xs">
        <span className="text-muted-foreground">Draft title *</span>
        <input
          name="title"
          defaultValue="Stage 04 molten-salt validation plan (draft)"
          aria-invalid={!!errors["title"]}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm aria-[invalid=true]:border-destructive"
        />
        {errors["title"] && <span className="mt-1 block text-destructive">{errors["title"]}</span>}
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className="block text-xs">
            <span className="text-muted-foreground">{field.label}</span>
            <textarea
              name={field.name}
              rows={field.rows}
              defaultValue={scopeDefaults[field.name] ?? field.defaultValue}
              aria-invalid={!!errors[field.name]}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm aria-[invalid=true]:border-destructive"
            />
            {errors[field.name] && (
              <span className="mt-1 block text-destructive">{errors[field.name]}</span>
            )}
          </label>
        ))}
      </div>
      {mutation.isError && <ErrorState message={mutation.error.message} />}
      {success && (
        <p className="text-xs text-primary" role="status">
          Draft saved. It remains unapproved and is not an experimental procedure.
        </p>
      )}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {mutation.isPending ? "Saving draft…" : "Save draft"}
      </button>
    </form>
  );
}
