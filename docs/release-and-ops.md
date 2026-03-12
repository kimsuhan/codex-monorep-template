# Release and Ops

## Release Expectations

- CI is GitHub Actions based and must pass `pnpm validate`.
- Root or shared changes are not review-ready until `pnpm validate` succeeds locally.
- App-specific release work still needs the owning app’s lint, typecheck, test, and build commands.

## Environment Handling

- Keep secrets out of the repository.
- Document required variables in app-local `.env.example` files.
- API runtime config is validated at startup and should fail fast on invalid values.
- Web runtime values must use the `VITE_` prefix and stay explicit.

## Operational Baseline

- API health surface:
  - `GET /system/status`
  - `GET /system/health`
  - `GET /system/ready`
- API startup logs should make the app name and port visible.
- Web changes should preserve a light initial render and avoid unnecessary client dependencies.

## CI Contract

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

Keep the local validation order aligned with CI so failures reproduce the same way for humans and Codex.
