# Codex Bootstrap

`pnpm template:init` is the canonical first-run bootstrap for this template.

It now handles six things in one guided flow:

1. Replace the template identity with your project name.
2. Optionally run `pnpm install`.
3. Ask what you want to build, unless you already provided `--project-idea="..."`.
4. Create the initial `docs/plans/YYYY-MM-DD-<project>.md` brief directly from `docs/plans/templates/project-brief.md`.
5. Generate a Codex bootstrap prompt and manifest in `.codex/bootstrap/`.
6. Optionally run `codex exec --sandbox workspace-write` so Codex can verify skills and refine the first `docs/plans` brief in place.

## Tracked Sources Of Truth

- `docs/init/codex-bootstrap-template.md`: tracked prompt template used to generate the runtime prompt.
- `tooling/scripts/template-bootstrap-config.mjs`: structured required/optional skill metadata consumed by the bootstrap script.
- `README.md`: human-readable summary of the required and optional Codex skills for this repository.

## Runtime Artifacts

The bootstrap script writes these local artifacts and keeps them out of git:

- `.codex/bootstrap/init.prompt.md`
- `.codex/bootstrap/init.config.json`

The manifest records whether a project idea was already captured locally or whether Codex still needs to ask the user before refining the brief, plus the effective Codex sandbox mode used for the bootstrap command contract.

Use the prompt file when you want to run Codex manually:

```bash
codex exec --sandbox workspace-write --cd "/absolute/path/to/workspace" - < "/absolute/path/to/workspace/.codex/bootstrap/init.prompt.md"
```

If you want a non-interactive run, provide the idea up front:

```bash
pnpm template:init --name=my-platform --project-idea="Describe what you want to build"
```

## Required Skills

These are always included in the generated bootstrap prompt:

- `vercel-react-best-practices`: required for `apps/web`
- `nestjs-best-practices`: required for `apps/api`
- `impeccable`: required when establishing or refining design quality
- `superpowers`: required for planning, verification, and workflow discipline

Installation notes:

- `superpowers`: fetch and follow `https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md`
- `impeccable`: install into `~/.agents` so bundled refinement skills such as `audit`, `critique`, `polish`, `harden`, and `optimize` are available together

## Optional Skills

The bootstrap script currently supports selecting these optional additions:

- `ui-ux-pro-max`

If an optional skill is not selected, it is omitted from the generated prompt.

## Autorun Behavior

- If the local `codex` CLI is available, `pnpm template:init` can immediately run the generated prompt in `workspace-write` mode.
- If the CLI is missing, or you decline autorun, the script prints the exact fallback `codex exec --sandbox workspace-write` command.
- If no product idea was captured before Codex runs, the generated prompt tells Codex to ask the user first and only then refine the placeholder brief.
- Autorun is best-effort only. The template rename, initial brief creation, and local bootstrap artifact generation still complete even when Codex is unavailable or constrained.
- Node still owns the bootstrap interview, path decisions, fallback behavior, and orchestration. Codex is only expected to verify skills and refine the prepared brief file inside the writable workspace.

## End State

The bootstrap is complete when:

1. the template identity has been replaced,
2. dependencies are installed if requested,
3. the initial `docs/plans/YYYY-MM-DD-<project>.md` brief exists,
4. the Codex bootstrap artifacts exist, and
5. Codex has refined the brief or the manual command is ready to run.
