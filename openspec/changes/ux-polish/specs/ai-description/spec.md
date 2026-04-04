## MODIFIED Requirements

### Requirement: AI-assisted notes pre-fill
When a photo is attached and an OpenRouter API key is configured, the system SHALL automatically request a text description of the image and pre-fill the notes field. The prompt SHALL focus strictly on identifying food and drink items, excluding descriptions of plates, packaging, background, or non-food objects. The system SHALL use the model determined by the user's model tier setting and append a language instruction based on the user's language setting.

#### Scenario: Notes pre-filled on photo selection
- **WHEN** the user attaches a photo and an API key is configured
- **THEN** the notes field SHALL show a loading indicator while the API call is in flight, then be populated with the returned description

#### Scenario: User can edit AI description
- **WHEN** the notes field is pre-filled by AI
- **THEN** the field SHALL remain editable so the user can correct or extend the description

#### Scenario: User can clear and retype
- **WHEN** the notes field is pre-filled by AI
- **THEN** the user SHALL be able to clear the field entirely and type their own notes

#### Scenario: Prompt focuses on food only
- **WHEN** an image is sent to the AI for description
- **THEN** the prompt SHALL instruct the model to list only food and drink items and to not describe plates, packaging, background, or non-food objects

#### Scenario: Model determined by tier setting
- **WHEN** an AI description is requested
- **THEN** the system SHALL use the OpenRouter model corresponding to the user's current model tier setting

#### Scenario: Language instruction appended
- **WHEN** an AI description is requested and the user's language setting is not English
- **THEN** the prompt SHALL include an instruction to respond in the selected language
