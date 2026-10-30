import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, FlaskConical, LineChart, GitCompareArrows, Gauge, type LucideIcon } from "lucide-react";
import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/common/states";
import { materialsQuery, overviewCountsQuery } from "@/lib/data/queries";
import { ProjectContextPanel } from "@/components/overview/ProjectContextPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · MaterialsGPT Africa" },
      { name: "description", content: "Materials-discovery dashboard for CSP molten-salt storage in solar salt at ~565 °C." },
      { property: "og:title", content: "Overview · MaterialsGPT Africa" },
      { property: "og:description", content: "Materials-discovery dashboard for CSP molten-salt storage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(overviewCountsQuery),
      context.queryClient.ensureQueryData(materialsQuery),
    ]),
  pendingComponent: () => <LoadingState label="Loading overview…" />,
  errorComponent: ({ error }) => <RetryError message={error.message} />,
  notFoundComponent: () => <EmptyState icon={BookOpen} title="Not found" description="This page does not exist." />,
  component: Overview,
});

type Stat = { label: string; value: string; hint: string; icon: LucideIcon };

function RetryError({ message }: { message: string }) {
  const router = useRouter();
  return <ErrorState message={message} onRetry={() => router.invalidate()} />;
}

function Overview() {
  const { data: c } = useSuspenseQuery(overviewCountsQuery);
  const stats: Stat[] = [
    { label: "Literature records", value: String(c.lit), hint: c.litDemo ? `${c.litDemo} of these are demo records` : "From the database", icon: BookOpen },
    { label: "Corrosion observations", value: String(c.obs), hint: c.obsDemo ? `${c.obsDemo} of these are demo values` : "From the database", icon: FlaskConical },
    { label: "Candidate materials", value: String(c.mats), hint: "From the database", icon: FlaskConical },
    { label: "Predictions", value: "0", hint: "No predictions imported", icon: LineChart },
    { label: "Validation mismatches", value: "—", hint: "Requires predictions and benchmarks", icon: GitCompareArrows },
    { label: "Dataset confidence", value: "—", hint: "Not enough data to assess", icon: Gauge },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        description="Status of the materials-discovery study for molten-salt thermal storage. Figures reflect only data entered into this workspace."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg border bg-card p-5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs uppercase tracking-wide">{s.label}</span>
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 font-mono text-3xl font-semibold">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="text-sm font-semibold">Workflow</h2>
            <ol className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Collect and structure corrosion research",
                "Compare candidate alloys and coatings",
                "Rank with transparent criteria",
                "Import service-life predictions",
                "Compare against published benchmarks",
                "Generate a laboratory validation plan",
              ].map((step, i) => (
                <li key={step} className="flex gap-3 rounded-md border bg-muted/40 p-3">
                  <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <ProjectContextPanel />
      </div>
    </>
  );
}
