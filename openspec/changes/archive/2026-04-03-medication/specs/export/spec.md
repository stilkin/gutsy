## MODIFIED Requirements

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

#### Scenario: Medication name shown in export

- **WHEN** a PDF is generated and a medication entry exists
- **THEN** the medication name SHALL be displayed as the primary label for that entry, followed by notes if present

#### Scenario: Images included and scaled

- **WHEN** a PDF is generated and an entry has an associated image
- **THEN** the image SHALL be included in the PDF, resized to a maximum dimension of 480px

#### Scenario: Empty date range

- **WHEN** no events exist in the selected date range
- **THEN** the PDF SHALL still be generated with a message indicating no entries were found for that period
