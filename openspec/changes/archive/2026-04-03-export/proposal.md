## Why

The diary is only useful to a physician or dietician if it can be shared. This change adds a date-range export that produces a clean, readable PDF containing all logged events and their photos, shareable via the standard system share sheet.

## What Changes

- Add an Export option to the Settings screen
- Implement a date-range picker for selecting the export period
- Generate a PDF from the diary entries (events, notes, images scaled to 480p)
- Open the system share sheet so the user can send it via email, WhatsApp, Files, etc.

## Capabilities

### New Capabilities

- `export`: Date-range selection, PDF generation, and sharing of the food diary

### Modified Capabilities

_(none)_

## Impact

- Adds `expo-print` and `expo-sharing` usage (both already in the declared tech stack)
- Adds `expo-file-system` usage for reading image files during export
- A new Export screen or modal added under Settings
- No changes to the data model
