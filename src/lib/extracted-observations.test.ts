import { describe, expect, it } from "vitest";
import {
  evidenceSources,
  extractedObservations,
  evidenceSummary,
  getEvidenceSource,
  qualitativeEvidenceFindings,
  verificationNote,
} from "./extracted-observations";

describe("extracted literature observations", () => {
  it("keeps every numeric result linked to a source and exact PDF location", () => {
    expect(extractedObservations).toHaveLength(27);

    for (const item of extractedObservations) {
      expect(getEvidenceSource(item.sourceId)).toBeDefined();
      expect(item.sourceLocation).toMatch(/PDF p\./);
      expect(item.reportedValue).toBeGreaterThanOrEqual(0);
      if (item.reviewStatus === "verified") {
        if (item.corrosionRate !== null) {
          expect(item.corrosionRate).toBeGreaterThanOrEqual(0);
        } else {
          expect(item.reportedValue).toBeGreaterThan(0);
        }
      } else {
        expect(item.reviewStatus).toBe("awaiting verification");
      }
    }

    expect(evidenceSources).toHaveLength(9);
    expect(qualitativeEvidenceFindings).toHaveLength(3);
    expect(verificationNote).toContain("original 22 numeric records");
    expect(verificationNote).toContain("reviewer identity and review date were not recorded");
  });

  it("summarizes numeric and qualitative source-check status", () => {
    expect(evidenceSummary).toEqual({
      sources: 9,
      observations: 27,
      verified: 26,
      awaitingVerification: 1,
      verifiedQualitativeFindings: 2,
      awaitingQualitativeVerification: 0,
      sourceConflictQualitativeFindings: 1,
    });
  });

  it("preserves reported study conditions and flags linear annualized estimates", () => {
    const cycling = extractedObservations.find((item) => item.id === "in625-tc-solar-salt");
    expect(cycling?.cycleProfile).toContain("250–600 °C");
    expect(cycling?.atmosphere).toBe("Argon");

    const a516 = extractedObservations.find((item) => item.id === "a516-450c-1cl");
    expect(a516?.rateBasis).toContain("upper-bound estimate");
    expect(a516?.saltComposition).toContain("1 wt% chloride ion");
    expect(a516?.corrosionRate).toBe(1.531);
    expect(a516?.corrosionRateUnit).toBe("mm/year");
  });

  it("preserves numeric 316L mass-loss metrics and source conditions without converting units", () => {
    const nitrogen1000h = extractedObservations.find((item) => item.id === "316l-nitrogen-1000h");
    expect(nitrogen1000h).toMatchObject({
      temperatureC: 600,
      exposureValue: 1000,
      atmosphere: "Nitrogen",
      reportedMetric: "Descaled mass loss per unit area",
      reportedValue: 44.58,
      reportedUnit: "mg/cm²",
      corrosionRate: null,
      reviewStatus: "verified",
    });

    const ambient550 = extractedObservations.find(
      (item) => item.id === "316l-550c-solar-salt-2019",
    );
    expect(ambient550?.corrosionRate).toBe(8.6);
    expect(ambient550?.sourceLocation).toBe("PDF p. 1, abstract");
    expect(ambient550?.reviewStatus).toBe("awaiting verification");

    const sandovalFinding = qualitativeEvidenceFindings.find(
      (item) => item.id === "316l-nitrate-nitrite-2019",
    );
    expect(sandovalFinding?.conditions).toContain("53 wt% NaNO₂, and 40 wt% KNO₃");
    expect(sandovalFinding?.scopeNote).toContain("internal conflict remains unresolved");
    expect(sandovalFinding?.sourceLocation).toContain("Figure 1 caption");
    expect(sandovalFinding?.reviewStatus).toBe("source conflict");
  });

  it("does not claim unknown atmosphere conditions as known", () => {
    const p91 = extractedObservations.find((item) => item.id === "p91-565c-1d");
    expect(p91?.atmosphere).toBeNull();
  });
});
