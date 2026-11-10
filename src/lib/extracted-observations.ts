export interface EvidenceSource {
  id: string;
  title: string;
  authors: string;
  publication: string;
  doi?: string;
  sourceUrl?: string;
  file: string;
}

export interface ExtractedObservation {
  id: string;
  sourceId: string;
  material: string;
  saltComposition: string;
  temperatureC: number;
  exposureValue: number;
  exposureUnit: "h" | "d";
  exposureMode: "isothermal" | "thermal cycling";
  cycleProfile: string | null;
  atmosphere: string | null;
  corrosionRate: number | null;
  corrosionRateUnit: "µm/year" | "mm/year" | null;
  reportedMetric: string;
  reportedValue: number;
  reportedUnit: string;
  rateBasis: string;
  method: string;
  sourceLocation: string;
  uncertainty: string | null;
  notes: string;
  reviewStatus: "verified" | "awaiting verification" | "source conflict";
}

export const evidenceSources: EvidenceSource[] = [
  {
    id: "p91-304-in625-2023",
    title:
      "Study of Corrosion Performance and Mechanisms of P91, 304SS and IN625 Alloys in Molten Nitrate Salts Used for Thermal Energy Storage System",
    authors: "Ning Li et al.",
    publication: "Metals 13 (2023), 806",
    doi: "10.3390/met13040806",
    sourceUrl: "https://doi.org/10.3390/met13040806",
    file: "metals-13-00806.pdf",
  },
  {
    id: "high-nickel-4000h-2022",
    title: "Corrosion resistance of high nickel alloys in solar salt at 600 °C for up to 4000 h",
    authors: "Mohamed Elbakhshwan, Dong Hwi Lee, and Mark Anderson",
    publication: "Solar Energy Materials and Solar Cells (2022)",
    sourceUrl: "https://www.sciencedirect.com/science/article/pii/S0927024822002574",
    file: "1977665.pdf",
  },
  {
    id: "nitrate-thermal-cycling",
    title:
      "The corrosion behaviour of stainless steels and Ni-based alloys in nitrate salts under thermal cycling conditions in concentrated solar power plants",
    authors: "Qingyang Liu et al.",
    publication: "Research manuscript; publication details not confirmed in the supplied PDF",
    file: "ThecorrosionbehaviourofstainlesssteelsandNi-basedalloysinnitratesaltsunderthermalcyclingconditionsinconcentratedsolarpowerpla.pdf",
  },
  {
    id: "a516-chloride-2010",
    title: "Effect of Chloride Content of Molten Nitrate Salt on Corrosion of A516 Carbon Steel",
    authors: "Robert W. Bradshaw and W. Miles Clift",
    publication: "Sandia Report SAND2010-7594 (2010)",
    file: "download.pdf",
  },
  {
    id: "316l-solar-salt-2019",
    title:
      "High-temperature corrosion performance of austenitic stainless steels type AISI 316L and AISI 321H, in molten Solar Salt",
    authors: "A. Gomes et al.",
    publication: "Solar Energy 177 (2019), 408–419",
    doi: "10.1016/j.solener.2018.11.019",
    sourceUrl: "https://doi.org/10.1016/j.solener.2018.11.019",
    file: "High_temperature_corrosion_performance_o.pdf",
  },
  {
    id: "316l-atmosphere-2024",
    title: "Influence of atmosphere and austenitic stainless steel on the solar salt corrosivity",
    authors: "Sumit Kumar et al.",
    publication: "Heliyon 10 (2024), e25966",
    doi: "10.1016/j.heliyon.2024.e25966",
    sourceUrl: "https://doi.org/10.1016/j.heliyon.2024.e25966",
    file: "main.pdf",
  },
  {
    id: "316l-oxide-rich-2024",
    title:
      "Corrosion characteristics of 316L stainless steel in oxide-rich molten solar salt at 600 °C",
    authors: "Srinivasan Swaminathan et al.",
    publication: "Solar Energy Materials and Solar Cells 278 (2024), 113176",
    doi: "10.1016/j.solmat.2024.113176",
    sourceUrl: "https://doi.org/10.1016/j.solmat.2024.113176",
    file: "Corrosion-characteristics-of-316L-stainless-steel-_2024_Solar-Energy-Materia.pdf",
  },
  {
    id: "316l-lpbf-salt-composition-2024",
    title:
      "Effect of Molten Salts Composition on the Corrosion Behavior of Additively Manufactured 316L Stainless Steel for Concentrating Solar Power",
    authors: "Najib Abu-warda et al.",
    publication: "Metals 14 (2024), 639",
    doi: "10.3390/met14060639",
    sourceUrl: "https://doi.org/10.3390/met14060639",
    file: "Effect_of_Molten_Salts_Composition_on_the_Corrosio.pdf",
  },
  {
    id: "316l-nitrate-nitrite-2019",
    title:
      "316L stainless steel corrosion in molten salts NaNO3 KNO3 NaNO2 simulating storage conditions",
    authors: "A. Sandoval-Amador et al.",
    publication: "Journal of Physics: Conference Series 1159 (2019), 012011",
    doi: "10.1088/1742-6596/1159/1/012011",
    sourceUrl: "https://doi.org/10.1088/1742-6596/1159/1/012011",
    file: "Sandoval-Amador_2019_J._Phys.__Conf._Ser._1159_012011.pdf",
  },
];

