## Context

The PDF export is generated from an HTML template (`src/export/template.ts`) rendered by `expo-print`. Currently each entry renders time, type, and details on separate lines, and images display at up to 200×200px preserving original aspect ratio. Portrait photos dominate the page and simple entries (medication, toilet) waste vertical space.

## Goals / Non-Goals

**Goals:**

- Reduce vertical space per entry so a typical day fits on fewer pages
- Keep the export readable and useful for a dietician reviewing the diary

**Non-Goals:**

- Changing the export flow, date picker, or share mechanism
- Re-encoding or resizing actual image files — CSS-only cropping is sufficient since `expo-print` renders HTML
- Changing the app title or header layout

## Decisions

### 1. Single-line entry headers

Merge time and type into one line: `HH:mm — Type`. Inline details (medication name, severity, Bristol type, fasting-safe label) join the same line as secondary text.

**Why over keeping separate lines:** Every entry saves 1–2 lines. For a day with 8+ entries, this alone saves significant vertical space. The `time — Type — detail` pattern is standard in medical logs.

### 2. CSS-only square image cropping

Use `width: 100px; height: 100px; object-fit: cover;` on `<img>` tags. This visually crops to a square from center without re-encoding the base64 data.

**Why 100px:** The images serve as visual references, not detailed inspection targets. 100px is large enough to recognize the meal but small enough to not dominate the page. Down from the current 200px max.

**Why CSS over re-encoding:** `expo-print` renders standard HTML/CSS. `object-fit: cover` is well-supported and requires zero additional code. Re-encoding with `expo-image-manipulator` at export time would add complexity and export latency for no visual benefit in a PDF.

### 3. Tighter vertical spacing

Reduce event `margin-bottom` from 14px to 8px and day heading top margin from 20px to 14px.

## Risks / Trade-offs

- **`object-fit: cover` in expo-print**: WebView-based PDF renderers generally support this CSS property. If a specific Android WebView version doesn't, images would stretch instead of crop — visually wrong but not broken. Low risk.
- **Very long notes text**: Notes still render on their own line below the header. Long AI-generated descriptions may still take space, but that's content-driven, not layout-driven.
