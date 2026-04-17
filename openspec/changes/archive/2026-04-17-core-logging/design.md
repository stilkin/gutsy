## Context

The navigation shell from `app-foundation` is in place. This change fills it with the app's entire core functionality. It touches every layer: SQLite queries, Zustand store, settings persistence, notification scheduling, and all UI screens and forms.

## Goals / Non-Goals

**Goals:**
- All three entry types working end-to-end (form → SQLite → timeline)
- Timeline shows the selected day's events in chronological order with the fasting window visualised
- Fasting window notification scheduled automatically when the first food entry is logged
- Settings screen persists all user preferences
- Date navigation (prev/next + picker) on the timeline

**Non-Goals:**
- Photo capture — deferred to `ai-photo-assist`
- Export — deferred to `export`
- In-app correlation or analysis — post-MVP
- Any form of cloud sync or sharing

## Decisions

**Entry forms as modal screens, not inline bottom sheet content**
The bottom sheet (ActionSheet) lists the three entry types. Tapping one navigates to a dedicated modal screen (`app/entry/food.tsx`, etc.). Inline forms inside a bottom sheet are cramped and harder to extend. Modal screens give each form full screen real estate and a natural back button.

**Fasting window tied to calendar day, midnight reset**
The first `type='food'` event inserted on a given calendar day marks the window start. The window end is `start + settings.windowHours`. A local notification is scheduled at `windowEnd - settings.notificationMinutes`. If the user logs no food for the day, no window and no notification. Simple, matches expectation.

**Single scheduled notification — cancel and reschedule on change**
Only one fasting window notification can be active at a time per day. On each new food entry insertion, cancel any existing notification for today and reschedule. This handles the edge case where the user edits the first entry's timestamp or logs a corrective entry.

**Settings in AsyncStorage (non-sensitive) + expo-secure-store (API key)**
Settings are small, infrequently read key-value pairs. AsyncStorage is sufficient. The OpenRouter API key (added in `ai-photo-assist`) goes in expo-secure-store. No SQLite table for settings — that would be overengineering a handful of scalar values.

**Zustand store holds today's events in memory; other days fetched on demand**
The timeline for the current day is kept in the Zustand store and updated optimistically on every insert. Navigating to a past day triggers a SQLite query and renders directly — no need to cache past days in the store. Keeps memory usage and complexity low.

**No soft-delete**
Events are hard-deleted. This is a personal health diary, not a multi-user system. If a user deletes an entry, it's gone. Soft-delete adds complexity with no benefit here.

## Risks / Trade-offs

**Notification permissions on iOS** → expo-notifications requires explicit permission. Mitigation: request permission at first food entry, show a brief explanation. If denied, fasting window still works visually; just no notification.

**Notification cancelled if app is uninstalled** → expected behaviour on both platforms, no mitigation needed.

**dayjs locale** → default locale is English. Mitigation: use dayjs locale plugins if the user's device locale matters; defer to post-MVP.

## Open Questions

_(none)_
