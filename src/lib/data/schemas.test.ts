import { describe, expect, it } from "vitest";
import { literatureInputSchema, observationInputSchema, predictionInputSchema } from "./schemas";

const base = {
  title: "Corrosion of 316L",
  authors: "A. Author",
  publication_year: "2020",
  doi: "10.1016/j.x.2020.1",
};

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
    expect(literatureInputSchema.safeParse({ ...base, publication_year: "1850" }).success).toBe(
      false,
    );
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
    expect(
      observationInputSchema.safeParse({ ...obs, corrosion_rate: 5, corrosion_rate_unit: "µm/yr" })
        .success,
    ).toBe(true);
  });
});

describe("prediction import validation", () => {
  const prediction = {
    model_name: "Corrosion trend model",
    model_version: "1.2.0",
    model_reference_url: "https://example.org/model",
    material_name: "IN625",
    salt_composition: "60 wt% NaNO3 / 40 wt% KNO3",
    temperature_c: "565",
    model_input_summary: "Isothermal exposure in atmospheric air",
    failure_criterion: "Time to 1 mm wall loss",
    metric_name: "Service life",
    predicted_value: "25",
    metric_unit: "years",
    uncertainty: "95% prediction interval: 18–32 years",
    assumptions: "Constant corrosion rate; no thermal cycling",
  };

  it("accepts a source-linked prediction with an explicit endpoint and assumptions", () => {
    const result = predictionInputSchema.safeParse(prediction);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.temperature_c).toBe(565);
      expect(result.data.predicted_value).toBe(25);
    }
  });

  it("rejects predictions without model provenance or a failure criterion", () => {
    expect(
      predictionInputSchema.safeParse({
        ...prediction,
        model_reference_url: "",
        failure_criterion: "",
      }).success,
    ).toBe(false);
  });

  it("rejects negative values and non-HTTP model references", () => {
    expect(predictionInputSchema.safeParse({ ...prediction, predicted_value: "-1" }).success).toBe(
      false,
    );
    expect(
      predictionInputSchema.safeParse({
        ...prediction,
        model_reference_url: "javascript:alert(1)",
      }).success,
    ).toBe(false);
  });
});
