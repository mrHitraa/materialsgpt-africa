import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer`)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional();

const optionalUrl = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional()
  .refine((v) => v == null || /^https?:\/\/\S+$/i.test(v), "Must start with http:// or https://");

export const literatureInputSchema = z
  .object({
    title: z.string().trim().min(3, "Title is required (at least 3 characters)").max(500),
    authors: z.string().trim().min(2, "Authors are required").max(1000),
    publication_year: z.coerce
      .number({ invalid_type_error: "Year must be a number" })
      .int("Year must be a whole number")
      .min(1900, "Year must be 1900 or later")
      .max(2100, "Year must be 2100 or earlier"),
    journal: optionalText(300),
    doi: z
      .string()
      .trim()
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .optional()
      .refine((v) => v == null || /^10\.\d{4,9}\/\S+$/i.test(v), "DOI must look like 10.1234/abc"),
    source_url: optionalUrl,
    full_text_url: optionalUrl,
    source_database: optionalText(100),
  })
  .refine((v) => v.doi != null || v.source_url != null, {
    message: "Provide a DOI or a source URL so the record is traceable",
    path: ["doi"],
  });

export type LiteratureInput = z.input<typeof literatureInputSchema>;

export const observationInputSchema = z
  .object({
    literature_record_id: z.string().uuid("Select a literature record"),
    material_name: z.string().trim().min(2, "Material is required"),
    salt_composition: z.string().trim().min(2, "Salt composition is required"),
    temperature_c: z.coerce.number({ invalid_type_error: "Temperature must be a number" }).min(-273.15).max(2000),
    exposure_time: z.coerce.number().positive("Exposure time must be positive").nullable().optional(),
    exposure_time_unit: z.enum(["h", "d", "cycles"]).nullable().optional(),
    corrosion_rate: z.coerce.number().min(0, "Corrosion rate cannot be negative").nullable().optional(),
    corrosion_rate_unit: z.enum(["µm/yr", "mm/yr", "mg/cm²", "mg/cm²/h"]).nullable().optional(),
  })
  .refine((v) => (v.exposure_time == null) === (v.exposure_time_unit == null), {
    message: "Exposure time needs a unit",
    path: ["exposure_time_unit"],
  })
  .refine((v) => (v.corrosion_rate == null) === (v.corrosion_rate_unit == null), {
    message: "Corrosion rate needs a unit",
    path: ["corrosion_rate_unit"],
  });

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
