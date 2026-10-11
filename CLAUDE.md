# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Principle

**Simple, maintainable, elegant.** Less code means less to break and less to maintain. Prefer the straightforward solution. Avoid abstractions that don't earn their complexity. Avoid dependencies that don't earn their place. When in doubt, do less.

## Project

Gutsy — a mobile food diary for tracking meals, symptoms, and intermittent fasting windows. Medical purpose: helps users identify food-triggered bellyache and share a diary export with their dietician or physician. Android-first (APK releases + Play Store, bundle id `be.pocito.fooddiary`).

## Commands

```sh
npm start          # Expo dev server — scan QR code with Expo Go
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run lint       # ESLint over src/ and app/
npm run typecheck  # tsc --noEmit
```

There is no test framework — lint + typecheck are the verification bar. The pre-commit hook (`.githooks/pre-commit`, installed via the `prepare` script) runs both, so a commit fails if either fails.

## Tech Stack

| Concern | Library |
|---|---|
| Framework | Expo (React Native) + Expo Router |
| Persistent data | expo-sqlite |
| Image files | expo-file-system (paths stored in SQLite) |
| Photo capture/pick + resize | expo-image-picker + expo-image-manipulator |
| PDF export | expo-print + expo-sharing |
| App state | Zustand |
| Date formatting | dayjs |
| AI photo analysis | OpenRouter API (user-provided key, opt-in) |

## Architecture

- **Single `events` table** for all four entry types (`food` | `ache` | `toilet` | `medication`), discriminated by the `type` column. Type-specific data lives in nullable columns: `severity` (ache), `bristol_type` (toilet), `name` (medication), `breaks_fast` (food). A new entry field means a nullable column + a migration step.
- **Migrations** (`src/db/migrations.ts`): schema version is tracked in AsyncStorage (`schema_version`) and run at startup in `app/_layout.tsx` alongside settings load. The DB itself is opened synchronously in `src/db/database.ts`.
- **All DB access goes through `src/db/queries.ts`** — screens never issue SQL directly.
- **Images are files on disk**; the `images` table stores paths. Deleting an event or image must also delete the file — use `deleteEventWithImages` / `removeImageForEvent`, which handle both.
- **Zustand** (`src/store/index.ts`) holds ephemeral state only: selected date, that day's events, settings, action-sheet flag. It does not observe the DB — after writing, callers re-fetch via `loadEventsForDate` (see `app/entry/food.tsx`).
- **Settings** live in AsyncStorage (`src/settings/index.ts`) except the OpenRouter API key, which lives in expo-secure-store (`src/settings/apiKey.ts`).
- Import alias `@/` → `src/` (tsconfig paths + babel module-resolver).

## Conventions

- TypeScript throughout
- Functional components and hooks
- SQLite for all persistent data; Zustand for ephemeral UI state
- No premature abstraction — share code only when there are 3+ genuine use cases

## Development Workflow

This project uses **OpenSpec** (spec-driven schema). All feature work flows through `/opsx:*` commands:

| Command | Purpose |
|---|---|
| `/opsx:explore [topic]` | Think through ideas before committing to a direction |
| `/opsx:propose [change-name]` | Create proposal, design, and task artifacts for a change |
| `/opsx:apply [change-name]` | Implement tasks from a change |
| `/opsx:archive [change-name]` | Archive a completed change |

### Completed changes (in order)

1. `app-foundation` — Expo project, Expo Router, SQLite schema, Zustand, navigation shell
2. `core-logging` — Timeline, FAB, food/ache/toilet entry, fasting window, settings
3. `ai-photo-assist` — Camera, OpenRouter integration, graceful fallback
4. `export` — Date range picker, PDF generation, share sheet
5. `medication` — Medication logging with name autocomplete, timeline icon, PDF export support
6. `fasting-exempt-entries` — "Breaks fast" toggle on food entries, window calculation respects it
7. `ux-polish` — AI prompt rewrite, language/model tier settings, retry button
8. `edit-entries` — Tap timeline entries to edit, update all entry types
9. `compact-export` — Single-line entry headers, thumbnail images, tighter spacing in PDF

## Project Structure

```
app/
  (tabs)/index.tsx          # Timeline (day view, fasting banner, event list)
  (tabs)/settings.tsx       # Settings screen
  entry/food|ache|toilet|medication.tsx  # Entry forms (create + edit)
  export.tsx                # PDF export screen
src/
  db/                       # database.ts (open), migrations.ts (schema), queries.ts (all reads/writes)
  export/                   # template.ts (PDF HTML), prepareImages.ts (thumbnails)
  images/processImage.ts    # Resize captured photos
  ai/describeImage.ts       # OpenRouter vision API call
  components/               # Shared form/timeline components
  settings/                 # AsyncStorage settings + apiKey.ts (SecureStore)
  store/index.ts            # Zustand store (ephemeral UI state)
  types.ts                  # Shared TypeScript types
```

## OpenSpec Layout

```
openspec/
  config.yaml                          # Tech stack, conventions, principles
  changes/<name>/                      # Active change
    proposal.md / design.md / tasks.md
  changes/archive/YYYY-MM-DD-<name>/  # Completed changes
  specs/<capability>/spec.md          # Canonical specs
```
