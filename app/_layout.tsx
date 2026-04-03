import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { runMigrations } from '@/db/migrations';
import { useAppStore } from '@/store';
import { colors } from '@/colors';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const loadSettings = useAppStore((s) => s.loadSettings);
  const loadEventsForDate = useAppStore((s) => s.loadEventsForDate);
  const selectedDate = useAppStore((s) => s.selectedDate);

  useEffect(() => {
    Promise.all([runMigrations(), loadSettings()])
      .then(() => loadEventsForDate(selectedDate))
      .then(() => setReady(true))
      .catch((err) => {
        console.error('Startup failed:', err);
        setReady(true);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="export" options={{ presentation: 'modal' }} />
    </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
