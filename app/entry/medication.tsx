import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { insertEvent, getMedicationNames } from '@/db/queries';
import { useAppStore } from '@/store';
import { colors } from '@/colors';
import { entryFormStyles } from '@/components/entryFormStyles';
import { EntryFormHeader } from '@/components/EntryFormHeader';
import { TimePickerField } from '@/components/TimePickerField';

function titleCase(s: string): string {
  return s.trim().replace(/\b[a-zA-Z]/g, (c) => c.toUpperCase());
}

export default function MedicationEntryScreen() {
  const [timestamp, setTimestamp] = useState(new Date());
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [nameError, setNameError] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allNames, setAllNames] = useState<string[]>([]);

  const addEvent = useAppStore((s) => s.addEvent);

  useEffect(() => {
    getMedicationNames().then(setAllNames);
  }, []);

  function handleNameChange(text: string) {
    setName(text);
    setNameError(false);
    if (text.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const lower = text.toLowerCase();
    setSuggestions(allNames.filter((n) => n.toLowerCase().includes(lower)));
  }

  function handleSuggestionPress(suggestion: string) {
    setName(suggestion);
    setSuggestions([]);
    setNameError(false);
  }

  async function handleSave() {
    const normalised = titleCase(name);
    if (!normalised) {
      setNameError(true);
      return;
    }

    const id = await insertEvent({
      type: 'medication',
      timestamp: timestamp.getTime(),
      notes: notes.trim() || null,
      severity: null,
      bristol_type: null,
      name: normalised,
    });

    addEvent({
      id,
      type: 'medication',
      timestamp: timestamp.getTime(),
      notes: notes.trim() || null,
      severity: null,
      bristol_type: null,
      name: normalised,
      created_at: Date.now(),
    });
    router.back();
  }

  return (
    <SafeAreaView style={entryFormStyles.container}>
      <EntryFormHeader title="Medication" onSave={handleSave} />
      <TimePickerField timestamp={timestamp} onChangeTimestamp={setTimestamp} />

      {/* Name field + autocomplete */}
      <View style={entryFormStyles.field}>
        <Text style={[entryFormStyles.label, nameError && styles.labelError]}>
          Medication name{nameError ? ' — required' : ''}
        </Text>
        <TextInput
          style={[styles.nameInput, nameError && styles.inputError]}
          placeholder="e.g. Ibuprofen"
          value={name}
          onChangeText={handleNameChange}
          autoCapitalize="none"
          returnKeyType="next"
        />
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            style={styles.suggestionList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Notes field */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  labelError: { color: colors.danger },
  nameInput: {
    fontSize: 17,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    borderRadius: 8,
    padding: 10,
    minHeight: 44,
  },
  inputError: { borderColor: colors.danger },
  suggestionList: {
    marginTop: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    borderRadius: 8,
    maxHeight: 180,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: { fontSize: 16 },
});
