import { ExternalLink } from "lucide-react";
import {
  evidenceSources,
  extractedObservations,
  evidenceSummary,
  qualitativeEvidenceFindings,
  verificationNote,
} from "@/lib/extracted-observations";

const sourceById = new Map(evidenceSources.map((source) => [source.id, source]));

export function ExtractedEvidencePanel() {
  return (
    <section aria-labelledby="extracted-evidence-title" className="mb-6 rounded-lg border bg-card">
      <div className="border-b px-5 py-4">
        <h2 id="extracted-evidence-title" className="text-sm font-semibold">
          Source-linked corrosion evidence
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {evidenceSummary.verified} numeric results are marked verified, including four 316L
          mass-loss values checked against the supplied Kumar et al. PDF on 2026-11-10.{" "}
          {evidenceSummary.awaitingVerification} new 316L numeric result remains pending because the
          supplied Gomes et al. PDF contains only the abstract. It reports 8.6 µm/year at 550 °C in
          solar salt and atmospheric air, but does not identify the exposure interval or rate
          calculation. {evidenceSummary.verifiedQualitativeFindings} qualitative findings were
          source-checked on 2026-11-10; {evidenceSummary.sourceConflictQualitativeFindings} has an
          unresolved salt-formulation conflict between the Sandoval-Amador paper's Introduction and
          its Methodology, Results, figure caption, and Conclusion. It remains flagged as a source
          conflict. {verificationNote} This evidence does not provide service-life predictions.
        </p>
        <p className="mt-2 text-xs text-warning-foreground">
          Annualized rates from short tests are not equivalent to year-long measurements. The A516
          report explicitly calls its linear extrapolations upper-bound estimates.
        </p>
      </div>
      <div className="max-h-[36rem] overflow-auto">
        <table className="w-full min-w-[1150px] text-left text-xs">
          <thead className="sticky top-0 border-b bg-muted text-[10px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Material</th>
              <th className="px-3 py-2">Salt / additive</th>
              <th className="px-3 py-2">Condition</th>
              <th className="px-3 py-2">Exposure</th>
              <th className="px-3 py-2">Reported result</th>
              <th className="px-3 py-2">Basis / method</th>
              <th className="px-3 py-2">Source location</th>
              <th className="px-3 py-2">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {extractedObservations.map((item) => {
              const source = sourceById.get(item.sourceId);
              return (
                <tr key={item.id} className="align-top">
                  <td className="px-3 py-2 font-medium">{item.material}</td>
                  <td className="max-w-56 px-3 py-2">{item.saltComposition}</td>
                  <td className="px-3 py-2">
                    {item.temperatureC} °C, {item.exposureMode}
                    {item.cycleProfile && (
                      <p className="mt-1 text-muted-foreground">{item.cycleProfile}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {item.exposureValue} {item.exposureUnit}
                    {item.atmosphere && (
                      <p className="mt-1 text-muted-foreground">{item.atmosphere}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <p className="font-medium">{item.reportedMetric}</p>
                    <p className="mt-1 whitespace-nowrap font-mono">
                      {item.reportedValue} {item.reportedUnit}
                    </p>
                  </td>
                  <td className="max-w-72 px-3 py-2">
                    {item.rateBasis}
                    <p className="mt-1 text-muted-foreground">{item.method}</p>
                    <p className="mt-1 text-muted-foreground">{item.notes}</p>
                  </td>
                  <td className="px-3 py-2">
                    <p>{item.sourceLocation}</p>
                    {source && (
                      <p className="mt-1 max-w-56 break-all text-muted-foreground">{source.file}</p>
                    )}
                    {source?.sourceUrl && (
                      <a
                        href={source.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Paper details <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {item.uncertainty && (
                      <p className="mt-1 text-muted-foreground">Uncertainty: {item.uncertainty}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        item.reviewStatus === "verified"
                          ? "text-accent-foreground"
                          : "text-warning-foreground"
                      }
                    >
                      {item.reviewStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t px-5 py-4">
        <h3 className="text-xs font-semibold">Additional qualitative 316L findings</h3>
        <p className="mt-1 text-[11px] text-muted-foreground">
          These papers provide condition-specific context but no numeric result was transcribed into
          the table above. Source-checked findings are not directly comparable with the binary
          solar-salt reference.
        </p>
        <ul className="mt-3 space-y-3">
          {qualitativeEvidenceFindings.map((item) => {
            const source = sourceById.get(item.sourceId);
            return (
              <li key={item.id} className="rounded-md border p-3 text-xs">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-medium">
                    {item.material} · {source?.title ?? item.sourceId}
                  </span>
                  <span className="text-warning-foreground">{item.reviewStatus}</span>
                </div>
                <p className="mt-1 text-muted-foreground">{item.conditions}</p>
                <p className="mt-1">{item.finding}</p>
                <p className="mt-1 text-muted-foreground">
                  {item.sourceLocation} · {item.scopeNote}
                </p>
                {source?.sourceUrl && (
                  <a
                    href={source.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Paper details <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-t px-5 py-3 text-[11px] text-muted-foreground">
        Source PDFs remain in the supplied Downloads folder; the app stores the extracted
        observations and PDF filenames, not copies of the papers. Empty condition fields mean they
        were not confirmed in this extraction and must not be inferred.
      </div>
    </section>
  );
}
