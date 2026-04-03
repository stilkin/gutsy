import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '@/store';
import { loadApiKey, saveApiKey, clearApiKey } from '@/settings/apiKey';
import { colors } from '@/colors';

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
          onChange={(v) => updateSetting('windowHours', v)}
        />
        <Text style={styles.sectionHeader}>Logging</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Toilet tracking</Text>
          <Switch
            value={settings.toiletTrackingEnabled}
            onValueChange={(v) => updateSetting('toiletTrackingEnabled', v)}
          />
        </View>

        {settings.toiletTrackingEnabled && (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Bristol scale</Text>
            <Switch
              value={settings.bristolScaleEnabled}
              onValueChange={(v) => updateSetting('bristolScaleEnabled', v)}
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
        <Text style={styles.sectionHeader}>Export</Text>

        <TouchableOpacity style={styles.row} onPress={() => router.push('/export')}>
          <Text style={styles.rowLabel}>Export diary</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
    color: colors.secondaryText,
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
    borderBottomColor: colors.divider,
    backgroundColor: colors.background,
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
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: { fontSize: 20, color: colors.primary, lineHeight: 22 },
  stepBtnDisabled: { color: colors.disabled },
  stepValue: { fontSize: 17, minWidth: 50, textAlign: 'center' },
  apiKeyField: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  apiKeyInput: {
    fontSize: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
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
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  apiKeySaveBtnSaved: {
    backgroundColor: colors.success,
  },
  apiKeySaveBtnText: { color: colors.white, fontSize: 15, fontWeight: '600' },
  chevron: { fontSize: 22, color: '#c7c7cc' },
});
