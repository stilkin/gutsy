# Tasks

## 1. Prettier

- [x] 1.1 Add `prettier` as devDependency, create `.prettierrc` (`singleQuote: true`, `printWidth: 100`) and `.prettierignore` (`package-lock.json`), add `format` / `format:check` scripts. Verify: `npm run format` completes, then `npm run format:check` exits 0.
- [x] 1.2 Land the one-time repo format as its own isolated `CHORE:` commit. Verify: diff is formatting-only (no semantic changes), `npm run lint` and `npm run typecheck` still pass on the formatted tree.

## 2. Jest + jest-expo

- [x] 2.1 Install `jest` and `jest-expo` via `npx expo install --save-dev`, add `"jest": { "preset": "jest-expo" }` to package.json, add `test` / `test:watch` / `test:coverage` scripts. Verify: `npm test -- --passWithNoTests` runs and exits 0 (tune `transformIgnorePatterns` only if a dependency fails to transform).

## 3. Fasting-window extraction

- [x] 3.1 Create `src/fasting.ts` with `getFastingWindow(events, windowHours)` returning `{ start, end } | null`; refactor `FastingWindowBanner` (`app/(tabs)/index.tsx`) and `buildHtml` (`src/export/template.ts`) to delegate to it. Verify: `npm run typecheck` and `npm run lint` pass; the two call sites keep their existing output formatting (pure code move).
- [x] 3.2 Write `src/fasting.test.ts`: window starts at earliest fast-breaking food event; `breaks_fast = 0` entries excluded even when earliest; non-food events ignored; no qualifying events → null; end = start + `windowHours * 3_600_000`. Verify: `npx jest src/fasting.test.ts` green.

## 4. Module tests

- [x] 4.1 Write `src/export/template.test.ts` (TZ pinned to UTC): events grouped by day; empty-period message; notes HTML-escaped; fasting-window line present/absent per `breaks_fast`; severity / Bristol / medication-name details; `(fasting-safe)` suffix; thumbnail + notes layout pairing. Verify: `npx jest src/export/template.test.ts` green.
- [x] 4.2 Write `src/export/prepareImages.test.ts` with `expo-image-manipulator` mocked: events without `image_path` skipped; data-URI map built from base64 results; manipulation failure skipped silently without aborting the export. Verify: `npx jest src/export/prepareImages.test.ts` green.
- [x] 4.3 Write `src/ai/describeImage.test.ts` with `expo-file-system` and `@/images/processImage` mocked and `fetch` stubbed: request hits the OpenRouter URL with Bearer key and the tier's model; non-English language appends the language suffix to the prompt; non-ok response throws; happy path returns trimmed content; malformed response throws. Verify: `npx jest src/ai/describeImage.test.ts` green.

## 5. Wiring

- [x] 5.1 Update `.githooks/pre-commit` to run, cheapest-first: `prettier --check` → `tsc --noEmit` → `eslint` → `jest`. Verify: `sh .githooks/pre-commit` exits 0 on the finished tree.
- [x] 5.2 Add `.github/workflows/ci.yml`: `on: [push, pull_request]`, ubuntu-latest, Node 20, `npm ci` → `npm run lint` → `npm run typecheck` → `npm test` with `TZ: UTC`. Verify: YAML parses and the steps mirror the local commands.
- [x] 5.3 Update `CLAUDE.md` Commands section to reflect the new bar (format/test scripts, pre-commit contents, CI). Verify: documented commands match `package.json` scripts exactly.

## 6. Integration

- [x] 6.1 Full local pass — `npm run format:check && npm run lint && npm run typecheck && npm test` — then make a commit and confirm the hook runs all four checks. Verify: commit succeeds and the pushed branch shows a green CI run on GitHub.

## Workflow follow-up

- Archive the change via `/opsx:archive dev-tooling` after the CI run is green.
- Separate follow-up change: align the archived `fasting-window` spec text with the implemented `breaks_fast` behavior (see proposal.md).
