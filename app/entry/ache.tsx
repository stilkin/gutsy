import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { insertEvent, updateEvent, getEventById } from '@/db/queries';
import { useAppStore } from '@/store';
import { colors } from '@/colors';
import { entryFormStyles } from '@/components/entryFormStyles';
import { EntryFormHeader } from '@/components/EntryFormHeader';
import { TimePickerField } from '@/components/TimePickerField';

export default function AcheEntryScreen() {
  const [timestamp, setTimestamp] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [severity, setSeverity] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const { id } = useLocalSearchParams<{ id?: string }>();
  const editId = id ? Number(id) : null;

  const addEvent = useAppStore((s) => s.addEvent);
  const loadEventsForDate = useAppStore((s) => s.loadEventsForDate);
  const selectedDate = useAppStore((s) => s.selectedDate);

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
      const id = await insertEvent({
        type: 'ache',
        timestamp: timestamp.getTime(),
        notes: notes.trim() || null,
        severity,
        bristol_type: null,
      });
      addEvent({
        id,
        type: 'ache',
        timestamp: timestamp.getTime(),
        notes: notes.trim() || null,
        severity,
        bristol_type: null,
        name: null,
        breaks_fast: 1,
        created_at: Date.now(),
      });
      router.back();
    }
  }

  return (
    <SafeAreaView style={entryFormStyles.container}>
      <EntryFormHeader title="Ache" onSave={handleSave} saveDisabled={loading} />
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
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.circle, severity === n && styles.circleSelected]}
              onPress={() => setSeverity(severity === n ? null : n)}
            >
              <Text style={[styles.circleText, severity === n && styles.circleTextSelected]}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  circleRow: { flexDirection: 'row', gap: 10 },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleSelected: { backgroundColor: colors.primary },
  circleText: { fontSize: 16, color: colors.primary },
  circleTextSelected: { color: colors.white },
});
