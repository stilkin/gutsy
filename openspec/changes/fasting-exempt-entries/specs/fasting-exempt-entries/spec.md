## ADDED Requirements

### Requirement: Food entries can be marked as fasting-safe
A food entry SHALL have a `breaks_fast` boolean property (stored as `INTEGER`, default `1`). When saving a food entry, the user SHALL be able to toggle whether it breaks the fast. The default is `true` (breaks fast).

#### Scenario: Default state on new food entry
- **WHEN** the user opens the food entry form
- **THEN** the "Breaks fast" toggle is ON by default

#### Scenario: Saving a fasting-safe entry
- **WHEN** the user turns "Breaks fast" OFF and saves
- **THEN** the event is stored with `breaks_fast = 0`

#### Scenario: Saving a fast-breaking entry
- **WHEN** the user leaves "Breaks fast" ON and saves
- **THEN** the event is stored with `breaks_fast = 1`

### Requirement: Fasting window is derived only from fast-breaking entries
The fasting window start SHALL be calculated as the earliest timestamp among food entries where `breaks_fast = 1`. If no fast-breaking food entries exist for the day, the window banner SHALL not be shown.

#### Scenario: All food entries are fasting-safe
- **WHEN** the day's only food entries have `breaks_fast = 0`
- **THEN** the fasting window banner is not displayed

#### Scenario: Mixed entries — some exempt, some not
- **WHEN** a day has a fasting-safe entry at 07:30 and a fast-breaking entry at 09:00
- **THEN** the window start is 09:00 (the exempt entry is ignored)

#### Scenario: All food entries break the fast
- **WHEN** all food entries for the day have `breaks_fast = 1`
- **THEN** the window start is the earliest of those entries (existing behaviour)

### Requirement: Timeline visually distinguishes fasting-exempt food entries
Food entries with `breaks_fast = 0` SHALL be rendered with a visual distinction in the timeline (e.g. muted/greyed food icon or a "(fasting-safe)" label) to make their exempt status immediately clear.

#### Scenario: Exempt entry in timeline
- **WHEN** a food entry has `breaks_fast = 0`
- **THEN** its row in the timeline shows a visual indicator of exempt status

#### Scenario: Normal entry in timeline
- **WHEN** a food entry has `breaks_fast = 1`
- **THEN** its row looks the same as before (no change)

### Requirement: PDF export annotates fasting-safe entries
In the PDF export, food entries with `breaks_fast = 0` SHALL be annotated inline (e.g. "fasting-safe") so the receiving dietician or physician can accurately interpret the fasting window.

#### Scenario: Export includes fasting-safe annotation
- **WHEN** a food entry has `breaks_fast = 0` and the user exports a date range containing it
- **THEN** the PDF entry is labelled to indicate it did not break the fast

#### Scenario: Export of normal food entry
- **WHEN** a food entry has `breaks_fast = 1`
- **THEN** the PDF entry has no additional annotation (existing behaviour)
