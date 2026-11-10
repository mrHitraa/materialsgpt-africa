import { describe, expect, it } from "vitest";
import {
  getCandidateEvidenceStatus,
  screenedSources,
  sourceCorpusSummary,
} from "./literature-corpus";

describe("screened literature corpus", () => {
  it("accounts for the supplied PDFs without treating duplicate copies as separate studies", () => {
    expect(sourceCorpusSummary).toEqual({
      pdfFiles: 21,
      uniqueStudies: 19,
      core: 12,
      context: 4,
      excluded: 3,
    });
  });

  it("keeps chloride systems out of nitrate-salt core evidence", () => {
    expect(
      screenedSources
        .filter((source) => source.topics.includes("chloride salt"))
        .every((source) => source.disposition === "excluded"),
    ).toBe(true);
  });

  it("maps configured candidates to title/abstract-level evidence without inventing a rank", () => {
    expect(
      getCandidateEvidenceStatus("P91").some((source) => source.id === "p91-304-in625-nitrate"),
    ).toBe(true);
    expect(getCandidateEvidenceStatus("Stainless steel 430")).toHaveLength(0);
  });

  it("groups exact duplicate PDFs and duplicate DOI files with their canonical study", () => {
    expect(
      screenedSources.find((source) => source.id === "nitrate-salt-thermal-cycling")?.files,
    ).toHaveLength(2);
    expect(
      screenedSources.find((source) => source.id === "district-heat-forecast")?.files,
    ).toHaveLength(2);
  });
});
