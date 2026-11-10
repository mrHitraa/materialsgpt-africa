export interface RateEvidenceRecord {
  id: string;
  literature_record_id: string;
  material_name: string;
  material_form: string | null;
  manufacturing_route: string | null;
  salt_composition: string;
  atmosphere: string | null;
  temperature_c: number;
  exposure_time: number | null;
  exposure_time_unit: string | null;
  corrosion_rate: number | null;
  corrosion_rate_unit: string | null;
  thermal_cycling_details: string | null;
  test_method: string | null;
  verification_status: string;
  is_demo: boolean;
  source: {
    title: string;
    doi: string | null;
    source_url: string | null;
    is_demo: boolean;
  };
}

export interface StudyRate {
  literatureRecordId: string;
  title: string;
  doi: string | null;
  sourceUrl: string | null;
  observationCount: number;
  medianRate: number;
}

export interface DatabaseRateEstimate {
  rate: number;
  unit: string;
  studyRates: StudyRate[];
  evidenceRange: { min: number; max: number };
}

function normalizeCondition(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function sameRequiredCondition(left: string | null, right: string | null) {
  return left !== null && right !== null && normalizeCondition(left) === normalizeCondition(right);
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const lower = sorted[middle - 1];
  const upper = sorted[middle];
  if (upper === undefined) throw new Error("Cannot calculate a median from no values");
  return sorted.length % 2 === 0 && lower !== undefined ? (lower + upper) / 2 : upper;
}

export function getMissingComparisonConditions(record: RateEvidenceRecord): string[] {
  const conditions = [
    ["material form", record.material_form],
    ["manufacturing route", record.manufacturing_route],
    ["atmosphere", record.atmosphere],
    ["exposure duration", record.exposure_time === null ? null : String(record.exposure_time)],
    ["exposure duration unit", record.exposure_time_unit],
    ["test method", record.test_method],
    ["static or cycling details", record.thermal_cycling_details],
  ] as const;
  return conditions
    .filter(([, value]) => value === null || value.trim() === "")
    .map(([name]) => name);
}

export function getDatabaseRateEstimate(
  anchor: RateEvidenceRecord,
  records: RateEvidenceRecord[],
): DatabaseRateEstimate {
  if (
    anchor.verification_status !== "verified" ||
    anchor.is_demo ||
    anchor.corrosion_rate === null ||
    anchor.corrosion_rate_unit === null
  ) {
    throw new Error("Select a verified, non-demo observation with a reported corrosion rate.");
  }
  const missingConditions = getMissingComparisonConditions(anchor);
  if (missingConditions.length > 0) {
    throw new Error(`Insufficient condition details to compare: ${missingConditions.join(", ")}.`);
  }
  const anchorRateUnit = anchor.corrosion_rate_unit;

  const matching = records.filter(
    (record) =>
      record.verification_status === "verified" &&
      !record.is_demo &&
      !record.source.is_demo &&
      record.corrosion_rate !== null &&
      record.corrosion_rate_unit !== null &&
      record.material_form !== null &&
      record.manufacturing_route !== null &&
      record.atmosphere !== null &&
      record.test_method !== null &&
      record.thermal_cycling_details !== null &&
      record.exposure_time !== null &&
      record.exposure_time_unit !== null &&
      sameRequiredCondition(record.material_name, anchor.material_name) &&
      sameRequiredCondition(record.material_form, anchor.material_form) &&
      sameRequiredCondition(record.manufacturing_route, anchor.manufacturing_route) &&
      sameRequiredCondition(record.salt_composition, anchor.salt_composition) &&
      sameRequiredCondition(record.atmosphere, anchor.atmosphere) &&
      record.temperature_c === anchor.temperature_c &&
      record.exposure_time === anchor.exposure_time &&
      record.exposure_time_unit === anchor.exposure_time_unit &&
      record.thermal_cycling_details === anchor.thermal_cycling_details &&
      sameRequiredCondition(record.test_method, anchor.test_method) &&
      normalizeCondition(record.corrosion_rate_unit) === normalizeCondition(anchorRateUnit),
  );

  const byStudy = new Map<string, RateEvidenceRecord[]>();
  for (const record of matching) {
    const study = byStudy.get(record.literature_record_id) ?? [];
    study.push(record);
    byStudy.set(record.literature_record_id, study);
  }

  const studyRates = [...byStudy.entries()]
    .map(([literatureRecordId, observations]) => {
      const source = observations[0];
      if (!source) throw new Error("Matched study has no source observation");
      return {
        literatureRecordId,
        title: source.source.title,
        doi: source.source.doi,
        sourceUrl: source.source.source_url,
        observationCount: observations.length,
        medianRate: median(
          observations.flatMap((observation) =>
            observation.corrosion_rate === null ? [] : [observation.corrosion_rate],
          ),
        ),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  const independentStudyRates = studyRates.map((study) => study.medianRate);
  if (independentStudyRates.length === 0) {
    throw new Error("No verified observations match the selected conditions.");
  }

  return {
    rate: median(independentStudyRates),
    unit: anchor.corrosion_rate_unit,
    studyRates,
    evidenceRange: {
      min: Math.min(...independentStudyRates),
      max: Math.max(...independentStudyRates),
    },
  };
}
