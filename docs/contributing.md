# Contributing

## Required Flow

1. Read `AGENTS.md` and the relevant guides in `docs/`.
2. Confirm whether the change belongs to `apps/api`, `apps/web`, or root tooling/docs.
3. Use the required app skill before editing code in that app.
4. Keep the change scoped and update docs when the repository contract changes.
5. Run the relevant validation commands before asking for review.

## Validation Gates

- API-only changes: run `pnpm --filter ./apps/api lint`, `typecheck`, `test`, and `build`.
- Web-only changes: run `pnpm --filter ./apps/web lint`, `typecheck`, `test`, and `build`.
- Root tooling, CI, shared docs, or cross-app changes: run `pnpm validate`.

## Review Readiness

- The reason for the change is clear and the scope is bounded.
- Tests or direct execution prove the changed behavior.
- Docs, env examples, or templates are updated when conventions move.
- The PR description follows `.github/PULL_REQUEST_TEMPLATE.md`.
- The final pass uses `docs/review-checklist.md`.
