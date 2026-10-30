import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/common/states";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Materials · MaterialsGPT Africa" },
      { name: "description", content: "Candidate alloys and coatings under evaluation for solar-salt service." },
      { property: "og:title", content: "Materials · MaterialsGPT Africa" },
      { property: "og:description", content: "Candidate alloys and coatings under evaluation for solar-salt service." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Materials" description="Candidate alloys and coatings under evaluation for solar-salt service." />
      <EmptyState icon={FlaskConical} title="No material evidence yet" description="Material comparisons will appear once literature records are linked to candidates. Rankings will use transparent, documented criteria." phaseNote="Planned for a later phase" />
    </>
  );
}
