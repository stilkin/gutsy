import { useEffect, useState } from 'react';
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
  Switch,
  StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  insertEvent,
  insertImage,
  updateEvent,
  getEventById,
  getImageForEvent,
  removeImageForEvent,
} from '@/db/queries';
import { resizeForStorage } from '@/images/processImage';
import { describeImage } from '@/ai/describeImage';
import { loadApiKey } from '@/settings/apiKey';
import { useAppStore } from '@/store';
import { colors, switchColors } from '@/colors';
import { entryFormStyles } from '@/components/entryFormStyles';
import { EntryFormHeader } from '@/components/EntryFormHeader';
import { TimePickerField } from '@/components/TimePickerField';

export default function FoodEntryScreen() {
  const [timestamp, setTimestamp] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [breaksFast, setBreaksFast] = useState(true);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Edit mode image state
  const [existingImagePath, setExistingImagePath] = useState<string | null>(null);
  const [existingImageRemoved, setExistingImageRemoved] = useState(false);

  const [loading, setLoading] = useState(false);

  const { id } = useLocalSearchParams<{ id?: string }>();
  const editId = id ? Number(id) : null;

  const addEvent = useAppStore((s) => s.addEvent);
  const loadEventsForDate = useAppStore((s) => s.loadEventsForDate);
  const selectedDate = useAppStore((s) => s.selectedDate);

  useEffect(() => {
    if (!editId) return;
    setLoading(true);
    Promise.all([getEventById(editId), getImageForEvent(editId)]).then(([event, imagePath]) => {
      if (!event) { setLoading(false); router.back(); return; }
      setTimestamp(new Date(event.timestamp));
      setNotes(event.notes ?? '');
      setBreaksFast(event.breaks_fast !== 0);
      setExistingImagePath(imagePath);
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (editId) {
      await updateEvent(editId, {
        timestamp: timestamp.getTime(),
        notes: notes.trim() || null,
        severity: null,
        bristol_type: null,
        name: null,
        breaks_fast: breaksFast ? 1 : 0,
      });

      // Remove old image if explicitly removed, or if being replaced
      if (existingImageRemoved || (photoUri && existingImagePath)) {
        await removeImageForEvent(editId);
      }

      // Store new image if picked
      if (photoUri) {
        try {
          const storedPath = await resizeForStorage(photoUri);
          await insertImage(editId, storedPath, null);
        } catch (e) {
          console.warn('Failed to store image:', e);
        }
      }

      await loadEventsForDate(selectedDate);
      router.back();
    } else {
      const id = await insertEvent({
        type: 'food',
        timestamp: timestamp.getTime(),
        notes: notes.trim() || null,
        severity: null,
        bristol_type: null,
        breaks_fast: breaksFast ? 1 : 0,
      });

      if (photoUri) {
        try {
          const storedPath = await resizeForStorage(photoUri);
          await insertImage(id, storedPath, null);
        } catch (e) {
          console.warn('Failed to store image:', e);
        }
      }

      addEvent({
        id,
        type: 'food' as const,
        timestamp: timestamp.getTime(),
        notes: notes.trim() || null,
        severity: null,
        bristol_type: null,
        name: null,
        breaks_fast: breaksFast ? 1 : 0,
        created_at: Date.now(),
      });
      router.back();
    }
  }

  // Determine what to show in the photo area
  const showExistingImage = existingImagePath !== null && !existingImageRemoved && photoUri === null;
  const showNewPhoto = photoUri !== null;

  return (
    <SafeAreaView style={entryFormStyles.container}>
      <EntryFormHeader title="Food" onSave={handleSave} saveDisabled={loading || aiLoading} />
      <TimePickerField timestamp={timestamp} onChangeTimestamp={setTimestamp} />

      {/* Photo field */}
      <View style={entryFormStyles.field}>
        <Text style={entryFormStyles.label}>Photo</Text>
        {showNewPhoto ? (
          // Freshly picked — remove silently
          <View style={styles.previewContainer}>
            <Image source={{ uri: photoUri! }} style={styles.preview} />
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
        ) : showExistingImage ? (
          // Stored image — confirm before removing
          <View style={styles.previewContainer}>
            <Image source={{ uri: existingImagePath! }} style={styles.preview} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => {
                Alert.alert(
                  'Remove photo?',
                  'This will permanently delete the stored photo.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Remove', style: 'destructive', onPress: () => setExistingImageRemoved(true) },
                  ]
                );
              }}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // No photo
          <TouchableOpacity style={styles.photoBtn} onPress={() => setShowPhotoSheet(true)}>
            <Text style={styles.photoBtnText}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notes field */}
      <View style={entryFormStyles.field}>
        <Text style={entryFormStyles.label}>Notes</Text>
        {aiLoading && (
          <View style={styles.aiLoadingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.aiLoadingText}>Getting AI description…</Text>
          </View>
        )}
        <TextInput
          style={[entryFormStyles.textInput, aiLoading && styles.textInputDisabled]}
          multiline
          placeholder="Optional notes…"
          value={notes}
          onChangeText={setNotes}
          editable={!aiLoading}
        />
        {aiError ? <Text style={styles.aiErrorText}>{aiError}</Text> : null}
      </View>

      {/* Breaks fast toggle */}
      <View style={[entryFormStyles.field, styles.switchRow]}>
        <Text style={entryFormStyles.label}>Breaks fast</Text>
        <Switch
          value={breaksFast}
          onValueChange={setBreaksFast}
          trackColor={switchColors.trackColor}
          thumbColor={switchColors.thumbColor}
        />
      </View>

      {/* Photo source sheet */}
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
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textInputDisabled: { opacity: 0.5 },
  photoBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  photoBtnText: { color: colors.primary, fontSize: 15 },
  previewContainer: { position: 'relative', alignSelf: 'flex-start' },
  preview: { width: 120, height: 120, borderRadius: 8 },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  aiLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  aiLoadingText: { fontSize: 13, color: colors.secondaryText },
  aiErrorText: { fontSize: 12, color: colors.danger, marginTop: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
  },
  sheetOption: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  sheetOptionText: { fontSize: 17 },
  sheetCancel: { borderBottomWidth: 0 },
  sheetCancelText: { color: colors.danger },
});
