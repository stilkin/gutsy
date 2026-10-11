## Context

There is no existing codebase. This design establishes every structural decision the subsequent changes will inherit: project tooling, data persistence, navigation, and state management. Getting these right up front avoids expensive refactors later.

## Goals / Non-Goals

**Goals:**

- A working Expo app that launches, navigates, and opens a database
- A SQLite schema that can accommodate all event types needed by later changes
- A navigation shell (tab bar + FAB) that future screens slot into without restructuring
- Minimal, well-typed Zustand store skeleton

**Non-Goals:**

- Any functional UI beyond navigation placeholders
- Settings screen logic, fasting window, AI, export — all deferred to later changes
- Anything that requires user input at this stage

## Decisions

**Expo Router over bare React Navigation**
Expo Router is file-system based and is now the Expo-recommended default. It reduces navigation boilerplate and co-locates screen files with their routes. Fits the "less code" principle.

**Single `events` table with a `type` discriminator**
One table for all event types (food, ache, toilet) rather than three separate tables. The schema is simple, queries are straightforward, and the type column makes it trivial to filter. Nullable columns (severity, bristol_type) are only populated for the relevant type. Three tables would be more "correct" relationally but overkill for this volume of data and complexity.

**expo-sqlite over other storage options**
expo-sqlite is part of the Expo SDK, requires no extra installation, supports structured queries, and makes the export feature (later change) easy to implement. AsyncStorage would be too unstructured; a remote DB adds unnecessary complexity for a local-first app.

**AsyncStorage for settings, expo-secure-store for the API key**
Settings (window duration, toggles) are non-sensitive key-value pairs — AsyncStorage is sufficient. The OpenRouter API key is sensitive and goes in expo-secure-store. Both are in the Expo SDK; no extra dependency.

**Zustand for app state**
Minimal API, no boilerplate, works well with React hooks. Redux is overkill; plain Context re-renders too broadly. The store at this stage is a skeleton — just enough structure for subsequent changes to extend.

**dayjs over Luxon / date-fns**
Smallest footprint, familiar moment.js-like API, good locale support. date-fns is tree-shakeable but more verbose; Luxon is heavier. dayjs does everything this app needs.

## Risks / Trade-offs

**SQLite schema migrations** → As later changes add columns (e.g. Bristol scale, AI description), the schema will need migrations. Mitigation: use `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE ADD COLUMN IF NOT EXISTS` patterns from the start. Keep a `schema_version` key in AsyncStorage to gate migrations.

**expo-sqlite v2 API** → Expo SDK 51+ ships a new async `expo-sqlite` API. Use the new API from day one to avoid a migration later.

## Open Questions

_(none — all decisions are made)_
