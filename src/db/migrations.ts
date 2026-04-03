import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './database';

const CURRENT_SCHEMA_VERSION = 3;

export async function runMigrations(): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS events (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      type         TEXT    NOT NULL,
      timestamp    INTEGER NOT NULL,
      notes        TEXT,
      severity     INTEGER,
      bristol_type INTEGER,
      name         TEXT,
      created_at   INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS images (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id       INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      file_path      TEXT    NOT NULL,
      ai_description TEXT,
      created_at     INTEGER NOT NULL
    );

    PRAGMA foreign_keys = ON;
  `);

  const existing = await AsyncStorage.getItem('schema_version');
  const version = existing !== null ? parseInt(existing, 10) : 0;

  if (version < 2) {
    // Migration v1 → v2: add name column for medication entries
    try {
      await db.execAsync(`ALTER TABLE events ADD COLUMN name TEXT`);
    } catch {
      // Column may already exist if table was just created above — safe to ignore
    }
  }

  if (version < 3) {
    // Migration v2 → v3: add breaks_fast flag for fasting-exempt food entries
    try {
      await db.execAsync(`ALTER TABLE events ADD COLUMN breaks_fast INTEGER NOT NULL DEFAULT 1`);
    } catch {
      // Column may already exist if table was just created above — safe to ignore
    }
    await AsyncStorage.setItem('schema_version', String(CURRENT_SCHEMA_VERSION));
  }
}
