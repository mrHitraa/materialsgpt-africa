import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/states";
import {
  getMissingComparisonConditions,
  getDatabaseRateEstimate,
  type RateEvidenceRecord,
} from "@/lib/database-rate-estimate";
import { LineChart } from "lucide-react";

export function DatabaseRateEstimator({ records }: { records: RateEvidenceRecord[] }) {
  const eligible = useMemo(
    () =>
      records.filter(
        (record) =>
          record.verification_status === "verified" &&
          !record.is_demo &&
          !record.source.is_demo &&
          record.corrosion_rate !== null &&
          record.corrosion_rate_unit !== null &&
          getMissingComparisonConditions(record).length === 0,
      ),
    [records],
  );
  const [selectedId, setSelectedId] = useState("");
  const anchor = eligible.find((record) => record.id === selectedId);
  const estimate = anchor ? getDatabaseRateEstimate(anchor, eligible) : null;

  return (
    <section className="mb-6 rounded-lg border bg-card p-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wide text-primary">
          Database-derived · exact-condition evidence
        </p>
        <h2 className="mt-1 text-sm font-semibold">Database-derived corrosion-rate estimate</h2>
        <p className="mt-1 max-w-4xl text-xs leading-relaxed text-muted-foreground">
          Select a verified observation as the reference condition. The estimate is the median of
          per-study medians for records matching its material, salt, temperature, exposure, cycling
          details, material form, manufacturing route, atmosphere, test method, and reported unit
          exactly. Demo, unverified, and condition-incomplete records are excluded. This does not
          predict service life or extrapolate to new conditions.
        </p>
      </div>

      {eligible.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={LineChart}
            title="No eligible database evidence"
            description="Add source-linked corrosion observations with complete material form, manufacturing route, salt, atmosphere, temperature, exposure, test method, cycling details, and reported rate; then mark them verified. Demo and unverified records are excluded."
          />
        </div>
      ) : (
        <div className="mt-4">
          <label className="block max-w-3xl text-xs">
            <span className="text-muted-foreground">Reference observation</span>
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="">Choose a verified source observation…</option>
              {eligible.map((record) => (
                <option key={record.id} value={record.id}>
                  {record.material_name} · {record.temperature_c} °C · {record.corrosion_rate}{" "}
                  {record.corrosion_rate_unit} · {record.source.title}
                </option>
              ))}
            </select>
          </label>

          {estimate && anchor && (
            <div className="mt-4 rounded-md border bg-muted/30 p-4" aria-live="polite">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-xs font-medium">Exact-condition database rate estimate</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">
                    {estimate.rate} {estimate.unit}
                  </p>
                </div>
                <span className="rounded border px-2 py-1 font-mono text-[10px] text-muted-foreground">
                  {estimate.studyRates.length} independent{" "}
                  {estimate.studyRates.length === 1 ? "study" : "studies"}
                </span>
              </div>
              <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="font-medium">Matched conditions</dt>
                  <dd className="mt-1 text-muted-foreground">
                    {anchor.material_name}; {anchor.material_form}; {anchor.manufacturing_route};{" "}
                    {anchor.salt_composition}; {anchor.atmosphere}; {anchor.temperature_c} °C;
                    exposure {anchor.exposure_time} {anchor.exposure_time_unit};{" "}
                    {anchor.test_method}; {anchor.thermal_cycling_details}; {estimate.unit}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Observed study-median range</dt>
                  <dd className="mt-1 text-muted-foreground">
                    {estimate.evidenceRange.min}–{estimate.evidenceRange.max} {estimate.unit}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Method</dt>
                  <dd className="mt-1 text-muted-foreground">
                    Median of study medians; multiple records from one paper count as one study.
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-warning-foreground">
                The range is the spread of matching study medians, not a confidence or prediction
                interval. This evidence summary is not a forecast of future corrosion, an
                extrapolation to other conditions, or a service-life estimate.
              </p>
              {estimate.studyRates.length === 1 && (
                <p className="mt-2 text-xs leading-relaxed text-warning-foreground">
                  Only one independent study matches; this result is a single-study summary, not a
                  cross-study estimate.
                </p>
              )}
              <h3 className="mt-4 text-xs font-semibold">Included source studies</h3>
              <ul className="mt-2 space-y-2">
                {estimate.studyRates.map((study) => (
                  <li
                    key={study.literatureRecordId}
                    className="flex flex-wrap justify-between gap-2 text-xs"
                  >
                    <span>
                      {study.title} · study median {study.medianRate} {estimate.unit}
                      {study.observationCount > 1
                        ? ` (${study.observationCount} observations summarized)`
                        : ""}
                    </span>
                    {study.doi ? (
                      <a
                        href={`https://doi.org/${study.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        DOI source
                      </a>
                    ) : study.sourceUrl ? (
                      <a
                        href={study.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        Source
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
