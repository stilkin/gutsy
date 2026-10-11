# Proposal

## Why

The project has linting (ESLint) and type checking (`tsc --noEmit`) enforced by the pre-commit hook, but no formatter and no test framework — there is no way to catch regressions in the app's core logic. The two most regression-prone pieces of logic (the fasting-window calculation and the PDF export template) are pure functions of their inputs, yet the fasting calculation is embedded in a React component (`FastingWindowBanner` in `app/(tabs)/index.tsx`) where it cannot be unit-tested, so the `fasting-exempt-entries` behavior has no executable verification at all.

## What Changes

- Add **Prettier** as the code formatter (direct devDependency; already present transitively via `eslint-config-expo`), with `format` / `format:check` scripts and a minimal `.prettierrc`. Includes a one-time whole-repo format commit.
- Add **Jest + jest-expo** as the test runner (SDK-compatible versions via `expo install`), with `test` / `test:watch` / `test:coverage` scripts.
- **Extract the fasting-window calculation** from `FastingWindowBanner` into a pure function under `src/` (takes `events` + `windowHours`, returns the window or null). The component renders; the function computes. No behavior change.
- **Initial unit tests** for:
  - the extracted fasting-window function (window start from earliest fast-breaking food event; `breaks_fast = 0` entries excluded; no window without food; end = start + `windowHours`)
  - `src/export/template.ts` (events → PDF HTML)
  - `src/export/prepareImages.ts`
  - `src/ai/describeImage.ts` (fetch-mocked: request shape, graceful fallback)
- Extend the **pre-commit hook** to run `jest` and `prettier --check` alongside typecheck + lint.
- Add a minimal **GitHub Actions workflow** running lint + typecheck + test on push (the repo now has a remote and currently has no CI).

Out of scope: testing `src/db/queries.ts` (thin SQL over SQLite — a mock proves nothing), component-render tests (`@testing-library/react-native`), husky/lint-staged (`.githooks` already exists), hosted coverage services.

## Capabilities

None. This change adds developer tooling and refactors an implementation detail (where the fasting-window calculation lives) without changing any spec-level behavior. Per the schema rules this change opts out of specs via `skip_specs: true` in `.openspec.yaml`.

> Discovered during research (not addressed here): the live `fasting-window` spec says the window starts with "the earliest food event", but the implementation (since `fasting-exempt-entries`) uses the earliest food event with `breaks_fast ≠ 0`. The new tests will encode the implemented behavior; aligning the spec text is a separate follow-up change.

## Impact

- `package.json`: new devDependencies (`prettier`, `jest`, `jest-expo`), new scripts, Jest config (`preset: "jest-expo"`)
- New files: `.prettierrc`, `.github/workflows/ci.yml`, `src/` fasting-window module, `__tests__/` files
- Modified: `app/(tabs)/index.tsx` (`FastingWindowBanner` delegates to the extracted function), `.githooks/pre-commit`, plus repo-wide reformatting from the one-time Prettier run
- No runtime/app behavior changes; no changes to `src/db`, store, or export logic itself
