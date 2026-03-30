import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAppStore } from '@/store';
import { loadApiKey, saveApiKey, clearApiKey } from '@/settings/apiKey';
import type { Settings } from '@/types';

// ── Stepper sub-component ─────────────────────────────────────────────────────

interface StepperProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

function Stepper({ label, value, unit, min, max, onChange }: StepperProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.stepper}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <Text style={[styles.stepBtnText, value <= min && styles.stepBtnDisabled]}>−</Text>
        </TouchableOpacity>
        <Text style={styles.stepValue}>
          {value} {unit}
        </Text>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          <Text style={[styles.stepBtnText, value >= max && styles.stepBtnDisabled]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { settings, updateSetting } = useAppStore();
  const [apiKey, setApiKey] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  useEffect(() => {
    loadApiKey().then((key) => {
      if (key) {
        setApiKey(key);
        setApiKeySaved(true);
      }
    });
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    updateSetting(key, value);
  }

  async function handleApiKeySave() {
    const trimmed = apiKey.trim();
    if (trimmed) {
      await saveApiKey(trimmed);
    } else {
      await clearApiKey();
    }
    setApiKeySaved(!!trimmed);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionHeader}>Fasting Window</Text>

        <Stepper
          label="Window duration"
          value={settings.windowHours}
          unit="h"
          min={1}
          max={24}
          onChange={(v) => update('windowHours', v)}
        />
        <Stepper
          label="Notification lead time"
          value={settings.notificationMinutes}
          unit="min"
          min={0}
          max={120}
          onChange={(v) => update('notificationMinutes', v)}
        />

        <Text style={styles.sectionHeader}>Logging</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Toilet tracking</Text>
          <Switch
            value={settings.toiletTrackingEnabled}
            onValueChange={(v) => update('toiletTrackingEnabled', v)}
          />
        </View>

        {settings.toiletTrackingEnabled && (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Bristol scale</Text>
            <Switch
              value={settings.bristolScaleEnabled}
              onValueChange={(v) => update('bristolScaleEnabled', v)}
            />
          </View>
        )}

        <Text style={styles.sectionHeader}>AI Assistant</Text>

        <View style={styles.apiKeyField}>
          <Text style={styles.rowLabel}>OpenRouter API Key</Text>
          <TextInput
            style={styles.apiKeyInput}
            value={apiKey}
            onChangeText={(v) => {
              setApiKey(v);
              setApiKeySaved(false);
            }}
            secureTextEntry
            placeholder="sk-or-…"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.apiKeySaveBtn, apiKeySaved && styles.apiKeySaveBtnSaved]}
            onPress={handleApiKeySave}
            disabled={apiKeySaved}
          >
            <Text style={styles.apiKeySaveBtnText}>{apiKeySaved ? 'Saved' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  rowLabel: { fontSize: 17 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: { fontSize: 20, color: '#007AFF', lineHeight: 22 },
  stepBtnDisabled: { color: '#ccc' },
  stepValue: { fontSize: 17, minWidth: 50, textAlign: 'center' },
  apiKeyField: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  apiKeyInput: {
    fontSize: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    color: '#000',
  },
  apiKeySaveBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  apiKeySaveBtnSaved: {
    backgroundColor: '#34c759',
  },
  apiKeySaveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
