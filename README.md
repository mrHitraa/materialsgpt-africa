# MaterialsGPT Africa

We are building MaterialsGPT Africa for the Solidus team.

The project is an end-to-end materials-discovery platform for concentrated solar power molten-salt storage. It will help researchers:

1. Collect and structure corrosion research data.

2. Compare candidate alloys and coatings.

3. Rank materials using transparent scientific criteria.

4. Import service-life predictions.

5. Compare predictions against published benchmark data.

6. Generate a practical laboratory validation plan.

The initial scientific scope is solar salt:

- 60% sodium nitrate

- 40% potassium nitrate

- Approximately 565°C

Initial candidate materials:

- 316L stainless steel

- Inconel 625

- P91 ferritic steel

- A516 carbon steel

- Stainless steel 430, if sufficient solar-salt evidence exists

The application must be explainable, traceable, open, and suitable for later integration with scientific models.

Important development rules:

- Build only the current phase.

- Do not implement future phases prematurely.

- Use realistic demo data clearly labelled as demo data.

- Do not invent scientific results or citations.

- Preserve source references for every research record.

- Use clear validation errors instead of silently accepting invalid data.

- Keep the system modular so the repository can later be cloned and extended.

- Do not use fake AI claims. Any AI-assisted extraction must show the source and confidence.

- Use a clean, professional scientific dashboard design.

Build Phase 1 only: the application foundation and project shell.

The Overview maps the five research stages and their owner, input, output, and gate. The supplied literature folder is screened into core nitrate/solar-salt evidence, contextual sources, and out-of-scope studies; duplicates are consolidated. This is a title/abstract-level screen, not full-text extraction or scientific verification. The PDFs stay in the local Downloads folder and are not copied into or uploaded by the app.

The Materials page reflects evidence signals for 316L, IN625, P91, and A516, while surfacing 321H, 347H, and an IN625 coating as leads for team review. These are not rankings or a finalized candidate roster. The ranking criteria are corrosion rate, thermal-fatigue resistance, and evidence confidence; cost and local availability remain descriptive tags. No weights or measured results are invented. The Knowledge stage calls for source locations and comparable test conditions to be recorded during full-text extraction.

Prediction import, ranking, protocol generation, and validation remain future implementation work until the team supplies the required model, approved scoring rules, and lab constraints.

Create a clean responsive web application called MaterialsGPT Africa.

Implement:

1. A professional dashboard layout with:

   - Sidebar navigation

   - Top header

   - Project name

   - Current environment: Solar salt at approximately 565°C

2. Pages or routes for:

   - Overview

   - Literature

   - Materials

   - Predictions

   - Validation

   - Test Plans

   - Settings

3. An Overview page with placeholder cards for:

   - Literature records

   - Candidate materials

   - Predictions

   - Validation mismatches

   - Dataset confidence

4. Add an empty-state design to every section.

5. Add a project context panel showing:

   - Salt composition

   - Temperature

   - Candidate materials

   - Project objective

6. Add basic loading, error, and empty states.

7. Make the layout responsive for desktop and tablet screens.

Do not build literature ingestion, ranking, prediction, authentication, or real APIs yet.

Acceptance criteria:

- The app starts successfully.

- All navigation links work.

- Every page has a useful placeholder or empty state.

- No fake scientific results are presented as real.

- The code structure is modular and ready for later backend integration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6148740f-78a5-4278-acd3-ca76f3d1eabc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
