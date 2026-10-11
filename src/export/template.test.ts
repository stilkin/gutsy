import { buildHtml } from './template';
import type { DiaryEventWithImage, EventType } from '@/types';

const OCT_11_0830 = Date.UTC(2026, 9, 11, 8, 30);
const OCT_11_1200 = Date.UTC(2026, 9, 11, 12, 0);
const OCT_12_0900 = Date.UTC(2026, 9, 12, 9, 0);

let nextId = 1;

function makeEvent(
  type: EventType,
  timestamp: number,
  extra: Partial<DiaryEventWithImage> = {},
): DiaryEventWithImage {
  return {
    id: nextId++,
    type,
    timestamp,
    notes: null,
    severity: null,
    bristol_type: null,
    name: null,
    breaks_fast: 1,
    created_at: timestamp,
    image_path: null,
    ...extra,
  };
}

function render(events: DiaryEventWithImage[], windowHours?: number): string {
  return buildHtml(events, {}, new Date(OCT_11_0830), new Date(OCT_12_0900), windowHours);
}

describe('buildHtml', () => {
  it('groups events under one heading per calendar day', () => {
    const html = render([makeEvent('food', OCT_11_0830), makeEvent('ache', OCT_12_0900)]);
    expect(html).toContain('<h2>Sunday, 11 October 2026</h2>');
    expect(html).toContain('<h2>Monday, 12 October 2026</h2>');
  });

  it('shows the empty-period message when there are no events', () => {
    expect(render([])).toContain('No entries for this period.');
  });

  it('escapes HTML in notes', () => {
    const html = render([makeEvent('food', OCT_11_0830, { notes: '<script>&x</script>' })]);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;&amp;x&lt;/script&gt;');
  });

  it('shows the fasting window derived from the earliest fast-breaking food event', () => {
    const html = render([makeEvent('food', OCT_11_0830), makeEvent('food', OCT_11_1200)], 8);
    expect(html).toContain('Window: 08:30 – 16:30');
  });

  it('omits the fasting window when the only food entry is fasting-safe', () => {
    const html = render([makeEvent('food', OCT_11_0830, { breaks_fast: 0 })], 8);
    expect(html).not.toContain('class="fasting-window"');
    expect(html).toContain('(fasting-safe)');
  });

  it('renders severity, Bristol type, and medication name details', () => {
    const html = render([
      makeEvent('ache', OCT_11_0830, { severity: 3 }),
      makeEvent('toilet', OCT_11_1200, { bristol_type: 4 }),
      makeEvent('medication', OCT_12_0900, { name: 'Ibuprofen' }),
    ]);
    expect(html).toContain('Severity: 3/5');
    expect(html).toContain('Bristol: 4');
    expect(html).toContain('— <b>Medication</b> — Ibuprofen');
  });

  it('pairs thumbnail and notes in a media row when both exist', () => {
    const event = makeEvent('food', OCT_11_0830, { notes: 'Soup', image_path: '/x.jpg' });
    const withImage = buildHtml(
      [event],
      { [event.id]: 'data:image/jpeg;base64,QUJD' },
      new Date(OCT_11_0830),
      new Date(OCT_12_0900),
    );
    expect(withImage).toContain('class="media-row"');
    expect(withImage).toContain('<img src="data:image/jpeg;base64,QUJD" />');

    const noImage = render([event]);
    expect(noImage).not.toContain('class="media-row"');
  });
});
