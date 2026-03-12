# API Code Style

This document is the canonical backend structure and style reference for `apps/api`.

## API Rules

- Treat `apps/api` as a feature-oriented NestJS application.
- Prefer constructor injection, focused providers, and clear module boundaries.
- Validate input at the framework boundary and keep controller logic thin.
- Make service return shapes explicit and easy to test.
- When changing `apps/api`, follow the repository's NestJS best-practices workflow.

## API Structure Guidance

- Keep backend work within feature modules under `apps/api/src/modules/{feature}` and avoid creating global `controllers`, `services`, `entities`, or `dto` folders directly under `apps/api/src`.
- Each feature should expose the default subfolders `presentation`, `application`, `domain`, and `infrastructure` so intent stays obvious.
- Use `apps/api/src/common` only for cross-cutting concerns (decorators, guards, interceptors, pipes, filters, exceptions, and shared utilities) and keep feature-specific business logic out of it.
- Place environment and configuration code in `apps/api/src/config`.
- Keep database-related code inside `apps/api/src/database`.
- Put cross-feature external integrations in `apps/api/src/integrations`.
- Use `apps/api/src/jobs` for queues, schedulers, processors, and other background job entrypoints.
