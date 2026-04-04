## ADDED Requirements

### Requirement: Model tier setting
The system SHALL provide a setting for the user to select an AI model cost tier that controls which OpenRouter model is used for food photo descriptions.

#### Scenario: Tier options available
- **WHEN** the user opens the settings screen
- **THEN** a model tier selector SHALL be visible with three options: Free, Normal, Premium

#### Scenario: Default tier
- **WHEN** the app is launched for the first time
- **THEN** the model tier SHALL default to Normal

#### Scenario: Tier persisted
- **WHEN** the user selects a tier
- **THEN** the selection SHALL be persisted to AsyncStorage and used for all subsequent AI descriptions

### Requirement: Tier maps to OpenRouter model
The system SHALL map each tier to a specific OpenRouter model identifier.

#### Scenario: Free tier model
- **WHEN** the model tier is set to Free
- **THEN** the system SHALL use the model `qwen/qwen3.6-plus:free` for AI descriptions

#### Scenario: Normal tier model
- **WHEN** the model tier is set to Normal
- **THEN** the system SHALL use the model `google/gemini-3-flash-preview` for AI descriptions

#### Scenario: Premium tier model
- **WHEN** the model tier is set to Premium
- **THEN** the system SHALL use the model `anthropic/claude-sonnet-4.6` for AI descriptions
