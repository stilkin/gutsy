## Why

Users have reported several small friction points: the AI photo description includes irrelevant details (plate color, packaging), the notes field is too small, there is no way to retry a failed AI description, and the PDF export notes run too wide. Additionally, users in different locales want the AI description in their language, and power users want control over which LLM model is used (cost vs. quality trade-off).

## What Changes

- **Tighter AI prompt**: rewrite the image description prompt to focus strictly on food/drink items, excluding plates, packaging, and background
- **LLM output language setting**: add a language picker to settings (EN, ES, PT, FR, DE, IT, NL, PL, TR, ID) that injects an output-language instruction into the AI prompt
- **LLM model tier setting**: add a 3-tier selector (free / normal / premium) to settings, mapping to specific OpenRouter models
- **Larger notes input**: increase the `minHeight` of the shared notes TextInput so it shows ~5-6 lines instead of 2-3
- **AI retry button**: add a retry/re-describe button on the food entry screen, visible when a photo is attached and an API key is configured
- **Narrower export notes**: cap `.notes` width in the PDF template to ~50% of the page
- **Photo beside notes in export**: when an event has both a photo and notes, lay them out side-by-side instead of stacked

## Capabilities

### New Capabilities
- `llm-language`: Language preference setting and prompt injection for AI output language
- `llm-model-tier`: Model tier setting (free/normal/premium) mapped to OpenRouter model IDs
- `ai-retry`: Retry button for AI food description on the food entry screen

### Modified Capabilities
- `ai-description`: Tighter prompt focusing only on food/drink; accepts language and model tier parameters
- `settings`: Two new settings (language, model tier) added to settings screen and persistence
- `export`: Narrower notes layout and side-by-side photo+notes in PDF template
- `event-logging`: Larger notes TextInput height in entry forms

## Impact

- `src/ai/describeImage.ts` — prompt rewrite, model selection, language injection
- `src/types.ts` — new settings fields (language, modelTier)
- `src/settings/index.ts` — new defaults and persistence keys
- `src/store/index.ts` — new settings in Zustand store
- `app/(tabs)/settings.tsx` — language picker and model tier selector UI
- `app/entry/food.tsx` — retry button UI and handler
- `src/components/entryFormStyles.ts` — increased minHeight
- `src/export/template.ts` — CSS changes for notes width and photo+notes layout
