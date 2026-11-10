import { describe, expect, it, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));
import { conditionContext } from "./pending-storage";

describe("pending condition fields", () => {
  it("keeps all undeployed conditions unknown instead of inventing evidence", () => {
    expect(conditionContext({})).toEqual({
      material_form: null,
      manufacturing_route: null,
      atmosphere: null,
    });
  });
  it("preserves reported conditions when available", () => {
    expect(conditionContext({ material_form: "Plate", manufacturing_route: "Wrought", atmosphere: "Air" }))
      .toEqual({ material_form: "Plate", manufacturing_route: "Wrought", atmosphere: "Air" });
  });
});