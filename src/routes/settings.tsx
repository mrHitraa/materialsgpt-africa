import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/common/states";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · MaterialsGPT Africa" },
      { name: "description", content: "Workspace, project scope and data preferences." },
      { property: "og:title", content: "Settings · MaterialsGPT Africa" },
      { property: "og:description", content: "Workspace, project scope and data preferences." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Settings" description="Workspace, project scope and data preferences." />
      <EmptyState icon={SettingsIcon} title="No settings configured" description="Project scope, units and data-source preferences will be configurable here." phaseNote="Planned for a later phase" />
    </>
  );
}
