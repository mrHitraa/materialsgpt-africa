import { sourceCorpusSummary } from "@/lib/literature-corpus";
import { getDesignEvidenceSummary } from "@/lib/design-evidence";

export type PipelineStageId = "knowledge" | "design" | "predict" | "plan" | "validate";

export interface PipelineCounts {
  literature: number;
  observations: number;
  materials: number;
  benchmarks: number;
  predictions: number;
  testPlans: number;
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
    output:
      "Confirmed research scope and condition-aware comparison framework; weighted ranking is deferred",
    gate: "Framework complete for the approved IN625/P91/316L hot-side scope and separate A516 track. Confirm A516's component service temperature before including it in that roster. No aggregate ranking until criterion weights are approved.",
  },
  {
    id: "predict",
    number: "03",
    title: "Predict",
    to: "/predictions",
    owner: "Mohsen",
    input: "Confirmed candidate scope and outputs from an approved external model",
    output: "Source-linked model outputs with version, conditions, endpoint, and assumptions",
    gate: "Import externally generated outputs with model provenance, inputs, uncertainty, and failure criterion. This workspace does not execute a prediction model.",
  },
  {
    id: "plan",
    number: "04",
    title: "Plan",
    to: "/test-plans",
    owner: "Powell",
    input: "Confirmed research scope and laboratory-approved constraints",
    output: "Readable draft plan with unresolved inputs identified",
    gate: "Resolve TBD fields and complete laboratory and safety review. A saved draft is not approval to begin experiments.",
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
      const evidenceSummary = getDesignEvidenceSummary();
      return {
        label: `${retained} retained · ${sourceCorpusSummary.excluded} excluded`,
        detail: `${sourceCorpusSummary.uniqueStudies} studies screened from ${sourceCorpusSummary.pdfFiles} local PDFs. The evidence set contains ${evidenceSummary.verifiedRecordCount} verified numeric records; numeric verifications pending: ${evidenceSummary.awaitingVerificationCount}, drawn from ${evidenceSummary.studyCount} papers. Qualitative findings source-checked: ${evidenceSummary.verifiedQualitativeFindingCount}; pending: ${evidenceSummary.awaitingQualitativeVerificationCount}; source conflicts: ${evidenceSummary.sourceConflictQualitativeFindingCount}. ${counts.literature} source records and ${counts.observations} observations are also stored in the workspace database.`,
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
            label: `Stage 02 design framework complete · ${counts.materials} candidate${counts.materials === 1 ? "" : "s"} listed`,
            detail:
              "The confirmed research scope compares IN625/P91/316L for the hot-side question and keeps A516 in a separate track pending component-temperature confirmation. Criteria and condition-matching rules are defined; weights and scoring are deferred, so no ranking is computed. Evidence gaps remain visible.",
            hasWorkspaceData: true,
          };
    case "predict":
      return counts.predictions === 0
        ? {
            label: "Awaiting eligible evidence or imported model outputs",
            detail:
              "The exact-condition database rate estimator is available but needs fully characterized, verified observations. External model outputs can also be imported; this workspace does not execute models or estimate service life.",
            hasWorkspaceData: false,
          }
        : {
            label: `${counts.predictions} model output${counts.predictions === 1 ? "" : "s"} imported`,
            detail:
              "Imported outputs are recorded with their model provenance and remain unvalidated until compared with independent benchmark data.",
            hasWorkspaceData: true,
          };
    case "plan":
      return counts.testPlans === 0
        ? {
            label: "No test plan drafts",
            detail:
              "Create a draft from the confirmed research scope. Keep unprovided lab constraints as TBD; do not treat a draft as an approved protocol.",
            hasWorkspaceData: false,
          }
        : {
            label: `${counts.testPlans} test plan draft${counts.testPlans === 1 ? "" : "s"}`,
            detail:
              "Draft plan records are stored; laboratory review and approval are still required before use.",
            hasWorkspaceData: true,
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
