import type { SupabaseClient } from "@supabase/supabase-js";
import type { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { predictionInputSchema } from "./schemas";
import type { testPlanDraftSchema } from "./test-plan-schemas";

// Repository migration contracts only: these tables are NOT yet present live.
// Keep the generated Database accurate; a missing table must still raise a DB error.
type Prediction = z.output<typeof predictionInputSchema> & {
  uncertainty: string | null;
  id: string;
  is_demo: boolean;
  created_at: string;
};
type Draft = z.output<typeof testPlanDraftSchema> & {
  id: string;
  status: "draft" | "ready_for_review" | "approved";
  is_demo: boolean;
  created_at: string;
  updated_at: string;
};
type PendingTable<Row, Generated extends keyof Row> = {
  Row: Row;
  Insert: Omit<Row, Generated> & Partial<Pick<Row, Generated>>;
  Update: Partial<Row>;
  Relationships: [];
};
type PendingDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables"> & {
    Tables: Database["public"]["Tables"] & {
      prediction_records: PendingTable<Prediction, "id" | "is_demo" | "created_at">;
      test_plan_drafts: PendingTable<Draft, "id" | "status" | "is_demo" | "created_at" | "updated_at">;
    };
  };
};

export const pendingStorage = supabase as unknown as SupabaseClient<PendingDatabase>;

export function conditionContext(row: {
  material_form?: string | null;
  manufacturing_route?: string | null;
  atmosphere?: string | null;
}) {
  return {
    material_form: row.material_form ?? null,
    manufacturing_route: row.manufacturing_route ?? null,
    atmosphere: row.atmosphere ?? null,
  };
}