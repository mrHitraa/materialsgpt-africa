import { Link } from "@tanstack/react-router";
import { ArrowRight, CircleDashed, Database } from "lucide-react";
import { getPipelineStageStatus, pipelineStages, type PipelineCounts } from "@/lib/pipeline";

export function DiscoveryPipeline({ counts }: { counts: PipelineCounts }) {
  return (
    <section aria-labelledby="pipeline-title" className="mb-8 rounded-lg border bg-card p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="pipeline-title" className="text-lg font-semibold">
            Discovery pipeline
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Five linked stages from sourced evidence to laboratory validation.
          </p>
        </div>
        <p className="max-w-xl text-xs text-muted-foreground">
          Status reflects records currently in this workspace, not scientific review or stage-gate
          approval.
        </p>
      </div>

      <ol className="grid gap-3 md:grid-cols-2 2xl:grid-cols-5">
        {pipelineStages.map((stage, index) => {
          const status = getPipelineStageStatus(stage.id, counts);
          const StatusIcon = status.hasWorkspaceData ? Database : CircleDashed;
          return (
            <li key={stage.id} className="relative min-w-0 rounded-md border bg-background p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Stage {stage.number}
                  </p>
                  <h3 className="mt-1 font-semibold">{stage.title}</h3>
                </div>
                <StatusIcon
                  aria-hidden="true"
                  className={`mt-1 h-4 w-4 shrink-0 ${status.hasWorkspaceData ? "text-primary" : "text-muted-foreground"}`}
                />
              </div>
              <p className="mt-3 text-xs font-medium">{status.label}</p>
              <p className="mt-1 min-h-10 text-xs leading-relaxed text-muted-foreground">
                {status.detail}
              </p>
              <div className="mt-3 space-y-2 border-t pt-3 text-xs">
                <p>
                  <span className="font-medium">Output: </span>
                  <span className="text-muted-foreground">{stage.output}</span>
                </p>
                <p className="text-muted-foreground">{stage.owner}</p>
              </div>
              <Link
                to={stage.to}
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Open stage <ArrowRight className="h-3 w-3" />
              </Link>
              {index < pipelineStages.length - 1 && (
                <ArrowRight
                  aria-hidden="true"
                  className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground 2xl:block"
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-4 rounded-md bg-muted/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">Handoffs: </span>
        each stage passes its defined output to the next. Validation mismatches feed back to the
        model or design stage; failed predictions are reviewed before any ranking changes.
      </div>
    </section>
  );
}
