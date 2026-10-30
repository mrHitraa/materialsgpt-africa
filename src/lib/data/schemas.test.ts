import { describe, expect, it } from "vitest";
import { literatureInputSchema, observationInputSchema } from "./schemas";

const base = { title: "Corrosion of 316L", authors: "A. Author", publication_year: "2020", doi: "10.1016/j.x.2020.1" };

describe("literature validation", () => {
  it("accepts a record with a DOI", () => {
    expect(literatureInputSchema.safeParse(base).success).toBe(true);
  });
  it("rejects a record with no DOI and no source URL", () => {
    expect(literatureInputSchema.safeParse({ ...base, doi: "" }).success).toBe(false);
  });
  it("rejects a missing title", () => {
    expect(literatureInputSchema.safeParse({ ...base, title: "" }).success).toBe(false);
  });
  it("rejects a malformed DOI", () => {
    expect(literatureInputSchema.safeParse({ ...base, doi: "not-a-doi" }).success).toBe(false);
  });
  it("rejects a year before 1900", () => {
    expect(literatureInputSchema.safeParse({ ...base, publication_year: "1850" }).success).toBe(false);
  });
});

describe("observation validation", () => {
  const obs = {
    literature_record_id: "00000000-0000-4000-8000-000000000001",
    material_name: "P91",
    salt_composition: "60/40",
    temperature_c: 565,
  };
  it("rejects a corrosion rate without a unit", () => {
    expect(observationInputSchema.safeParse({ ...obs, corrosion_rate: 5 }).success).toBe(false);
  });
  it("accepts a corrosion rate with a unit", () => {
    expect(observationInputSchema.safeParse({ ...obs, corrosion_rate: 5, corrosion_rate_unit: "µm/yr" }).success).toBe(true);
  });
});
