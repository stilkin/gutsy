## MODIFIED Requirements

### Requirement: Food entry form
The system SHALL provide a form for logging a food event with a timestamp, optional notes, and (in a later change) a photo. The notes field SHALL display at least 5-6 visible lines of text.

#### Scenario: Food entry saved with notes
- **WHEN** the user submits the food form with notes text
- **THEN** a row with `type='food'`, the current timestamp, and the provided notes SHALL be inserted into `events`

#### Scenario: Food entry saved without notes
- **WHEN** the user submits the food form with no notes
- **THEN** a row with `type='food'` and a NULL `notes` field SHALL be inserted

#### Scenario: Timestamp defaults to now
- **WHEN** the food form opens
- **THEN** the timestamp field SHALL default to the current date and time

#### Scenario: Notes field is tall enough for comfortable input
- **WHEN** any entry form (food, ache, toilet, medication) is displayed
- **THEN** the notes text input SHALL have a minimum height of 140 points, providing approximately 5-6 visible lines
