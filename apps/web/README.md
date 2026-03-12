# Web Workspace

React + Vite frontend baseline for the `codex-monorep-template` platform.

## Responsibilities

- Keep routing and bootstrap code under `src/app`
- Keep route screens under `src/pages`
- Keep product behavior inside `src/features`
- Keep only reusable primitives and utilities in `src/shared`

## Environment

Copy `apps/web/.env.example` to `apps/web/.env` and adjust as needed.

```bash
VITE_APP_NAME=Codex Internal Template
VITE_API_BASE_URL=http://localhost:3000
```

## Test And Build Commands

```bash
pnpm --filter ./apps/web dev
pnpm --filter ./apps/web lint
pnpm --filter ./apps/web typecheck
pnpm --filter ./apps/web test
pnpm --filter ./apps/web build
```

## Included Example

The home page deliberately shows:

- `pages/home` composing the route screen
- `features/template-readiness` owning a focused slice of UI behavior
- `shared/config` and `shared/ui` hosting reusable primitives
