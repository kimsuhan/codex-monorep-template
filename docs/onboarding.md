# Onboarding

## Goal

Get from fresh clone to a validated first feature branch in about 30 minutes.

## Read Order

1. `AGENTS.md`
2. `docs/template-usage.md`
3. `docs/monorepo.md`
4. `docs/code-style.md`
5. `docs/code-style-api.md` when changing `apps/api`
6. `docs/code-style-web.md` when changing `apps/web`
7. `docs/release-and-ops.md` when changing runtime or delivery behavior

## First 30 Minutes

1. Install dependencies with `pnpm install`.
2. Initialize the template identity with `pnpm template:init --name=my-platform`.
3. Create `docs/plans/YYYY-MM-DD-my-platform.md` from `docs/plans/templates/project-brief.md` and write the initial product brief.
4. Copy `apps/api/.env.example` and `apps/web/.env.example` into local `.env` files.
5. Start both apps with `pnpm dev`.
6. Run `pnpm validate` before opening the first PR or changing repository-wide rules.

## First Checks

- API responds at `GET /system/status`, `GET /system/health`, and `GET /system/ready`.
- Web home route renders the template readiness example.
- Lint, typecheck, tests, and builds all pass from the repository root.
