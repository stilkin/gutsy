## ADDED Requirements

### Requirement: Events table

The system SHALL maintain a single SQLite `events` table that stores all diary entries regardless of type.

Schema:

```
events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  type         TEXT    NOT NULL,   -- 'food' | 'ache' | 'toilet'
  timestamp    INTEGER NOT NULL,   -- Unix ms (user-facing event time)
  notes        TEXT,               -- optional free text
  severity     INTEGER,            -- 1–5, only for type='ache'
  bristol_type INTEGER,            -- 1–7, only for type='toilet'
  created_at   INTEGER NOT NULL    -- Unix ms (record creation time)
)
```

#### Scenario: Database initialised on first launch

- **WHEN** the app opens for the first time
- **THEN** the `events` table SHALL be created if it does not exist

#### Scenario: Food entry stored

- **WHEN** a food event is saved
- **THEN** a row with `type='food'`, a `timestamp`, and optional `notes` SHALL be inserted; `severity` and `bristol_type` SHALL be NULL

#### Scenario: Ache entry stored

- **WHEN** an ache event is saved
- **THEN** a row with `type='ache'`, a `timestamp`, optional `notes`, and optional `severity` (1–5) SHALL be inserted

#### Scenario: Toilet entry stored

- **WHEN** a toilet event is saved
- **THEN** a row with `type='toilet'`, a `timestamp`, optional `notes`, and optional `bristol_type` (1–7) SHALL be inserted

### Requirement: Images table

The system SHALL maintain a SQLite `images` table that links image files on disk to their parent event.

Schema:

```
images (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id         INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  file_path        TEXT    NOT NULL,  -- absolute path in app document directory
  ai_description   TEXT,             -- nullable; populated by AI analysis
  created_at       INTEGER NOT NULL
)
```

#### Scenario: Image linked to event

- **WHEN** a food event with a photo is saved
- **THEN** the image file SHALL be written to the app document directory and a row inserted in `images` with the absolute `file_path` and the parent `event_id`

#### Scenario: Cascade delete

- **WHEN** an event row is deleted
- **THEN** all rows in `images` referencing that event SHALL also be deleted automatically via `ON DELETE CASCADE`

### Requirement: Schema versioning

The system SHALL track the current schema version in AsyncStorage under the key `schema_version` (integer) to enable future migrations.

#### Scenario: Schema version set on first launch

- **WHEN** the database is initialised for the first time
- **THEN** `schema_version` SHALL be written to AsyncStorage with the current version number
