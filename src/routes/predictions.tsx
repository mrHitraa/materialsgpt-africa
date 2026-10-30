import { createFileRoute } from "@tanstack/react-router";
import { LineChart } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/common/states";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "Predictions · MaterialsGPT Africa" },
      { name: "description", content: "Imported service-life predictions from external scientific models." },
      { property: "og:title", content: "Predictions · MaterialsGPT Africa" },
      { property: "og:description", content: "Imported service-life predictions from external scientific models." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Predictions" description="Imported service-life predictions from external scientific models." />
      <EmptyState icon={LineChart} title="No predictions imported" description="Imported predictions will be listed here with their model, version, inputs and assumptions." phaseNote="Planned for a later phase" />
    </>
  );
}
