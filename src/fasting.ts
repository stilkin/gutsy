import type { DiaryEvent } from '@/types';

/**
 * Derives the eating window for a set of events: it starts at the earliest
 * food event that breaks the fast and lasts `windowHours` hours. Returns
 * null when no food event breaks the fast.
 */
export function getFastingWindow(
  events: Pick<DiaryEvent, 'type' | 'timestamp' | 'breaks_fast'>[],
  windowHours: number,
): { start: number; end: number } | null {
  const fastBreaking = events.filter((e) => e.type === 'food' && e.breaks_fast !== 0);
  if (fastBreaking.length === 0) return null;
  const start = Math.min(...fastBreaking.map((e) => e.timestamp));
  return { start, end: start + windowHours * 3_600_000 };
}
