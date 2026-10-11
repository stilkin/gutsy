## ADDED Requirements

### Requirement: Bottom tab navigation

The app SHALL use a bottom tab bar with two tabs: Timeline and Settings.

#### Scenario: Timeline tab is default

- **WHEN** the app launches
- **THEN** the Timeline tab SHALL be shown by default

#### Scenario: Switching tabs

- **WHEN** the user taps a tab bar item
- **THEN** the corresponding screen SHALL be displayed

### Requirement: Floating action button

The Timeline screen SHALL display a floating action button (FAB) in the bottom-right corner, above the tab bar.

#### Scenario: FAB visible on Timeline

- **WHEN** the Timeline tab is active
- **THEN** the FAB SHALL be visible and tappable

#### Scenario: FAB opens action sheet

- **WHEN** the user taps the FAB
- **THEN** a bottom sheet SHALL open presenting entry-type options (placeholder labels at this stage)

### Requirement: Screen placeholders

Each tab SHALL render a minimal placeholder screen so the navigation shell is functional end-to-end.

#### Scenario: Timeline placeholder renders

- **WHEN** the Timeline tab is active
- **THEN** a screen with a visible title "Timeline" SHALL be rendered without errors

#### Scenario: Settings placeholder renders

- **WHEN** the Settings tab is active
- **THEN** a screen with a visible title "Settings" SHALL be rendered without errors
