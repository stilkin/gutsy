import * as ImageManipulator from 'expo-image-manipulator';
import type { DiaryEventWithImage } from '@/types';

export async function prepareImages(
  events: DiaryEventWithImage[],
): Promise<Record<number, string>> {
  const result: Record<number, string> = {};
  for (const event of events) {
    if (!event.image_path) continue;
    try {
      const resized = await ImageManipulator.manipulateAsync(
        event.image_path,
        [{ resize: { width: 480 } }],
        { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG, base64: true },
      );
      if (resized.base64) {
        result[event.id] = `data:image/jpeg;base64,${resized.base64}`;
      }
    } catch {
      // Missing or unreadable file — skip silently, continue export
    }
  }
  return result;
}
