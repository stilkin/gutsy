## MODIFIED Requirements

### Requirement: Day timeline

The Timeline screen SHALL display all events for the selected day in chronological order.

#### Scenario: Events shown for selected day

- **WHEN** a day is selected
- **THEN** all events with a `timestamp` falling on that calendar day SHALL be listed, sorted ascending by timestamp

#### Scenario: Empty state

- **WHEN** no events exist for the selected day
- **THEN** a message indicating no entries for that day SHALL be displayed

#### Scenario: Event type visually distinct with icon

- **WHEN** events of different types are displayed
- **THEN** each event row SHALL show a distinct icon for its type: a food icon for food entries, a pain/alert icon for ache entries, a water/drop icon for toilet entries, and a medical/pill icon for medication entries

#### Scenario: Medication entry shown on timeline

- **WHEN** a medication event exists for the selected day
- **THEN** it SHALL appear in the timeline with the medication name as the primary label and notes (if any) as secondary text
