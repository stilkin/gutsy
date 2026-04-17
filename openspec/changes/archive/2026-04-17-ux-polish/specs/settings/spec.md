## ADDED Requirements

### Requirement: Language setting
The settings screen SHALL include a language picker for selecting the AI description output language.

#### Scenario: Language picker rendered
- **WHEN** the settings screen is displayed
- **THEN** a language picker SHALL appear in the AI section with options: English, Spanish, Portuguese, French, German, Italian, Dutch, Polish, Turkish, Indonesian

#### Scenario: Language setting persisted
- **WHEN** the user selects a language
- **THEN** the value SHALL be persisted via AsyncStorage using the existing settings persistence pattern

### Requirement: Model tier setting
The settings screen SHALL include a model tier selector for choosing the AI model cost level.

#### Scenario: Model tier selector rendered
- **WHEN** the settings screen is displayed
- **THEN** a three-option selector (Free / Normal / Premium) SHALL appear in the AI section

#### Scenario: Model tier persisted
- **WHEN** the user selects a tier
- **THEN** the value SHALL be persisted via AsyncStorage using the existing settings persistence pattern
