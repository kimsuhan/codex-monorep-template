# Codex Bootstrap For `{{PROJECT_NAME}}`

You are bootstrapping a fresh clone of this repository so it is ready for regular feature work.

## Operating Order

1. Read `AGENTS.md`.
2. Read `docs/onboarding.md`.
3. Read `docs/monorepo.md`.
4. Read `docs/code-style.md`.
5. Read `docs/template-usage.md`.
6. Read `docs/init/README.md`.

## Skill Verification

Skill mode for this run: {{SKILL_BOOTSTRAP_MODE}}.

Required skills:
{{REQUIRED_SKILLS}}

Selected optional skills:
{{OPTIONAL_SKILLS}}

If a skill is missing and the install summary gives you a concrete source or command, use that source. If the install summary specifies a target directory such as `~/.agents`, preserve that target. If the install summary only gives guidance, explain what still needs to be installed manually. Restart guidance should be called out explicitly whenever a newly installed skill will not be available until Codex restarts.

## Project Brief

Create the initial project brief at `{{PROJECT_BRIEF_PATH}}` using `docs/plans/templates/project-brief.md` as the source template.

Requirements:

- Fill in the brief for the current project name, `{{PROJECT_NAME}}`.
- Keep the brief decision-ready, concise, and suitable for the first implementation planning pass.
- Do not start feature implementation.
- Do not create additional planning files unless the existing brief template clearly requires them.

## Final Output

Stop after a short readiness summary that includes:

- which docs were reviewed,
- which required skills were verified or installed,
- which optional skills were handled,
- the path to the created project brief, and
- any manual next step that still blocks normal development.
