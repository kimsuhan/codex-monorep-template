# Monorepo Guide

## Layout

- `apps/api`: NestJS backend application
- `apps/web`: React + Vite frontend application
- `packages/*`: reserved for future shared packages
- `tooling/`: shared lint config and repository scripts
- `docs/`: operating rules, onboarding, and release guidance

## Commands

- `pnpm template:init`: replace template identity after cloning
- `pnpm dev`: start both apps
- `pnpm lint`: run app lint checks
- `pnpm typecheck`: run app type checks
- `pnpm test`: run template tooling tests plus app tests
- `pnpm build`: build both apps
- `pnpm validate`: run lint, typecheck, tests, and builds in CI order

## Workspace Rules

- Keep app-specific dependencies in the owning app unless both apps truly depend on them.
- Put shared repo automation in `tooling/`, not ad-hoc shell snippets inside app packages.
- Update the matching `docs/*` file when the repository contract changes.

## Shared Package Promotion Rule

Keep `packages/*` empty until all of these are true:

- The code is used by at least two owned workspaces.
- The abstraction is stable enough to version as a public internal contract.
- Keeping duplicate copies would create drift or review noise.
- The shared code is not merely a convenience wrapper around one app’s domain logic.

## Ownership Boundaries

- API-specific changes stay in `apps/api` unless root tooling or shared docs must also move.
- Web-specific changes stay in `apps/web` unless root tooling or shared docs must also move.
- Cross-app rules, CI, and template bootstrapping belong at the repository root.
