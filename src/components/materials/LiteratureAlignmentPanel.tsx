import {
  contextualMaterialLeads,
  getCandidateEvidenceStatus,
  rankingCriteria,
  screenedSources,
} from "@/lib/literature-corpus";

export function LiteratureAlignmentPanel({ candidateNames }: { candidateNames: string[] }) {
  return (
    <section className="mb-6 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-sm font-semibold">Evidence signals for configured candidates</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Signals come from source titles and abstracts only. They are not a full-text screen,
          verified observation, or performance ranking.
        </p>
        <ul className="mt-4 divide-y">
          {candidateNames.map((name) => {
            const sources = getCandidateEvidenceStatus(name);
            return (
              <li
                key={name}
                className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm"
              >
                <span className="font-medium">{name}</span>
                <span
                  className={
                    sources.length
                      ? "rounded bg-accent px-2 py-1 font-mono text-[10px] text-accent-foreground"
                      : "rounded bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground"
                  }
                >
                  {sources.length
                    ? `${sources.length} core source${sources.length === 1 ? "" : "s"}`
                    : "No title/abstract match"}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          No title/abstract match does not establish that a material is unsupported; screen full
          text before changing the roster.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-5">
          <h2 className="text-sm font-semibold">Ranking criteria from the team brief</h2>
          <ul className="mt-3 space-y-3">
            {rankingCriteria.map((criterion) => (
              <li key={criterion.name}>
                <p className="text-sm font-medium">{criterion.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {criterion.description}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
            Cost and local availability remain descriptive tags, not scored criteria. No weights or
            scores have been invented.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h2 className="text-sm font-semibold">Additional leads for team review</h2>
          <ul className="mt-3 space-y-3">
            {contextualMaterialLeads.map((lead) => {
              const source = screenedSources.find((item) => item.id === lead.sourceId);
              return (
                <li key={lead.name}>
                  <p className="text-sm font-medium">{lead.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {lead.note}
                  </p>
                  {source?.doi && (
                    <a
                      href={`https://doi.org/${source.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block font-mono text-[10px] text-primary hover:underline"
                    >
                      Source DOI: {source.doi}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
