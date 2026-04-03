## Context

Food events currently all count equally toward the fasting window. The window start is derived as `Math.min(...foodEvents.map(e => e.timestamp))` — the earliest food event of the day. There is no way to mark an entry as fasting-safe (e.g. a cup of tea or black coffee).

The window is entirely derived; it is never stored. This is a strength — no sync problems, no stale state. The fix should preserve this property by filtering the derivation, not by adding override storage.

## Goals / Non-Goals

**Goals:**
- Let users mark a food entry as "does not break my fast"
- Fasting window calculation and notifications only count fast-breaking entries
- Timeline makes fasting-exempt entries visually distinguishable
- PDF export accurately reflects which entries were considered fast-breaking

**Non-Goals:**
- Storing the fasting window as an explicit record
- Editing the window start time directly (an override layer would introduce sync complexity)
- Retroactively marking past entries exempt (existing rows default to `breaks_fast = 1`, which is correct)

## Decisions

### 1. Store `breaks_fast` as `INTEGER` in SQLite, not a Zustand flag

`breaks_fast` is event data, not UI state. It belongs in SQLite alongside `severity`, `bristol_type`, etc. A default of `1` (true) means all existing rows remain unchanged after migration — no backfill needed.

*Alternative considered:* A per-day override in AsyncStorage. Rejected: creates hidden state that can drift from event data if entries are edited or deleted.

### 2. Default to `true` ("breaks fast" is on by default)

Most food entries do break a fast. Requiring users to opt out for exceptions (tea, coffee) is less friction than opting in for every real meal. The toggle in the food form defaults to ON.

*Alternative:* Default off. Rejected: would invalidate all existing data and force extra taps for the common case.

### 3. Fasting window stays fully derived

No new storage. The banner calculation gains a `.filter(e => e.breaks_fast)` before the `Math.min`. The notification reschedule is similarly gated. This keeps the data model minimal.

### 4. Visual treatment for exempt entries: muted icon, no separate section

Exempt food entries appear in the timeline in their natural chronological position — they are still meaningful diary entries. A muted/greyed icon (or a small label) signals the distinction without restructuring the list.

*Alternative:* A separate "exempt" section or different row layout. Rejected: overcomplicates the timeline for an edge case.

### 5. PDF export: annotate inline, not in a separate section

Fasting-exempt entries are noted with a small marker (e.g. "(fasting-safe)") next to the entry in the export. The dietician sees all entries in context.

## Risks / Trade-offs

- **Migration is additive only** → SQLite `ALTER TABLE ADD COLUMN` with a default is safe and fast. No rollback risk.
- **Existing notification logic** — the food form doesn't currently call notification scheduling (the spec says it should, but the code doesn't). This change should be careful not to introduce or fix that silently; stay in scope.
- **`breaks_fast` is food-only** — other event types (`ache`, `toilet`, `medication`) never affect the window. The field is nullable for non-food events, but `insertEvent` only receives it for food entries. The type definition can carry it as optional.
