import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import { deleteEvent } from '@/db/queries';
import { db } from '@/db/database';
import * as FileSystem from 'expo-file-system';
import { useAppStore } from '@/store';
import { FAB } from '@/components/FAB';
import { ActionSheet } from '@/components/ActionSheet';
import type { DiaryEvent, EventType } from '@/types';

// ── Sub-components ────────────────────────────────────────────────────────────

interface DateHeaderProps {
  selectedDate: string;
  onPrev: () => void;
  onNext: () => void;
  onDateChange: (date: string) => void;
}

function DateHeader({ selectedDate, onPrev, onNext, onDateChange }: DateHeaderProps) {
  const [showPicker, setShowPicker] = useState(false);
  const today = dayjs().format('YYYY-MM-DD');
  const isToday = selectedDate === today;

  return (
    <View style={styles.dateHeader}>
      <TouchableOpacity onPress={onPrev} style={styles.arrowBtn}>
        <Text style={styles.arrow}>‹</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateLabelBtn}>
        <Text style={styles.dateLabel}>{dayjs(selectedDate).format('dddd, D MMMM')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onNext} disabled={isToday} style={styles.arrowBtn}>
        <Text style={[styles.arrow, isToday && styles.arrowDisabled]}>›</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={new Date(selectedDate)}
          mode="date"
          maximumDate={new Date()}
          onChange={(_, date) => {
            setShowPicker(false);
            if (date) onDateChange(dayjs(date).format('YYYY-MM-DD'));
          }}
        />
      )}
    </View>
  );
}

interface FastingWindowBannerProps {
  events: DiaryEvent[];
  windowHours: number;
}

function FastingWindowBanner({ events, windowHours }: FastingWindowBannerProps) {
  const foodEvents = events.filter((e) => e.type === 'food');
  if (foodEvents.length === 0) return null;
  const windowStart = Math.min(...foodEvents.map((e) => e.timestamp));
  const windowEnd = windowStart + windowHours * 3_600_000;
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        Window: {dayjs(windowStart).format('HH:mm')} – {dayjs(windowEnd).format('HH:mm')}
      </Text>
    </View>
  );
}

const TYPE_ICONS: Record<EventType, string> = {
  food: '🍽',
  ache: '⚡',
  toilet: '🚽',
};

interface EventRowProps {
  event: DiaryEvent;
  onDelete: () => void;
}

function EventRow({ event, onDelete }: EventRowProps) {
  function handleLongPress() {
    Alert.alert(
      'Delete entry?',
      `${dayjs(event.timestamp).format('HH:mm')} · ${event.type}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  }

  return (
    <TouchableOpacity style={styles.row} onLongPress={handleLongPress}>
      <Text style={styles.rowIcon}>{TYPE_ICONS[event.type]}</Text>
      <View style={styles.rowContent}>
        <Text style={styles.rowTime}>{dayjs(event.timestamp).format('HH:mm')}</Text>
        {event.notes ? (
          <Text style={styles.rowNotes} numberOfLines={1}>
            {event.notes}
          </Text>
        ) : null}
        {event.severity != null && (
          <Text style={styles.rowMeta}>Severity {event.severity}/5</Text>
        )}
        {event.bristol_type != null && (
          <Text style={styles.rowMeta}>Bristol type {event.bristol_type}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function TimelineScreen() {
  const {
    events,
    selectedDate,
    setSelectedDate,
    loadEventsForDate,
    removeEvent,
    settings,
    isActionSheetOpen,
    openActionSheet,
    closeActionSheet,
  } = useAppStore();

  useEffect(() => {
    loadEventsForDate(selectedDate);
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(event: DiaryEvent) {
    // Fetch image paths before the cascade delete removes them
    const images = await db.getAllAsync<{ file_path: string }>(
      'SELECT file_path FROM images WHERE event_id = ?',
      [event.id]
    );
    await deleteEvent(event.id);
    removeEvent(event.id);
    for (const img of images) {
      try {
        await FileSystem.deleteAsync(img.file_path, { idempotent: true });
      } catch {
        // Ignore missing files
      }
    }
  }

  function handleSelect(key: EventType) {
    router.push(`/entry/${key}`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <DateHeader
        selectedDate={selectedDate}
        onPrev={() =>
          setSelectedDate(dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD'))
        }
        onNext={() =>
          setSelectedDate(dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD'))
        }
        onDateChange={setSelectedDate}
      />

      <FastingWindowBanner events={events} windowHours={settings.windowHours} />

      <FlatList
        data={events}
        keyExtractor={(e) => String(e.id)}
        renderItem={({ item }) => (
          <EventRow event={item} onDelete={() => handleDelete(item)} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No entries for this day.</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      <FAB onPress={openActionSheet} />
      <ActionSheet
        visible={isActionSheetOpen}
        onClose={closeActionSheet}
        onSelect={handleSelect}
      />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Date header
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  arrowBtn: { padding: 8 },
  arrow: { fontSize: 28, color: '#007AFF', lineHeight: 32 },
  arrowDisabled: { color: '#ccc' },
  dateLabelBtn: { flex: 1, alignItems: 'center' },
  dateLabel: { fontSize: 17, fontWeight: '600' },

  // Fasting banner
  banner: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d0e8ff',
  },
  bannerText: { fontSize: 14, color: '#0057b3' },

  // Event list
  listContent: { flexGrow: 1, paddingBottom: 100 },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 60,
    fontSize: 16,
  },

  // Event row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  rowIcon: { fontSize: 22, marginRight: 12 },
  rowContent: { flex: 1 },
  rowTime: { fontSize: 15, fontWeight: '500' },
  rowNotes: { fontSize: 13, color: '#888', marginTop: 2 },
  rowMeta: { fontSize: 12, color: '#aaa', marginTop: 2 },
});
