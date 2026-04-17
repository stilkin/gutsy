# event-logging Specification

## Purpose
TBD - created by archiving change core-logging. Update Purpose after archive.
## Requirements
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

### Requirement: Ache entry form
The system SHALL provide a form for logging an ache event with a timestamp, optional notes, and an optional severity rating.

#### Scenario: Ache entry saved with severity
- **WHEN** the user submits the ache form with a severity value (1–5)
- **THEN** a row with `type='ache'` and the given `severity` SHALL be inserted

#### Scenario: Ache entry saved without severity
- **WHEN** the user submits the ache form without selecting a severity
- **THEN** a row with `type='ache'` and NULL `severity` SHALL be inserted

#### Scenario: Severity input is a 1–5 scale
- **WHEN** the ache form is displayed
- **THEN** the severity control SHALL allow selection of values 1 through 5 only

### Requirement: Toilet entry form
The system SHALL provide a form for logging a toilet event with a timestamp and optional notes. Bristol scale type is conditionally shown based on settings.

#### Scenario: Toilet entry saved
- **WHEN** the user submits the toilet form
- **THEN** a row with `type='toilet'` and the current timestamp SHALL be inserted

#### Scenario: Bristol scale shown when enabled
- **WHEN** the toilet form opens and the `bristolScaleEnabled` setting is true
- **THEN** a Bristol scale selector (types 1–7) SHALL be visible

#### Scenario: Bristol scale hidden when disabled
- **WHEN** the toilet form opens and the `bristolScaleEnabled` setting is false
- **THEN** no Bristol scale selector SHALL be shown and `bristol_type` SHALL be NULL

#### Scenario: Toilet entry option hidden when disabled
- **WHEN** the `toiletTrackingEnabled` setting is false
- **THEN** the "Toilet break" option SHALL not appear in the FAB action sheet

### Requirement: Entry deletion
The system SHALL allow the user to delete any logged event from the timeline.

#### Scenario: Event deleted
- **WHEN** the user confirms deletion of an event
- **THEN** the event row SHALL be removed from SQLite and the timeline SHALL update immediately

#### Scenario: Associated images deleted
- **WHEN** an event with linked images is deleted
- **THEN** the image files SHALL be deleted from the device filesystem and the `images` rows removed via cascade

