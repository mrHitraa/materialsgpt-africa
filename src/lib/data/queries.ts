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

export const overviewCountsQuery = queryOptions({
  queryKey: ["overview_counts"],
  queryFn: async () => {
    const count = async (table: "literature_records" | "corrosion_observations" | "candidate_materials" | "benchmark_results", demo?: boolean) => {
      let q = supabase.from(table).select("id", { count: "exact", head: true });
      if (demo !== undefined && table !== "candidate_materials") q = q.eq("is_demo", demo);
      const { count, error } = await q;
      if (error) throw new Error(error.message);
      return count ?? 0;
    };
    const [lit, litDemo, obs, obsDemo, mats, bench] = await Promise.all([
      count("literature_records"),
      count("literature_records", true),
      count("corrosion_observations"),
      count("corrosion_observations", true),
      count("candidate_materials"),
      count("benchmark_results"),
    ]);
    return { lit, litDemo, obs, obsDemo, mats, bench };
  },
});

/** Turn database errors into readable messages. */
export function friendlyDbError(message: string): string {
  if (message.includes("duplicate key") && message.includes("doi")) return "A record with this DOI already exists.";
  if (message.includes("literature_has_reference")) return "Provide a DOI or a source URL.";
  if (message.includes("violates check constraint")) return "One of the values is outside the allowed range or format.";
  if (message.includes("row-level security")) return "This record is not allowed to be saved.";
  return message;
}
