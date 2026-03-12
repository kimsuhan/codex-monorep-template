# codex-monorep-template

Codex-first `pnpm` monorepo template for teams that want an opinionated starting point, explicit collaboration rules, and a working API/Web baseline from the first clone.

## What Ships In The Template

- `apps/api`: NestJS API with feature-oriented structure, validated runtime config, and `/system` probes
- `apps/web`: React + Vite app with page/feature/shared boundaries and Vitest coverage
- `tooling/`: shared repository scripts and lint configuration
- `docs/`: onboarding, structure, code style, contribution, and release guides
- `.github/`: CI and review templates

## Quick Start

```bash
pnpm install
pnpm template:init --name=my-platform
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm dev
```

After bootstrapping, verify the template baseline:

```bash
pnpm validate
```

## Core Commands

```bash
pnpm template:init --name=my-platform
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm validate
pnpm format
```

## Repository Layout

- `apps/api`: backend application
- `apps/web`: frontend application
- `tooling/`: repository-level scripts and shared config
- `docs/`: operating rules and contributor guidance
- `packages/*`: reserved for future shared packages

## Required Read Order

Start here before broad changes:

1. `AGENTS.md`
2. `docs/onboarding.md`
3. `docs/monorepo.md`
4. `docs/code-style.md`
5. `docs/code-style-api.md` when changing `apps/api`
6. `docs/code-style-web.md` when changing `apps/web`
7. `docs/design-guide.md` when changing UI or UX
8. `docs/release-and-ops.md` when changing build, deployment, or environment behavior

## Working Contract

- Keep API work inside `apps/api`, web work inside `apps/web`, and shared rules in `docs/` or root tooling.
- Update the matching `docs/*` file when repository conventions materially change.
- Run app-local validation for app-only work.
- Run `pnpm validate` for root tooling, CI, shared docs, or cross-app behavior changes.

Validation shortcuts:

- API-only: `pnpm --filter ./apps/api lint && pnpm --filter ./apps/api typecheck && pnpm --filter ./apps/api test && pnpm --filter ./apps/api build`
- Web-only: `pnpm --filter ./apps/web lint && pnpm --filter ./apps/web typecheck && pnpm --filter ./apps/web test && pnpm --filter ./apps/web build`
- Root/docs/tooling/cross-app: `pnpm validate`

## Codex Skill Setup

Codex must have the following skills installed before working in this repository. Treat these as required local prerequisites, not optional enhancements.

- [`react-best-practices`](https://vercel.com/blog/introducing-react-best-practices): required for `apps/web` work
- [`agent-nestjs-skills`](https://github.com/Kadajett/agent-nestjs-skills): required for `apps/api` work
- [`impeccable`](https://github.com/pbakaus/impeccable): required when establishing or refining design quality and UI review workflows
- [`superpowers`](https://github.com/obra/superpowers): required for the process discipline this template expects around planning, verification, debugging, and skill-driven execution

If these skills are not installed locally, Codex should be considered not ready for this project.

Important constraint:

- Codex skill installation is user-local, not repository-local.
- In this environment, installed skills are discovered from directories such as `~/.codex/skills` and `~/.agents/skills`.
- Do not assume a checked-in project folder like `./skills` will be auto-loaded.
- After installing or updating skills, restart Codex so the new skills are discovered.

Repository policy:

- Keep the project contract and required-skill list in `AGENTS.md` and this `README`.
- Install the actual skill files into each developer's local Codex skill directory.
- If the team wants reproducible setup, add repository scripts or onboarding docs that install/sync those local skills.

## Documentation

- `docs/template-usage.md`: clone, rename, env setup, and first-feature workflow
- `docs/onboarding.md`: 30-minute bootstrap checklist
- `docs/monorepo.md`: layout, commands, and ownership boundaries
- `docs/code-style.md`: shared TypeScript, testing, naming, and formatting rules
- `docs/contributing.md`: validation gates and review readiness
- `docs/release-and-ops.md`: environment, health checks, logging, and CI contract