const reviewStatus = "verified" as const;
export const verificationNote =
  "The original 22 numeric records were marked verified based on team confirmation; reviewer identity and review date were not recorded.";

type ObservationInput = Omit<
  ExtractedObservation,
  "reviewStatus" | "reportedMetric" | "reportedValue" | "reportedUnit"
> & {
  reportedMetric?: string;
  reportedValue?: number;
  reportedUnit?: string;
  reviewStatus?: ExtractedObservation["reviewStatus"];
};

function observation(values: ObservationInput): ExtractedObservation {
  const rateValue = values.corrosionRate;
  const rateUnit = values.corrosionRateUnit;
  return {
    ...values,
    reportedMetric: values.reportedMetric ?? "Corrosion rate",
    reportedValue: values.reportedValue ?? rateValue ?? 0,
    reportedUnit: values.reportedUnit ?? rateUnit ?? "",
    reviewStatus: values.reviewStatus ?? reviewStatus,
  };
}

export const extractedObservations: ExtractedObservation[] = [
  observation({
    id: "p91-565c-1d",
    sourceId: "p91-304-in625-2023",
    material: "P91",
    saltComposition: "60 wt% NaNO₃ / 40 wt% KNO₃ (solar salt)",
    temperatureC: 565,
    exposureValue: 1,
    exposureUnit: "d",
    exposureMode: "isothermal",
    cycleProfile: null,
    atmosphere: null,
    corrosionRate: 67.63,
    corrosionRateUnit: "µm/year",
    rateBasis: "Calculated from descaled mass loss using the paper's stated equation",
    method: "Descaled gravimetric mass loss; reported rate calculated assuming uniform corrosion",
    sourceLocation: "PDF p. 6, Results, Figure 3b",
    uncertainty: "Not stated for this value in the extracted text",
    notes:
      "The paper reports a non-monotonic rate over time; do not treat this initial rate as a steady-state rate.",
  }),
  observation({
    id: "p91-565c-12d",
    sourceId: "p91-304-in625-2023",
    material: "P91",
    saltComposition: "60 wt% NaNO₃ / 40 wt% KNO₃ (solar salt)",
    temperatureC: 565,
    exposureValue: 12,
    exposureUnit: "d",
    exposureMode: "isothermal",
    cycleProfile: null,
    atmosphere: null,
    corrosionRate: 19.73,
    corrosionRateUnit: "µm/year",
    rateBasis: "Calculated from descaled mass loss using the paper's stated equation",
    method: "Descaled gravimetric mass loss; reported rate calculated assuming uniform corrosion",
    sourceLocation: "PDF p. 6, Results, Figure 3b",
    uncertainty: "Not stated for this value in the extracted text",
    notes:
      "The reported rate rises again by day 15, so this value does not establish a long-term rate.",
  }),
  observation({
    id: "p91-565c-15d",
    sourceId: "p91-304-in625-2023",
    material: "P91",
    saltComposition: "60 wt% NaNO₃ / 40 wt% KNO₃ (solar salt)",
    temperatureC: 565,
    exposureValue: 15,
    exposureUnit: "d",
    exposureMode: "isothermal",
    cycleProfile: null,
    atmosphere: null,
    corrosionRate: 31.84,
    corrosionRateUnit: "µm/year",
    rateBasis: "Calculated from descaled mass loss using the paper's stated equation",
    method: "Descaled gravimetric mass loss; reported rate calculated assuming uniform corrosion",
    sourceLocation: "PDF p. 6, Results, Figure 3b",
    uncertainty: "Not stated for this value in the extracted text",
    notes: "The rate increased from its reported 12-day value; do not extrapolate linearly.",
  }),
  observation({
    id: "304ss-565c-1d",
    sourceId: "p91-304-in625-2023",
    material: "304SS",
    saltComposition: "60 wt% NaNO₃ / 40 wt% KNO₃ (solar salt)",
    temperatureC: 565,
    exposureValue: 1,
    exposureUnit: "d",
    exposureMode: "isothermal",
    cycleProfile: null,
    atmosphere: null,
    corrosionRate: 514.03,
    corrosionRateUnit: "µm/year",
    rateBasis: "Calculated from descaled mass loss using the paper's stated equation",
    method: "Descaled gravimetric mass loss; reported rate calculated assuming uniform corrosion",
    sourceLocation: "PDF p. 7, Results, Figure 3b",
    uncertainty: "Not stated for this value in the extracted text",
    notes: "This is the initial one-day rate; the paper reports a rapid decrease afterward.",
  }),
  observation({
    id: "in625-565c-15d",
    sourceId: "p91-304-in625-2023",
    material: "IN625",
    saltComposition: "60 wt% NaNO₃ / 40 wt% KNO₃ (solar salt)",
    temperatureC: 565,
    exposureValue: 15,
    exposureUnit: "d",
    exposureMode: "isothermal",
    cycleProfile: null,
    atmosphere: null,
    corrosionRate: 2.27,
    corrosionRateUnit: "µm/year",
    rateBasis: "Calculated from descaled mass loss using the paper's stated equation",
    method: "Descaled gravimetric mass loss; reported rate calculated assuming uniform corrosion",
    sourceLocation: "PDF p. 7, Results",
    uncertainty: "Not stated for this value in the extracted text",
    notes: "Short-duration static test; this rate is not a service-life estimate.",
  }),
  ...(
    [
      ["in625", "IN625", 2.23],
      ["h230", "H230", 3.19],
      ["740h", "740H", 3.8],
    ] as const
  ).map(([id, material, corrosionRate]) =>
    observation({
      id: `${id}-600c-4000h`,
      sourceId: "high-nickel-4000h-2022",
      material,
      saltComposition: "60 wt% NaNO₃ / 40 wt% KNO₃ (solar salt)",
      temperatureC: 600,
      exposureValue: 4000,
      exposureUnit: "h",
      exposureMode: "isothermal",
      cycleProfile: null,
      atmosphere: "Air gas cover (as stated in the paper)",
      corrosionRate,
      corrosionRateUnit: "µm/year",
      rateBasis: "Paper-reported corrosion rate after 4000 h exposure",
      method:
        "Mass-change-derived corrosion rate; details require independent check against the full methods and figure",
      sourceLocation: "PDF p. 4, Results; see also Figures 5–6 on PDF p. 14",
      uncertainty: "Figure error bars are reported; numerical uncertainty was not extracted",
      notes:
        "Tested at 600 °C, above the project's 565 °C reference condition. The alloy-specific mapping follows the paper's explicit text.",
    }),
  ),
  ...(
    [
      ["a321-iso", "AISI 321", "isothermal", 600, 434, 7],
      ["a321-tc", "AISI 321", "thermal cycling", 600, 114, 7],
      ["a347-iso", "AISI 347", "isothermal", 600, 317, 7],
      ["a347-tc", "AISI 347", "thermal cycling", 600, 124, 7],
      ["in625-iso", "IN625", "isothermal", 600, 128, 7],
      ["in625-tc", "IN625", "thermal cycling", 600, 57.7, 7],
      ["in825-iso", "IN825", "isothermal", 600, 109, 7],
      ["in825-tc", "IN825", "thermal cycling", 600, 80.8, 7],
    ] as const
  ).map(([id, material, exposureMode, temperatureC, corrosionRate, exposureValue]) =>
    observation({
      id: `${id}-solar-salt`,
      sourceId: "nitrate-thermal-cycling",
      material,
      saltComposition:
        "60 wt% NaNO₃ / 40 wt% KNO₃ (solar salt); supplier-reported impurities in PDF Table 3",
      temperatureC,
      exposureValue,
      exposureUnit: "d",
      exposureMode,
      cycleProfile:
        exposureMode === "thermal cycling"
          ? "250–600 °C; approximately 12 h at each temperature per 24 h cycle; 10 °C/min ramp with 35-minute interval"
          : null,
      atmosphere: "Argon",
      corrosionRate,
      corrosionRateUnit: "µm/year",
      rateBasis: "Calculated from descaled mass loss; short test rate expressed on an annual basis",
      method: "Descaled gravimetric mass loss; uniform-corrosion assumption",
      sourceLocation: "PDF p. 8, Results/Figure 4; Table 6 on PDF p. 27",
      uncertainty: "Not stated for these tabulated values",
      notes:
        exposureMode === "thermal cycling"
          ? "The cycle result combines cooling time and reduced time at 600 °C; it is not an isolated thermal-fatigue effect."
          : "600 °C isothermal comparator; do not pool with the thermal-cycling result.",
    }),
  ),
  ...(
    [
      ["400c-0cl", 400, 0, 810, 0.078],
      ["400c-05cl", 400, 0.5, 811, 0.198],
      ["400c-1cl", 400, 1, 804, 0.405],
      ["450c-0cl", 450, 0, 642, 0.299],
      ["450c-05cl", 450, 0.5, 724, 0.734],
      ["450c-1cl", 450, 1, 602, 1.531],
    ] as const
  ).map(([id, temperatureC, chlorideWtPercent, exposureValue, corrosionRate]) =>
    observation({
      id: `a516-${id}`,
      sourceId: "a516-chloride-2010",
      material: "A516 carbon steel",
      saltComposition: `60 wt% NaNO₃ / 40 wt% KNO₃ with ${chlorideWtPercent} wt% chloride ion`,
      temperatureC,
      exposureValue,
      exposureUnit: "h",
      exposureMode: "isothermal",
      cycleProfile: null,
      atmosphere: null,
      corrosionRate,
      corrosionRateUnit: "mm/year",
      rateBasis:
        "Annualized by linear extrapolation of the test-period metal loss to 8760 h; authors describe this as an upper-bound estimate",
      method: "Descaled metal loss; uniform surface-recession assumption",
      sourceLocation: "PDF p. 12, Table 2",
      uncertainty: "No error bars stated in the reported table",
      notes:
        "The annualized rate is an extrapolation, not a year-long observation. Chloride level and temperature must remain explicit.",
    }),
  ),
  ...(
    [
      ["air-500h", "Synthetic air", 500, 2.23],
      ["air-1000h", "Synthetic air", 1000, 6.53],
      ["nitrogen-500h", "Nitrogen", 500, 11.84],
      ["nitrogen-1000h", "Nitrogen", 1000, 44.58],
    ] as const
  ).map(([id, atmosphere, exposureValue, reportedValue]) =>
    observation({
      id: `316l-${id}`,
      sourceId: "316l-atmosphere-2024",
      material: "AISI 316L",
      saltComposition: "60 wt% NaNO₃ / 40 wt% KNO₃ (solar salt)",
      temperatureC: 600,
      exposureValue,
      exposureUnit: "h",
      exposureMode: "isothermal",
      cycleProfile: null,
      atmosphere,
      corrosionRate: null,
      corrosionRateUnit: null,
      reportedMetric: "Descaled mass loss per unit area",
      reportedValue,
      reportedUnit: "mg/cm²",
      rateBasis: "Direct descaled gravimetric mass-loss result; not converted to a corrosion rate",
      method: "ASTM G1 descaling and area-specific mass-loss measurement",
      sourceLocation: "PDF p. 8, Section 3.2.1; Figure 7 on PDF p. 9",
      uncertainty: "No numerical uncertainty transcribed for these results",
      notes:
        "Atmosphere is a key condition: nitrogen results are substantially higher than synthetic-air results in this study. Do not compare across atmospheres as if they were equivalent.",
      reviewStatus: "verified",
    }),
  ),
  observation({
    id: "316l-550c-solar-salt-2019",
    sourceId: "316l-solar-salt-2019",
    material: "AISI 316L",
    saltComposition: "60 wt% NaNO₃ / 40 wt% KNO₃ (solar salt)",
    temperatureC: 550,
    exposureValue: 3000,
    exposureUnit: "h",
    exposureMode: "isothermal",
    cycleProfile: null,
    atmosphere: "Atmospheric air",
    corrosionRate: 8.6,
    corrosionRateUnit: "µm/year",
    reportedMetric: "Corrosion rate",
    reportedValue: 8.6,
    reportedUnit: "µm/year",
    rateBasis:
      "Rate stated in the supplied abstract; calculation and interval are not reported there",
    method:
      "Weight-change monitoring over exposure intervals; abstract describes exposure up to 3000 h",
    sourceLocation: "PDF p. 1, abstract",
    uncertainty: "Not available in the supplied abstract text",
    notes:
      "The supplied PDF contains only the abstract. It reports weight changes at intervals up to 3000 h, but does not identify which interval or calculation produced the 8.6 µm/year rate.",
    reviewStatus: "awaiting verification",
  }),
];

