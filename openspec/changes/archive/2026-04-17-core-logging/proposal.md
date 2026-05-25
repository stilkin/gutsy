## Why

The app foundation provides a shell with no functionality. This change delivers the complete core experience: logging food, ache, and toilet events; viewing them on a day timeline; tracking the intermittent fasting window with a closing notification; and configuring all behaviour from a settings screen.

## What Changes

- Replace placeholder Timeline screen with a functional day-by-day timeline of logged events
- Replace placeholder Settings screen with a working settings form
- Wire the FAB action sheet to three entry forms: Food, Ache, Toilet break
- Implement fasting window tracking: first food entry of the day starts the window; a local notification fires 30 minutes before it closes
- Add date navigation (previous/next day buttons + date picker) to the Timeline
- Add all entry types to the Zustand store and SQLite query layer

## Capabilities

### New Capabilities

- `event-logging`: Creating food, ache, and toilet entries — form fields, validation, persistence to SQLite
- `timeline-view`: Day timeline rendering, date navigation, fasting window indicator
- `fasting-window`: Window start detection, end calculation, local notification scheduling
- `settings`: User-configurable preferences — window duration, notification lead time, toilet tracking toggle, Bristol scale toggle

### Modified Capabilities

- `navigation-shell`: FAB action sheet items now navigate to real entry forms instead of placeholders

## Impact

- Adds `expo-notifications` permission request flow (first launch)
- Extends Zustand store with event and settings state
- Adds SQLite query functions for inserting and reading events by date
- `app/(tabs)/index.tsx` and `app/(tabs)/settings.tsx` are fully replaced
- `src/components/ActionSheet.tsx` wired to navigation
