import { describe, expect, it } from "vitest";
import { getPipelineStageStatus, type PipelineCounts } from "./pipeline";

const emptyCounts: PipelineCounts = {
  literature: 0,
  observations: 0,
  materials: 0,
  benchmarks: 0,
};

describe("discovery pipeline status", () => {
  it("shows the screened local source set without marking extraction complete", () => {
    const status = getPipelineStageStatus("knowledge", emptyCounts);

    expect(status.label).toBe("16 retained · 3 excluded");
    expect(status.detail).toContain("19 studies screened from 21 local PDFs");
    expect(status.detail).toContain("0 non-demo source records");
    expect(status.detail).toContain("full-text extraction and verification remain");
    expect(status.hasWorkspaceData).toBe(true);
  });

  it("keeps design status evidence-informed without claiming a completed ranking", () => {
    const status = getPipelineStageStatus("design", { ...emptyCounts, materials: 4 });

    expect(status.label).toBe("4 candidates listed");
    expect(status.detail).toContain("no ranking has been computed");
  });

  it("requires prediction outputs before validation can proceed", () => {
    const status = getPipelineStageStatus("validate", { ...emptyCounts, benchmarks: 3 });

    expect(status.label).toBe("3 benchmarks recorded");
    expect(status.detail).toContain("requires imported predictions");
  });

  it("does not imply predictions or a test plan have been implemented", () => {
    expect(getPipelineStageStatus("predict", emptyCounts).hasWorkspaceData).toBe(false);
    expect(getPipelineStageStatus("plan", emptyCounts).hasWorkspaceData).toBe(false);
  });
});
