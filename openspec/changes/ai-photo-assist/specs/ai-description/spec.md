## ADDED Requirements

### Requirement: AI-assisted notes pre-fill

When a photo is attached and an OpenRouter API key is configured, the system SHALL automatically request a text description of the image and pre-fill the notes field.

#### Scenario: Notes pre-filled on photo selection

- **WHEN** the user attaches a photo and an API key is configured
- **THEN** the notes field SHALL show a loading indicator while the API call is in flight, then be populated with the returned description

#### Scenario: User can edit AI description

- **WHEN** the notes field is pre-filled by AI
- **THEN** the field SHALL remain editable so the user can correct or extend the description

#### Scenario: User can clear and retype

- **WHEN** the notes field is pre-filled by AI
- **THEN** the user SHALL be able to clear the field entirely and type their own notes

### Requirement: Graceful degradation

The food entry form SHALL function identically whether or not AI assistance is available.

#### Scenario: No API key configured

- **WHEN** the user attaches a photo and no OpenRouter API key is set
- **THEN** the photo SHALL be stored but no API call SHALL be made; the notes field SHALL remain empty

#### Scenario: API call fails

- **WHEN** the OpenRouter API returns an error or times out
- **THEN** the notes field SHALL be left empty, a brief error message SHALL be shown, and the user SHALL be able to continue logging normally

#### Scenario: No photo attached

- **WHEN** the user submits the food form without a photo
- **THEN** no API call SHALL be made regardless of API key configuration

### Requirement: Image resized before API submission

The system SHALL submit a reduced-resolution version of the image to the API to minimise cost and latency.

#### Scenario: Image sent at reduced size

- **WHEN** an API call is made
- **THEN** the image SHALL be resized to a maximum dimension of 512px before encoding and submission; the stored 720p image SHALL not be modified
