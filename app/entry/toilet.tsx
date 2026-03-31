import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import { insertEvent } from '@/db/queries';
import { useAppStore } from '@/store';

export default function ToiletEntryScreen() {
  const [timestamp, setTimestamp] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [bristolType, setBristolType] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);

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
      created_at: Date.now(),
    });
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Toilet break</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text style={styles.timeValue}>{dayjs(timestamp).format('HH:mm')}</Text>
        </TouchableOpacity>
        {(showPicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={timestamp}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              setShowPicker(false);
              if (date) setTimestamp(date);
            }}
          />
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Optional notes…"
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {bristolEnabled && (
        <View style={styles.field}>
          <Text style={styles.label}>Bristol type (optional)</Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  title: { fontSize: 17, fontWeight: '600' },
  cancel: { fontSize: 17, color: '#007AFF' },
  save: { fontSize: 17, color: '#007AFF', fontWeight: '600' },
  field: { paddingHorizontal: 16, paddingVertical: 12 },
  label: { fontSize: 13, color: '#888', marginBottom: 6 },
  timeValue: { fontSize: 17, color: '#007AFF' },
  textInput: {
    fontSize: 17,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bristolRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleSelected: { backgroundColor: '#007AFF' },
  circleText: { fontSize: 16, color: '#007AFF' },
  circleTextSelected: { color: '#fff' },
});
