import { describe, expect, it } from "vitest";
import { testPlanDraftSchema } from "./test-plan-schemas";

const draft = {
  title: "Stage 04 molten-salt validation plan (draft)",
  candidate_materials: "IN625, P91, 316L",
  salt_composition: "60 wt% NaNO3 / 40 wt% KNO3",
  target_temperature: "Approximately 565 °C (project target; lab setpoint TBD)",
  lab_capabilities: "TBD",
  coupon_specifications: "TBD",
  test_mode: "TBD",
  atmosphere: "TBD",
  exposure_duration: "TBD",
  replicate_count: "TBD",
  controls: "TBD",
  characterization_methods: "TBD",
  safety_review: "TBD",
  open_questions: "Confirm all TBD fields with laboratory team.",
};

describe("test plan draft validation", () => {
  it("accepts an explicitly incomplete draft", () => {
    expect(testPlanDraftSchema.safeParse(draft).success).toBe(true);
  });

  it("requires draft fields to be explicit instead of silently omitting them", () => {
    expect(testPlanDraftSchema.safeParse({ ...draft, safety_review: "" }).success).toBe(false);
  });

  it("enforces text limits", () => {
    expect(
      testPlanDraftSchema.safeParse({ ...draft, lab_capabilities: "x".repeat(2001) }).success,
    ).toBe(false);
  });

  it("matches the database minimum title length", () => {
    expect(testPlanDraftSchema.safeParse({ ...draft, title: "ab" }).success).toBe(false);
  });
});
