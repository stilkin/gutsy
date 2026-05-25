import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { insertEvent, updateEvent, getEventById } from '@/db/queries';
import { useAppStore } from '@/store';
import { colors } from '@/colors';
import { entryFormStyles } from '@/components/entryFormStyles';
import { EntryFormHeader } from '@/components/EntryFormHeader';
import { DatePickerField } from '@/components/DatePickerField';
import { TimePickerField } from '@/components/TimePickerField';

export default function AcheEntryScreen() {
  const selectedDate = useAppStore((s) => s.selectedDate);
  const now = new Date();
  const [y, m, d] = selectedDate.split('-').map(Number);
  const [timestamp, setTimestamp] = useState(new Date(y, m - 1, d, now.getHours(), now.getMinutes()));
  const [notes, setNotes] = useState('');
  const [severity, setSeverity] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const { id } = useLocalSearchParams<{ id?: string }>();
  const editId = id ? Number(id) : null;

  const loadEventsForDate = useAppStore((s) => s.loadEventsForDate);

  useEffect(() => {
    if (!editId) return;
    setLoading(true);
    getEventById(editId).then((event) => {
      if (!event) return;
      setTimestamp(new Date(event.timestamp));
      setNotes(event.notes ?? '');
      setSeverity(event.severity);
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    if (editId) {
      await updateEvent(editId, {
        timestamp: timestamp.getTime(),
        notes: notes.trim() || null,
        severity,
        bristol_type: null,
        name: null,
        breaks_fast: 1,
      });
      await loadEventsForDate(selectedDate);
      router.back();
    } else {
      await insertEvent({
        type: 'ache',
        timestamp: timestamp.getTime(),
        notes: notes.trim() || null,
        severity,
        bristol_type: null,
      });
      await loadEventsForDate(selectedDate);
      router.back();
    }
  }

  return (
    <SafeAreaView style={entryFormStyles.container}>
      <EntryFormHeader title="Ache" onSave={handleSave} saveDisabled={loading} />
      <DatePickerField timestamp={timestamp} onChangeDate={setTimestamp} />
      <TimePickerField timestamp={timestamp} onChangeTimestamp={setTimestamp} />

      <View style={entryFormStyles.field}>
        <Text style={entryFormStyles.label}>Notes</Text>
        <TextInput
          style={entryFormStyles.textInput}
          multiline
          placeholder="Optional notes…"
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      <View style={entryFormStyles.field}>
        <Text style={entryFormStyles.label}>Severity (optional)</Text>
        <View style={styles.circleRow}>
          {[1, 2, 3, 4, 5].map((n) => {
            const color = severityColors[n - 1];
            const selected = severity === n;
            return (
              <TouchableOpacity
                key={n}
                style={[styles.circle, { borderColor: color }, selected && { backgroundColor: color }]}
                onPress={() => setSeverity(selected ? null : n)}
              >
                <Text style={{ fontSize: 16, color: selected ? colors.white : color }}>{n}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.labelRow}>
          <Text style={styles.endLabel}>mild</Text>
          <Text style={styles.endLabel}>severe</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const severityColors = ['#2D7D4F', '#5A9A72', '#A8D5B8', '#aaa', '#888'];

const styles = StyleSheet.create({
  circleRow: { flexDirection: 'row', gap: 10 },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, width: 44 * 5 + 10 * 4 },
  endLabel: { fontSize: 11, color: colors.secondaryText },
});
