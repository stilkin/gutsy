import * as ImageManipulator from 'expo-image-manipulator';
import { File, Directory, Paths } from 'expo-file-system';

/** Resize to max 1280px, persist to app document directory. Returns permanent file URI. */
export async function resizeForStorage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1280 } }],
    { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
  );

  const dir = new Directory(Paths.document, 'food-images');
  dir.create({ intermediates: true, idempotent: true });

  const dest = new File(dir, `${Date.now()}.jpg`);
  new File(result.uri).copy(dest);
  return dest.uri;
}

/** Resize to max 512px into cache dir. Returns temp URI (not persisted). */
export async function resizeForApi(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 512 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}
