# API Workspace

NestJS backend baseline for the `codex-monorep-template` platform.

## Responsibilities

- Keep business behavior in feature modules under `src/modules/{feature}`
- Reserve `src/common` for true cross-cutting concerns
- Expose operational probes from `src/modules/system`

## Environment

Copy `apps/api/.env.example` to `apps/api/.env` and adjust as needed.

```bash
NODE_ENV=development
APP_NAME=codex-monorep-template-api
PORT=3000
LOG_LEVEL=log
```

The app validates runtime configuration at startup with `zod` and fails fast on invalid values.

## Operational Endpoints

- `GET /system/status`
- `GET /system/health`
- `GET /system/ready`

## Common Commands

```bash
pnpm --filter ./apps/api dev
pnpm --filter ./apps/api lint
pnpm --filter ./apps/api typecheck
pnpm --filter ./apps/api test
pnpm --filter ./apps/api test:e2e
pnpm --filter ./apps/api build
```
