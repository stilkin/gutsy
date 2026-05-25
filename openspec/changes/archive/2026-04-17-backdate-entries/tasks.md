## 1. DatePickerField component

- [x] 1.1 Create `src/components/DatePickerField.tsx` — mirrors `TimePickerField` structure: accepts `date` (Date) and `onChangeDate` callback, shows formatted date (e.g. "17 April 2026"), taps open platform date picker with `mode="date"` and `maximumDate={new Date()}`

## 2. Initialise timestamp from selectedDate

- [x] 2.1 Update all four entry forms (food, ache, toilet, medication) to initialise `timestamp` by combining `selectedDate` (date portion) with the current time, instead of plain `new Date()`

## 3. Wire DatePickerField into entry forms

- [x] 3.1 Add `DatePickerField` above `TimePickerField` in food entry form
- [x] 3.2 Add `DatePickerField` above `TimePickerField` in ache entry form
- [x] 3.3 Add `DatePickerField` above `TimePickerField` in toilet entry form
- [x] 3.4 Add `DatePickerField` above `TimePickerField` in medication entry form
- [x] 3.5 Ensure date change updates only the date portion of `timestamp`, preserving the time

## 4. Verify

- [x] 4.1 Manual test: create entry from past day timeline — date defaults to that day
- [x] 4.2 Manual test: change date on entry form, confirm time is preserved
- [x] 4.3 Manual test: edit an existing entry, confirm stored date is shown and changeable
- [x] 4.4 Manual test: confirm future dates are not selectable
- [x] 4.5 Manual test: save backdated entry, confirm timeline stays on current date
