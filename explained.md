# How MaterialsGPT Africa Works

## 1. What the system is for

MaterialsGPT Africa is a research-workflow dashboard for the Solidus team. It organizes evidence for materials used in concentrated solar power (CSP) molten-salt thermal energy storage.

The current study context is defined in `src/lib/project-context.ts`:

- Salt: solar salt, 60 wt% sodium nitrate (NaNO3) and 40 wt% potassium nitrate (KNO3).
- Reference temperature: approximately 565 °C.
- Objective: compare alloys and coatings using traceable evidence, then connect that evidence to predictions, validation, and practical laboratory planning.

The project is a research-support tool, not a materials certification system. A source appearing in the app does not mean its results have been extracted, independently checked, or shown to apply to the reference condition.

## 2. The five-stage workflow

The app presents the research process as five stages. The stage definitions, owners, handoffs, and gates are in `src/lib/pipeline.ts`.

| Stage | What it does | Current state |
|---|---|---|
| **Knowledge** | Screen research, record publications, and extract corrosion observations with their conditions and source locations. | A literature set has been screened at title/abstract and citation-metadata level. Users can add literature records. Full-text data extraction and verification are still needed. |
| **Design** | Compare the agreed candidate materials and coatings using evidence and explainable criteria. | Candidate materials and literature signals are shown. The app does not calculate scores or rankings. |
| **Predict** | Bring in versioned service-life estimates under thermal cycling. | Placeholder only; no prediction model or import workflow is implemented. |
| **Plan** | Convert evidence gaps and a shortlist into a practical laboratory protocol. | Placeholder only; no protocol generator is implemented. |
| **Validate** | Compare predictions with source-backed benchmark or laboratory data, document mismatches, and feed findings back into Design or Predict. | Placeholder only; no comparison engine is implemented. |

Each stage page shows its expected inputs, output, owner, and gate. The Overview status is a summary of available records, **not an approval that a scientific gate has passed**.

## 3. How the literature set is used

The supplied PDFs are located at:

`C:\Users\chimw\Downloads\Literature Review-20261105T060209Z-1-001\Literature Review`

The app currently has a curated source catalog in `src/lib/literature-corpus.ts`. It groups 21 PDF files into 19 study records and labels them as:

- **Core evidence (12):** relevant nitrate or solar-salt corrosion studies for the current research scope.
- **Context (4):** useful for broader CSP failures or boundary conditions, but not automatically comparable coupon results.
- **Excluded (3):** unrelated or chloride-salt studies that must not be mixed into the nitrate-salt comparison.

Duplicate copies are grouped under one study. A study can still be relevant while having conditions that differ from the 60/40 solar-salt reference—for example, a different temperature, salt impurity, atmosphere, manufacturing route, or thermal-cycling profile. Those conditions need to stay attached to any observation extracted from it.

The catalog was prepared from available PDF titles, abstracts, and citation metadata. It is an initial screen, not a systematic full-text review. It does not contain extracted experimental values. The PDFs stay in the Downloads folder: the app does not copy, upload, or parse them at runtime. The catalog's source-file names are local references and will not resolve on another computer unless that person has the same files.

### Extraction checklist

When a researcher extracts an observation from a paper, the record should preserve:

1. Material grade, manufacturing route, and coating/substrate where applicable.
2. Salt composition and reported impurities.
3. Temperature and exposure duration, including units.
4. Static or thermal-cycling test mode and the reported cycle profile.
5. Atmosphere and other stated experimental conditions.
6. Corrosion metric, reported value, and original unit.
7. Exact source page, table, or figure.

Values with materially different test conditions should not be combined as if they were directly comparable. The extraction checklist is shown on the Literature page, but the current app does not yet provide a form for entering corrosion observations or their page/table/figure locations.

## 4. How candidate materials are represented

The Materials page reads candidate records from the `candidate_materials` database table. The initial candidate roster is seeded in `drizzle/migrations/0000_migration.sql`:

- 316L stainless steel
- Inconel 625
- P91 ferritic-martensitic steel
- A516 carbon steel
- Stainless steel 430, marked conditional pending sufficient solar-salt evidence

The page also matches candidate names against topics in the local literature catalog. This produces a **title/abstract-level evidence signal only**. It is not a full-text match, verified evidence count, performance comparison, or ranking. An apparent lack of a match does not prove that no evidence exists.

