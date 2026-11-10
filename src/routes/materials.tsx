import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FlaskConical } from "lucide-react";
import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/common/states";
import { materialsQuery } from "@/lib/data/queries";
import { StageHandoff } from "@/components/pipeline/StageHandoff";
import { LiteratureAlignmentPanel } from "@/components/materials/LiteratureAlignmentPanel";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Materials · MaterialsGPT Africa" },
      {
        name: "description",
        content: "Candidate alloys and coatings under evaluation for solar-salt service.",
      },
      { property: "og:title", content: "Materials · MaterialsGPT Africa" },
      {
        property: "og:description",
        content: "Candidate alloys and coatings under evaluation for solar-salt service.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(materialsQuery),
  pendingComponent: () => <LoadingState label="Loading materials…" />,
  errorComponent: ({ error }) => (
    <RetryError message={error instanceof Error ? error.message : String(error)} />
  ),
  notFoundComponent: () => (
    <EmptyState icon={FlaskConical} title="Not found" description="This page does not exist." />
  ),
  component: Page,
});

function RetryError({ message }: { message: string }) {
  const router = useRouter();
  return <ErrorState message={message} onRetry={() => router.invalidate()} />;
}

function Page() {
  const { data: materials } = useSuspenseQuery(materialsQuery);
  return (
    <>
      <PageHeader
        title="Materials"
        description="Candidate alloys and coatings under evaluation for solar-salt service. Cost and availability tags are scope labels, not measurements."
      />
      <StageHandoff stageId="design" />
      <LiteratureAlignmentPanel candidateNames={materials.map((material) => material.name)} />
      {materials.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No candidate materials"
          description="Candidate materials will appear here once added."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Local availability</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {materials.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 capitalize">{m.material_type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.description ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{m.cost_tag ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{m.local_availability_tag ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        m.active
                          ? "rounded bg-accent px-1.5 py-0.5 font-mono text-[10px] text-accent-foreground"
                          : "rounded bg-warning px-1.5 py-0.5 font-mono text-[10px] text-warning-foreground"
                      }
                    >
                      {m.active ? "active" : "conditional"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
