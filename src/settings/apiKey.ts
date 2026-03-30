import * as SecureStore from 'expo-secure-store';

const KEY = 'openrouter_api_key';

export async function loadApiKey(): Promise<string | null> {
  return SecureStore.getItemAsync(KEY);
}

export async function saveApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(KEY, key);
}

export async function clearApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}
