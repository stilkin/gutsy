# Gutsy

A mobile app for logging meals, symptoms, and intermittent fasting windows — built to help identify food-triggered digestive issues and share a readable diary with a dietician or physician.

## Why this exists

Diagnosing food intolerances and digestive problems is hard without data. This app makes it easy to log what you eat, when you feel unwell, and how your fasting window is going — then export a clean summary to bring to a medical appointment.

## What it does

- **Log food entries** — free text, optional photo, optional AI-assisted description
- **Log ache events** — timestamp, optional notes, optional severity (1–5)
- **Log toilet breaks** — timestamp, optional notes, optional Bristol stool type (1–7, configurable)
- **Log medication** — name (with autocomplete from history), optional notes
- **Track your fasting window** — first meal of the day starts the window; a notification fires before it closes
- **Day timeline** — browse your log day by day
- **Export to PDF** — select a date range and share with your doctor or dietician

## Design principles

Simple, maintainable, elegant. Less code means less to break and less to maintain.

## Tech stack

Expo (React Native) · Expo Router · SQLite · Zustand · dayjs · OpenRouter API (optional, for AI photo description)

## Getting started

**Prerequisites:** Node.js, and either the [Expo Go](https://expo.dev/go) app on your phone or a simulator/emulator.

```sh
npm install
npm start        # opens Expo dev server — scan QR code with Expo Go
npm run ios      # iOS simulator
npm run android  # Android emulator
```

## What's built

All planned phases are complete:

| Phase | Change | Description |
|---|---|---|
| 1 | `app-foundation` | Expo project, navigation shell, SQLite schema, Zustand store |
| 2 | `core-logging` | Timeline, entry forms, fasting window, notifications, settings |
| 3 | `ai-photo-assist` | Camera, image resizing, OpenRouter vision API integration |
| 4 | `export` | Date range picker, PDF generation, system share sheet |
| 5 | `medication` | Medication logging with name autocomplete and PDF export support |

Each phase is a self-contained OpenSpec change in `openspec/changes/`. See `CLAUDE.md` for how to work with the codebase.

## License

[PolyForm Noncommercial 1.0.0](LICENSE) — free to use for personal and non-commercial purposes.

## Post-MVP ideas

- In-app correlation analysis (which foods precede ache events?)
- Dynamic AI model selection via OpenRouter
- CSV export option

## Support

If you enjoy Gutsy and want to support its development, consider buying me a drink:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/stilkin)

Your support helps me continue developing and improving Gutsy! ☕
