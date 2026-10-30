// Static study scope (salt, temperature, objective). Candidate materials live in the database.
// These are scope definitions, not scientific results.

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
} as const;
