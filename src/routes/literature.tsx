import { useState, type FormEvent } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/common/states";
import { DemoBadge } from "@/components/common/DemoBadge";
import { supabase } from "@/integrations/supabase/client";
import { friendlyDbError, literatureQuery } from "@/lib/data/queries";
import { fieldErrors, literatureInputSchema } from "@/lib/data/schemas";

export const Route = createFileRoute("/literature")({
  head: () => ({
    meta: [
      { title: "Literature · MaterialsGPT Africa" },
      { name: "description", content: "Structured corrosion research records with preserved source references." },
      { property: "og:title", content: "Literature · MaterialsGPT Africa" },
      { property: "og:description", content: "Structured corrosion research records with preserved source references." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(literatureQuery),
  pendingComponent: () => <LoadingState label="Loading literature…" />,
  errorComponent: ({ error }) => <RetryError message={error.message} />,
  notFoundComponent: () => <EmptyState icon={BookOpen} title="Not found" description="This page does not exist." />,
  component: Page,
});

function RetryError({ message }: { message: string }) {
  const router = useRouter();
  return <ErrorState message={message} onRetry={() => router.invalidate()} />;
}

function Page() {
  const { data: records } = useSuspenseQuery(literatureQuery);
  return (
    <>
      <PageHeader title="Literature" description="Structured corrosion research records with preserved source references. Records marked Demo are illustrative placeholders, not real publications." />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {records.length === 0 ? (
            <EmptyState icon={BookOpen} title="No literature records yet" description="Add a record with a DOI or source URL to start." />
          ) : (
            records.map((r) => (
              <article key={r.id} className="rounded-lg border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold leading-snug">{r.title}</h2>
                  {r.is_demo && <DemoBadge />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {r.authors} · {r.publication_year}
                  {r.journal ? ` · ${r.journal}` : ""}
                </p>
                <div className="mt-2 flex flex-wrap gap-3 font-mono text-xs text-muted-foreground">
                  {r.doi && <a className="text-primary hover:underline" href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer">doi:{r.doi}</a>}
                  {r.source_url && <a className="text-primary hover:underline" href={r.source_url} target="_blank" rel="noreferrer">source</a>}
                  <span>status: {r.extraction_status}</span>
                  {r.extraction_confidence != null && <span>confidence: {r.extraction_confidence}</span>}
                </div>
                {r.corrosion_observations.length > 0 && (
                  <div className="mt-4 overflow-x-auto rounded-md border">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/40 text-left uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2">Material</th>
                          <th className="px-3 py-2">Salt</th>
                          <th className="px-3 py-2">Temp</th>
                          <th className="px-3 py-2">Exposure</th>
                          <th className="px-3 py-2">Corrosion rate</th>
                          <th className="px-3 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-mono">
                        {r.corrosion_observations.map((o) => (
                          <tr key={o.id}>
                            <td className="px-3 py-2 font-sans">{o.material_name} {o.is_demo && <DemoBadge />}</td>
                            <td className="px-3 py-2">{o.salt_composition}</td>
                            <td className="px-3 py-2">{o.temperature_c} °C</td>
                            <td className="px-3 py-2">{o.exposure_time != null ? `${o.exposure_time} ${o.exposure_time_unit}` : "—"}</td>
                            <td className="px-3 py-2">{o.corrosion_rate != null ? `${o.corrosion_rate} ${o.corrosion_rate_unit}` : "—"}</td>
                            <td className="px-3 py-2">{o.verification_status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
        <AddLiteratureForm />
      </div>
    </>
  );
}

const fields = [
  { name: "title", label: "Title *" },
  { name: "authors", label: "Authors *" },
  { name: "publication_year", label: "Publication year *", type: "number" },
  { name: "journal", label: "Journal" },
  { name: "doi", label: "DOI (or source URL) *", placeholder: "10.1016/…" },
  { name: "source_url", label: "Source URL", placeholder: "https://…" },
  { name: "full_text_url", label: "Full-text URL", placeholder: "https://…" },
  { name: "source_database", label: "Source database", placeholder: "e.g. Scopus" },
] as const;

function AddLiteratureForm() {
  const qc = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async (values: Record<string, FormDataEntryValue>) => {
      const parsed = literatureInputSchema.safeParse(values);
      if (!parsed.success) {
        setErrors(fieldErrors(parsed.error));
        throw new Error("Please fix the highlighted fields.");
      }
      const { error } = await supabase.from("literature_records").insert(parsed.data);
      if (error) throw new Error(friendlyDbError(error.message));
    },
    onSuccess: () => {
      setSuccess(true);
      qc.invalidateQueries({ queryKey: ["literature_records"] });
      qc.invalidateQueries({ queryKey: ["overview_counts"] });
    },
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    const form = e.currentTarget;
    mutation.mutate(Object.fromEntries(new FormData(form)), { onSuccess: () => form.reset() });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="h-fit space-y-3 rounded-lg border bg-card p-5">
      <h2 className="text-sm font-semibold">Add literature record</h2>
      {fields.map((f) => (
        <label key={f.name} className="block text-xs">
          <span className="text-muted-foreground">{f.label}</span>
          <input
            name={f.name}
            type={"type" in f ? f.type : "text"}
            placeholder={"placeholder" in f ? f.placeholder : undefined}
            aria-invalid={!!errors[f.name]}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm aria-[invalid=true]:border-destructive"
          />
          {errors[f.name] && <span className="mt-1 block text-destructive">{errors[f.name]}</span>}
        </label>
      ))}
      {mutation.isError && <ErrorState message={mutation.error.message} />}
      {success && <p className="text-xs text-primary" role="status">Record saved.</p>}
      <button type="submit" disabled={mutation.isPending} className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
        {mutation.isPending ? "Saving…" : "Save record"}
      </button>
    </form>
  );
}
