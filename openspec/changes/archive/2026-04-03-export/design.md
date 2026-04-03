## Context

All diary data is in SQLite; images are on the local filesystem. The export feature reads a date range of events, builds an HTML document, converts it to PDF via `expo-print`, and hands it to the system share sheet. No new dependencies are needed.

## Goals / Non-Goals

**Goals:**
- User selects a start and end date, taps Export, receives a shareable PDF
- PDF is readable by a non-technical recipient (dietician, GP) without any special software
- Images are included, scaled down to keep the file size manageable
- Events are grouped by day, shown in chronological order

**Non-Goals:**
- CSV export (may be added post-MVP if users request it)
- Scheduled or automatic export
- Export directly to a specific app (just the system share sheet)
- Cloud storage integration

## Decisions

**PDF via HTML template + expo-print**
`expo-print` converts an HTML string to a PDF natively on-device (iOS: UIGraphicsPDFRenderer, Android: PdfDocument). No external service, no dependency beyond what's already in the stack. The HTML is a simple template — a table or list of events per day, with inline base64 images. Easy to iterate on the visual design.

**Images scaled to 480p for export**
At 480p, images are legible in a PDF without bloating the file size. Resize with `expo-image-manipulator` before base64 encoding — same pattern as the AI resizing in `ai-photo-assist`.

**Images embedded as base64 in the HTML**
`expo-print` renders HTML in a sandboxed context where local `file://` URIs may not be accessible. Base64 inline images are reliably rendered on both platforms.

**Date range picker using two date inputs**
Start date and end date, both selectable with the platform date picker. Default: last 7 days. Simple and clear for a medical context where the user typically exports "the last week" or "the last month."

**Export entry point in Settings**
Export is not a frequent action — it lives in Settings rather than as a tab or FAB option. A single "Export diary" row that navigates to a minimal export screen.

## Risks / Trade-offs

**Large date ranges → large PDFs** → Mitigation: no hard limit for MVP, but images are scaled down and the HTML template is lean. A month of entries with photos should produce a file well under 10MB.

**expo-print on Android** → Android's PDF renderer has historically been less reliable than iOS. Mitigation: test on Android emulator early; the HTML template should avoid complex CSS.

## Open Questions

_(none)_
