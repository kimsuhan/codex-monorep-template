# AGENTS

## Purpose

This repository is a `pnpm` monorepo for the `codex-monorep-template` platform.

- `apps/api`: NestJS API application
- `apps/web`: React + Vite web application
- `tooling/`: shared repository tooling
- `docs/`: detailed engineering and collaboration guides

## Required Workflow

Read these documents before making broad changes:

1. `docs/onboarding.md`
2. `docs/monorepo.md`
3. `docs/code-style.md`
4. `docs/code-style-api.md` when changing `apps/api`
5. `docs/code-style-web.md` when changing `apps/web`
6. `docs/design-guide.md` when changing UI or UX
7. `docs/release-and-ops.md` when changing build, deployment, or environment behavior

## Skill Requirements

- When modifying `apps/api`, you must use [$nestjs-best-practices](/Users/kim/.codex/skills/agent-nestjs-skills/SKILL.md).
- When modifying `apps/web`, you must use [$vercel-react-best-practices](/Users/kim/.codex/skills/react-best-practices/SKILL.md).

## Frontend Design Skills

When working in `apps/web`, choose design skills deliberately based on the task:

- Use `impeccable` when establishing project-specific design context, setting a quality bar, or reviewing whether UI work matches the intended product direction.
- `ui-ux-pro-max` is an officially supported companion skill for early visual exploration, style direction, wireframe expansion, and broader UI/UX ideation.
- Use `/audit` for technical UI quality reviews across accessibility, performance, responsiveness, theming consistency, and AI-like rough edges. Prefer it for finding issues, not directly fixing them.
- Use `/critique` for product and UX design review. Prefer it when the question is whether the screen communicates well, feels intentional, and supports user goals.
- Use `/normalize` to align one-off UI with the repository's design system patterns, tokens, spacing, typography, motion, and responsive conventions.
- Use `/polish` near the end of implementation to refine alignment, states, copy consistency, touch targets, and release-level finish.
- Use `/distill` when a screen or flow feels overloaded and needs simplification around a clear user goal.
- Use `/clarify` for labels, buttons, help text, empty states, confirmations, and error copy.
- Use `/optimize` for frontend performance work, including Core Web Vitals, bundle size, rendering cost, and interaction smoothness.
- Use `/harden` to make UI resilient against edge cases such as long text, empty data, errors, permissions, i18n, and repeated actions.
- Use `/animate` when motion is needed to communicate feedback, transitions, or state changes. Respect reduced-motion behavior.
- Use `/colorize` when the UI needs stronger color purpose for hierarchy, state, or brand tone without falling into generic gradient-heavy styling.
- Use `/bolder` when the design is too safe and needs more contrast, personality, or compositional strength.
- Use `/quieter` when the interface feels too loud and needs restraint, hierarchy cleanup, and a calmer presentation.
- Use `/delight` when the product would benefit from small emotionally positive moments that do not reduce clarity or speed.
- Use `/extract` when repeated UI patterns should become reusable components or tokens instead of staying duplicated.
- Use `/adapt` when the same experience must be rethought for mobile, tablet, desktop, print, email, or another context.
- Use `/onboard` for first-run flows, setup guidance, empty states, and time-to-value improvements.

Use only the minimum set of skills needed for the task. For most frontend implementation work, start with `vercel-react-best-practices` and add one or two design skills only when the task clearly calls for them.
Use `ui-ux-pro-max` for exploration and option generation, then bring the result back into alignment with repository rules through `impeccable` and the existing refinement skills.
When guidance conflicts, follow this priority order: repository docs and local project conventions first, `impeccable` design context second, `ui-ux-pro-max` suggestions third.

## Working Rules

- Keep changes scoped to the target app or shared tooling that the change actually requires.
- Prefer feature-oriented structure in the API and avoid cross-module coupling.
- Prefer React patterns that minimize unnecessary client work, bundle growth, and render churn.
- Run app-local validation before claiming completion, and run `pnpm validate` for root tooling, CI, docs, or cross-app changes.
- Keep app environment contracts documented in `apps/*/.env.example`.
- Do not duplicate policy in this file. Put detailed standards in `docs/` and keep this file as the entry point.
- Update the relevant document in `docs/` when repository conventions materially change.

## Document Index

- `docs/design-guide.md`: interface direction, accessibility, responsive behavior
- `docs/code-style.md`: shared TypeScript, testing, naming, and formatting rules
- `docs/code-style-api.md`: NestJS backend structure and code rules
- `docs/code-style-web.md`: React frontend structure and code rules
- `docs/monorepo.md`: workspace layout, ownership boundaries, shared tooling, and commands
- `docs/contributing.md`: contribution flow, validation expectations, and review readiness
- `docs/onboarding.md`: how to get the repo running and what to read first
- `docs/release-and-ops.md`: release checklist, environment handling, and operational guardrails
- `docs/template-usage.md`: clone, rename, env setup, and first-feature workflow
- `docs/review-checklist.md`: final self-review pass before review request

## Frontend Structure

- Keep `apps/web` aligned with the canonical frontend structure guide in `docs/code-style-web.md`.
- Do not introduce global dumping folders like `components`, `hooks`, `utils`, or `types` directly under `apps/web/src`.

## Backend Structure

- Keep `apps/api` aligned with the canonical backend structure guide in `docs/code-style-api.md`.
- Do not create global `controllers`, `services`, `entities`, or `dto` folders directly under `apps/api/src`.
