import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/common/states";
import { StageHandoff } from "@/components/pipeline/StageHandoff";
import { TestPlanDraftForm } from "@/components/test-plans/TestPlanDraftForm";
import { materialsQuery, testPlanDraftsQuery } from "@/lib/data/queries";

export const Route = createFileRoute("/test-plans")({
  head: () => ({
    meta: [
      { title: "Test Plans · MaterialsGPT Africa" },
      {
        name: "description",
        content: "Draft laboratory validation plans with unresolved inputs clearly marked.",
      },
      { property: "og:title", content: "Test Plans · MaterialsGPT Africa" },
      {
        property: "og:description",
        content: "Draft laboratory validation plans with unresolved inputs clearly marked.",
      },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(testPlanDraftsQuery),
      context.queryClient.ensureQueryData(materialsQuery),
    ]),
  pendingComponent: () => <LoadingState label="Loading test plan drafts…" />,
  errorComponent: ({ error }) => (
    <RetryError message={error instanceof Error ? error.message : String(error)} />
  ),
  component: Page,
});

function RetryError({ message }: { message: string }) {
  const router = useRouter();
  return <ErrorState message={message} onRetry={() => router.invalidate()} />;
}

function Page() {
  const { data: plans } = useSuspenseQuery(testPlanDraftsQuery);
  return (
    <>
      <PageHeader
        title="Test Plans"
        description="Draft a lab plan from the confirmed research scope. Only lab-reviewed, approved procedures may be used for experimental work."
      />
      <StageHandoff stageId="plan" />
      <div className="mb-6 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
        <p className="font-semibold">Draft template only — not an experimental protocol</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          No furnace settings, coupon dimensions, exposure duration, cycle schedule, replicate
          count, or test procedures are prescribed. Replace each TBD with laboratory-approved
          requirements and complete the safety review before any work.
        </p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {plans.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No saved plan drafts"
              description="Use the form to create the requested draft. Its unknown laboratory details are explicitly marked TBD."
            />
          ) : (
            plans.map((plan) => (
              <article key={plan.id} className="space-y-4 rounded-lg border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{plan.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Saved {plan.created_at.slice(0, 10)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.is_demo && (
                      <span className="rounded border px-2 py-1 font-mono text-[10px] uppercase">
                        Demo
                      </span>
                    )}
                    <span className="rounded bg-warning px-2 py-1 font-mono text-[10px] uppercase text-warning-foreground">
                      {plan.status.replaceAll("_", " ")} · not approved
                    </span>
                  </div>
                </div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Research scope materials", plan.candidate_materials],
                    ["Project salt composition", plan.salt_composition],
                    ["Project target temperature", plan.target_temperature],
                    ["Laboratory capabilities", plan.lab_capabilities],
                    ["Coupon specifications", plan.coupon_specifications],
                    ["Exposure mode / cycle profile", plan.test_mode],
                    ["Atmosphere", plan.atmosphere],
                    ["Exposure duration / schedule", plan.exposure_duration],
                    ["Replicates / allocation", plan.replicate_count],
                    ["Controls", plan.controls],
                    ["Characterization methods", plan.characterization_methods],
                    ["Safety review", plan.safety_review],
                    ["Open questions / approvals", plan.open_questions],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-md border p-3">
                      <dt className="text-xs font-medium">{label}</dt>
                      <dd className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))
          )}
        </div>
        <TestPlanDraftForm />
      </div>
    </>
  );
}
