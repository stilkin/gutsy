## 1. Database Migration

- [ ] 1.1 Add migration in `src/db/migrations.ts` — `ALTER TABLE events ADD COLUMN breaks_fast INTEGER NOT NULL DEFAULT 1` (guarded with schema version check)
- [ ] 1.2 Update `src/types.ts` — add `breaks_fast: number` to `DiaryEvent`

## 2. Data Layer

- [ ] 2.1 Update `insertEvent` in `src/db/queries.ts` to accept and persist `breaks_fast` (default `1` if not provided, so all non-food callers are unaffected)

## 3. Food Entry Form

- [ ] 3.1 Add `breaksfast` state (default `true`) to `app/entry/food.tsx`
- [ ] 3.2 Render a "Breaks fast" toggle row in the form (below notes, above save)
- [ ] 3.3 Pass `breaks_fast: breaksFast ? 1 : 0` to `insertEvent` on save
- [ ] 3.4 Pass `breaks_fast` value when calling `addEvent` to update Zustand store

## 4. Timeline — Window Calculation & Visual Treatment

- [ ] 4.1 Update `FastingWindowBanner` in `app/(tabs)/index.tsx` — filter food events by `breaks_fast === 1` before computing window start
- [ ] 4.2 Update `EventRow` — if `event.type === 'food' && event.breaks_fast === 0`, render a muted food icon or a small "(fasting-safe)" label

## 5. PDF Export

- [ ] 5.1 Update `src/export/template.ts` — append "(fasting-safe)" annotation to food entries where `breaks_fast === 0`

## 6. Smoke Test

- [ ] 6.1 Log a normal food entry → window starts from that entry as before
- [ ] 6.2 Log a fasting-safe entry followed by a normal entry → window starts from the normal entry
- [ ] 6.3 Log only fasting-safe entries → no window banner shown
- [ ] 6.4 Verify fasting-safe entry appears with visual distinction in the timeline
- [ ] 6.5 Export a date with a mix of entries → PDF annotates fasting-safe entry correctly
