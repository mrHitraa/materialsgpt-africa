import {
  evidenceSources,
  extractedObservations,
  qualitativeEvidenceFindings,
} from "@/lib/extracted-observations";

export interface DesignCandidateEvidence {
  material: string;
  trackId: "hot-side" | "lower-temperature";
  aliases: string[];
  extractedRecordCount: number;
  studyCount: number;
  referenceTemperatureCount: number;
  thermalCyclingCount: number;
  qualitativeStudyCount: number;
  regimes: string[];
  limitation: string;
}

export interface DesignTrack {
  id: DesignCandidateEvidence["trackId"];
  title: string;
  purpose: string;
  candidates: DesignCandidateEvidence[];
}

const proposedCandidates: Omit<
  DesignCandidateEvidence,
  | "extractedRecordCount"
  | "studyCount"
  | "referenceTemperatureCount"
  | "thermalCyclingCount"
  | "qualitativeStudyCount"
  | "regimes"
>[] = [
  {
    material: "316L stainless steel",
    trackId: "hot-side",
    aliases: ["316l"],
    limitation:
      "Five new numeric records are from 550–600 °C studies, not 565 °C. Wrought and L-PBF evidence, atmospheres, oxide additions, and salt mixtures must remain distinct; do not substitute 304SS evidence.",
  },
  {
    material: "IN625",
    trackId: "hot-side",
    aliases: ["in625", "inconel 625"],
    limitation:
      "Evidence spans separate studies, temperatures, durations, and cycling modes; do not pool rates into one score.",
  },
  {
    material: "P91",
    trackId: "hot-side",
    aliases: ["p91"],
    limitation:
      "Extracted evidence is a short 565 °C isothermal time series; no P91 cycling record is available here.",
  },
  {
    material: "A516 carbon steel",
    trackId: "lower-temperature",
    aliases: ["a516"],
    limitation:
      "Evidence is at 400–450 °C with varied chloride. Reported annualized rates are short-test upper-bound extrapolations.",
  },
];

function matchesMaterial(material: string, aliases: string[]) {
  const normalized = material.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
  return aliases.some((alias) =>
    normalized.includes(alias.toLocaleLowerCase().replace(/[^a-z0-9]/g, "")),
  );
}

export const designCandidateEvidence: DesignCandidateEvidence[] = proposedCandidates.map(
  (candidate) => {
    const records = extractedObservations.filter((item) =>
      matchesMaterial(item.material, candidate.aliases),
    );
    const findings = qualitativeEvidenceFindings.filter((item) =>
      matchesMaterial(item.material, candidate.aliases),
    );
    const sourceIds = new Set([
      ...records.map((record) => record.sourceId),
      ...findings.map((finding) => finding.sourceId),
    ]);

    return {
      ...candidate,
      extractedRecordCount: records.length,
      studyCount: sourceIds.size,
      referenceTemperatureCount: records.filter((record) => record.temperatureC === 565).length,
      thermalCyclingCount: records.filter((record) => record.exposureMode === "thermal cycling")
        .length,
      qualitativeStudyCount: findings.length,
      regimes: [
        ...new Set(
          records.map(
            (record) =>
              `${record.temperatureC} °C ${record.exposureMode}${record.cycleProfile ? ` (${record.cycleProfile})` : ""}`,
          ),
        ),
      ],
    };
  },
);

export const designTracks: DesignTrack[] = [
  {
    id: "hot-side",
    title: "Hot-side research shortlist",
    purpose:
      "Confirmed scope: compare IN625, P91, and 316L for the approximately 565 °C solar-salt question. Treat only like-for-like conditions as direct comparisons.",
    candidates: designCandidateEvidence.filter((candidate) => candidate.trackId === "hot-side"),
  },
  {
    id: "lower-temperature",
    title: "Separate lower-temperature track",
    purpose:
      "Keep A516 evidence separate until its intended component service temperature is confirmed. Current extracted A516 results are at 400–450 °C with varied chloride.",
    candidates: designCandidateEvidence.filter(
      (candidate) => candidate.trackId === "lower-temperature",
    ),
  },
];

export const designDecisionGate = [
  "Use the hot-side shortlist for the primary ~565 °C research comparison; keep A516 separate unless its intended service temperature supports inclusion.",
  "Corrosion performance: compare source-reported corrosion rate or mass loss only within compatible salt, temperature, exposure, material form, and method; retain original metrics and units.",
  "Thermal-cycle resistance: use matched cycling/isothermal comparisons and report the full cycle profile; do not attribute differences to fatigue alone when peak-temperature exposure also changes.",
  "Evidence confidence: report independent study count, closeness to the target conditions, measurement/method transparency, and reported uncertainty; keep it as a profile rather than an invented score.",
  "No criterion weights are set. Do not produce a weighted aggregate or rank until the team explicitly chooses a weighting method.",
  "Compare records only within compatible salt chemistry, temperature, exposure, material form, and test method.",
] as const;

export function getDesignEvidenceSummary() {
  return {
    candidateCount: designCandidateEvidence.length,
    extractedRecordCount: extractedObservations.length,
    studyCount: evidenceSources.length,
    qualitativeFindingCount: qualitativeEvidenceFindings.length,
    verifiedQualitativeFindingCount: qualitativeEvidenceFindings.filter(
      (finding) => finding.reviewStatus === "verified",
    ).length,
    awaitingQualitativeVerificationCount: qualitativeEvidenceFindings.filter(
      (finding) => finding.reviewStatus === "awaiting verification",
    ).length,
    sourceConflictQualitativeFindingCount: qualitativeEvidenceFindings.filter(
      (finding) => finding.reviewStatus === "source conflict",
    ).length,
    verifiedRecordCount: extractedObservations.filter(
      (record) => record.reviewStatus === "verified",
    ).length,
    awaitingVerificationCount: extractedObservations.filter(
      (record) => record.reviewStatus === "awaiting verification",
    ).length,
    referenceTemperatureRecordCount: extractedObservations.filter(
      (record) => record.temperatureC === 565,
    ).length,
    cyclingRecordCount: extractedObservations.filter(
      (record) => record.exposureMode === "thermal cycling",
    ).length,
    canRank: false,
  };
}
