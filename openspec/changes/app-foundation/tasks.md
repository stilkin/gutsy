## 1. Project Initialisation

- [x] 1.1 Scaffold new Expo project with TypeScript template: `npx create-expo-app@latest food-diary --template blank-typescript`
- [x] 1.2 Install Expo Router and configure entry point in `package.json` and `app.json`
- [x] 1.3 Install dependencies: `expo-sqlite`, `expo-file-system`, `expo-secure-store`, `@react-native-async-storage/async-storage`, `dayjs`, `zustand`
- [x] 1.4 Configure `tsconfig.json` with strict mode and path aliases (`@/` → `src/`)
- [x] 1.5 Clean out template boilerplate (default screens, assets, styles)

## 2. Database Layer

- [x] 2.1 Create `src/db/database.ts` — open the SQLite database and export the `db` instance
- [x] 2.2 Write `src/db/migrations.ts` — `CREATE TABLE IF NOT EXISTS` for `events` and `images` tables per spec; store `schema_version` in AsyncStorage on first run
- [x] 2.3 Call migrations from app startup (before any screen renders) using a loading gate

## 3. Zustand Store

- [x] 3.1 Create `src/store/index.ts` — minimal Zustand store skeleton with typed slices for `ui` (e.g. FAB sheet open/close state); leave data slices as stubs for the next change

## 4. Navigation Shell

- [x] 4.1 Create Expo Router root layout `app/_layout.tsx` — wrap with database initialisation gate and any global providers
- [x] 4.2 Create tab layout `app/(tabs)/_layout.tsx` — two tabs: Timeline (`index`) and Settings, with icons
- [x] 4.3 Create placeholder `app/(tabs)/index.tsx` (Timeline) — renders title "Timeline" and the FAB
- [x] 4.4 Create placeholder `app/(tabs)/settings.tsx` (Settings) — renders title "Settings"
- [x] 4.5 Implement FAB component `src/components/FAB.tsx` — positioned bottom-right, opens a bottom sheet on press
- [x] 4.6 Implement bottom sheet `src/components/ActionSheet.tsx` — shows three placeholder options: "Food", "Ache", "Toilet break"; tapping any closes the sheet (no navigation yet)

## 5. Smoke Test

- [ ] 5.1 Run on iOS simulator — confirm app launches, tabs switch, FAB opens/closes action sheet, no console errors
- [ ] 5.2 Run on Android emulator — confirm same behaviour
