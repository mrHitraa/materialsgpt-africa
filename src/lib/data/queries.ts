import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const materialsQuery = queryOptions({
  queryKey: ["candidate_materials"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("candidate_materials")
      .select("*")
      .order("active", { ascending: false })
      .order("name");
    if (error) throw new Error(error.message);
    return data;
  },
});

export const literatureQuery = queryOptions({
  queryKey: ["literature_records"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("literature_records")
      .select("*, corrosion_observations(*)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
});

export const predictionRecordsQuery = queryOptions({
  queryKey: ["prediction_records"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("prediction_records")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
});

export const testPlanDraftsQuery = queryOptions({
  queryKey: ["test_plan_drafts"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("test_plan_drafts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
});

export const overviewCountsQuery = queryOptions({
  queryKey: ["overview_counts"],
  queryFn: async () => {
    const count = async (
      query: PromiseLike<{ count: number | null; error: { message: string } | null }>,
    ) => {
      const { count, error } = await query;
      if (error) throw new Error(error.message);
      return count ?? 0;
    };
    const [lit, litDemo, obs, obsDemo, mats, bench, predictions, testPlans] = await Promise.all([
      count(supabase.from("literature_records").select("id", { count: "exact", head: true })),
      count(
        supabase
          .from("literature_records")
          .select("id", { count: "exact", head: true })
          .eq("is_demo", true),
      ),
      count(supabase.from("corrosion_observations").select("id", { count: "exact", head: true })),
      count(
        supabase
          .from("corrosion_observations")
          .select("id", { count: "exact", head: true })
          .eq("is_demo", true),
      ),
      count(supabase.from("candidate_materials").select("id", { count: "exact", head: true })),
      count(supabase.from("benchmark_results").select("id", { count: "exact", head: true })),
      count(supabase.from("prediction_records").select("id", { count: "exact", head: true })),
      count(supabase.from("test_plan_drafts").select("id", { count: "exact", head: true })),
    ]);
    return { lit, litDemo, obs, obsDemo, mats, bench, predictions, testPlans };
  },
});

/** Turn database errors into readable messages. */
export function friendlyDbError(message: string): string {
  if (message.includes("duplicate key") && message.includes("doi"))
    return "A record with this DOI already exists.";
  if (message.includes("literature_has_reference")) return "Provide a DOI or a source URL.";
  if (message.includes("violates check constraint"))
    return "One of the values is outside the allowed range or format.";
  if (message.includes("row-level security")) return "This record is not allowed to be saved.";
  return message;
}
