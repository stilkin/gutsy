import { getFastingWindow } from './fasting';
import type { DiaryEvent, EventType } from '@/types';

type WindowInput = Pick<DiaryEvent, 'type' | 'timestamp' | 'breaks_fast'>;

function event(type: EventType, timestamp: number, breaks_fast = 1): WindowInput {
  return { type, timestamp, breaks_fast };
}

const HOUR = 3_600_000;

describe('getFastingWindow', () => {
  it('starts the window at the earliest fast-breaking food event', () => {
    const events = [event('food', 8 * HOUR), event('food', 12 * HOUR + 30 * 60 * 1000)];
    expect(getFastingWindow(events, 8)).toEqual({ start: 8 * HOUR, end: 16 * HOUR });
  });

  it('excludes fasting-safe entries even when they are the earliest', () => {
    const events = [event('food', 9 * HOUR, 0), event('food', 11 * HOUR)];
    expect(getFastingWindow(events, 8)).toEqual({ start: 11 * HOUR, end: 19 * HOUR });
  });

  it('returns null when every food event is fasting-safe', () => {
    expect(
      getFastingWindow([event('food', 9 * HOUR, 0), event('food', 10 * HOUR, 0)], 8),
    ).toBeNull();
  });

  it('ignores non-food events', () => {
    const events = [
      event('ache', 7 * HOUR),
      event('toilet', 7 * HOUR + 30 * 60 * 1000),
      event('medication', 10 * HOUR),
    ];
    expect(getFastingWindow(events, 8)).toBeNull();
  });

  it('returns null for an empty day', () => {
    expect(getFastingWindow([], 8)).toBeNull();
  });

  it('computes the end as start plus windowHours in milliseconds', () => {
    const start = 1_700_000_000_000;
    expect(getFastingWindow([event('food', start)], 6)).toEqual({
      start,
      end: start + 6 * HOUR,
    });
  });
});
