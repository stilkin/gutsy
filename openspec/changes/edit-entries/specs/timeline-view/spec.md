## MODIFIED Requirements

### Requirement: Day timeline
The Timeline screen SHALL display all events for the selected day in chronological order, and each event row SHALL be tappable to open its edit form.

#### Scenario: Events shown for selected day
- **WHEN** a day is selected
- **THEN** all events with a `timestamp` falling on that calendar day SHALL be listed, sorted ascending by timestamp

#### Scenario: Empty state
- **WHEN** no events exist for the selected day
- **THEN** a message indicating no entries for that day SHALL be displayed

#### Scenario: Event type visually distinct
- **WHEN** events of different types are displayed
- **THEN** food, ache, and toilet entries SHALL be visually distinguishable (e.g. distinct icon or colour per type)

#### Scenario: Tap row opens edit form
- **WHEN** the user taps an event row
- **THEN** the corresponding entry form SHALL open in edit mode, pre-populated with that event's data
