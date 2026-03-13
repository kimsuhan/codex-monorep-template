# Onboarding

## Goal

Get from fresh clone to a Codex-ready workspace and validated first feature branch in about 30 minutes.

## Read Order

1. `AGENTS.md`
2. `docs/template-usage.md`
3. `docs/monorepo.md`
4. `docs/code-style.md`
5. `docs/code-style-api.md` when changing `apps/api`
6. `docs/code-style-web.md` when changing `apps/web`
7. `docs/release-and-ops.md` when changing runtime or delivery behavior
8. `docs/init/README.md` when setting up or debugging the Codex bootstrap flow

## First 30 Minutes

1. Run `pnpm template:init --name=my-platform`.
2. Let the bootstrap flow replace the template identity, optionally run `pnpm install`, and capture what you want to build.
3. Confirm that `docs/plans/YYYY-MM-DD-my-platform.md` now exists immediately after bootstrap, created from `docs/plans/templates/project-brief.md`.
4. If `codex` is available, let the bootstrap run `codex exec` so Codex can verify skills and refine that initial brief.
5. If Codex autorun is skipped, run the printed fallback command against `.codex/bootstrap/init.prompt.md`.
5. Copy `apps/api/.env.example` and `apps/web/.env.example` into local `.env` files if you have not already done so.
6. Start both apps with `pnpm dev`.
7. Run `pnpm validate` before opening the first PR or changing repository-wide rules.

Manual fallback remains valid when you do not want the interactive bootstrap:

1. Run `pnpm install`.
2. Run `pnpm template:init --name=my-platform --skip-install --no-run-codex --project-idea="Describe what you want to build"`.
3. Run `codex exec --cd "/absolute/path/to/workspace" - < "/absolute/path/to/workspace/.codex/bootstrap/init.prompt.md"`.

## First Checks

- API responds at `GET /system/status`, `GET /system/health`, and `GET /system/ready`.
- Web home route renders the template readiness example.
- `docs/plans/YYYY-MM-DD-my-platform.md` exists after bootstrap.
- `.codex/bootstrap/init.prompt.md` and `.codex/bootstrap/init.config.json` exist after bootstrap.
- Lint, typecheck, tests, and builds all pass from the repository root.
