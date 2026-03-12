# Code Style

## Shared Rules

- Write TypeScript with strict typing and explicit intent.
- Keep modules small and named after domain behavior, not generic helpers.
- Prefer descriptive names over abbreviations.
- Avoid broad utility files that become unowned dependency magnets.
- Run lint, tests, and builds relevant to the changed area before considering work complete.

## Formatting

- Use Prettier as the source of formatting truth.
- Keep imports stable and avoid unused symbols.
- Add comments only when they capture non-obvious intent or constraints.

## Testing

- Add or update tests when behavior changes.
- Keep tests close to the behavior they validate.
- Prefer simple, direct assertions over large fixture-driven indirection for basic app behavior.

## App-Specific Style Guides

- Use [code-style-api.md](./code-style-api.md) as the canonical backend structure and NestJS style guide for `apps/api`.
- Use [code-style-web.md](./code-style-web.md) as the canonical frontend structure and React style guide for `apps/web`.
