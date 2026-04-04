## MODIFIED Requirements

### Requirement: Event details included
- **WHEN** a PDF is generated
- **THEN** each event SHALL render its time and type on a single line formatted as `HH:mm — Type`
- **AND** if the event is a medication entry with a name, the name SHALL appear inline after the type
- **AND** if the event is an ache entry with severity, the severity SHALL appear inline after the type as `Severity: N/5`
- **AND** if the event is a toilet entry with a Bristol type, the Bristol type SHALL appear inline after the type as `Bristol: N`
- **AND** if the event is a fasting-safe food entry, `(fasting-safe)` SHALL appear inline after the type
- **AND** notes (if any) SHALL render below the header with a maximum width of 50% of the page
- **AND** if the event has both a photo and notes, the photo and notes SHALL be laid out side-by-side (photo on the left, notes to the right)

#### Scenario: Medication entry renders as single line
- **WHEN** a PDF contains a medication entry with name "Carmenthin" at 10:34
- **THEN** the entry header SHALL render as `10:34 — Medication — Carmenthin`

#### Scenario: Ache entry renders severity inline
- **WHEN** a PDF contains an ache entry with severity 3 at 15:00
- **THEN** the entry header SHALL render as `15:00 — Ache — Severity: 3/5`

#### Scenario: Toilet entry renders Bristol type inline
- **WHEN** a PDF contains a toilet entry with Bristol type 5 at 12:15
- **THEN** the entry header SHALL render as `12:15 — Toilet — Bristol: 5`

#### Scenario: Food entry with notes
- **WHEN** a PDF contains a food entry at 11:08 with notes "A bowl of oatmeal"
- **THEN** the header SHALL render as `11:08 — Food` and the notes SHALL appear below, not exceeding 50% of the page width

#### Scenario: Fasting-safe food entry
- **WHEN** a PDF contains a fasting-safe food entry at 09:00
- **THEN** the header SHALL render as `09:00 — Food (fasting-safe)`

#### Scenario: Photo and notes side-by-side
- **WHEN** a PDF contains a food entry with both a photo and notes
- **THEN** the photo SHALL render on the left (100x100px) and the notes SHALL render to the right of the photo

#### Scenario: Photo without notes
- **WHEN** a PDF contains a food entry with a photo but no notes
- **THEN** the photo SHALL render below the header as before

### Requirement: Images included and scaled
- **WHEN** a PDF is generated and an entry has an associated image
- **THEN** the image SHALL be rendered as a 100x100px square
- **AND** the image SHALL be cropped from center using CSS `object-fit: cover` to fill the square without distortion

#### Scenario: Portrait image is square-cropped
- **WHEN** a portrait-oriented image is included in the PDF
- **THEN** it SHALL render as a 100x100px square, cropped from center

#### Scenario: Landscape image is square-cropped
- **WHEN** a landscape-oriented image is included in the PDF
- **THEN** it SHALL render as a 100x100px square, cropped from center
