## 1. Data Layer

- [x] 1.1 Add `updateEvent(id, fields)` to `src/db/queries.ts` — updates `timestamp`, `notes`, `severity`, `bristol_type`, `name`, `breaks_fast` for the given event id
- [x] 1.2 Add `getImageForEvent(eventId)` to `src/db/queries.ts` — returns `{ id, file_path } | null` for the first image linked to an event

## 2. Timeline — Tap to Edit

- [x] 2.1 Add `onPress` to `EventRow` in `app/(tabs)/index.tsx` — calls `router.push('/entry/<type>?id=<id>')`
- [x] 2.2 Pass `onPress` handler down from `TimelineScreen` to each `EventRow`

## 3. Ache, Toilet, Medication — Edit Mode

- [x] 3.1 `app/entry/ache.tsx` — read `id` from `useLocalSearchParams`; if present, load event from DB on mount and pre-populate `timestamp`, `notes`, `severity`; call `updateEvent` on save instead of `insertEvent`; call `loadEventsForDate` then `router.back()`
- [x] 3.2 `app/entry/toilet.tsx` — same pattern: load, pre-populate `timestamp`, `notes`, `bristol_type`; call `updateEvent` on save
- [x] 3.3 `app/entry/medication.tsx` — same pattern: load, pre-populate `timestamp`, `notes`, `name`; call `updateEvent` on save

## 4. Food Entry — Edit Mode

- [x] 4.1 `app/entry/food.tsx` — read `id` from `useLocalSearchParams`; if present, load event from DB on mount and pre-populate `timestamp`, `notes`, `breaksFast`
- [x] 4.2 Load existing image via `getImageForEvent` on mount; store result in `existingImagePath` state
- [x] 4.3 Render existing image in the photo preview area when `existingImagePath` is set and not removed
- [x] 4.4 "Remove" button on existing image shows a confirmation Alert; on confirm, set `existingImageRemoved = true` and clear the preview
- [x] 4.5 On save in edit mode: if `existingImageRemoved`, delete the file and DB row; if `newPhotoUri`, resize, write, and insert new image row; call `updateEvent`; call `loadEventsForDate` then `router.back()`

## 5. Smoke Test

- [x] 5.1 Tap a food entry → form opens pre-populated; edit notes and save → timeline shows updated notes
- [ ] 5.2 Tap a food entry with an image → existing image shown; remove it with confirmation → image gone from timeline entry
- [ ] 5.3 Tap a food entry → replace image with new photo → new image persisted
- [x] 5.4 Tap an ache entry → edit severity → timeline shows updated severity
- [x] 5.5 Tap a medication entry → edit name → timeline shows updated name
- [x] 5.6 Tap a toilet entry → edit notes → timeline reflects change
- [x] 5.7 Tap an entry and change its timestamp to an earlier time → timeline re-orders correctly
