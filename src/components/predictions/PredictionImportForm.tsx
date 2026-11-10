import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { friendlyDbError } from "@/lib/data/queries";
import { fieldErrors, predictionInputSchema } from "@/lib/data/schemas";
import { ErrorState } from "@/components/common/states";

const fields = [
  { name: "model_name", label: "Model name *", placeholder: "Approved model or tool" },
  { name: "model_version", label: "Model version *", placeholder: "Version or commit" },
  {
    name: "model_reference_url",
    label: "Model source URL *",
    placeholder: "https://…",
    type: "url",
  },
  { name: "material_name", label: "Material *", placeholder: "IN625" },
  {
    name: "salt_composition",
    label: "Salt composition *",
    placeholder: "60 wt% NaNO₃ / 40 wt% KNO₃",
  },
  { name: "temperature_c", label: "Temperature (°C) *", type: "number" },
  { name: "metric_name", label: "Predicted metric *", placeholder: "Service life" },
  { name: "predicted_value", label: "Predicted value *", type: "number" },
  { name: "metric_unit", label: "Metric unit *", placeholder: "years" },
] as const;

export function PredictionImportForm() {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async (values: Record<string, FormDataEntryValue>) => {
      const parsed = predictionInputSchema.safeParse(values);
      if (!parsed.success) {
        setErrors(fieldErrors(parsed.error));
        throw new Error("Please fix the highlighted fields.");
      }

      const { error } = await supabase.from("prediction_records").insert({
        ...parsed.data,
        uncertainty: parsed.data.uncertainty ?? null,
      });
      if (error) throw new Error(friendlyDbError(error.message));
    },
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["prediction_records"] });
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
    <form onSubmit={onSubmit} noValidate className="h-fit space-y-3 rounded-lg border bg-card p-5">
      <div>
        <h2 className="text-sm font-semibold">Import model output</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Records an output from an external model; this workspace does not calculate predictions.
          Include the model source, its input conditions, assumptions, and the endpoint it predicts.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className="block text-xs">
            <span className="text-muted-foreground">{field.label}</span>
            <input
              name={field.name}
              type={"type" in field ? field.type : "text"}
              placeholder={"placeholder" in field ? field.placeholder : undefined}
              step={
                field.name === "temperature_c" || field.name === "predicted_value"
                  ? "any"
                  : undefined
              }
              aria-invalid={!!errors[field.name]}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm aria-[invalid=true]:border-destructive"
            />
            {errors[field.name] && (
              <span className="mt-1 block text-destructive">{errors[field.name]}</span>
            )}
          </label>
        ))}
      </div>
      {[
        {
          name: "model_input_summary",
          label: "Model inputs and operating conditions *",
          placeholder: "Include conditions beyond the material, salt, and temperature above.",
          rows: 3,
        },
        {
          name: "failure_criterion",
          label: "Predicted endpoint / failure criterion *",
          placeholder: "State the endpoint defined by the model.",
          rows: 2,
        },
        {
          name: "assumptions",
          label: "Model assumptions *",
          placeholder:
            "Record assumptions and known limits exactly as supplied by the model owner.",
          rows: 3,
        },
        {
          name: "uncertainty",
          label: "Uncertainty (if reported)",
          placeholder:
            "Preserve the model's interval or uncertainty statement; leave blank if absent.",
          rows: 2,
        },
      ].map((field) => (
        <label key={field.name} className="block text-xs">
          <span className="text-muted-foreground">{field.label}</span>
          <textarea
            name={field.name}
            rows={field.rows}
            placeholder={field.placeholder}
            aria-invalid={!!errors[field.name]}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm aria-[invalid=true]:border-destructive"
          />
          {errors[field.name] && (
            <span className="mt-1 block text-destructive">{errors[field.name]}</span>
          )}
        </label>
      ))}
      {errors["form"] && <p className="text-xs text-destructive">{errors["form"]}</p>}
      {mutation.isError && <ErrorState message={mutation.error.message} />}
      {success && (
        <p className="text-xs text-primary" role="status">
          Model output imported. It has not been independently validated.
        </p>
      )}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {mutation.isPending ? "Importing…" : "Import model output"}
      </button>
    </form>
  );
}
