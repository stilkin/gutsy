## ADDED Requirements

### Requirement: Photo attachment on food entry

The food entry form SHALL allow the user to attach one photo per entry, taken with the camera or chosen from the photo library.

#### Scenario: User takes a photo

- **WHEN** the user taps the photo button and selects "Camera"
- **THEN** the camera SHALL open, and after capture the image SHALL appear as a preview in the form

#### Scenario: User picks from library

- **WHEN** the user taps the photo button and selects "Library"
- **THEN** the photo library picker SHALL open, and after selection the image SHALL appear as a preview in the form

#### Scenario: Permission requested on first use

- **WHEN** the user taps the photo button for the first time
- **THEN** the system SHALL request camera and/or photo library permission before proceeding

#### Scenario: Photo can be removed before saving

- **WHEN** a photo preview is shown in the form
- **THEN** the user SHALL be able to remove it, clearing the preview

### Requirement: Image resizing before storage

The system SHALL resize captured or picked images before writing them to the device filesystem.

#### Scenario: Image stored at 720p

- **WHEN** a food entry with a photo is saved
- **THEN** the image SHALL be resized to a maximum dimension of 1280px (720p-equivalent) before being written to the app document directory

#### Scenario: Original image not stored

- **WHEN** a food entry with a photo is saved
- **THEN** only the resized image SHALL be stored; the original full-resolution file SHALL be discarded
