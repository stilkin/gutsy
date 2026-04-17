## Context

The app has a working AI photo description flow, settings page, entry forms, and PDF export. This change bundles seven small-to-medium improvements that touch these existing surfaces without introducing new screens or dependencies.

Current state:
- AI prompt is a single hardcoded string; model is hardcoded to `google/gemini-2.5-pro`
- Settings persist via AsyncStorage (non-sensitive) and SecureStore (API key)
- All entry forms share `entryFormStyles.textInput` with `minHeight: 80`
- PDF export uses inline HTML/CSS generated in `src/export/template.ts`

## Goals / Non-Goals

**Goals:**
- Improve AI description quality by focusing the prompt on food/drink only
- Let users control AI output language and model cost tier via settings
- Provide a retry mechanism for failed or stale AI descriptions
- Make notes fields more comfortable to type in
- Improve PDF readability by constraining note width and laying out photo+notes side-by-side

**Non-Goals:**
- Full app UI i18n (deferred)
- Two-column day layout in PDF (deferred)
- Changing the AI flow architecture (still fire-and-forget with error fallback)

## Decisions

### 1. Language as prompt suffix, not prompt translation
Append `"Respond in {language}."` to the existing English prompt rather than translating the entire prompt per language. LLMs handle cross-language instruction following well, and this avoids maintaining 10 translated prompt copies.

**Alternative considered:** Translate entire prompt per language. Rejected — maintenance burden for no quality gain with modern models.

### 2. Model tier as a simple map, not a config file
Store a `modelTier` enum in settings and map to model IDs in `describeImage.ts`. Three tiers: `free`, `normal`, `premium`. The mapping lives in code, not in a config file, since it changes rarely and should be tested when updated.

**Model mapping:**
- `free` → `qwen/qwen3.6-plus:free`
- `normal` → `google/gemini-3-flash-preview`
- `premium` → `anthropic/claude-sonnet-4.6`

**Default:** `normal`

### 3. Retry button placement
Place a small icon button (refresh/retry icon) beside the photo thumbnail area on the food entry screen. Visible when: a photo is attached AND an API key is configured. Tapping it re-runs `describeImage()` with the current photo, overwriting the notes field.

**Alternative considered:** Inline retry in an error banner. Rejected — the button should also work for re-describing after a photo swap or when coming back online, not just on error.

### 4. Notes field height increase
Bump `minHeight` from 80 to 140 in `entryFormStyles.ts`. This gives ~5-6 visible lines. All four entry forms (food, ache, toilet, medication) benefit from the shared style.

### 5. Export layout: constrained notes + side-by-side photo
- Add `max-width: 50%` to `.notes` in the PDF CSS
- When an event has both a photo and notes, use a flex row to place the image (100x100) on the left and notes to the right. When there's no photo, notes render normally (still capped at 50%)

**Alternative considered:** CSS grid for photo+notes. Rejected — flexbox is simpler and `expo-print` WebView handles it reliably.

### 6. Settings UI components
- **Language:** a picker/dropdown with 10 language options (EN default)
- **Model tier:** a segmented control with 3 options (Free / Normal / Premium), with the model name shown as hint text below

Both use the existing `updateSetting()` pattern for persistence.

## Risks / Trade-offs

- **Model availability** — OpenRouter models can be deprecated. Mitigation: comment in code, fallback to `normal` if model returns 404 (existing error handling covers this).
- **Prompt language compliance** — Some free-tier models may not reliably follow "Respond in X" instructions. Mitigation: acceptable degradation; users on free tier accept lower quality.
- **50% notes width** — Long notes will wrap more in PDF. Mitigation: this is the desired behavior per user feedback; keeps entries compact.
