import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import dayjs from 'dayjs';
import { insertEvent, insertImage } from '@/db/queries';
import { resizeForStorage } from '@/images/processImage';
import { describeImage } from '@/ai/describeImage';
import { loadApiKey } from '@/settings/apiKey';
import { useAppStore } from '@/store';

export default function FoodEntryScreen() {
  const [timestamp, setTimestamp] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const addEvent = useAppStore((s) => s.addEvent);

  async function handleCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera access is needed to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });
    if (!result.canceled) {
      await handlePhotoSelected(result.assets[0].uri);
    }
  }

  async function handleLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Photo library access is needed to pick a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });
    if (!result.canceled) {
      await handlePhotoSelected(result.assets[0].uri);
    }
  }

  async function handlePhotoSelected(uri: string) {
    setPhotoUri(uri);
    setAiError(null);

    const apiKey = await loadApiKey();
    if (!apiKey) return;

    setAiLoading(true);
    try {
      const description = await describeImage(uri, apiKey);
      setNotes(description);
    } catch {
      setAiError('AI description failed. You can still add notes manually.');
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSave() {
    const id = await insertEvent({
      type: 'food',
      timestamp: timestamp.getTime(),
      notes: notes.trim() || null,
      severity: null,
      bristol_type: null,
    });

    if (photoUri) {
      try {
        const storedPath = await resizeForStorage(photoUri);
        await insertImage(id, storedPath, null);
      } catch (e) {
        console.warn('Failed to store image:', e);
      }
    }

    const saved = {
      id,
      type: 'food' as const,
      timestamp: timestamp.getTime(),
      notes: notes.trim() || null,
      severity: null,
      bristol_type: null,
      created_at: Date.now(),
    };
    addEvent(saved);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Food</Text>
        <TouchableOpacity onPress={handleSave} disabled={aiLoading}>
          <Text style={[styles.save, aiLoading && styles.saveDisabled]}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* ── Time field ── */}
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

      {/* ── Photo field ── */}
      <View style={styles.field}>
        <Text style={styles.label}>Photo</Text>
        {photoUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: photoUri }} style={styles.preview} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => {
                setPhotoUri(null);
                setAiError(null);
              }}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.photoBtn} onPress={() => setShowPhotoSheet(true)}>
            <Text style={styles.photoBtnText}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Notes field ── */}
      <View style={styles.field}>
        <Text style={styles.label}>Notes</Text>
        {aiLoading && (
          <View style={styles.aiLoadingRow}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.aiLoadingText}>Getting AI description…</Text>
          </View>
        )}
        <TextInput
          style={[styles.textInput, aiLoading && styles.textInputDisabled]}
          multiline
          placeholder="Optional notes…"
          value={notes}
          onChangeText={setNotes}
          editable={!aiLoading}
        />
        {aiError ? <Text style={styles.aiErrorText}>{aiError}</Text> : null}
      </View>

      {/* ── Photo source sheet ── */}
      <Modal
        visible={showPhotoSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPhotoSheet(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPhotoSheet(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.sheet}>
          <TouchableOpacity
            style={styles.sheetOption}
            onPress={() => {
              setShowPhotoSheet(false);
              handleCamera();
            }}
          >
            <Text style={styles.sheetOptionText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sheetOption}
            onPress={() => {
              setShowPhotoSheet(false);
              handleLibrary();
            }}
          >
            <Text style={styles.sheetOptionText}>Choose from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sheetOption, styles.sheetCancel]}
            onPress={() => setShowPhotoSheet(false)}
          >
            <Text style={[styles.sheetOptionText, styles.sheetCancelText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  saveDisabled: { opacity: 0.4 },
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
  textInputDisabled: { opacity: 0.5 },
  // Photo
  photoBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  photoBtnText: { color: '#007AFF', fontSize: 15 },
  previewContainer: { position: 'relative', alignSelf: 'flex-start' },
  preview: { width: 120, height: 120, borderRadius: 8 },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  // AI loading / error
  aiLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  aiLoadingText: { fontSize: 13, color: '#888' },
  aiErrorText: { fontSize: 12, color: '#ff3b30', marginTop: 4 },
  // Photo source sheet
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
  },
  sheetOption: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  sheetOptionText: { fontSize: 17 },
  sheetCancel: { borderBottomWidth: 0 },
  sheetCancelText: { color: '#ff3b30' },
});
