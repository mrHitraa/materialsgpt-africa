import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { pipelineStages, type PipelineStageId } from "@/lib/pipeline";

export function StageHandoff({ stageId }: { stageId: PipelineStageId }) {
  const index = pipelineStages.findIndex((stage) => stage.id === stageId);
  const stage = pipelineStages[index];
  if (!stage) throw new Error(`Unknown pipeline stage: ${stageId}`);
  const nextStage = pipelineStages[index + 1];

  return (
    <section
      className="mb-6 rounded-lg border bg-card p-5"
      aria-label={`${stage.title} stage handoff`}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Input</p>
          <p className="mt-1 text-sm">{stage.input}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Stage output</p>
          <p className="mt-1 text-sm">{stage.output}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Owner and gate</p>
          <p className="mt-1 text-sm">{stage.owner}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stage.gate}</p>
        </div>
      </div>
      {nextStage ? (
        <div className="mt-4 border-t pt-3">
          <Link
            to={nextStage.to}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Next handoff: {nextStage.title} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
          Feedback returns to Design or Predict when results require a review.
        </p>
      )}
    </section>
  );
}
