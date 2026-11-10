export type SourceDisposition = "core" | "context" | "excluded";

export interface ScreenedSource {
  id: string;
  title: string;
  reference: string;
  doi?: string;
  files: string[];
  disposition: SourceDisposition;
  topics: string[];
  rationale: string;
}

const reviewFolder = "Downloads\\Literature Review-20261105T060209Z-1-001\\Literature Review";

export const reviewCorpusFolder = reviewFolder;

export const screenedSources: ScreenedSource[] = [
  {
    id: "solar-salt-austenitic-failure-review",
    title:
      "Understanding failure in austenitic steels: Key considerations for molten salt storage in CSP applications",
    reference: "Journal of Materials Research and Technology, 2026",
    doi: "10.1016/j.jmrt.2026.02.207",
    files: ["1-s2.0-S2238785426004576-main.pdf"],
    disposition: "context",
    topics: ["CSP failure", "austenitic steels"],
    rationale:
      "Use for failure mechanisms and context; review conclusions are not individual corrosion measurements.",
  },
  {
    id: "high-nickel-alloys-solar-salt",
    title: "Corrosion resistance of high nickel alloys in solar salt at 600 °C for up to 4000 h",
    reference: "Research paper; PDF citation metadata did not expose a DOI",
    files: ["1977665.pdf"],
    disposition: "core",
    topics: ["solar salt", "IN625", "long exposure"],
    rationale:
      "Direct solar-salt exposure study with extended-duration testing; extract alloy-specific values from the full text.",
  },
  {
    id: "nrel-tank-failure-analysis",
    title:
      "Failure Analysis for Molten Salt Thermal Energy Storage Tanks for In-Service CSP Plants",
    reference: "NREL/TP-5700-89036, 2024",
    files: ["89036.pdf"],
    disposition: "context",
    topics: ["tank failure", "CSP operation"],
    rationale:
      "Use for system-level failure and validation context, not as a coupon corrosion-rate record.",
  },
  {
    id: "316l-oxide-rich-solar-salt",
    title:
      "Corrosion characteristics of 316L stainless steel in oxide-rich molten solar salt at 600 °C",
    reference: "Solar Energy Materials and Solar Cells, 2024",
    doi: "10.1016/j.solmat.2024.113176",
    files: ["Corrosion-characteristics-of-316L-stainless-steel-_2024_Solar-Energy-Materia.pdf"],
    disposition: "core",
    topics: ["316L", "solar salt", "oxide impurity"],
    rationale:
      "Direct solar-salt evidence; retain oxide content as a test condition rather than pooling with unspecified salt.",
  },
  {
    id: "316-and-in625-chloride-salts",
    title:
      "Corrosion behaviors of 316 stainless steel and Inconel 625 alloy in chloride molten salts for solar energy storage",
    reference: "High Temperature Materials and Processes, 2020",
    doi: "10.1515/htmp-2020-0077",
    files: ["Corrosion_behaviors_of_316_stainless_steel_and_Inc.pdf"],
    disposition: "excluded",
    topics: ["chloride salt"],
    rationale:
      "NaCl-KCl-ZnCl2 results are not comparable to the project's nitrate solar-salt scope.",
  },
  {
    id: "a516-nitrate-chloride-content",
    title: "Effect of Chloride Content of Molten Nitrate Salt on Corrosion of A516 Carbon Steel",
    reference: "Sandia Report SAND2010-7594, 2010",
    files: ["download.pdf"],
    disposition: "core",
    topics: ["A516", "nitrate salt", "chloride impurity"],
    rationale:
      "Relevant carbon-steel evidence; chloride content is an explicit variable and must remain attached to each record.",
  },
  {
    id: "additive-316l-salt-composition",
    title:
      "Effect of Molten Salts Composition on the Corrosion Behavior of Additively Manufactured 316L Stainless Steel for Concentrating Solar Power",
    reference: "Metals, 2024",
    doi: "10.3390/met14060639",
    files: ["Effect_of_Molten_Salts_Composition_on_the_Corrosio.pdf"],
    disposition: "core",
    topics: ["316L", "additive manufacturing", "salt composition"],
    rationale:
      "Relevant evidence, but preserve manufacturing route and salt composition; do not merge blindly with wrought 316L.",
  },
  {
    id: "316l-321h-solar-salt",
    title:
      "High-temperature corrosion performance of austenitic stainless steels type AISI 316L and AISI 321H, in molten Solar Salt",
    reference: "Solar Energy, 2018",
    doi: "10.1016/j.solener.2018.11.019",
    files: ["High_temperature_corrosion_performance_o.pdf"],
    disposition: "core",
    topics: ["316L", "321H", "solar salt"],
    rationale:
      "Direct solar-salt evidence for 316L and 321H; retain alloy grade and test conditions separately.",
  },
  {
    id: "in625-molten-nitrate",
    title: "Hot Corrosion Behavior of Inconel 625 Superalloy in Eutectic Molten Nitrate Salts",
    reference: "Oxidation of Metals, 2018",
    doi: "10.1007/s11085-017-9830-5",
    files: ["HotCorrosionBehaviorofInconel625Superalloy.pdf"],
    disposition: "core",
    topics: ["Inconel 625", "nitrate salt"],
    rationale:
      "Nitrate-salt evidence; keep its reported temperature and salt conditions distinct from the fixed project reference condition.",
  },
  {
    id: "atmosphere-solar-salt",
    title: "Influence of atmosphere and austenitic stainless steel on the solar salt corrosivity",
    reference: "Heliyon, 2024",
    doi: "10.1016/j.heliyon.2024.e25966",
    files: ["main.pdf"],
    disposition: "core",
    topics: ["solar salt", "atmosphere", "austenitic steel"],
    rationale: "Directly informs recording atmosphere as an experimental condition.",
  },
  {
    id: "ferritic-steels-solar-salt",
    title:
      "Kinetic and Thermodynamic Aspects of the Degradation of Ferritic Steels Immersed in Solar Salt",
    reference: "Materials, 2024",
    doi: "10.3390/ma17235776",
    files: ["materials-17-05776.pdf"],
    disposition: "core",
    topics: ["ferritic steels", "solar salt", "kinetics"],
    rationale:
      "Relevant ferritic-steel evidence; extract the specific grade and test conditions from the paper.",
  },
  {
    id: "p91-304-in625-nitrate",
    title:
      "Study of Corrosion Performance and Mechanisms of P91, 304SS and IN625 Alloys in Molten Nitrate Salts Used for Thermal Energy Storage System",
    reference: "Metals, 2023",
    doi: "10.3390/met13040806",
    files: ["metals-13-00806.pdf"],
    disposition: "core",
    topics: ["P91", "304 stainless steel", "Inconel 625", "nitrate salt"],
    rationale:
      "Directly informs the candidate comparison; verify the precise salt, temperature, and exposure before comparing values.",
  },
  {
    id: "347h-precorrosion-fatigue",
    title:
      "Effect of Pre-Corrosion on the Fatigue Behavior of 347H Austenitic Stainless Steel at Elevated Temperature",
    reference: "Metals, 2026",
    doi: "10.3390/met16101124",
    files: ["metals-16-01124.pdf"],
    disposition: "context",
    topics: ["347H", "fatigue", "pre-corrosion"],
    rationale:
      "Potentially informs the fatigue workstream; confirm exposure details and relevance to solar-salt thermal cycling during full-text review.",
  },
  {
    id: "in625-nitrate-coating",
    title:
      "Corrosion Behavior of Plasma-Sprayed In625 Coatings Exposed to Nitrate Salts in Concentrating Solar Power Plants",
    reference: "Journal of Thermal Spray Technology, 2026",
    doi: "10.1007/s11666-026-02281-8",
    files: ["s11666-026-02281-8.pdf"],
    disposition: "core",
    topics: ["In625 coating", "nitrate salt", "coating process"],
    rationale:
      "Supports a separate coating evidence stream; do not treat coating results as bulk-alloy results.",
  },
  {
    id: "carbon-steel-nitrate-inhibition",
    title:
      "A simple method for the inhibition of the corrosion of carbon steel by molten nitrate salt for thermal storage in concentrating solar power applications",
    reference: "npj Materials Degradation, 2018",
    doi: "10.1038/s41529-018-0055-0",
    files: ["s41529-018-0055-0.pdf"],
    disposition: "core",
    topics: ["carbon steel", "nitrate salt", "corrosion inhibition"],
    rationale:
      "Relevant to carbon steel and mitigation; distinguish treated/inhibited specimens from baseline alloy evidence.",
  },
  {
    id: "316l-nitrate-nitrite",
    title:
      "316L stainless steel corrosion in molten salts NaNO3 KNO3 NaNO2 simulating storage conditions",
    reference: "Journal of Physics: Conference Series, 2019",
    doi: "10.1088/1742-6596/1159/1/012011",
    files: ["Sandoval-Amador_2019_J._Phys.__Conf._Ser._1159_012011.pdf"],
    disposition: "context",
    topics: ["316L", "nitrate/nitrite salt"],
    rationale:
      "Useful boundary-condition evidence, but the added nitrite means it is not the 60/40 solar-salt baseline.",
  },
  {
    id: "in625-chloride-cladding",
    title:
      "Study of corrosion behavior of Inconel 625 cladding metal in KCl-MgCl2 molten salt under isothermal and thermal cycling conditions",
    reference: "Journal of Materials Science, 2023",
    doi: "10.1007/s10853-023-08823-7",
    files: ["Study_of_corrosion_behavior_of_Inconel_625_claddin.pdf"],
    disposition: "excluded",
    topics: ["Inconel 625 cladding", "chloride salt", "thermal cycling"],
    rationale:
      "KCl-MgCl2 is a chloride system, not the project's nitrate solar salt; retain only as out-of-scope context.",
  },
  {
    id: "nitrate-salt-thermal-cycling",
    title:
      "The corrosion behaviour of stainless steels and Ni-based alloys in nitrate salts under thermal cycling conditions in concentrated solar power plants",
    reference: "Research paper; PDF citation metadata did not expose a DOI",
    files: [
      "ThecorrosionbehaviourofstainlesssteelsandNi-basedalloysinnitratesaltsunderthermalcyclingconditionsinconcentratedsolarpowerpla.pdf",
      "ThecorrosionbehaviourofstainlesssteelsandNi-basedalloysinnitratesaltsunderthermalcyclingconditionsinconcentratedsolarpowerpla (1).pdf",
    ],
    disposition: "core",
    topics: ["nitrate salt", "thermal cycling", "stainless and nickel alloys"],
    rationale:
      "Directly informs the thermal-cycling workflow; the two files are an exact duplicate and count as one study.",
  },
  {
    id: "district-heat-forecast",
    title:
      "Assessing the feasibility of using the heat demand-outdoor temperature function for a long-term district heat demand forecast",
    reference: "Energy Procedia, 2017",
    doi: "10.1016/j.egypro.2017.12.781",
    files: [
      "1-s2.0-S1876610217365463-main.pdf",
      "Corrosion_resistance_of_310S_and_316L_austenitic_s.pdf",
    ],
    disposition: "excluded",
    topics: ["unrelated to molten-salt corrosion"],
    rationale:
      "The PDF contents and DOI identify a district-heating forecast paper, despite one misleading local filename.",
  },
];

