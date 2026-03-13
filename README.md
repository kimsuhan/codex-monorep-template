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
pnpm template:init --name=my-platform
pnpm dev
```

`pnpm template:init` now guides the first-run bootstrap:

- replaces the template identity
- can run `pnpm install`
- asks what you want to build, or accepts `--project-idea="..."`
- creates `docs/plans/YYYY-MM-DD-<project>.md` immediately from `docs/plans/templates/project-brief.md`
- generates `.codex/bootstrap/init.prompt.md`
- can run `codex exec --sandbox workspace-write` so Codex verifies skills and directly refines the first `docs/plans` brief in place

If you decline Codex autorun, the script prints the exact fallback command to run manually.

Direct manual fallback remains supported:

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm template:init --name=my-platform --skip-install --no-run-codex --project-idea="Describe what you want to build"
codex exec --sandbox workspace-write --cd "/absolute/path/to/workspace" - < "/absolute/path/to/workspace/.codex/bootstrap/init.prompt.md"
pnpm dev
```

After bootstrapping, verify the template baseline before opening the first PR:

```bash
pnpm validate
```

## Core Commands

```bash
pnpm template:init
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
- `docs/plans`: project planning space and reusable planning templates
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
- When starting a new product from this template, write the initial planning document in `docs/plans` before the first feature implementation.
- Update the matching `docs/*` file when repository conventions materially change.
- Run app-local validation for app-only work.
- Run `pnpm validate` for root tooling, CI, shared docs, or cross-app behavior changes.

Validation shortcuts:

- API-only: `pnpm --filter ./apps/api lint && pnpm --filter ./apps/api typecheck && pnpm --filter ./apps/api test && pnpm --filter ./apps/api build`
- Web-only: `pnpm --filter ./apps/web lint && pnpm --filter ./apps/web typecheck && pnpm --filter ./apps/web test && pnpm --filter ./apps/web build`
- Root/docs/tooling/cross-app: `pnpm validate`

## Codex Skill Setup

Codex must have the following skills installed before working in this repository. Treat these as required local prerequisites, not optional enhancements.

- [`vercel-react-best-practices`](https://github.com/vercel-labs/agent-skills/tree/main/vercel-react-best-practices): required for `apps/web` work
- [`agent-nestjs-skills`](https://github.com/Kadajett/agent-nestjs-skills): required for `apps/api` work
- [`impeccable`](https://github.com/pbakaus/impeccable): required when establishing or refining design quality and UI review workflows
- [`superpowers`](https://github.com/obra/superpowers): required for the process discipline this template expects around planning, verification, debugging, and skill-driven execution

Supported optional bootstrap skills:

- [`ui-ux-pro-max`](https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max): optional companion for visual direction exploration, style expansion, and broader UI/UX ideation; do not treat it as the final authority over repository design decisions

`impeccable` should be installed into `~/.agents` so its bundled refinement skills such as `audit`, `critique`, `polish`, `harden`, and `optimize` are available without separate bootstrap prompts.

If these skills are not installed locally, Codex should be considered not ready for this project.

Important constraint:

- Codex skill installation is user-local, not repository-local.
- In this environment, installed skills are discovered from directories such as `~/.codex/skills` and `~/.agents/skills`.
- Do not assume a checked-in project folder like `./skills` will be auto-loaded.
- After installing or updating skills, restart Codex so the new skills are discovered.
- `pnpm template:init` writes `.codex/bootstrap/init.prompt.md` and `.codex/bootstrap/init.config.json` for the current workspace, then optionally runs the prompt with `codex exec --sandbox workspace-write`.
- `pnpm template:init` also writes the initial `docs/plans/YYYY-MM-DD-<project>.md` brief before any Codex autorun begins, and Codex is expected to refine that same file directly rather than only review it.
- Node still owns the bootstrap interview, path decisions, fallback behavior, and orchestration; Codex stays scoped to the generated prompt contract and the prepared writable brief.

Repository policy:

- Keep the project contract and required-skill list in `AGENTS.md` and this `README`.
- Keep the structured bootstrap skill metadata in `tooling/scripts/template-bootstrap-config.mjs`.
- Install the actual skill files into each developer's local Codex skill directory.
- Use `docs/init/README.md` and `docs/init/codex-bootstrap-template.md` as the tracked bootstrap source of truth for Codex initialization.
- For UI work, use `ui-ux-pro-max` to broaden options when needed, then resolve final decisions against repository docs and the project-specific design context created with `impeccable`.
- Install `superpowers` by fetching and following [INSTALL.md](https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md).
- Install `impeccable` into `~/.agents` so its bundled refinement skills are discovered together.
- If you install the optional companion skill, use `npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max -g -y` and restart Codex afterward so it is discovered.

## Documentation

- `docs/plans/README.md`: planning workflow, naming rules, and template selection
- `docs/init/README.md`: Codex bootstrap flow, prompt source, and generated artifact contract
- `docs/template-usage.md`: clone, rename, env setup, and first-feature workflow
- `docs/onboarding.md`: 30-minute bootstrap checklist
- `docs/monorepo.md`: layout, commands, and ownership boundaries
- `docs/code-style.md`: shared TypeScript, testing, naming, and formatting rules
- `docs/contributing.md`: validation gates and review readiness
- `docs/release-and-ops.md`: environment, health checks, logging, and CI contract
