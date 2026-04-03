## Why

Diary entries are currently write-once: the only mutation available is delete. Users have no way to correct a timestamp, fix a typo, change a severity rating, or update notes after saving — making the diary brittle for everyday use where small corrections are common.

## What Changes

- Tapping a timeline row opens the existing entry form pre-populated with that entry's data
- All four entry forms (food, ache, toilet, medication) support both create and edit modes, controlled by an optional `?id=` route param
- On save in edit mode, `updateEvent` replaces the existing row in SQLite and the timeline re-fetches
- Food entry edit form shows the existing stored image; the user can remove it (with confirmation) or replace it with a new photo
- Long-press delete remains as the deletion gesture (swipe-to-delete is a separate patch)

## Capabilities

### New Capabilities

- `entry-editing`: Per-entry edit flow — navigate to any existing event's form, pre-populate all fields, persist changes via `updateEvent`; covers all four entry types and image management for food entries

### Modified Capabilities

- `event-logging`: Entry forms now support edit mode in addition to create mode; food form gains image-editing behaviour (view/remove/replace existing stored image)
- `timeline-view`: Tapping an event row navigates to its edit form

## Impact

- `src/db/queries.ts` — new `updateEvent(id, fields)` query; new `getImageForEvent(eventId)` query
- `src/store/index.ts` — `loadEventsForDate` already handles re-fetch; no new store action needed
- `app/entry/food.tsx` — accepts `?id=` param; loads event + image from DB; calls `updateEvent` + image CRUD on save
- `app/entry/ache.tsx` — accepts `?id=` param; loads event; calls `updateEvent` on save
- `app/entry/toilet.tsx` — accepts `?id=` param; loads event; calls `updateEvent` on save
- `app/entry/medication.tsx` — accepts `?id=` param; loads event; calls `updateEvent` on save
- `app/(tabs)/index.tsx` — `EventRow` gains `onPress` → `router.push('/entry/<type>?id=<id>')`
