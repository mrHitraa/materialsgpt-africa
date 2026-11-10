<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Study scope (salt, temperature, objective) lives in `src/lib/project-context.ts`; candidate materials, literature and observations live in the database — single source of truth.
- Database reads are TanStack Query options in `src/lib/data/queries.ts`; input validation schemas in `src/lib/data/schemas.ts` mirror DB CHECK constraints so errors show before and after save.
- Every scientific row carries `is_demo`; demo rows must render a Demo badge, and real literature must have a DOI or source URL (DB-enforced).
- Nav items live in `src/lib/navigation.ts`; shell in `src/components/layout/AppShell.tsx` wraps all routes from `__root.tsx`.
- Shared empty/loading/error UI lives in `src/components/common/states.tsx`; every page must use it instead of ad-hoc states.
- Never display scientific values that are not backed by a stored source reference.
- Storage uses generated live-database types without schema casts; missing comparison conditions stay null so compilation never invents scientific evidence.
