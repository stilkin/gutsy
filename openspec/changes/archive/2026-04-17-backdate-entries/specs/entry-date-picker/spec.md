## ADDED Requirements

### Requirement: Date picker field on entry forms

All entry forms (food, ache, toilet, medication) SHALL display a date picker field above the time picker field. The field SHALL show the currently selected date in a human-readable format (e.g. "17 April 2026"). Tapping the field SHALL open the platform date picker.

#### Scenario: Date field is visible on new entry
- **WHEN** the user opens any entry form to create a new entry
- **THEN** a date field is displayed above the time field, showing a date value

#### Scenario: Date field is visible on edit entry
- **WHEN** the user opens any entry form to edit an existing entry
- **THEN** a date field is displayed above the time field, showing the entry's stored date

### Requirement: Default date matches timeline selection

When creating a new entry, the date field SHALL default to the date currently selected on the timeline (the `selectedDate` from the store), not necessarily today.

#### Scenario: New entry from past day
- **WHEN** the user is viewing yesterday's timeline and opens a new entry form
- **THEN** the date field defaults to yesterday's date

#### Scenario: New entry from today
- **WHEN** the user is viewing today's timeline and opens a new entry form
- **THEN** the date field defaults to today's date

### Requirement: Date is user-changeable

The user SHALL be able to change the date by tapping the date field and selecting a different date from the platform date picker. Changing the date SHALL NOT reset the time value.

#### Scenario: Change date preserves time
- **WHEN** the user has set the time to 09:15 and then changes the date
- **THEN** the time remains 09:15 after the date change

### Requirement: Future dates are disallowed

The date picker SHALL NOT allow selecting a date in the future. The maximum selectable date SHALL be today.

#### Scenario: Future date blocked
- **WHEN** the user opens the date picker
- **THEN** dates after today are not selectable

### Requirement: Saved timestamp reflects chosen date and time

When the user saves an entry, the persisted timestamp SHALL combine the selected date and the selected time into a single epoch-millisecond value.

#### Scenario: Backdated entry is stored correctly
- **WHEN** the user sets the date to two days ago and the time to 19:00 and saves
- **THEN** the stored timestamp corresponds to 19:00 on that past date

### Requirement: Timeline stays on current date after save

After saving an entry (new or edited), the app SHALL return to the timeline without changing which date the timeline is displaying.

#### Scenario: Save backdated entry without navigation
- **WHEN** the user is viewing today's timeline, creates a food entry dated yesterday, and saves
- **THEN** the timeline still shows today's date after returning
