## MODIFIED Requirements

### Requirement: Food entry form

The system SHALL provide a form for logging a food event with a timestamp, optional notes, and an optional photo.

#### Scenario: Food entry saved with notes

- **WHEN** the user submits the food form with notes text
- **THEN** a row with `type='food'`, the current timestamp, and the provided notes SHALL be inserted into `events`

#### Scenario: Food entry saved without notes

- **WHEN** the user submits the food form with no notes
- **THEN** a row with `type='food'` and a NULL `notes` field SHALL be inserted

#### Scenario: Timestamp defaults to now

- **WHEN** the food form opens
- **THEN** the timestamp field SHALL default to the current date and time

#### Scenario: Food entry saved with photo

- **WHEN** the user submits the food form with a photo attached
- **THEN** the resized image SHALL be written to the app document directory and a row inserted in the `images` table linking it to the new event

#### Scenario: Food entry saved without photo

- **WHEN** the user submits the food form with no photo
- **THEN** no image file is written and no row is inserted in the `images` table
