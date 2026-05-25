## ADDED Requirements

### Requirement: Retry AI description
The food entry screen SHALL provide a retry button that re-runs the AI photo description.

#### Scenario: Retry button visible
- **WHEN** a photo is attached to the food entry AND an OpenRouter API key is configured
- **THEN** a retry button SHALL be visible near the photo area

#### Scenario: Retry button hidden without photo
- **WHEN** no photo is attached to the food entry
- **THEN** the retry button SHALL NOT be visible

#### Scenario: Retry button hidden without API key
- **WHEN** a photo is attached but no OpenRouter API key is configured
- **THEN** the retry button SHALL NOT be visible

#### Scenario: Retry replaces notes
- **WHEN** the user taps the retry button
- **THEN** the system SHALL call the AI description API with the current photo and replace the notes field content with the new description

#### Scenario: Retry shows loading state
- **WHEN** the user taps the retry button
- **THEN** the notes field SHALL show a loading indicator while the API call is in flight, consistent with the initial auto-describe behavior
