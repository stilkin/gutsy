## ADDED Requirements

### Requirement: Medication entry form

The system SHALL provide a form for logging a medication event with a timestamp, a required medication name, and optional notes.

#### Scenario: Medication form opens from FAB

- **WHEN** the user taps "Medication" in the FAB action sheet
- **THEN** the medication entry modal SHALL open with the timestamp defaulting to the current date and time

#### Scenario: Medication entry saved

- **WHEN** the user submits the medication form with a name
- **THEN** a row with `type='medication'`, the selected timestamp, the normalised name, and optional notes SHALL be inserted into `events`

#### Scenario: Save blocked without name

- **WHEN** the user taps Save with an empty name field
- **THEN** the form SHALL not submit and SHALL indicate that a name is required

#### Scenario: Timestamp defaults to now

- **WHEN** the medication form opens
- **THEN** the timestamp field SHALL default to the current date and time

### Requirement: Medication name autocomplete

The system SHALL suggest previously used medication names as the user types in the name field.

#### Scenario: Suggestions appear while typing

- **WHEN** the user types one or more characters into the name field
- **THEN** a list of matching previously used medication names SHALL be shown below the input, filtered case-insensitively

#### Scenario: Tapping a suggestion fills the field

- **WHEN** the user taps a suggestion
- **THEN** the name field SHALL be populated with that suggestion and the suggestion list SHALL be dismissed

#### Scenario: No suggestions when field is empty

- **WHEN** the name field is empty
- **THEN** no suggestion list SHALL be shown

#### Scenario: No suggestions on first use

- **WHEN** the user opens the medication form and no medication events have been logged previously
- **THEN** no suggestion list SHALL be shown

### Requirement: Medication name sanitization

The system SHALL normalise the medication name before saving.

#### Scenario: Name is trimmed and Title Cased on save

- **WHEN** the user saves a medication entry
- **THEN** the stored name SHALL have leading and trailing whitespace removed and each word's first letter capitalised (Title Case)

#### Scenario: Autocomplete suggestions are normalised

- **WHEN** autocomplete suggestions are displayed
- **THEN** each suggestion SHALL be shown in its stored (normalised) Title Case form

### Requirement: Medication in FAB action sheet

The system SHALL expose a "Medication" entry option in the FAB action sheet.

#### Scenario: Medication option always visible

- **WHEN** the FAB action sheet opens
- **THEN** a "Medication" option SHALL always be shown (it is not conditionally hidden by any setting)
