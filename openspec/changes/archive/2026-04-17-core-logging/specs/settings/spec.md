## ADDED Requirements

### Requirement: Fasting window configuration
The system SHALL allow the user to configure the feeding window duration and notification lead time.

#### Scenario: Window duration saved
- **WHEN** the user changes the window duration setting
- **THEN** the new value SHALL be persisted to AsyncStorage and used for all subsequent window calculations

#### Scenario: Window duration default
- **WHEN** the app is launched for the first time
- **THEN** the window duration SHALL default to 8 hours

#### Scenario: Notification lead time saved
- **WHEN** the user changes the notification lead time
- **THEN** the new value SHALL be persisted and used when scheduling future notifications

#### Scenario: Notification lead time default
- **WHEN** the app is launched for the first time
- **THEN** the notification lead time SHALL default to 30 minutes

### Requirement: Toilet tracking toggle
The system SHALL allow the user to enable or disable toilet break logging.

#### Scenario: Toilet tracking disabled
- **WHEN** the user disables toilet tracking
- **THEN** the "Toilet break" option SHALL disappear from the FAB action sheet

#### Scenario: Toilet tracking enabled
- **WHEN** the user enables toilet tracking
- **THEN** the "Toilet break" option SHALL appear in the FAB action sheet

#### Scenario: Toilet tracking default
- **WHEN** the app is launched for the first time
- **THEN** toilet tracking SHALL be enabled by default

### Requirement: Bristol scale toggle
The system SHALL allow the user to show or hide the Bristol stool scale selector within the toilet entry form.

#### Scenario: Bristol scale disabled
- **WHEN** the user disables the Bristol scale setting
- **THEN** the scale selector SHALL not appear in the toilet entry form

#### Scenario: Bristol scale default
- **WHEN** the app is launched for the first time
- **THEN** the Bristol scale SHALL be disabled by default
