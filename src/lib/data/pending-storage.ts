import { supabase } from "@/integrations/supabase/client";

// Compatibility alias for existing imports; storage now uses generated live types.
export const pendingStorage = supabase;

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