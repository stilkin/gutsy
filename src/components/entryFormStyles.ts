import { StyleSheet } from 'react-native';
import { colors } from '@/colors';

export const entryFormStyles = StyleSheet.create({
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
  save: { fontSize: 17, color: colors.primary, fontWeight: '600' },
  saveDisabled: { opacity: 0.4 },
  field: { paddingHorizontal: 16, paddingVertical: 12 },
  label: { fontSize: 13, color: colors.secondaryText, marginBottom: 6 },
  timeValue: { fontSize: 17, color: colors.primary },
  textInput: {
    fontSize: 17,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