export const sourceCorpusSummary = {
  pdfFiles: screenedSources.reduce((total, source) => total + source.files.length, 0),
  uniqueStudies: screenedSources.length,
  core: screenedSources.filter((source) => source.disposition === "core").length,
  context: screenedSources.filter((source) => source.disposition === "context").length,
  excluded: screenedSources.filter((source) => source.disposition === "excluded").length,
};

export const rankingCriteria = [
  {
    name: "Corrosion rate",
    description:
      "Compare only records with compatible salt chemistry, material form, temperature, exposure, and measurement units.",
  },
  {
    name: "Thermal fatigue resistance",
    description: "Keep cycling profile and pre-corrosion history attached to the evidence.",
  },
  {
    name: "Evidence confidence",
    description: "Reflect the quantity and traceability of comparable published evidence.",
  },
] as const;

export const extractionChecklist = [
  "Material grade, manufacturing route, and coating/substrate where applicable",
  "Salt composition and reported impurities",
  "Temperature and exposure duration with units",
  "Static or thermal-cycling mode, including the reported cycle profile",
  "Atmosphere and other stated test conditions",
  "Corrosion metric, reported value, and original unit",
  "Exact source page, table, or figure for each extracted value",
] as const;

export const contextualMaterialLeads = [
  {
    name: "AISI 321H",
    note: "Appears in a direct solar-salt study; confirm with the team before adding it to the candidate roster.",
    sourceId: "316l-321h-solar-salt",
  },
  {
    name: "347H stainless steel",
    note: "Appears in a pre-corrosion/fatigue paper; solar-salt cycling relevance needs full-text review.",
    sourceId: "347h-precorrosion-fatigue",
  },
  {
    name: "Plasma-sprayed In625 coating",
    note: "Coating evidence is present and must remain distinct from bulk Inconel 625 alloy evidence.",
    sourceId: "in625-nitrate-coating",
  },
] as const;

export function getCandidateEvidenceStatus(materialName: string) {
  const normalized = materialName.toLocaleLowerCase();
  const matchingSources = screenedSources.filter(
    (source) =>
      source.disposition === "core" &&
      source.topics.some((topic) => normalized.includes(topic.toLocaleLowerCase())),
  );
  return matchingSources;
}
