import { z } from "zod";

const draftField = (label: string, max: number) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);

export const testPlanDraftSchema = z.object({
  title: z.string().trim().min(3, "Plan title is required").max(200, "Plan title is too long"),
  candidate_materials: draftField("Candidate materials", 1000),
  salt_composition: draftField("Salt composition", 500),
  target_temperature: draftField("Target temperature", 100),
  lab_capabilities: draftField("Lab capabilities", 2000),
  coupon_specifications: draftField("Coupon specifications", 1500),
  test_mode: draftField("Test mode", 1000),
  atmosphere: draftField("Atmosphere", 500),
  exposure_duration: draftField("Exposure duration", 500),
  replicate_count: draftField("Replicate count", 300),
  controls: draftField("Controls", 1000),
  characterization_methods: draftField("Characterization methods", 1500),
  safety_review: draftField("Safety review", 1500),
  open_questions: draftField("Open questions", 2000),
});

export type TestPlanDraftInput = z.input<typeof testPlanDraftSchema>;
