## Context

All four entry forms (food, ache, toilet, medication) use a `TimePickerField` component that lets users pick hours and minutes. The date is always "now" — `new Date()`. The timeline already supports browsing past days and the `selectedDate` is available in the Zustand store, but entry forms don't use it to seed the date.

The `@react-native-community/datetimepicker` package is already installed and used in both `TimePickerField` (mode `"time"`) and the timeline's `DateHeader` (mode `"date"`).

## Goals / Non-Goals

**Goals:**

- Let users set the date on any entry (create or edit)
- Default new entries to the timeline's currently selected date
- Prevent future dates
- Keep the existing time-only picker untouched (no regression for the common case)

**Non-Goals:**

- Combined date+time picker in a single widget (user preference: separate rows)
- Auto-navigating the timeline to the entry's date after saving
- Any database schema changes

## Decisions

**1. New `DatePickerField` component, separate from `TimePickerField`**

Both are small, single-purpose components. Merging them into a combined component adds complexity for little gain — most entries only need time adjustment. A separate `DatePickerField` keeps each component focused and the common path (time-only tweaks) zero-friction.

Alternative considered: extending `TimePickerField` with an optional date mode. Rejected because it would add conditional logic to a component that's already clean and simple.

**2. Default date sourced from `selectedDate` in the Zustand store**

Entry forms already read `selectedDate` for the reload-after-edit flow. Using the same value as the initial date is consistent and requires no new plumbing. The `timestamp` state in each form is initialized by combining `selectedDate` (date portion) with the current time.

Alternative considered: passing the date as a route param. Rejected because `selectedDate` is already the source of truth and avoids coupling route params to this concern.

**3. Date change updates the date portion of `timestamp`, preserving time**

When the user picks a new date, only year/month/day change on the `timestamp` state. The hours and minutes stay as-is. This avoids surprising resets when switching between pickers.

**4. After save, stay on the current timeline date**

No auto-navigation. The entry is persisted in SQLite and will appear when the user browses to that day. Jumping to a different day after save is disorienting, especially if the user wants to add multiple entries for different dates.

## Risks / Trade-offs

**[Minor] Invisible entry after save** — If a user backdates an entry while viewing today, the saved entry won't appear in the current list. → Accepted trade-off; the entry is safely stored and the user knows they picked a past date. The UX is self-explanatory.

**[Minor] Time initialisation for past dates** — When creating an entry for yesterday, the time defaults to "now" (e.g. 14:30). That's fine — the user already intends to adjust time when backdating. → No mitigation needed; consistent with current behaviour.
