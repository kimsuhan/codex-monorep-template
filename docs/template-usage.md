# Template Usage

## Clone And Rename

1. Clone the repository.
2. Run `pnpm install`.
3. Run `pnpm template:init --name=my-platform`.
4. Copy `docs/plans/templates/project-brief.md` to `docs/plans/YYYY-MM-DD-my-platform.md` and write the initial product brief before the first feature implementation.
5. Review any remaining `codex-monorep-template` references before the first commit.

## Configure Environments

- Copy `apps/api/.env.example` to `apps/api/.env`.
- Copy `apps/web/.env.example` to `apps/web/.env`.
- Point `VITE_API_BASE_URL` at the API you want the web app to use.

## Start Working

- Run `pnpm dev` to start both apps.
- Use `docs/plans/templates/project-brief.md` for the initial project brief and `docs/plans/templates/product-prd.md` when the work needs a deeper product requirements document.
- Use `apps/api/src/modules/system` as the reference vertical slice for backend work.
- Use `apps/web/src/pages/home` plus `apps/web/src/features/template-readiness` as the reference vertical slice for frontend work.

## Before Opening A PR

- Run `pnpm validate` for root, CI, docs, tooling, or cross-app changes.
- Update the relevant `docs/*` file when rules or conventions change.
- Follow `docs/review-checklist.md` before asking for review.
