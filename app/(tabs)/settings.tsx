import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  Modal,
  ScrollView,
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '@/store';
import { loadApiKey, saveApiKey, clearApiKey } from '@/settings/apiKey';
import { colors, switchColors } from '@/colors';
import { LANGUAGE_NAMES } from '@/types';
import type { Language, ModelTier } from '@/types';

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
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const languages = Object.entries(LANGUAGE_NAMES) as [Language, string][];
  const tierOptions: { key: ModelTier; label: string }[] = [
    { key: 'free', label: 'Free' },
    { key: 'normal', label: 'Normal' },
    { key: 'premium', label: 'Premium' },
  ];

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
    <SafeAreaView style={styles.topAccent}>
      <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionHeader}>Export</Text>

        <TouchableOpacity style={styles.row} onPress={() => router.push('/export')}>
          <Text style={styles.rowLabel}>Export diary</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

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
            trackColor={switchColors.trackColor}
            thumbColor={switchColors.thumbColor}
          />
        </View>

        {settings.toiletTrackingEnabled && (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Bristol scale</Text>
            <Switch
              value={settings.bristolScaleEnabled}
              onValueChange={(v) => updateSetting('bristolScaleEnabled', v)}
              trackColor={switchColors.trackColor}
              thumbColor={switchColors.thumbColor}
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

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Model</Text>
          <View style={styles.segmented}>
            {tierOptions.map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[styles.segmentBtn, settings.modelTier === key && styles.segmentBtnActive]}
                onPress={() => updateSetting('modelTier', key)}
              >
                <Text style={[styles.segmentText, settings.modelTier === key && styles.segmentTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.row} onPress={() => setShowLanguagePicker(true)}>
          <Text style={styles.rowLabel}>Description language</Text>
          <Text style={styles.rowValue}>{LANGUAGE_NAMES[settings.language]} ›</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>

      {/* Language picker modal */}
      <Modal visible={showLanguagePicker} transparent animationType="slide" onRequestClose={() => setShowLanguagePicker(false)}>
        <TouchableWithoutFeedback onPress={() => setShowLanguagePicker(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.sheet}>
          <FlatList
            data={languages}
            keyExtractor={([code]) => code}
            renderItem={({ item: [code, name] }) => (
              <TouchableOpacity
                style={styles.sheetOption}
                onPress={() => {
                  updateSetting('language', code);
                  setShowLanguagePicker(false);
                }}
              >
                <Text style={[styles.sheetOptionText, settings.language === code && styles.sheetOptionActive]}>
                  {name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topAccent: { flex: 1, backgroundColor: colors.primary },
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
  rowValue: { fontSize: 15, color: colors.secondaryText },
  segmented: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.primary },
  segmentBtn: { paddingVertical: 6, paddingHorizontal: 12 },
  segmentBtnActive: { backgroundColor: colors.primary },
  segmentText: { fontSize: 14, color: colors.primary },
  segmentTextActive: { color: colors.white },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 32, maxHeight: '50%' },
  sheetOption: { paddingVertical: 14, paddingHorizontal: 24, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  sheetOptionText: { fontSize: 17 },
  sheetOptionActive: { color: colors.primary, fontWeight: '600' },
});
