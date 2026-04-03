## Context

All four entry screens (food, ache, toilet, medication) are currently write-once: they always call `insertEvent` and `addEvent`, then navigate back. The only mutation available is delete via long-press. There is no route or query support for loading or updating an existing event.

The screens share a consistent structure (`EntryFormHeader`, `TimePickerField`, type-specific fields) and all live under `app/entry/`. The data layer has `insertEvent` and `deleteEventWithImages` but no update path. The Zustand store has `addEvent` and `removeEvent` but no update action.

## Goals / Non-Goals

**Goals:**
- Tap any timeline row → open that entry's form pre-populated
- All four forms support create and edit mode via an optional `?id=` route param
- `updateEvent` persists changes to SQLite; timeline re-fetches on return
- Food edit form shows existing stored image; user can remove (with confirmation) or replace it

**Non-Goals:**
- Swipe-to-delete (separate patch)
- Edit history or audit trail
- Changing an entry's type (food → ache etc.)
- AI re-analysis when replacing a food photo in edit mode

## Decisions

### 1. Single route per type, mode driven by `?id=` param

Each entry screen reads `useLocalSearchParams()`. If `id` is present, the screen is in edit mode: it loads the event from DB on mount and calls `updateEvent` on save. If absent, behaviour is unchanged (create mode).

**Why over separate `/entry/food-edit` routes**: Keeps routing simple, avoids duplicating the form JSX into a second file, and the forms are already stateful enough to handle both modes cleanly.

### 2. Re-fetch via `loadEventsForDate` after save, no new Zustand action

Edit mode calls `await loadEventsForDate(selectedDate)` then `router.back()` instead of patching in-memory state.

**Why over an optimistic `updateEvent` store action**: Eliminates a class of stale-state bugs (the timeline reflects exactly what's in DB), and the event list for a single day is small enough that a round-trip is imperceptible.

### 3. Image state model in food edit

Food entry edit tracks three pieces of state alongside the existing `photoUri` / `showPhotoSheet` state:

| State var | Meaning |
|---|---|
| `existingImagePath` | Path of the already-stored image loaded from DB (`null` if none) |
| `existingImageRemoved` | Whether the user has chosen to remove that stored image |
| `newPhotoUri` | A freshly-picked (unsaved) replacement photo |

On save: if `existingImageRemoved`, delete the DB row and file; if `newPhotoUri`, resize, write, and insert a new images row. The two actions are independent and can both happen in the same save (remove old, add new).

**Why not reuse `photoUri` for the existing image**: The existing image is already on disk; treating it the same as a fresh pick would trigger re-processing. Keeping them separate makes the save logic explicit and safe.

### 4. Confirm dialog only for removing a stored image

Removing an already-saved image is destructive (file + DB row deleted on save). A freshly-picked photo that hasn't been saved yet can be dismissed silently — the same "✕" button behaviour as create mode.

### 5. `getImageForEvent` query added to `queries.ts`

`getEventsByDate` returns `DiaryEvent` (no image path). Edit mode needs the existing image path for a single event. A small targeted query avoids over-fetching.

## Risks / Trade-offs

- **User edits the wrong entry accidentally** → tap target is the full row, which is large and deliberate; accidental edits are recoverable (just edit again or delete)
- **Image file deleted but DB row survives** (crash mid-save) → `getImageForEvent` would return a path pointing to a missing file; the food form should treat a missing file gracefully (show no image, not a crash). Low probability, acceptable for this app's scope.
- **`updateEvent` updates `timestamp`** — if the user changes a food entry's time, the fasting window banner will shift on re-fetch. This is correct behaviour. Notifications are not yet implemented, so no scheduling side-effects.
