# Codex Bootstrap For `{{PROJECT_NAME}}`

You are bootstrapping a fresh clone of this repository so it is ready for regular feature work.

This Codex run has writable access to the workspace. Stay inside the generated prompt contract: Node owns the bootstrap interview, file/path decisions, fallback behavior, and orchestration; your job is to work only on the prepared project brief and the skill checks described here.

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

An initial project brief already exists at `{{PROJECT_BRIEF_PATH}}`, created by `pnpm template:init` from `docs/plans/templates/project-brief.md`.

Treat that file as the writable source of truth for this bootstrap run. Do not create a replacement brief or move the content into a different planning file unless the existing template explicitly requires it.

Project idea mode: {{PROJECT_IDEA_MODE}}.

Captured product idea:

{{PROJECT_IDEA}}

Requirements:

- Review the existing brief for the current project name, `{{PROJECT_NAME}}`, then refine and complete it in place.
- If no product idea was captured yet, ask the user what they want to build first and wait for the answer before updating the brief.
- Preserve the user's original wording in the `Source Idea` section of the brief.
- Verify that the draft sections still match the source idea, then improve them where needed across Problem, Target Users, Goals, Non-Goals, Core User Flow, Success Metrics, and Open Questions.
- Use the existing brief file as the only target for content edits during this bootstrap. Review, refine, and complete the prepared draft instead of treating it as read-only feedback material.
- Keep the brief decision-ready, concise, and suitable for the first implementation planning pass.
- Do not start feature implementation.
- Do not create additional planning files unless the existing brief template clearly requires them.

## Final Output

Stop after a short readiness summary that includes:

- which docs were reviewed,
- which required skills were verified or installed,
- which optional skills were handled,
- the path to the refined project brief, and
- any manual next step that still blocks normal development.
