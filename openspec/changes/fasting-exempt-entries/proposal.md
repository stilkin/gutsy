## Why

Users sometimes log items like "cup of tea" or black coffee that don't meaningfully break a fast, but the current window calculation treats every food entry equally — causing the fasting window to start earlier than it should. There's no way to indicate that a logged entry is fasting-safe.

## What Changes

- Food entries gain a `breaks_fast` boolean flag (default: `true`)
- The food entry form gets a toggle — "Breaks fast" — defaulting to on
- The fasting window start is derived only from food entries where `breaks_fast = true`
- The fasting window notification is only rescheduled when a fast-breaking food event is saved
- Timeline visually distinguishes fasting-exempt entries (subtle treatment)
- PDF export notes fasting-exempt entries so the dietician has an accurate picture

## Capabilities

### New Capabilities

- `fasting-exempt-entries`: Per-entry flag on food events indicating whether the entry breaks the fast; drives window calculation, notification scheduling, timeline display, and export

### Modified Capabilities

- `event-logging`: Food entry form gains a "Breaks fast" toggle (new field on food events)
- `fasting-window`: Window start is now filtered to fast-breaking events only
- `timeline-view`: Fasting-exempt food entries rendered with a subtle visual distinction
- `export`: Fasting-exempt entries annotated in PDF export

## Impact

- `src/db/migrations.ts` — new migration adding `breaks_fast INTEGER NOT NULL DEFAULT 1` to `events`
- `src/types.ts` — `DiaryEvent` gains `breaks_fast: number` field
- `src/db/queries.ts` — `insertEvent` accepts and persists `breaks_fast`
- `app/entry/food.tsx` — new toggle field; passes flag to `insertEvent`
- `app/(tabs)/index.tsx` — `FastingWindowBanner` filters by `breaks_fast`; fasting-exempt rows styled differently
- `src/export/template.ts` — annotate fasting-exempt food entries in PDF
