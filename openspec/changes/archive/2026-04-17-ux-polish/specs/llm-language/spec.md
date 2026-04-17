## ADDED Requirements

### Requirement: Language preference setting
The system SHALL provide a setting for the user to select the preferred language for AI-generated food descriptions.

#### Scenario: Language options available
- **WHEN** the user opens the settings screen
- **THEN** a language picker SHALL be visible with the following options: English, Spanish, Portuguese, French, German, Italian, Dutch, Polish, Turkish, Indonesian

#### Scenario: Default language
- **WHEN** the app is launched for the first time
- **THEN** the language setting SHALL default to English

#### Scenario: Language persisted
- **WHEN** the user selects a language
- **THEN** the selection SHALL be persisted to AsyncStorage and used for all subsequent AI descriptions

### Requirement: Language injected into AI prompt
The system SHALL append a language instruction to the AI prompt so the description is returned in the user's chosen language.

#### Scenario: Non-English language selected
- **WHEN** the user has selected French as their language and a food photo is submitted for AI description
- **THEN** the AI prompt SHALL include an instruction to respond in French

#### Scenario: English language selected
- **WHEN** the user has selected English (the default)
- **THEN** no additional language instruction needs to be appended to the prompt
