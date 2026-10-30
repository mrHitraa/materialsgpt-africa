// Static project scope for Phase 1. Later phases will load this from a backend.
// These are scope definitions, not scientific results.

export type CandidateMaterial = {
  id: string;
  name: string;
  family: string;
  status: "candidate" | "conditional";
  note?: string;
};

export const projectContext = {
  name: "MaterialsGPT Africa",
  team: "Solidus",
  environmentLabel: "Solar salt · ~565 °C",
  salt: {
    name: "Solar salt",
    components: [
      { compound: "NaNO₃", label: "Sodium nitrate", wtPercent: 60 },
      { compound: "KNO₃", label: "Potassium nitrate", wtPercent: 40 },
    ],
  },
  temperatureC: 565,
  objective:
    "Identify and rank alloys and coatings for concentrated solar power molten-salt storage, using traceable corrosion evidence, imported service-life predictions, benchmark comparison and a practical laboratory validation plan.",
  materials: [
    { id: "316l", name: "316L stainless steel", family: "Austenitic stainless", status: "candidate" },
    { id: "in625", name: "Inconel 625", family: "Nickel-based superalloy", status: "candidate" },
    { id: "p91", name: "P91", family: "Ferritic-martensitic steel", status: "candidate" },
    { id: "a516", name: "A516 carbon steel", family: "Carbon steel", status: "candidate" },
    {
      id: "ss430",
      name: "Stainless steel 430",
      family: "Ferritic stainless",
      status: "conditional",
      note: "Included only if sufficient solar-salt evidence exists",
    },
  ] satisfies CandidateMaterial[],
} as const;
