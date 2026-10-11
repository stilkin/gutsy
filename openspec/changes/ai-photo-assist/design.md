## Context

The food entry form exists and saves text notes. This change layers photo capture and AI-assisted description on top of it without disrupting the existing flow. The feature is entirely opt-in: the photo button is always visible, but the AI step only fires if an API key is configured.

## Goals / Non-Goals

**Goals:**

- User can attach a photo to a food entry (taken or picked from library)
- Photo is resized before storage (save space) and before API submission (reduce cost/latency)
- If an API key is set, the AI returns a description that pre-fills the notes field
- Full graceful degradation: no key → no AI call, API error → notes field stays empty, user continues normally

**Non-Goals:**

- Ingredient extraction or calorie estimation — post-MVP
- Attaching photos to ache or toilet entries
- Multiple photos per entry (one is enough for MVP)
- Video

## Decisions

**expo-image-picker over expo-camera directly**
`expo-image-picker` provides both camera and library access through a single, simpler API. `expo-camera` gives more control (live preview, manual capture) but is heavier and not needed here. The picker is lower friction to implement and sufficient for this use case.

**Resize to 720p before storage, resize to 512px before API call**
720p on-device storage balances quality and disk space. 512px for the API call is sufficient for food identification by vision models and minimises token cost. Both resizes use `expo-image-manipulator` which is already in the stack.

**OpenRouter via plain fetch, not a client SDK**
We need a single POST endpoint with a base64 image payload. A fetch call is 10 lines; pulling in an HTTP client library would be unnecessary bloat.

**Hardcode one vision model for MVP**
Model: `google/gemini-2.5-pro` (capable vision, competitive cost). Expose the model identifier as a constant so it can be changed in one place. Model selection UI is post-MVP.

**API key in expo-secure-store**
The key is a credential. expo-secure-store uses the platform keychain (iOS Keychain, Android Keystore). No plaintext.

**AI call is fire-and-wait with a loading indicator**
The notes field shows a spinner while the API call is in flight. On success, the field is populated. On error (network, bad key, model error), the field is left empty and a brief toast explains what happened. No retry logic for MVP.

## Risks / Trade-offs

**Camera/library permission prompts** → Both require explicit permission on iOS and Android. Mitigation: request on first tap of the photo button with a clear explanation.

**API key visible in Settings** → Shown masked (password field). User can clear it. Stored in secure store, not in logs.

**Model deprecation** → If `google/gemini-2.5-pro` is deprecated on OpenRouter, the feature silently degrades (API error → empty notes). Mitigation: the model constant is easy to update; note it in code comments.

## Open Questions

_(none)_
