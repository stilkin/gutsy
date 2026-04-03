import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Settings } from '@/types';

export const DEFAULT_SETTINGS: Settings = {
  windowHours: 8,
  toiletTrackingEnabled: true,
  bristolScaleEnabled: false,
};

const KEY = (k: string) => `settings.${k}`;

export async function loadSettings(): Promise<Settings> {
  const keys = Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[];
  const pairs = await AsyncStorage.multiGet(keys.map(KEY));
  const result = { ...DEFAULT_SETTINGS };
  for (const [rawKey, value] of pairs) {
    if (value === null) continue;
    const key = rawKey.replace('settings.', '') as keyof Settings;
    (result as Record<keyof Settings, unknown>)[key] =
      typeof DEFAULT_SETTINGS[key] === 'boolean' ? value === 'true' : Number(value);
  }
  return result;
}

export async function saveSetting<K extends keyof Settings>(
  key: K,
  value: Settings[K]
): Promise<void> {
  await AsyncStorage.setItem(KEY(key), String(value));
}
