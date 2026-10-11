## Context

The app already stores all diary events in a single `events` SQLite table with type-specific nullable columns (`severity` for ache, `bristol_type` for toilet). Adding medication follows the same pattern. The main new concerns are: a schema migration to add a `name` column, autocomplete UX drawing from past entries, and input sanitization.

## Goals / Non-Goals

**Goals:**

- Log medication events (timestamp, name, optional notes) from the FAB
- Autocomplete medication name from previous entries in SQLite
- Normalise name to Title Case + trim on save
- Show medication entries on the timeline with a distinct icon
- Include medication entries in the PDF export

**Non-Goals:**

- Medication scheduling or reminders
- Dosage or quantity tracking
- Drug interaction warnings or medication library lookups
- Per-medication settings or management UI

## Decisions

### 1. Store name in a new `name TEXT` column on `events` (not a separate table)

The existing pattern uses nullable columns for type-specific data (`severity`, `bristol_type`). A `name` column follows that same convention and avoids a join. `name` will be NULL for all non-medication event types.

Alternative considered: separate `medications` table. Rejected — overkill for a single extra field, adds a join to every query.

### 2. Schema migration: `ALTER TABLE events ADD COLUMN name TEXT`

SQLite supports `ADD COLUMN` without rebuilding the table. All existing rows will have `name = NULL`, which is correct. The `schema_version` in AsyncStorage is bumped so the migration runs exactly once.

### 3. Autocomplete: query once on form open, filter client-side

`SELECT DISTINCT name FROM events WHERE type='medication' AND name IS NOT NULL ORDER BY name` is called when the medication form mounts. Results are held in component state. As the user types, the list is filtered in-memory (case-insensitive prefix or substring match). This is simple and fast — a personal diary will have at most tens of distinct medication names.

Alternative considered: debounced DB query on each keystroke. Rejected — unnecessary complexity for small data sets.

### 4. Sanitization applied on save, not while typing

Applying Title Case during typing fights the user's cursor position and feels jarring. Instead, `name.trim().replace(/\b\w/g, c => c.toUpperCase())` is called immediately before `insertEvent`. The autocomplete suggestions are already normalized (stored normalized from prior saves), so matching against the raw input uses `.toLowerCase()` for comparison.

### 5. Icons: use `@expo/vector-icons` (Ionicons), already bundled with Expo

All four event types get a small icon in the timeline row. Ionicons has suitable glyphs: `restaurant` (food), `alert-circle` (ache), `water` (toilet), `medical` (medication). No new dependency needed.

## Risks / Trade-offs

- **`name` column NULL for non-medication rows** → queries that read all event types must handle `name` being NULL; this is already the pattern for `severity` and `bristol_type`.
- **Autocomplete normalisation mismatch** — if a user somehow has un-normalised names in DB from future manual data entry, duplicates may appear in suggestions. Mitigation: normalize on display too (`UPPER(SUBSTR(name,1,1)) || LOWER(SUBSTR(name,2,...))` is not needed — client-side JS normalization at suggestion render is sufficient).
- **`ALTER TABLE` migration is irreversible** — downgrading the app to a version without the column is benign (SQLite ignores unknown columns in SELECT *), but inserting without the column would fail. Acceptable risk for a personal app with no multi-version concurrency.

## Migration Plan

1. Bump `schema_version` constant in `migrations.ts` (e.g. 1 → 2)
2. Add migration step: if current version < 2, run `ALTER TABLE events ADD COLUMN name TEXT`
3. Write new version to AsyncStorage
4. No rollback needed — column addition is backwards-compatible for reads
