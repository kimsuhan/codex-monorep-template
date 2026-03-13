# Template Usage

## Clone And Rename

1. Clone the repository.
2. Run `pnpm template:init --name=my-platform`.
3. Use the interactive bootstrap to decide whether to run `pnpm install`, which optional Codex skills to prepare, what you want to build, and whether Codex should autorun.
4. Let Codex create `docs/plans/YYYY-MM-DD-my-platform.md` from `docs/plans/templates/project-brief.md`, using the captured product idea, or run the printed fallback `codex exec` command manually.
5. Review any remaining `codex-monorep-template` references before the first commit.

## Configure Environments

- Copy `apps/api/.env.example` to `apps/api/.env`.
- Copy `apps/web/.env.example` to `apps/web/.env`.
- Point `VITE_API_BASE_URL` at the API you want the web app to use.

## Start Working

- Run `pnpm dev` to start both apps.
- Use `docs/plans/templates/project-brief.md` for the initial project brief and `docs/plans/templates/product-prd.md` when the work needs a deeper product requirements document.
- Use `docs/init/README.md` when you need to re-run or debug the Codex bootstrap flow.
- Reuse `.codex/bootstrap/init.prompt.md` if you want Codex to repeat the initial bootstrap flow in the same workspace.
- Use `apps/api/src/modules/system` as the reference vertical slice for backend work.
- Use `apps/web/src/pages/home` plus `apps/web/src/features/template-readiness` as the reference vertical slice for frontend work.

Manual fallback path:

- Run `pnpm install` yourself if you skipped it during bootstrap.
- Run `pnpm template:init --name=my-platform --skip-install --no-run-codex --project-idea="Describe what you want to build"` if you only want file preparation.
- Run `codex exec --cd "/absolute/path/to/workspace" - < "/absolute/path/to/workspace/.codex/bootstrap/init.prompt.md"` when you are ready for Codex to verify skills and write the initial brief.

## Before Opening A PR

- Run `pnpm validate` for root, CI, docs, tooling, or cross-app changes.
- Update the relevant `docs/*` file when rules or conventions change.
- Follow `docs/review-checklist.md` before asking for review.
