## ADDED Requirements

### Requirement: Window start detection
The system SHALL derive the fasting window start from the earliest food event on each calendar day.

#### Scenario: Window starts with first food entry
- **WHEN** the user logs a food event and no food events exist yet for that calendar day
- **THEN** the window start time SHALL be set to that event's timestamp

#### Scenario: Window start unchanged on subsequent food entries
- **WHEN** the user logs a food event and a food event already exists for that calendar day
- **THEN** the window start time SHALL remain the timestamp of the earliest food event

### Requirement: Window end calculation
The system SHALL calculate the window end time as window start plus the configured window duration.

#### Scenario: Window end derived from settings
- **WHEN** a window start exists for the day
- **THEN** the window end SHALL equal `windowStart + settings.windowHours` (in hours)

### Requirement: Closing notification
The system SHALL schedule a local notification to fire before the fasting window closes.

#### Scenario: Notification scheduled on first food entry
- **WHEN** the first food event of the day is logged and notification permission is granted
- **THEN** a local notification SHALL be scheduled to fire at `windowEnd - settings.notificationMinutes`

#### Scenario: Notification rescheduled when window changes
- **WHEN** a food event is added or edited that changes the window start time
- **THEN** any existing notification for today SHALL be cancelled and a new one scheduled

#### Scenario: No notification without permission
- **WHEN** the user has not granted notification permission
- **THEN** no notification SHALL be scheduled and the app SHALL continue to function normally

#### Scenario: Permission requested on first food entry
- **WHEN** the user logs their first food entry ever and permission has not been requested
- **THEN** the system SHALL request notification permission before scheduling
