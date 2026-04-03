import dayjs from 'dayjs';
import * as FileSystem from 'expo-file-system';
import { db } from './database';
import type { DiaryEvent, DiaryEventWithImage } from '@/types';

export async function insertEvent(
  event: Omit<DiaryEvent, 'id' | 'created_at' | 'name' | 'breaks_fast'> & { name?: string | null; breaks_fast?: number }
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO events (type, timestamp, notes, severity, bristol_type, name, breaks_fast, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event.type,
      event.timestamp,
      event.notes ?? null,
      event.severity ?? null,
      event.bristol_type ?? null,
      event.name ?? null,
      event.breaks_fast ?? 1,
      Date.now(),
    ]
  );
  return result.lastInsertRowId;
}

export async function getEventsByDate(dateStr: string): Promise<DiaryEvent[]> {
  const start = dayjs(dateStr).startOf('day').valueOf();
  const end = dayjs(dateStr).add(1, 'day').startOf('day').valueOf();
  return db.getAllAsync<DiaryEvent>(
    `SELECT * FROM events WHERE timestamp >= ? AND timestamp < ? ORDER BY timestamp ASC`,
    [start, end]
  );
}

export async function deleteEvent(id: number): Promise<void> {
  await db.runAsync(`DELETE FROM events WHERE id = ?`, [id]);
}

export async function deleteEventWithImages(id: number): Promise<void> {
  const images = await db.getAllAsync<{ file_path: string }>(
    'SELECT file_path FROM images WHERE event_id = ?',
    [id]
  );
  await deleteEvent(id);
  for (const img of images) {
    try {
      await FileSystem.deleteAsync(img.file_path, { idempotent: true });
    } catch {
      // Ignore missing files
    }
  }
}

export async function getEventsByDateRange(
  start: Date,
  end: Date
): Promise<DiaryEventWithImage[]> {
  const startMs = dayjs(start).startOf('day').valueOf();
  const endMs   = dayjs(end).endOf('day').valueOf();
  return db.getAllAsync<DiaryEventWithImage>(
    `SELECT e.*, i.file_path AS image_path
     FROM events e
     LEFT JOIN images i ON i.event_id = e.id AND i.id = (
       SELECT MIN(id) FROM images WHERE event_id = e.id
     )
     WHERE e.timestamp >= ? AND e.timestamp <= ?
     ORDER BY e.timestamp ASC`,
    [startMs, endMs]
  );
}

export async function getEventById(id: number): Promise<DiaryEvent | null> {
  return db.getFirstAsync<DiaryEvent>(`SELECT * FROM events WHERE id = ?`, [id]);
}

export async function updateEvent(
  id: number,
  fields: {
    timestamp: number;
    notes: string | null;
    severity: number | null;
    bristol_type: number | null;
    name: string | null;
    breaks_fast: number;
  }
): Promise<void> {
  await db.runAsync(
    `UPDATE events SET timestamp = ?, notes = ?, severity = ?, bristol_type = ?, name = ?, breaks_fast = ? WHERE id = ?`,
    [fields.timestamp, fields.notes, fields.severity, fields.bristol_type, fields.name, fields.breaks_fast, id]
  );
}

export async function getImageForEvent(eventId: number): Promise<string | null> {
  const row = await db.getFirstAsync<{ file_path: string }>(
    `SELECT file_path FROM images WHERE event_id = ? ORDER BY id ASC LIMIT 1`,
    [eventId]
  );
  return row?.file_path ?? null;
}

export async function removeImageForEvent(eventId: number): Promise<void> {
  const rows = await db.getAllAsync<{ file_path: string }>(
    `SELECT file_path FROM images WHERE event_id = ?`,
    [eventId]
  );
  if (rows.length === 0) return;
  await db.runAsync(`DELETE FROM images WHERE event_id = ?`, [eventId]);
  for (const row of rows) {
    try {
      await FileSystem.deleteAsync(row.file_path, { idempotent: true });
    } catch {
      // Missing file is non-fatal
    }
  }
}

export async function getMedicationNames(): Promise<string[]> {
  const rows = await db.getAllAsync<{ name: string }>(
    `SELECT DISTINCT name FROM events WHERE type='medication' AND name IS NOT NULL ORDER BY name`
  );
  return rows.map((r) => r.name);
}

export async function insertImage(
  eventId: number,
  filePath: string,
  aiDescription: string | null
): Promise<void> {
  await db.runAsync(
    `INSERT INTO images (event_id, file_path, ai_description, created_at) VALUES (?, ?, ?, ?)`,
    [eventId, filePath, aiDescription ?? null, Date.now()]
  );
}
