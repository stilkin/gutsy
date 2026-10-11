## MODIFIED Requirements

### Requirement: Events table

The system SHALL maintain a single SQLite `events` table that stores all diary entries regardless of type.

Schema:

```
events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  type         TEXT    NOT NULL,   -- 'food' | 'ache' | 'toilet' | 'medication'
  timestamp    INTEGER NOT NULL,   -- Unix ms (user-facing event time)
  notes        TEXT,               -- optional free text
  severity     INTEGER,            -- 1–5, only for type='ache'
  bristol_type INTEGER,            -- 1–7, only for type='toilet'
  name         TEXT,               -- medication name, only for type='medication'
  created_at   INTEGER NOT NULL    -- Unix ms (record creation time)
)
```

#### Scenario: Database initialised on first launch

- **WHEN** the app opens for the first time
- **THEN** the `events` table SHALL be created if it does not exist, including the `name` column

#### Scenario: Food entry stored

- **WHEN** a food event is saved
- **THEN** a row with `type='food'`, a `timestamp`, and optional `notes` SHALL be inserted; `severity`, `bristol_type`, and `name` SHALL be NULL

#### Scenario: Ache entry stored

- **WHEN** an ache event is saved
- **THEN** a row with `type='ache'`, a `timestamp`, optional `notes`, and optional `severity` (1–5) SHALL be inserted; `name` SHALL be NULL

#### Scenario: Toilet entry stored

- **WHEN** a toilet event is saved
- **THEN** a row with `type='toilet'`, a `timestamp`, optional `notes`, and optional `bristol_type` (1–7) SHALL be inserted; `name` SHALL be NULL

#### Scenario: Medication entry stored

- **WHEN** a medication event is saved
- **THEN** a row with `type='medication'`, a `timestamp`, a non-null `name`, and optional `notes` SHALL be inserted; `severity` and `bristol_type` SHALL be NULL

#### Scenario: Schema migration adds name column

- **WHEN** the app launches on a device with an existing database at schema version 1
- **THEN** `ALTER TABLE events ADD COLUMN name TEXT` SHALL be executed and `schema_version` SHALL be updated to 2
