import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/common/states";

export const Route = createFileRoute("/literature")({
  head: () => ({
    meta: [
      { title: "Literature · MaterialsGPT Africa" },
      { name: "description", content: "Structured corrosion research records with preserved source references." },
      { property: "og:title", content: "Literature · MaterialsGPT Africa" },
      { property: "og:description", content: "Structured corrosion research records with preserved source references." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Literature" description="Structured corrosion research records with preserved source references." />
      <EmptyState icon={BookOpen} title="No literature records yet" description="Research records will appear here, each linked to its original source, DOI and extraction confidence." phaseNote="Planned for a later phase" />
    </>
  );
}
