import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/common/states";

export const Route = createFileRoute("/test-plans")({
  head: () => ({
    meta: [
      { title: "Test Plans · MaterialsGPT Africa" },
      { name: "description", content: "Practical laboratory validation plans for shortlisted materials." },
      { property: "og:title", content: "Test Plans · MaterialsGPT Africa" },
      { property: "og:description", content: "Practical laboratory validation plans for shortlisted materials." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Test Plans" description="Practical laboratory validation plans for shortlisted materials." />
      <EmptyState icon={ClipboardList} title="No test plans yet" description="Laboratory plans will be generated from ranked materials and identified evidence gaps." phaseNote="Planned for a later phase" />
    </>
  );
}
