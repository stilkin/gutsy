## ADDED Requirements

### Requirement: Edit existing entry
The system SHALL allow the user to open any existing diary event in its entry form for editing.

#### Scenario: Tap row opens edit form
- **WHEN** the user taps an event row in the timeline
- **THEN** the corresponding entry form SHALL open with all fields pre-populated from the stored event

#### Scenario: Edit form shows correct type
- **WHEN** the user taps a food entry row
- **THEN** the food entry form SHALL open (not ache, toilet, or medication)

#### Scenario: Timestamp pre-populated
- **WHEN** an entry form opens in edit mode
- **THEN** the timestamp field SHALL reflect the stored event timestamp, not the current time

#### Scenario: Save persists changes
- **WHEN** the user modifies fields and taps Save in edit mode
- **THEN** the existing event row in SQLite SHALL be updated with the new values

#### Scenario: Timeline refreshes after edit
- **WHEN** the user saves an edited entry
- **THEN** the timeline SHALL reload and reflect the updated values

#### Scenario: Entry type cannot be changed
- **WHEN** an entry form opens in edit mode
- **THEN** the entry type (food, ache, toilet, medication) SHALL be fixed and not editable

### Requirement: Edit food entry image
The system SHALL allow the user to manage the photo on a food entry when editing.

#### Scenario: Existing image shown in edit form
- **WHEN** the food entry form opens in edit mode and the event has a stored image
- **THEN** the existing image SHALL be displayed in the photo preview area

#### Scenario: Remove stored image with confirmation
- **WHEN** the user taps the remove button on an existing stored image
- **THEN** a confirmation dialog SHALL appear before the image is marked for removal

#### Scenario: Stored image deleted on save after confirmation
- **WHEN** the user confirms removal and saves the form
- **THEN** the image file SHALL be deleted from the filesystem and its row removed from the `images` table

#### Scenario: Unsaved photo dismissed without confirmation
- **WHEN** the user picks a new photo during an edit session and then taps remove
- **THEN** the photo SHALL be cleared immediately with no confirmation dialog

#### Scenario: Replace image
- **WHEN** the user picks a new photo after removing the existing one and saves
- **THEN** the new image SHALL be resized, written to disk, and inserted into the `images` table linked to the event
