# Design

## Context

See proposal.md for motivation. Constraints that shape this design:

- ESLint (`extends: 'expo'`) already defers formatting to Prettier via its bundled `eslint-config-prettier` — today's code (single quotes, 100-col lines) passes lint, proving the preset doesn't enforce Prettier defaults. Adding Prettier won't fight ESLint.
- The fasting-window calculation exists **twice**: `FastingWindowBanner` (`app/(tabs)/index.tsx:71-74`) and the PDF template (`src/export/template.ts:44-50`). Identical math: filter `type === 'food' && breaks_fast !== 0`, window start = min timestamp, end = start + `windowHours * 3_600_000`.
- `describeImage` touches `expo-file-system` (`File.base64()`) and `resizeForApi` before `fetch`; `prepareImages` calls `ImageManipulator.manipulateAsync`. Under Jest these need module mocks, not real native modules.
- `buildHtml` and the fasting math format timestamps with dayjs local time — tests need a pinned timezone to be deterministic.
- Discovered during implementation: `tsconfig.json` and `.eslintrc.js` were in the `.gitignore` "project specific" block, so a fresh clone (and therefore CI) could not run `typecheck` or `lint`. Both are now tracked; `.githooks/`, `.claude/`, `.opencode/` remain local-only.

## Goals / Non-Goals

**Goals:**

- Deterministic `npm test` runnable locally and in CI with zero native dependencies
- One-time, reviewable format change; formatting invisible afterwards
- Fasting-window math existing in exactly one place

**Non-Goals:**

- No component-render tests, no `@testing-library/react-native`
- No coverage thresholds or gates (report only)
- No EAS builds in CI — static checks + unit tests only
- No change to app runtime behavior

## Decisions

**D1 — Prettier with a two-key config.** `.prettierrc` = `{ "singleQuote": true, "printWidth": 100 }` — everything else stock. This matches the existing code style, so the one-time `prettier --write .` produces a minimal diff. Alternative rejected: pure defaults (double quotes, 80 cols) would churn every file for zero benefit. Prettier 3 already respects `.gitignore`, so ignored paths stay out; add a one-line `.prettierignore` for `package-lock.json`. The reformat lands as its own isolated commit.

**D2 — Jest + jest-expo, config inline in package.json.** Install with `npx expo install --save-dev jest jest-expo` so versions match SDK 54. Config is `"jest": { "preset": "jest-expo" }` — no separate `jest.config.js`. If ESM-only deps trip the transformer, allowlist them via `transformIgnorePatterns` during implementation rather than pre-designing it. Alternative rejected: Vitest (second toolchain, no native-module mocking story for Expo).

**D3 — Extract `getFastingWindow` to `src/fasting.ts`.** Signature:

```ts
function getFastingWindow(
  events: Pick<DiaryEvent, 'type' | 'timestamp' | 'breaks_fast'>[],
  windowHours: number,
): { start: number; end: number } | null;
```

Returns null when no fast-breaking food event exists. Both call sites (timeline banner, PDF template) keep their own formatting and delegate the math. This isn't extraction-for-tests: it deduplicates logic that already exists twice and meets the 3+ genuine use cases convention (banner, PDF, tests). Alternative rejected: testing through component render.

**D4 — Co-located `*.test.ts` files, mocked native edges.** `src/fasting.test.ts`, `src/export/template.test.ts`, `src/export/prepareImages.test.ts`, `src/ai/describeImage.test.ts`. Tests that touch native modules use `jest.mock('expo-file-system')` / `jest.mock('expo-image-manipulator')` / `jest.mock('@/images/processImage')`; `describeImage` tests stub `global.fetch` and assert request shape (URL, model per tier, prompt language suffix) and error paths. Date-formatting tests set `process.env.TZ = 'UTC'` before importing dayjs-using modules.

**D5 — Pre-commit runs cheapest-first.** `.githooks/pre-commit` order: `prettier --check` → `tsc --noEmit` → `eslint` → `jest`. Unit tests finish in seconds; skipping them locally would make the hook weaker than CI.

**D6 — CI is one small workflow.** `.github/workflows/ci.yml`: `on: [push, pull_request]`, single job on `ubuntu-latest` / Node 20, steps: checkout → `npm ci` → `npm run lint` → `npm run typecheck` → `npm test` (with `TZ: UTC`). No build, no EAS, no coverage upload.

## Risks / Trade-offs

- [Repo-wide reformat obscures real changes] → Isolated `CHORE:` format commit before any other work in this change; trivially revertible on its own.
- [jest-expo / SDK version skew] → Installed via `expo install`, never hand-pinned.
- [Tests encode `breaks_fast` behavior that the archived `fasting-window` spec text doesn't mention] → Tests follow the implementation (source of truth since `fasting-exempt-entries`); spec alignment is a separate follow-up noted in proposal.md.
- [dayjs local-time formatting makes tests flaky across machines] → `TZ=UTC` pinned in tests and CI.
- [fetch-mock drift from the real OpenRouter API] → Tests assert the request shape and graceful error handling, not a live contract.

## Migration Plan

Dev-tooling only; no app release impact. Rollback = revert the format commit and/or the tooling commit and `npm uninstall` the devDeps.
