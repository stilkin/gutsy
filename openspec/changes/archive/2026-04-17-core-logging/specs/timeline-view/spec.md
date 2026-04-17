## ADDED Requirements

### Requirement: Day timeline
The Timeline screen SHALL display all events for the selected day in chronological order.

#### Scenario: Events shown for selected day
- **WHEN** a day is selected
- **THEN** all events with a `timestamp` falling on that calendar day SHALL be listed, sorted ascending by timestamp

#### Scenario: Empty state
- **WHEN** no events exist for the selected day
- **THEN** a message indicating no entries for that day SHALL be displayed

#### Scenario: Event type visually distinct
- **WHEN** events of different types are displayed
- **THEN** food, ache, and toilet entries SHALL be visually distinguishable (e.g. distinct icon or colour per type)

### Requirement: Date navigation
The Timeline screen SHALL allow the user to move between days.

#### Scenario: Navigate to previous day
- **WHEN** the user taps the previous-day button
- **THEN** the timeline SHALL update to show events for the preceding calendar day

#### Scenario: Navigate to next day
- **WHEN** the user taps the next-day button
- **THEN** the timeline SHALL update to show events for the following calendar day

#### Scenario: Next-day button disabled on today
- **WHEN** the selected day is today
- **THEN** the next-day button SHALL be disabled

#### Scenario: Date picker opens on date tap
- **WHEN** the user taps the date display in the header
- **THEN** a date picker SHALL open allowing selection of any past or present day

#### Scenario: Dates formatted readably
- **WHEN** a date is displayed in the header
- **THEN** it SHALL be formatted in a human-readable form (e.g. "Sunday 29 March") using dayjs

### Requirement: Fasting window indicator
The Timeline screen SHALL visually indicate the fasting window for the selected day when one exists.

#### Scenario: Window shown when active
- **WHEN** a food event exists for the selected day
- **THEN** the timeline SHALL display the window start time and calculated end time

#### Scenario: No window shown without food entry
- **WHEN** no food events exist for the selected day
- **THEN** no fasting window indicator SHALL be shown
