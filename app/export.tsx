import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import dayjs from 'dayjs';
import { getEventsByDateRange } from '@/db/queries';
import { prepareImages } from '@/export/prepareImages';
import { buildHtml } from '@/export/template';
import { loadSettings } from '@/settings';
import { colors } from '@/colors';

export default function ExportScreen() {
  const [startDate, setStartDate] = useState(
    dayjs().subtract(7, 'day').startOf('day').toDate()
  );
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const [events, settings] = await Promise.all([
        getEventsByDateRange(startDate, endDate),
        loadSettings(),
      ]);
      const images = await prepareImages(events);
      const html = buildHtml(events, images, startDate, endDate, settings.windowHours);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
      });
    } catch (e) {
      Alert.alert('Export failed', 'Something went wrong. Please try again.');
      console.warn('Export error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Export diary</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView>
      <View style={styles.field}>
        <Text style={styles.label}>Start date</Text>
        <TouchableOpacity onPress={() => setShowStartPicker(true)}>
          <Text style={styles.dateValue}>{dayjs(startDate).format('D MMM YYYY')}</Text>
        </TouchableOpacity>
        {(showStartPicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={startDate}
            mode="date"
            maximumDate={endDate}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>End date</Text>
        <TouchableOpacity onPress={() => setShowEndPicker(true)}>
          <Text style={styles.dateValue}>{dayjs(endDate).format('D MMM YYYY')}</Text>
        </TouchableOpacity>
        {(showEndPicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={endDate}
            mode="date"
            minimumDate={startDate}
            maximumDate={new Date()}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.exportBtn, loading && styles.exportBtnDisabled]}
        onPress={handleExport}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.exportBtnText}>Export PDF</Text>
        )}
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  title: { fontSize: 17, fontWeight: '600' },
  cancel: { fontSize: 17, color: colors.primary },
  headerSpacer: { width: 60 },
  field: { paddingHorizontal: 16, paddingVertical: 12 },
  label: { fontSize: 13, color: colors.secondaryText, marginBottom: 6 },
  dateValue: { fontSize: 17, color: colors.primary },
  exportBtn: {
    marginHorizontal: 16,
    marginTop: 32,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportBtnDisabled: { opacity: 0.5 },
  exportBtnText: { color: colors.white, fontSize: 17, fontWeight: '600' },
});
