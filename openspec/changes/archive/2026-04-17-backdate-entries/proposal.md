## Why

User testing revealed that people sometimes want to log a food or medication entry for a past day (e.g. forgot to log dinner last night). Currently every new entry is pinned to today's date — there is no way to change the date. This makes the diary inaccurate when users can't log in real time.

## What Changes

- Add a **date picker row** to all four entry forms (food, ache, toilet, medication), displayed above the existing time picker
- New entries default to the **currently selected date** on the timeline (so browsing yesterday and tapping "+" starts on yesterday)
- Users can tap the date row to override the date via the platform date picker
- Future dates are disallowed (`maximumDate = today`)
- Edit mode shows the entry's stored date and allows changing it
- After saving, the user stays on whatever timeline date they were viewing (no auto-navigation)

## Capabilities

### New Capabilities

- `entry-date-picker`: Date selection field for entry forms — defaults to timeline's selected date, allows backdating, caps at today

### Modified Capabilities

_None — no spec-level behaviour changes to existing capabilities. The timestamp field in SQLite already stores full date+time; this change only exposes the date portion in the UI._

## Impact

- **Components**: New `DatePickerField` component; all four entry screens gain one extra field row
- **Store**: Entry forms read `selectedDate` from Zustand to set the default (already available, no store changes)
- **Database**: No schema changes — `timestamp` column already holds epoch millis with full date+time
- **Dependencies**: Uses `@react-native-community/datetimepicker` which is already installed (used by `TimePickerField` and the timeline date header)
