## 1. Dependencies & Permissions

- [x] 1.1 Install `expo-image-picker` and `expo-image-manipulator` (if not already present from foundation)
- [x] 1.2 Add camera and photo library permission strings to `app.json` (`NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, Android equivalents)

## 2. Photo Capture UI

- [x] 2.1 Add a photo button to `app/entry/food.tsx`; on press show an action sheet: "Take photo" / "Choose from library"
- [x] 2.2 Implement camera flow: call `expo-image-picker` with `mediaTypes: ['images']` and `source: Camera`; request permission if needed
- [x] 2.3 Implement library flow: call `expo-image-picker` with `source: MediaLibrary`; request permission if needed
- [x] 2.4 Show image preview thumbnail in the form after selection; add a remove button that clears the selection

## 3. Image Resizing & Storage

- [x] 3.1 Create `src/images/processImage.ts` — `resizeForStorage(uri): Promise<string>` resizes to max 1280px using `expo-image-manipulator`, writes to app document directory, returns new file path
- [x] 3.2 Create `src/images/processImage.ts` (same file) — `resizeForApi(uri): Promise<string>` resizes to max 512px, returns temp file path (not persisted)
- [x] 3.3 On food form save: call `resizeForStorage`, write to filesystem, insert `images` row with `event_id` and `file_path`

## 4. OpenRouter Integration

- [x] 4.1 Create `src/ai/describeImage.ts` — `describeImage(imagePath: string, apiKey: string): Promise<string>` resizes to 512px, base64-encodes, POSTs to OpenRouter vision endpoint, returns description text
- [x] 4.2 Hardcode model as `google/gemini-2.5-pro` in a named constant at the top of the file
- [x] 4.3 Handle errors: network failure, non-200 response, malformed response — all return a rejected promise; caller handles gracefully

## 5. AI Pre-fill in Food Form

- [x] 5.1 After photo selection in food form: if API key is set, call `describeImage` with a loading spinner on the notes field; on success populate the field; on error show a brief inline message and leave notes empty
- [x] 5.2 If no API key is set: skip AI call entirely, leave notes empty
- [x] 5.3 Ensure notes field remains fully editable regardless of AI pre-fill state

## 6. Settings — API Key

- [x] 6.1 Add OpenRouter API key field to `app/(tabs)/settings.tsx` — masked text input (secureTextEntry)
- [x] 6.2 On save: write key to expo-secure-store; on clear: delete from secure store
- [x] 6.3 Load existing key on settings screen mount; show masked if present

## 7. Smoke Test

- [ ] 7.1 Test with no API key: take photo → photo stored → notes field empty → entry saves normally
- [ ] 7.2 Test with valid API key: take photo → spinner → notes pre-filled → user edits → saves
- [ ] 7.3 Test with invalid API key: take photo → spinner → error message → notes empty → user can still save
- [ ] 7.4 Test library picker flow on both iOS and Android