export interface QualitativeEvidenceFinding {
  id: string;
  sourceId: string;
  material: string;
  conditions: string;
  finding: string;
  sourceLocation: string;
  scopeNote: string;
  reviewStatus: "verified" | "awaiting verification" | "source conflict";
}

export const qualitativeEvidenceFindings: QualitativeEvidenceFinding[] = [
  {
    id: "316l-oxide-threshold",
    sourceId: "316l-oxide-rich-2024",
    material: "AISI 316L",
    conditions:
      "60/40 wt% solar salt at 600 °C for 168 h in synthetic air; separate tests with 0, 0.005, 0.07, 0.135, and 0.2 wt% added Na₂O",
    finding:
      "The authors report more severe corrosion as Na₂O increases; dissolution and scale spallation are dominant at 0.135 and 0.2 wt% additions. This is condition-specific evidence about oxide impurity, not a baseline 565 °C corrosion-rate value.",
    sourceLocation: "PDF pp. 1, 3–4, and 11",
    scopeNote:
      "Wrought 316L; no numeric corrosion rate transcribed from this paper in this extraction.",
    reviewStatus: "verified",
  },
  {
    id: "316l-lpbf-high-temp-salt",
    sourceId: "316l-lpbf-salt-composition-2024",
    material: "L-PBF 316L",
    conditions:
      "Additively manufactured 316L tested at 650 and 700 °C for 48 h; nitrate/nitrite salt was 53 wt% KNO₃, 7 wt% NaNO₃, and 40 wt% NaNO₂",
    finding:
      "The study reports salt-dependent metal damage, with chloride salts more aggressive than the nitrate/nitrite mixture. The nitrate/nitrite results are not equivalent to binary 60/40 solar salt.",
    sourceLocation: "PDF pp. 3–6; Figure 3 on PDF p. 6",
    scopeNote:
      "L-PBF material form and different salt chemistry and temperatures must remain separate from wrought 316L at the 565 °C reference condition.",
    reviewStatus: "verified",
  },
  {
    id: "316l-nitrate-nitrite-2019",
    sourceId: "316l-nitrate-nitrite-2019",
    material: "AISI 316L",
    conditions:
      "Methodology/results/figure caption/conclusion report 7 wt% NaNO₃, 53 wt% NaNO₂, and 40 wt% KNO₃; 150 h tests at 450, 500, and 550 °C using sprayed salt in an oxidizing atmosphere",
    finding:
      "The paper reports gravimetric mass-gain measurements and temperature-dependent oxide products; the plot values were not transcribed numerically here.",
    sourceLocation:
      "PDF pp. 3–5; Methodology, Results, Figure 1 caption, Table 2, and Conclusion. Introduction on PDF p. 3 gives a conflicting salt formulation.",
    scopeNote:
      "Source text checked on 2026-11-10. The Introduction lists 7 wt% NaNO₃, 53 wt% KNO₃, and 40 wt% NaNO₂, while Methodology, Results, Figure 1 caption, Table 2, and Conclusion support 7 wt% NaNO₃, 53 wt% NaNO₂, and 40 wt% KNO₃. This record follows the latter formulation, but the internal conflict remains unresolved. The ternary salt is not the binary solar-salt baseline.",
    reviewStatus: "source conflict",
  },
];

export const evidenceSummary = {
  sources: evidenceSources.length,
  observations: extractedObservations.length,
  verified: extractedObservations.filter((item) => item.reviewStatus === "verified").length,
  awaitingVerification: extractedObservations.filter(
    (item) => item.reviewStatus === "awaiting verification",
  ).length,
  verifiedQualitativeFindings: qualitativeEvidenceFindings.filter(
    (item) => item.reviewStatus === "verified",
  ).length,
  awaitingQualitativeVerification: qualitativeEvidenceFindings.filter(
    (item) => item.reviewStatus === "awaiting verification",
  ).length,
  sourceConflictQualitativeFindings: qualitativeEvidenceFindings.filter(
    (item) => item.reviewStatus === "source conflict",
  ).length,
};

export function getEvidenceSource(sourceId: string) {
  return evidenceSources.find((source) => source.id === sourceId);
}
