# fasting-window Specification

## Purpose
TBD - created by archiving change core-logging. Update Purpose after archive.
## Requirements
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

