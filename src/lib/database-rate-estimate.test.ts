import { describe, expect, it } from "vitest";
import { getDatabaseRateEstimate, type RateEvidenceRecord } from "./database-rate-estimate";

function evidence(overrides: Partial<RateEvidenceRecord> = {}): RateEvidenceRecord {
  return {
    id: "observation-1",
    literature_record_id: "study-1",
    material_name: "IN625",
    material_form: "Wrought plate",
    manufacturing_route: "Wrought",
    salt_composition: "60 wt% NaNO3 / 40 wt% KNO3",
    atmosphere: "Air",
    temperature_c: 565,
    exposure_time: 1000,
    exposure_time_unit: "h",
    corrosion_rate: 2,
    corrosion_rate_unit: "µm/yr",
    thermal_cycling_details: "Static isothermal exposure",
    test_method: "Mass loss",
    verification_status: "verified",
    is_demo: false,
    source: {
      title: "Study 1",
      doi: "10.1234/study1",
      source_url: null,
      is_demo: false,
    },
    ...overrides,
  };
}

describe("database corrosion-rate estimate", () => {
  it("uses the median of independent study medians for exact matching conditions", () => {
    const anchor = evidence();
    const records = [
      anchor,
      evidence({
        id: "observation-2",
        literature_record_id: "study-1",
        corrosion_rate: 4,
      }),
      evidence({
        id: "observation-3",
        literature_record_id: "study-2",
        corrosion_rate: 10,
        source: {
          title: "Study 2",
          doi: null,
          source_url: "https://example.org/study2",
          is_demo: false,
        },
      }),
      evidence({
        id: "observation-4",
        literature_record_id: "study-3",
        corrosion_rate: 100,
        source: {
          title: "Study 3",
          doi: null,
          source_url: "https://example.org/study3",
          is_demo: false,
        },
      }),
      evidence({ id: "demo", literature_record_id: "demo-study", is_demo: true }),
      evidence({
        id: "unverified",
        literature_record_id: "unverified-study",
        verification_status: "unverified",
      }),
      evidence({ id: "wrong-temp", literature_record_id: "wrong-temp-study", temperature_c: 600 }),
      evidence({
        id: "wrong-salt",
        literature_record_id: "wrong-salt-study",
        salt_composition: "chloride salt",
      }),
      evidence({
        id: "wrong-unit",
        literature_record_id: "wrong-unit-study",
        corrosion_rate_unit: "mm/yr",
      }),
      evidence({
        id: "wrong-exposure",
        literature_record_id: "wrong-exposure-study",
        exposure_time: 500,
      }),
      evidence({
        id: "wrong-cycling",
        literature_record_id: "wrong-cycling-study",
        thermal_cycling_details: "250-600 °C cycles",
      }),
      evidence({
        id: "wrong-atmosphere",
        literature_record_id: "wrong-atmosphere-study",
        atmosphere: "Nitrogen",
      }),
      evidence({
        id: "wrong-route",
        literature_record_id: "wrong-route-study",
        manufacturing_route: "L-PBF",
      }),
      evidence({
        id: "wrong-method",
        literature_record_id: "wrong-method-study",
        test_method: "Electrochemical",
      }),
      evidence({
        id: "demo-source",
        literature_record_id: "demo-source-study",
        source: {
          title: "Demo study",
          doi: null,
          source_url: null,
          is_demo: true,
        },
      }),
    ];

    const estimate = getDatabaseRateEstimate(anchor, records);

    expect(estimate.rate).toBe(10);
    expect(estimate.unit).toBe("µm/yr");
    expect(estimate.studyRates.map((study) => study.medianRate)).toEqual([3, 10, 100]);
    expect(estimate.studyRates[0]?.observationCount).toBe(2);
    expect(estimate.evidenceRange).toEqual({ min: 3, max: 100 });
  });

  it("reports no estimate when the database has no exact-condition evidence", () => {
    const anchor = evidence();
    expect(() =>
      getDatabaseRateEstimate(anchor, [
        evidence({ temperature_c: 600 }),
        evidence({ is_demo: true, id: "demo", literature_record_id: "demo" }),
      ]),
    ).toThrow("No verified observations match the selected conditions");
  });

  it("does not allow unverified or demo records as the reference observation", () => {
    expect(() => getDatabaseRateEstimate(evidence({ is_demo: true }), [])).toThrow(
      "Select a verified, non-demo observation",
    );
    expect(() =>
      getDatabaseRateEstimate(evidence({ verification_status: "unverified" }), []),
    ).toThrow("Select a verified, non-demo observation");
  });

  it("refuses to estimate when a critical comparison condition is missing", () => {
    const anchor = evidence({ atmosphere: null });
    expect(() => getDatabaseRateEstimate(anchor, [anchor])).toThrow(
      "Insufficient condition details to compare: atmosphere",
    );
  });
});
