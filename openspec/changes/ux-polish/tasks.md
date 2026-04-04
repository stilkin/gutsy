## 1. Settings — types and persistence

- [ ] 1.1 Add `language` and `modelTier` fields to the `Settings` interface in `src/types.ts`
- [ ] 1.2 Add defaults (`language: 'en'`, `modelTier: 'normal'`) and persistence keys in `src/settings/index.ts`

## 2. Settings — UI

- [ ] 2.1 Add language picker to the settings screen (EN, ES, PT, FR, DE, IT, NL, PL, TR, ID)
- [ ] 2.2 Add model tier segmented control (Free / Normal / Premium) to the settings screen

## 3. AI prompt and model selection

- [ ] 3.1 Rewrite the AI prompt in `src/ai/describeImage.ts` to focus strictly on food/drink items
- [ ] 3.2 Replace hardcoded model with a tier-to-model map; accept `modelTier` parameter
- [ ] 3.3 Append language instruction to prompt when language is not English; accept `language` parameter
- [ ] 3.4 Update the call site in `app/entry/food.tsx` to pass language and modelTier from settings

## 4. AI retry button

- [ ] 4.1 Add a retry button to the food entry screen, visible when photo is attached and API key is configured
- [ ] 4.2 Wire the retry button to re-run `describeImage()` with loading state

## 5. Notes field height

- [ ] 5.1 Increase `minHeight` from 80 to 140 in `src/components/entryFormStyles.ts`

## 6. Export layout

- [ ] 6.1 Add `max-width: 50%` to `.notes` in the PDF template CSS
- [ ] 6.2 Lay out photo and notes side-by-side (flexbox row) when both are present
