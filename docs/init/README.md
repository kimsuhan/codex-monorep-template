# Codex Bootstrap

`pnpm template:init` is the canonical first-run bootstrap for this template.

It now handles four things in one guided flow:

1. Replace the template identity with your project name.
2. Optionally run `pnpm install`.
3. Generate a Codex bootstrap prompt and manifest in `.codex/bootstrap/`.
4. Optionally run `codex exec` so Codex can verify skills and create the first `docs/plans` brief.

## Tracked Sources Of Truth

- `docs/init/codex-bootstrap-template.md`: tracked prompt template used to generate the runtime prompt.
- `tooling/scripts/template-bootstrap-config.mjs`: structured required/optional skill metadata consumed by the bootstrap script.
- `README.md`: human-readable summary of the required and optional Codex skills for this repository.

## Runtime Artifacts

The bootstrap script writes these local artifacts and keeps them out of git:

- `.codex/bootstrap/init.prompt.md`
- `.codex/bootstrap/init.config.json`

Use the prompt file when you want to run Codex manually:

```bash
codex exec --cd "/absolute/path/to/workspace" - < "/absolute/path/to/workspace/.codex/bootstrap/init.prompt.md"
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

- If the local `codex` CLI is available, `pnpm template:init` can immediately run the generated prompt.
- If the CLI is missing, or you decline autorun, the script prints the exact fallback `codex exec` command.
- Autorun is best-effort only. The template rename and local bootstrap artifact generation still complete even when Codex is unavailable.

## End State

The bootstrap is complete when:

1. the template identity has been replaced,
2. dependencies are installed if requested,
3. the Codex bootstrap artifacts exist, and
4. Codex has created the first `docs/plans/YYYY-MM-DD-<project>.md` brief or the manual command is ready to run.
