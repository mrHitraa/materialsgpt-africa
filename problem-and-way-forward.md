# MaterialsGPT Africa: Problem and Way Forward

## The problem

Concentrated solar power (CSP) can store heat in molten salt for long periods, but corrosion and thermal-cycle damage can cause tanks and other components to fail. The Solidus team wants to compare candidate alloys and coatings for molten-salt storage and ultimately estimate service life.

The study's reference condition is solar salt (60 wt% sodium nitrate and 40 wt% potassium nitrate) at approximately 565 °C. The Literature page now includes 27 numeric results from nine papers and three qualitative 316L findings. The team confirmed the original 22 numeric records. On 2026-11-10, four additional mass-loss values and two qualitative findings were checked against their supplied PDFs. The supplied Gomes abstract reports 8.6 μm/year at 550 °C in solar salt and atmospheric air, but does not state the interval or calculation used for the rate. The Sandoval-Amador PDF was checked in full and its contradictory salt formulations are now documented as an unresolved source conflict.

A list of papers is not model-ready data. A corrosion rate from a different salt, temperature, alloy form, atmosphere, or test method cannot automatically be treated as evidence for the reference condition. In particular, short-test rates expressed per year and rates linearly extrapolated from test-period loss are not equivalent to year-long measurements.

We therefore do **not** yet have a defensible service-life model. In particular, we have not established a failure criterion, confirmed that the papers contain sufficient comparable thermal-cycling data, or assembled independent data for validation. A service-life estimate must not be invented from the bibliography or from illustrative demo records.

## Recommended way forward

1. **Stage 02 — Design framework complete.** The team confirmed IN625, P91, and 316L for the hot-side research comparison and A516 as a separate track pending confirmation of its component service temperature. The Materials page defines the comparison criteria and condition-matching rules and displays source coverage and limitations. Criterion weights are deferred, so no material scores or aggregate ranking are produced. Keep chloride salts, coatings, different manufacturing routes, impurities, and other test conditions distinct. Treat 321H, 347H, stainless steel 430, and coating studies as leads for review—not approved candidates.

2. **Extend the evidence set.** Five numeric 316L results and three qualitative findings from five additional papers have been extracted. Four numeric values and two qualitative findings are source-checked; the Gomes rate interval remains pending full-text verification, and the Sandoval-Amador source conflict requires an erratum or author clarification before its salt condition can be treated as certain. Continue with the remaining relevant sources. For every observation, capture:
   - Material grade, material form, manufacturing route, and coating/substrate if applicable.
   - Salt composition and reported impurities.
   - Temperature and exposure time, with units.
   - Static or thermal-cycling conditions, including cycle profile, dwell time, and heating/cooling details when reported.
   - Atmosphere and other experimental conditions.
   - Reported corrosion or fatigue metric, measured value, original units, method, and uncertainty if available.
   - Exact paper, page, table, or figure.

   Preserve the source with every value. Do not fill missing fields with guesses or pool results from incompatible test conditions.

3. **Keep verification auditable.** The team confirmed the original 22 records, but verifier identity and review date were not recorded. The four Kumar values, two qualitative findings, and Sandoval-Amador source conflict were checked against supplied PDFs on 2026-11-10. Retain the conflict and do not treat the preferred salt formulation as settled; the Gomes rate interval and derivation remain pending full-text verification.

4. **Assess what the evidence can support.** Produce an evidence-gap report: coverage by material and test condition, comparable data volume, missing fields, and whether thermal-cycling evidence is sufficient. If the evidence supports it, explore a simple, transparent corrosion-trend model and test it on whole studies held out from fitting—not random rows from papers already used for training. If the evidence is sparse or incompatible, report that limitation instead of forcing a model.

5. **Build toward service-life prediction only when justified.** Agree on a measurable failure criterion (for example, an explicitly defined damage threshold) and show how the measured degradation data relates to that endpoint. A corrosion-rate measurement alone may not establish time to component failure. Any eventual model should state its assumptions, applicable conditions, uncertainty, and when it must not extrapolate.

6. **Validate independently.** Compare predictions against source-backed benchmark or laboratory observations that were not used to fit or tune the model. Agree in advance on comparison metrics and what counts as a meaningful mismatch. Record failures and feed them back to data review or model revision.

## Current status and immediate next steps

**Stage 02 — Design framework is complete.** The team confirmed the research split: IN625, P91, and 316L for the hot-side question, with A516 separate until its component service temperature is confirmed. The Materials page shows condition-aware evidence coverage and the comparison framework preserves original metrics/units, requires matched cycling/isothermal conditions, and describes evidence confidence using study count, target-condition relevance, method transparency, and uncertainty. The team deferred criterion weights; no scores or aggregate ranking are produced. This completes the design framework, not the ranking itself. The 316L extraction adds results at 550 °C and 600 °C, but none exactly at 565 °C; there is still no 316L cycling result.

**Stage 03 — Prediction has started with a database-derived rate estimator.** The Predictions page takes a median of per-study medians from verified, non-demo database observations that exactly match material, salt, temperature, exposure, material form, manufacturing route, atmosphere, test method, cycling details, and rate unit. It displays the included papers and observed study-median range; this range is not a prediction interval. The estimator does not extrapolate to new conditions or estimate service life. It requires fully characterized verified records in the database; it will report no eligible evidence when required conditions are missing. The locally extracted evidence catalogue is not automatically inserted into Supabase. External model outputs can also be imported with their provenance and assumptions. Apply the migrations in `supabase/migrations` before using the prediction table or new condition fields. A supplied/approved model, agreed failure criterion, and independent validation evidence are still required before service-life estimates can be considered defensible.

The coverage review is documented in `evidence-extraction-report.md`. It indicates that a descriptive, within-study comparison is possible, but a general corrosion-trend model would be exploratory and poorly validated with only nine numeric source studies. Evidence follow-up remains necessary: obtain the full Gomes paper, seek clarification of the Sandoval-Amador salt discrepancy, and preserve audit details. “Insufficient evidence for a defensible lifetime prediction” remains a valid result—and is more useful than false precision.
