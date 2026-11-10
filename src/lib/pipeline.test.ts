import { describe, expect, it } from "vitest";
import { getPipelineStageStatus, type PipelineCounts } from "./pipeline";

const emptyCounts: PipelineCounts = {
  literature: 0,
  observations: 0,
  materials: 0,
  benchmarks: 0,
  predictions: 0,
  testPlans: 0,
};

describe("discovery pipeline status", () => {
  it("shows the screened corpus and verified extracted subset", () => {
    const status = getPipelineStageStatus("knowledge", emptyCounts);

    expect(status.label).toBe("16 retained · 3 excluded");
    expect(status.detail).toContain("19 studies screened from 21 local PDFs");
    expect(status.detail).toContain("0 source records");
    expect(status.detail).toContain(
      "26 verified numeric records; numeric verifications pending: 1",
    );
    expect(status.detail).toContain(
      "Qualitative findings source-checked: 2; pending: 0; source conflicts: 1",
    );
    expect(status.hasWorkspaceData).toBe(true);
  });

  it("marks the design framework complete without implying a material ranking", () => {
    const status = getPipelineStageStatus("design", { ...emptyCounts, materials: 4 });

    expect(status.label).toBe("Stage 02 design framework complete · 4 candidates listed");
    expect(status.detail).toContain("weights and scoring are deferred");
    expect(status.detail).toContain("no ranking is computed");
  });

  it("requires prediction outputs before validation can proceed", () => {
    const status = getPipelineStageStatus("validate", { ...emptyCounts, benchmarks: 3 });

    expect(status.label).toBe("3 benchmarks recorded");
    expect(status.detail).toContain("requires imported predictions");
  });

  it("does not imply model execution or test-plan generation", () => {
    const predictionStatus = getPipelineStageStatus("predict", emptyCounts);
    expect(predictionStatus.hasWorkspaceData).toBe(false);
    expect(predictionStatus.detail).toContain("exact-condition database rate estimator");
    expect(predictionStatus.detail).toContain("does not execute models");
    const planStatus = getPipelineStageStatus("plan", emptyCounts);
    expect(planStatus.hasWorkspaceData).toBe(false);
    expect(planStatus.detail).toContain("do not treat a draft as an approved protocol");
  });

  it("reports test plan drafts without marking them approved", () => {
    const status = getPipelineStageStatus("plan", { ...emptyCounts, testPlans: 1 });
    expect(status.label).toBe("1 test plan draft");
    expect(status.detail).toContain("review and approval are still required");
  });

  it("reports imported outputs without implying independent validation", () => {
    const status = getPipelineStageStatus("predict", { ...emptyCounts, predictions: 2 });
    expect(status.label).toBe("2 model outputs imported");
    expect(status.detail).toContain("remain unvalidated");
  });
});
