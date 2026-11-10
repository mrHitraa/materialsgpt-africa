import { describe, expect, it } from "vitest";
import {
  designCandidateEvidence,
  designDecisionGate,
  designTracks,
  getDesignEvidenceSummary,
} from "./design-evidence";

describe("Stage 02 design evidence", () => {
  it("summarizes the proposed shortlist without treating coverage as a score", () => {
    expect(designCandidateEvidence.map((item) => item.material)).toEqual([
      "316L stainless steel",
      "IN625",
      "P91",
      "A516 carbon steel",
    ]);

    const ss316l = designCandidateEvidence[0];
    if (!ss316l) throw new Error("Missing 316L design evidence row");
    expect(ss316l.extractedRecordCount).toBe(5);
    expect(ss316l.studyCount).toBe(5);
    expect(ss316l.qualitativeStudyCount).toBe(3);
    expect(ss316l.referenceTemperatureCount).toBe(0);
    expect(ss316l.limitation).toContain("do not substitute 304SS");

    const in625 = designCandidateEvidence[1];
    if (!in625) throw new Error("Missing IN625 design evidence row");
    expect(in625.extractedRecordCount).toBe(4);
    expect(in625.studyCount).toBe(3);
    expect(in625.thermalCyclingCount).toBe(1);

    const summary = getDesignEvidenceSummary();
    expect(summary).toMatchObject({
      candidateCount: 4,
      extractedRecordCount: 27,
      studyCount: 9,
      referenceTemperatureRecordCount: 5,
      cyclingRecordCount: 4,
      verifiedRecordCount: 26,
      awaitingVerificationCount: 1,
      qualitativeFindingCount: 3,
      verifiedQualitativeFindingCount: 2,
      awaitingQualitativeVerificationCount: 0,
      sourceConflictQualitativeFindingCount: 1,
      canRank: false,
    });
  });

  it("records the approved scope and keeps weighted scoring deferred", () => {
    expect(designTracks[0]?.candidates.map((candidate) => candidate.material)).toEqual([
      "316L stainless steel",
      "IN625",
      "P91",
    ]);
    expect(designTracks[1]?.candidates.map((candidate) => candidate.material)).toEqual([
      "A516 carbon steel",
    ]);
    expect(designDecisionGate.some((item) => item.includes("hot-side shortlist"))).toBe(true);
    expect(designDecisionGate.some((item) => item.includes("No criterion weights are set"))).toBe(
      true,
    );
    expect(designDecisionGate.some((item) => item.includes("Evidence confidence"))).toBe(true);
  });
});
