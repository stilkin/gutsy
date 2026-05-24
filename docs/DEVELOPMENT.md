# Development

Build Gutsy from source or contribute to the project.

## Prerequisites

- Node.js
- [Expo Go](https://expo.dev/go) on your phone, or a simulator/emulator

## Getting started

```sh
npm install
npm start        # opens Expo dev server — scan QR code with Expo Go
npm run ios      # iOS simulator
npm run android  # Android emulator
```

## Tech stack

Expo (React Native) · Expo Router · SQLite · Zustand · dayjs · OpenRouter API (optional, for AI photo description)

## Design principles

Simple, maintainable, elegant. Less code means less to break and less to maintain.

## Architecture

All planned phases are complete:

| Phase | Change | Description |
|---|---|---|
| 1 | `app-foundation` | Expo project, navigation shell, SQLite schema, Zustand store |
| 2 | `core-logging` | Timeline, entry forms, fasting window, settings |
| 3 | `ai-photo-assist` | Camera, image resizing, OpenRouter vision API integration |
| 4 | `export` | Date range picker, PDF generation, system share sheet |
| 5 | `medication` | Medication logging with name autocomplete and PDF export support |

Each phase is a self-contained OpenSpec change in `openspec/changes/`. See `CLAUDE.md` for how to work with the codebase.

## Post-MVP ideas

- In-app correlation analysis (which foods precede ache events?)
- Dynamic AI model selection via OpenRouter
- CSV export option
