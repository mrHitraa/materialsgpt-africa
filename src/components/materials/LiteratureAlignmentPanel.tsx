import {
  contextualMaterialLeads,
  getCandidateEvidenceStatus,
  rankingCriteria,
  screenedSources,
} from "@/lib/literature-corpus";
import { designCandidateEvidence, designDecisionGate, designTracks } from "@/lib/design-evidence";

export function LiteratureAlignmentPanel({ candidateNames }: { candidateNames: string[] }) {
  return (
    <section className="mb-6 space-y-4">
      <div className="rounded-lg border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-primary">
              Stage 02 · Design · Framework complete
            </p>
            <h2 className="mt-1 text-sm font-semibold">
              Approved research scope and comparison framework
            </h2>
            <p className="mt-1 max-w-4xl text-xs leading-relaxed text-muted-foreground">
              Confirmed research scope: compare IN625, P91, and 316L for the hot-side question;
              assess A516 separately until its component service temperature is confirmed. Coverage
              counts describe the extracted records, not material performance.
            </p>
          </div>
          <span className="rounded bg-warning px-2 py-1 font-mono text-[10px] text-warning-foreground">
            No weighted ranking · weights deferred
          </span>
        </div>
        <div className="mt-4 space-y-4">
          {designTracks.map((track) => (
            <section key={track.id} aria-labelledby={`${track.id}-track-title`}>
              <h3 id={`${track.id}-track-title`} className="text-xs font-semibold">
                {track.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">{track.purpose}</p>
              <div className="mt-2 overflow-x-auto rounded-md border">
                <table className="w-full min-w-[850px] text-left text-xs">
                  <thead className="border-b bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">Candidate</th>
                      <th className="px-3 py-2">Extracted records</th>
                      <th className="px-3 py-2">Source studies</th>
                      <th className="px-3 py-2">Qualitative findings</th>
                      <th className="px-3 py-2">565 °C records</th>
                      <th className="px-3 py-2">Cycling records</th>
                      <th className="px-3 py-2">Evidence limitation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {track.candidates.map((item) => (
                      <tr key={item.material} className="align-top">
                        <td className="px-3 py-2 font-medium">{item.material}</td>
                        <td className="px-3 py-2 font-mono">{item.extractedRecordCount}</td>
                        <td className="px-3 py-2 font-mono">{item.studyCount}</td>
                        <td className="px-3 py-2 font-mono">{item.qualitativeStudyCount}</td>
                        <td className="px-3 py-2 font-mono">{item.referenceTemperatureCount}</td>
                        <td className="px-3 py-2 font-mono">{item.thermalCyclingCount}</td>
                        <td className="max-w-md px-3 py-2 text-muted-foreground">
                          {item.limitation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold">Non-scoring comparison rules</h3>
            <ol className="mt-2 list-inside list-decimal space-y-1.5 text-xs text-muted-foreground">
              {designDecisionGate.map((decision) => (
                <li key={decision}>{decision}</li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-xs font-semibold">
              Observed test regimes (not directly comparable)
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              {designCandidateEvidence.map((item) => (
                <li key={item.material}>
                  <span className="font-medium text-foreground">{item.material}:</span>{" "}
                  {item.regimes.length ? item.regimes.join("; ") : "No extracted numeric records"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-lg border bg-card p-5">
          <h2 className="text-sm font-semibold">Bibliographic leads for configured candidates</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            These signals come from title and abstract screening only. They are not numeric
            measurements and are not used in the condition-aware coverage counts above.
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
            <h2 className="text-sm font-semibold">Defined evaluation criteria</h2>
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
              Cost and local availability remain descriptive tags, not scored criteria. Criterion
              weights are deferred by the team; no scores or aggregate ranking are produced.
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
      </div>
    </section>
  );
}
