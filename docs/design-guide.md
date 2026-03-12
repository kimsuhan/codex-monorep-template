# Design Guide

## Purpose

This document defines the default UI and UX direction for `apps/web`.

## Core Principles

- Design for clarity first. Interfaces should communicate state, hierarchy, and next actions without extra explanation.
- Prefer strong visual intent over generic templates. Avoid default-looking layouts and undifferentiated card grids.
- Keep interactions fast and legible. Motion should explain change, not decorate it.
- Preserve accessibility as a product requirement, not an afterthought.

## Visual Direction

- Use a deliberate type hierarchy with a distinctive display face and a readable body face when the product surface justifies it.
- Avoid default system-looking color palettes. Use a cohesive palette with tinted neutrals and clear contrast.
- Use spacing rhythm intentionally. Mix tight and generous spacing to create emphasis.
- Keep visual density appropriate to the task. Internal tools should feel efficient, not ornamental.

## Accessibility

- Meet semantic HTML expectations before adding custom behavior.
- Keep keyboard navigation and visible focus states intact.
- Maintain readable color contrast for text, boundaries, and state indicators.
- Respect reduced-motion preferences whenever motion is introduced.

## Responsive Behavior

- Build mobile-first and adapt layouts instead of hiding critical functionality.
- Prefer fluid sizing and component-level responsiveness over rigid breakpoint-only thinking.
- Handle long text, empty states, and narrow screens explicitly.

## Performance-Aware UI

- Keep initial rendering light and avoid shipping heavy dependencies without product justification.
- Prefer progressive disclosure over rendering every possible control at once.
- When changing `apps/web`, follow the repository's React performance best-practices workflow.

## Frontend Design Skill Usage

- Use design review skills such as `/audit` and `/critique` before major redesigns or when evaluating an existing UI.
- Use alignment and finish skills such as `/normalize` and `/polish` when the main behavior already exists and quality needs to improve.
- Use simplification and clarity skills such as `/distill` and `/clarify` when the issue is complexity, comprehension, or copy quality.
- Use resilience and performance skills such as `/optimize` and `/harden` when preparing UI for real product load and edge cases.
- Use expression skills such as `/animate`, `/colorize`, `/bolder`, `/quieter`, and `/delight` only when they reinforce product goals and do not weaken usability.
- Use `/extract` to turn repeated UI into reusable patterns and `/adapt` or `/onboard` when the problem is context shift or first-use experience.
