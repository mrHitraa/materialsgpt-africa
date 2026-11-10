import { sourceCorpusSummary } from "@/lib/literature-corpus";

export type PipelineStageId = "knowledge" | "design" | "predict" | "plan" | "validate";

export interface PipelineCounts {
  literature: number;
  observations: number;
  materials: number;
  benchmarks: number;
}

export interface PipelineStage {
  id: PipelineStageId;
  number: string;
  title: string;
  to: "/literature" | "/materials" | "/predictions" | "/test-plans" | "/validation";
  owner: string;
  input: string;
  output: string;
  gate: string;
}

export interface PipelineStageStatus {
  label: string;
  detail: string;
  hasWorkspaceData: boolean;
}

export const pipelineStages: PipelineStage[] = [
  {
    id: "knowledge",
    number: "01",
    title: "Knowledge",
    to: "/literature",
    owner: "Powell · schema and spot checks; Raldo · extraction",
    input: "The screened local PDF set: nitrate/solar-salt studies plus marked context sources",
    output: "Verified observations with source location and matching test conditions",
    gate: "Full-text screen core sources; preserve salt chemistry, material form, atmosphere, exposure, cycling, units, and page/table/figure references.",
  },
  {
    id: "design",
    number: "02",
    title: "Design",
    to: "/materials",
    owner: "Powell · criteria; Mohsen · coatings; Raldo · ranking engine",
    input: "Verified corrosion evidence and the agreed candidate list",
    output: "Ranked candidates with explanations",
    gate: "Use the three agreed dimensions; keep cost and local availability as tags, not scores.",
  },
  {
    id: "predict",
    number: "03",
    title: "Predict",
    to: "/predictions",
    owner: "Mohsen",
    input: "Ranked candidates and model assumptions",
    output: "Versioned service-life estimates under thermal cycling",
    gate: "Import model outputs with model version, inputs, and assumptions.",
  },
  {
    id: "plan",
    number: "04",
    title: "Plan",
    to: "/test-plans",
    owner: "Powell",
    input: "Shortlisted candidates and practical lab constraints",
    output: "Readable and machine-readable test protocol",
    gate: "Agree coupon, exposure, and characterization constraints for the lab.",
  },
  {
    id: "validate",
    number: "05",
    title: "Validate",
    to: "/validation",
    owner: "Raldo · comparison; Mohsen · interpretation",
    input: "Predictions and source-linked benchmark observations",
    output: "Documented mismatches and feedback to design or the model",
    gate: "Compare only when both prediction outputs and benchmark data exist.",
  },
];

export function getPipelineStageStatus(
  stageId: PipelineStageId,
  counts: PipelineCounts,
): PipelineStageStatus {
  switch (stageId) {
    case "knowledge": {
      const retained = sourceCorpusSummary.core + sourceCorpusSummary.context;
      return {
        label: `${retained} retained · ${sourceCorpusSummary.excluded} excluded`,
        detail: `${sourceCorpusSummary.uniqueStudies} studies screened from ${sourceCorpusSummary.pdfFiles} local PDFs at title/abstract level. The workspace has ${counts.literature} non-demo source records and ${counts.observations} non-demo observations; full-text extraction and verification remain.`,
        hasWorkspaceData: true,
      };
    }
    case "design":
      return counts.materials === 0
        ? {
            label: "No candidates configured",
            detail: "Confirm the candidate list with the research team.",
            hasWorkspaceData: false,
          }
        : {
            label: `${counts.materials} candidate${counts.materials === 1 ? "" : "s"} listed`,
            detail:
              "The source set supports 316L, IN625, P91, and A516 signals. 321H, 347H, and an IN625 coating also surfaced for team review; no ranking has been computed.",
            hasWorkspaceData: true,
          };
    case "predict":
      return {
        label: "Awaiting model output",
        detail: "Prediction import is not available in this workspace yet.",
        hasWorkspaceData: false,
      };
    case "plan":
      return {
        label: "Awaiting plan inputs",
        detail: "A ranked shortlist and agreed laboratory constraints are required.",
        hasWorkspaceData: false,
      };
    case "validate":
      return counts.benchmarks === 0
        ? {
            label: "No benchmarks recorded",
            detail:
              "Add source-backed benchmark data; predictions are also required for comparison.",
            hasWorkspaceData: false,
          }
        : {
            label: `${counts.benchmarks} benchmark${counts.benchmarks === 1 ? "" : "s"} recorded`,
            detail:
              "Benchmark records are present; comparison still requires imported predictions.",
            hasWorkspaceData: true,
          };
  }
}
