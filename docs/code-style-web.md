# Web Code Style

This document is the canonical frontend structure and style reference for `apps/web`.

## Web Rules

- Treat `apps/web` as a performance-sensitive React application.
- Keep components focused and avoid avoidable rerenders, effect misuse, and oversized client bundles.
- Prefer render-time derivation over effect-driven synchronization when possible.
- Add dependencies to the client bundle only with clear product justification.
- When changing `apps/web`, follow the repository's React performance best-practices workflow.

## Web Structure Guidance

- Keep `apps/web/src` organized around `app`, `pages`, `features`, `shared`, and optional top-level `widgets` or `entities`; avoid creating global dumping folders like `components`, `hooks`, `utils`, or `types` directly under `apps/web/src`.
- Reserve `app/` for bootstrap work, routing, provider wiring, layout shells, and global styles so it only contains application-level scaffolding.
- Treat `pages/` as the place for route-level screens. Page-specific helpers, loaders, layouts, or data fetching belong close to the page file rather than migrating into `shared/`.
- Build action-oriented code under `features/{feature}` so each domain owns its own components, hooks, API calls, and assets; add top-level `widgets/` only for reusable composed UI blocks and top-level `entities/` only for stable domain model UI or logic when that abstraction is warranted.
- Use `shared/` exclusively for truly reusable UI primitives, library helpers, hooks, API constants, types, or assets; keep business logic and domain behavior inside the owning feature or entity.
- Restrict `shared/api/` to global client or fetch wrappers. Keep domain-specific queries and mutations adjacent to their owning feature or entity.
- Prefer explicit boundary barrels, for example a feature-level `index.ts` that re-exports exports within that feature, and avoid adding broad barrels unless the responsibility boundary is crystal clear.
