import { createFileRoute } from "@tanstack/react-router";
import { GitCompareArrows } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/common/states";

export const Route = createFileRoute("/validation")({
  head: () => ({
    meta: [
      { title: "Validation · MaterialsGPT Africa" },
      { name: "description", content: "Comparison of predictions against published benchmark data." },
      { property: "og:title", content: "Validation · MaterialsGPT Africa" },
      { property: "og:description", content: "Comparison of predictions against published benchmark data." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Validation" description="Comparison of predictions against published benchmark data." />
      <EmptyState icon={GitCompareArrows} title="Nothing to validate yet" description="Validation needs both imported predictions and benchmark records. Mismatches will be flagged with their sources." phaseNote="Planned for a later phase" />
    </>
  );
}
