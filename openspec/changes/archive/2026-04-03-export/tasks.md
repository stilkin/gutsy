## 1. Data Query

- [x] 1.1 Add `getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]>` to `src/db/queries.ts` — returns all events (with image paths joined) within the range, sorted by timestamp ascending

## 2. HTML Template

- [x] 2.1 Create `src/export/template.ts` — `buildHtml(events: Event[], images: Record<number, string>): string` produces a self-contained HTML string with events grouped by day; include minimal inline CSS for readability (clean table or list layout, no external fonts or stylesheets)
- [x] 2.2 Include a document header in the HTML: app name, export date range, generation timestamp
- [x] 2.3 Render ache severity (1–5) and toilet Bristol type (1–7) when present
- [x] 2.4 Render inline base64 images (resized to 480p) for food entries that have photos

## 3. Image Preparation

- [x] 3.1 Create `src/export/prepareImages.ts` — for each event with an image, read the stored file, resize to max 480px using `expo-image-manipulator`, return as base64 string; handle missing files gracefully (skip image, continue export)

## 4. Export Screen

- [x] 4.1 Create `app/export.tsx` — modal or stack screen; show start date picker, end date picker (defaults: today − 7 days to today), and an Export button
- [x] 4.2 Add "Export diary" row to `app/(tabs)/settings.tsx` that navigates to the export screen
- [x] 4.3 On Export tap: show loading indicator, call `getEventsByDateRange`, call `prepareImages`, call `buildHtml`, pass to `expo-print` to generate PDF, then open share sheet via `expo-sharing`
- [x] 4.4 Handle errors (query failure, print failure) with a user-facing message; do not crash

## 5. Smoke Test

- [x] 5.1 Export a single day with food, ache, and toilet entries — verify all appear correctly grouped and formatted in the PDF
- [x] 5.2 Export a range with photo entries — verify images appear in the PDF at reasonable size
- [x] 5.3 Export an empty date range — verify PDF contains the "no entries" message
- [x] 5.4 Test share sheet on iOS and Android — verify PDF is openable in a PDF viewer
