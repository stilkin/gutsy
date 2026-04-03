import React, { useEffect, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { deleteEventWithImages } from '@/db/queries';
import { useAppStore } from '@/store';
import { FAB } from '@/components/FAB';
import { ActionSheet } from '@/components/ActionSheet';
import { colors } from '@/colors';
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
  const fastBreakingEvents = events.filter((e) => e.type === 'food' && e.breaks_fast !== 0);
  if (fastBreakingEvents.length === 0) return null;
  const windowStart = Math.min(...fastBreakingEvents.map((e) => e.timestamp));
  const windowEnd = windowStart + windowHours * 3_600_000;
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        Window: {dayjs(windowStart).format('HH:mm')} – {dayjs(windowEnd).format('HH:mm')}
      </Text>
    </View>
  );
}

const TYPE_ICONS: Record<EventType, React.ComponentProps<typeof Ionicons>['name']> = {
  food: 'restaurant-outline',
  ache: 'flash-outline',
  toilet: 'water-outline',
  medication: 'medical-outline',
};

interface EventRowProps {
  event: DiaryEvent;
  onDelete: () => void;
  onPress: () => void;
}

function EventRow({ event, onDelete, onPress }: EventRowProps) {
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

  const primaryLabel = event.type === 'medication' && event.name ? event.name : null;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} onLongPress={handleLongPress}>
      <Ionicons
        name={TYPE_ICONS[event.type]}
        size={22}
        color={event.type === 'food' && event.breaks_fast === 0 ? colors.disabled : colors.primary}
        style={styles.rowIcon}
      />
      <View style={styles.rowContent}>
        <Text style={styles.rowTime}>{dayjs(event.timestamp).format('HH:mm')}</Text>
        {primaryLabel ? (
          <Text style={styles.rowPrimaryLabel} numberOfLines={1}>{primaryLabel}</Text>
        ) : null}
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
        {event.type === 'food' && event.breaks_fast === 0 && (
          <Text style={styles.rowMeta}>fasting-safe</Text>
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
    await deleteEventWithImages(event.id);
    removeEvent(event.id);
  }

  function handleSelect(key: EventType) {
    router.push(`/entry/${key}`);
  }

  return (
    <SafeAreaView style={styles.topAccent}>
      <View style={styles.container}>
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
          <EventRow
            event={item}
            onDelete={() => handleDelete(item)}
            onPress={() => router.push(`/entry/${item.type}?id=${item.id}`)}
          />
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
      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topAccent: { flex: 1, backgroundColor: colors.primary },

  // Date header
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  arrowBtn: { padding: 8 },
  arrow: { fontSize: 28, color: colors.primary, lineHeight: 32 },
  arrowDisabled: { color: colors.disabled },
  dateLabelBtn: { flex: 1, alignItems: 'center' },
  dateLabel: { fontSize: 17, fontWeight: '600' },

  // Fasting banner
  banner: {
    backgroundColor: '#f0f7f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8e6d4',
  },
  bannerText: { fontSize: 14, color: colors.primary },

  // Event list
  listContent: { flexGrow: 1, paddingBottom: 100 },
  empty: {
    textAlign: 'center',
    color: colors.tertiaryText,
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
    borderBottomColor: colors.divider,
  },
  rowIcon: { marginRight: 12 },
  rowContent: { flex: 1 },
  rowTime: { fontSize: 15, fontWeight: '500' },
  rowPrimaryLabel: { fontSize: 15, fontWeight: '500', marginTop: 2 },
  rowNotes: { fontSize: 13, color: colors.secondaryText, marginTop: 2 },
  rowMeta: { fontSize: 12, color: colors.tertiaryText, marginTop: 2 },
});
