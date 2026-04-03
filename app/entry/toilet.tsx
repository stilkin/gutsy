import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { insertEvent } from '@/db/queries';
import { useAppStore } from '@/store';
import { colors } from '@/colors';
import { entryFormStyles } from '@/components/entryFormStyles';
import { EntryFormHeader } from '@/components/EntryFormHeader';
import { TimePickerField } from '@/components/TimePickerField';

export default function ToiletEntryScreen() {
  const [timestamp, setTimestamp] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [bristolType, setBristolType] = useState<number | null>(null);

  const addEvent = useAppStore((s) => s.addEvent);
  const bristolEnabled = useAppStore((s) => s.settings.bristolScaleEnabled);

  async function handleSave() {
    const id = await insertEvent({
      type: 'toilet',
      timestamp: timestamp.getTime(),
      notes: notes.trim() || null,
      severity: null,
      bristol_type: bristolEnabled ? bristolType : null,
    });
    addEvent({
      id,
      type: 'toilet',
      timestamp: timestamp.getTime(),
      notes: notes.trim() || null,
      severity: null,
      bristol_type: bristolEnabled ? bristolType : null,
      name: null,
      created_at: Date.now(),
    });
    router.back();
  }

  return (
    <SafeAreaView style={entryFormStyles.container}>
      <EntryFormHeader title="Toilet break" onSave={handleSave} />
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

      {bristolEnabled && (
        <View style={entryFormStyles.field}>
          <Text style={entryFormStyles.label}>Bristol type (optional)</Text>
          <View style={styles.bristolRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.circle, bristolType === n && styles.circleSelected]}
                onPress={() => setBristolType(bristolType === n ? null : n)}
              >
                <Text style={[styles.circleText, bristolType === n && styles.circleTextSelected]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bristolRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
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
