## ADDED Requirements

### Requirement: FAB opens action sheet
The Timeline screen SHALL display a floating action button (FAB) in the bottom-right corner, above the tab bar.

#### Scenario: FAB visible on Timeline
- **WHEN** the Timeline tab is active
- **THEN** the FAB SHALL be visible and tappable

#### Scenario: FAB opens action sheet
- **WHEN** the user taps the FAB
- **THEN** a bottom sheet SHALL open presenting the available entry-type options

#### Scenario: Action sheet shows food and ache always
- **WHEN** the action sheet opens
- **THEN** "Food" and "Ache" options SHALL always be present

#### Scenario: Action sheet conditionally shows toilet option
- **WHEN** the action sheet opens and `toiletTrackingEnabled` is true
- **THEN** a "Toilet break" option SHALL also be present

#### Scenario: Tapping an option navigates to entry form
- **WHEN** the user taps an entry-type option in the action sheet
- **THEN** the action sheet SHALL close and the corresponding entry form modal SHALL open
