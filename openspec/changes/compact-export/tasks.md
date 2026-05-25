## 1. Single-Line Entry Headers

- [x] 1.1 Refactor entry HTML in `src/export/template.ts` — merge time and type into a single `<div class="header">` rendered as `HH:mm — Type`
- [x] 1.2 Append inline details to the header: medication name, ache severity (`Severity: N/5`), toilet Bristol type (`Bristol: N`), fasting-safe label (`(fasting-safe)`)
- [x] 1.3 Keep notes on a separate line below the header (only rendered when present)

## 2. Compact Image Styling

- [x] 2.1 Update `img` CSS in `src/export/template.ts` — set `width: 100px; height: 100px; object-fit: cover;` for square center-cropped thumbnails

## 3. Tighter Spacing

- [x] 3.1 Reduce `.event` margin-bottom from 14px to 8px
- [x] 3.2 Reduce `h2` top margin from 20px to 14px

## 4. Smoke Test

- [x] 4.1 Export a day with medication entries → each renders as single-line header (e.g. `10:34 — Medication — Carmenthin`)
- [x] 4.2 Export a day with ache entry → severity shown inline (e.g. `15:00 — Ache — Severity: 3/5`)
- [x] 4.3 Export a day with toilet entry → Bristol type shown inline (e.g. `12:15 — Toilet — Bristol: 5`)
- [x] 4.4 Export a day with a portrait food photo → image renders as 100×100px square, cropped from center
- [ ] 4.5 Export a day with a fasting-safe food entry → header shows `(fasting-safe)` inline
- [x] 4.6 Compare page count of a multi-day export before and after — confirm reduction
