## ADDED Requirements

### Requirement: Date range selection
The system SHALL allow the user to select a start and end date for the export.

#### Scenario: Default range is last 7 days
- **WHEN** the export screen opens
- **THEN** the start date SHALL default to 7 days before today and the end date SHALL default to today

#### Scenario: User changes start date
- **WHEN** the user taps the start date field
- **THEN** a date picker SHALL open allowing selection of any date up to the current end date

#### Scenario: User changes end date
- **WHEN** the user taps the end date field
- **THEN** a date picker SHALL open allowing selection of any date from the start date up to today

### Requirement: PDF generation
The system SHALL generate a PDF document containing all diary events within the selected date range.

#### Scenario: Events grouped by day
- **WHEN** a PDF is generated
- **THEN** events SHALL be grouped by calendar day with a clear day heading, sorted chronologically within each day

#### Scenario: Event details included
- **WHEN** a PDF is generated
- **THEN** each event SHALL show its time (formatted), type, and notes (if any)

#### Scenario: Severity shown for ache entries
- **WHEN** a PDF is generated and an ache entry has a severity value
- **THEN** the severity (1–5) SHALL be displayed alongside the entry

#### Scenario: Bristol type shown for toilet entries
- **WHEN** a PDF is generated and a toilet entry has a Bristol type value
- **THEN** the Bristol type (1–7) SHALL be displayed alongside the entry

#### Scenario: Images included and scaled
- **WHEN** a PDF is generated and an entry has an associated image
- **THEN** the image SHALL be included in the PDF, resized to a maximum dimension of 480px

#### Scenario: Empty date range
- **WHEN** no events exist in the selected date range
- **THEN** the PDF SHALL still be generated with a message indicating no entries were found for that period

### Requirement: PDF sharing
The system SHALL allow the user to share the generated PDF via the system share sheet.

#### Scenario: Share sheet opens after export
- **WHEN** the user taps the Export button and the PDF is generated
- **THEN** the system share sheet SHALL open with the PDF file ready to send

#### Scenario: Export button shows loading state
- **WHEN** the user taps the Export button
- **THEN** the button SHALL show a loading indicator while the PDF is being generated
