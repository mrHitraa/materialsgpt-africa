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
- Project scope (salt, temperature, candidates) lives in `src/lib/project-context.ts`; replace with a backend loader later rather than hardcoding in pages — single source of truth.
- Nav items live in `src/lib/navigation.ts`; shell in `src/components/layout/AppShell.tsx` wraps all routes from `__root.tsx`.
- Shared empty/loading/error UI lives in `src/components/common/states.tsx`; every page must use it instead of ad-hoc states.
- Never display scientific values that are not backed by a stored source reference.