The source set also surfaces AISI 321H, 347H, and plasma-sprayed In625 coating as leads for the team to review. These are not automatically added to the candidate roster. Bulk alloys and coatings are kept distinct.

The team brief identifies three eventual ranking dimensions:

- Corrosion rate.
- Thermal-fatigue resistance.
- Confidence in the amount and quality of published evidence.

Cost and local availability are descriptive tags, not ranking scores. The app contains no scoring weights or ranking formula because the team has not supplied approved rules.

## 5. Pages and what users can do

Routes are defined in `src/routes/`, and navigation is configured in `src/lib/navigation.ts`.

- **Overview (`/`)** — Shows database counts, the five-stage workflow, and the study context.
- **Literature (`/literature`)** — Shows the screened source catalog, allows a user to add a publication with a DOI or source URL, and displays any corrosion observations already associated with that publication.
- **Materials (`/materials`)** — Lists configured candidate alloys/coatings and shows literature signals and team-review leads.
- **Predictions (`/predictions`)** — Placeholder for importing model predictions.
- **Test Plans (`/test-plans`)** — Placeholder for generating laboratory protocols.
- **Validation (`/validation`)** — Placeholder for comparing predictions with benchmark data.
- **Settings (`/settings`)** — Placeholder for future workspace and project preferences.

The Literature form validates required bibliographic fields and requires a DOI or source URL so records can be traced. It inserts a non-demo literature record into the configured Supabase project. The current UI does not upload PDFs, extract article content, create observation records, or edit and delete publications.

## 6. Data and application architecture

The project uses:

- **React and TypeScript** for the user interface.
- **TanStack Router** for page routes.
- **TanStack Query** for loading and refreshing remote records.
- **Supabase** for database access.
- **Zod** schemas in `src/lib/data/schemas.ts` for client-side input validation.
- **PostgreSQL** tables and constraints represented by the checked-in migration in `drizzle/migrations/0000_migration.sql`.

The main database records are:

- `literature_records` — Publication metadata, DOI/source links, extraction status, and a demo-data flag.
- `corrosion_observations` — A material's measured response under stated salt, temperature, exposure, and test conditions; each observation links back to a literature record.
- `candidate_materials` — Candidate names, alloy/coating type, and descriptive cost/availability tags.
- `benchmark_results` — Source-linked benchmark values for a candidate material.

Queries are in `src/lib/data/queries.ts`. Database-backed literature and candidate data are separate from the local source catalog: listing a PDF in the catalog does not insert it into Supabase.

The seeded demo literature records and observations are explicitly marked as demo data. They are illustrative placeholders and must not be used as experimental results.

### Access and data handling

The current database policies allow public reads of research records and anonymous insertion of pending, non-demo literature records and unverified, non-demo observations. The app does not currently have a user sign-in, team roles, or a verification/approval interface. Do not put confidential or unpublished research into this version until access controls and review workflows have been designed.

## 7. Running the project locally

Install dependencies and start the development server:

```powershell
npm install
npm run dev
```

Configure the Supabase URL and publishable key using the environment-variable names expected by `src/integrations/supabase/client.ts`. Do not commit credentials. The app needs a reachable, configured Supabase project with the required schema; without it, database-backed pages will show an error.

Useful checks:

```powershell
npm test -- --run
npx tsc --noEmit
npm run build
```

## 8. Current limits and next work

The current application is an informed workflow shell with a source catalog, not an automated discovery or AI extraction system.

Not implemented yet:

- PDF selection, upload, parsing, or text extraction.
- Literature search across Semantic Scholar, OpenAlex, Crossref, CORE, Europe PMC, arXiv, or OSTI.
- A review queue for checking extracted statements against full text.
- Corrosion-observation entry, source page/table/figure coordinates, or Powell's batch spot-check/error-rate workflow.
- Final candidate-list approval with the research team.
- Ranking weights, score computation, or automatic material recommendations.
- Mohsen's service-life model or prediction import.
- Test-plan generation using confirmed laboratory constraints.
- Prediction-to-benchmark comparison and mismatch tracking.
- User authentication, role-based access, or private team workspaces.

The safe next sequence is to agree the candidate roster and extraction schema, complete a human-reviewed full-text extraction of the core papers, record the source location for each value, and report spot-check results. Only after those inputs are agreed should the team define ranking rules, connect prediction outputs, and generate validation plans.
