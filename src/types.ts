export type EventType = 'food' | 'ache' | 'toilet' | 'medication';

export interface DiaryEvent {
  id: number;
  type: EventType;
  timestamp: number;         // Unix ms (user-facing event time)
  notes: string | null;
  severity: number | null;       // 1–5, ache only
  bristol_type: number | null;   // 1–7, toilet only
  name: string | null;           // medication name, medication only
  breaks_fast: number;           // 1 = breaks fast (default), 0 = fasting-safe; food only
  created_at: number;
}

export interface DiaryEventWithImage extends DiaryEvent {
  image_path: string | null;
}

export interface Settings {
  windowHours: number;              // default 8
  toiletTrackingEnabled: boolean;   // default true
  bristolScaleEnabled: boolean;     // default false
}
