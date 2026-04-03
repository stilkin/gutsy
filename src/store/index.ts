import { create } from 'zustand';
import { getEventsByDate } from '@/db/queries';
import { loadSettings as loadFromDisk, saveSetting, DEFAULT_SETTINGS } from '@/settings';
import type { DiaryEvent, Settings } from '@/types';
import dayjs from 'dayjs';

// ── Slice interfaces ──────────────────────────────────────────────────────────

interface UIState {
  isActionSheetOpen: boolean;
  openActionSheet: () => void;
  closeActionSheet: () => void;
}

interface EventsSlice {
  events: DiaryEvent[];
  selectedDate: string; // 'YYYY-MM-DD'
  setSelectedDate: (date: string) => void;
  loadEventsForDate: (date: string) => Promise<void>;
  addEvent: (event: DiaryEvent) => void;
  removeEvent: (id: number) => void;
}

interface SettingsSlice {
  settings: Settings;
  loadSettings: () => Promise<void>;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
}

type AppStore = UIState & EventsSlice & SettingsSlice;

// ── Store ─────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>((set, get) => ({
  // UI
  isActionSheetOpen: false,
  openActionSheet: () => set({ isActionSheetOpen: true }),
  closeActionSheet: () => set({ isActionSheetOpen: false }),

  // Events
  events: [],
  selectedDate: dayjs().format('YYYY-MM-DD'),
  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().loadEventsForDate(date);
  },
  loadEventsForDate: async (date) => {
    const events = await getEventsByDate(date);
    set({ events });
  },
  addEvent: (event) =>
    set((s) => ({
      events: [...s.events, event].sort((a, b) => a.timestamp - b.timestamp),
    })),
  removeEvent: (id) =>
    set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

  // Settings
  settings: DEFAULT_SETTINGS,
  loadSettings: async () => {
    const settings = await loadFromDisk();
    set({ settings });
  },
  updateSetting: async (key, value) => {
    await saveSetting(key, value);
    set((s) => ({ settings: { ...s.settings, [key]: value } }));
  },
}));
