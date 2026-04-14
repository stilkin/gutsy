import dayjs from 'dayjs';
import type { DiaryEventWithImage } from '@/types';

const TYPE_EMOJI: Record<string, string> = {
  food: '🍽️',
  ache: '⚡',
  toilet: '🚽',
  medication: '💊',
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function buildHtml(
  events: DiaryEventWithImage[],
  images: Record<number, string>,
  startDate: Date,
  endDate: Date,
  windowHours?: number
): string {
  const headerRange =
    `${dayjs(startDate).format('D MMM YYYY')} – ${dayjs(endDate).format('D MMM YYYY')}`;
  const exportedAt = dayjs().format('D MMM YYYY, HH:mm');

  // Group events by calendar day
  const byDay = new Map<string, DiaryEventWithImage[]>();
  for (const event of events) {
    const key = dayjs(event.timestamp).format('YYYY-MM-DD');
    const group = byDay.get(key);
    if (group) {
      group.push(event);
    } else {
      byDay.set(key, [event]);
    }
  }

  let body = '';
  if (byDay.size === 0) {
    body = '<p class="empty">No entries for this period.</p>';
  } else {
    for (const [dateKey, dayEvents] of byDay) {
      body += `<h2>${dayjs(dateKey).format('dddd, D MMMM YYYY')}</h2>`;
      if (windowHours != null) {
        const breaking = dayEvents.filter((e) => e.type === 'food' && e.breaks_fast !== 0);
        if (breaking.length > 0) {
          const windowStart = Math.min(...breaking.map((e) => e.timestamp));
          const windowEnd = windowStart + windowHours * 3_600_000;
          body += `<div class="fasting-window">Window: ${dayjs(windowStart).format('HH:mm')} – ${dayjs(windowEnd).format('HH:mm')}</div>`;
        }
      }
      for (const e of dayEvents) {
        const time = dayjs(e.timestamp).format('HH:mm');
        const type = e.type.charAt(0).toUpperCase() + e.type.slice(1);
        const icon = TYPE_EMOJI[e.type];
        let detail = '';
        if (e.type === 'medication' && e.name) {
          detail = ` — ${esc(e.name)}`;
        } else if (e.type === 'ache' && e.severity != null) {
          detail = ` — Severity: ${e.severity}/5`;
        } else if (e.type === 'toilet' && e.bristol_type != null) {
          detail = ` — Bristol: ${e.bristol_type}`;
        }
        if (e.type === 'food' && e.breaks_fast === 0) detail += ` (fasting-safe)`;
        body += `<div class="event">`;
        body += `<div class="time-col">${icon} ${time}</div>`;
        body += `<div class="content-col">`;
        body += `<div class="header">— <b>${type}</b>${detail}</div>`;
        if (images[e.id] && e.notes) {
          body += `<div class="media-row">`;
          body += `<img src="${images[e.id]}" />`;
          body += `<div class="notes">${esc(e.notes)}</div>`;
          body += `</div>`;
        } else {
          if (e.notes) body += `<div class="notes">${esc(e.notes)}</div>`;
          if (images[e.id]) body += `<img src="${images[e.id]}" />`;
        }
        body += `</div></div>`;
      }
    }
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: sans-serif; font-size: 14px; color: #222; margin: 0; padding: 16px; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    .meta { font-size: 12px; color: #888; margin-bottom: 24px; }
    h2 { font-size: 15px; font-weight: bold; margin: 14px 0 8px; border-bottom: 1px solid #2D7D4F; padding-bottom: 4px; color: #2D7D4F; }
    .fasting-window { font-size: 12px; color: #2D7D4F; margin-bottom: 8px; }
    .event { margin-bottom: 8px; padding-left: 10px; border-left: 3px solid #A8D5B8; display: grid; grid-template-columns: auto 1fr; gap: 0 8px; }
    .time-col { font-size: 13px; color: #888; white-space: nowrap; }
    .content-col { min-width: 0; }
    .header { font-size: 13px; }
    .notes { font-size: 13px; margin-top: 2px; max-width: 50%; }
    .media-row { display: flex; gap: 8px; align-items: flex-start; margin-top: 2px; }
    .media-row .notes { margin-top: 0; }
    img { width: 100px; height: 100px; object-fit: cover; margin-top: 4px; display: block; border-radius: 4px; }
    .empty { color: #aaa; text-align: center; padding: 40px 0; }
  </style>
</head>
<body>
  <h1>Gutsy</h1>
  <p class="meta">${headerRange} &middot; Exported ${exportedAt}</p>
  ${body}
</body>
</html>`;
}
