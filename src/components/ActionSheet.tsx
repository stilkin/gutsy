import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { useAppStore } from '@/store';
import { colors } from '@/colors';
import type { EventType } from '@/types';

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (key: EventType) => void;
}

const BASE_OPTIONS = [
  { label: 'Food', key: 'food' as const },
  { label: 'Ache', key: 'ache' as const },
  { label: 'Medication', key: 'medication' as const },
];

const TOILET_OPTION = { label: 'Toilet break', key: 'toilet' as const };

export function ActionSheet({ visible, onClose, onSelect }: ActionSheetProps) {
  const toiletEnabled = useAppStore((s) => s.settings.toiletTrackingEnabled);
  const options = toiletEnabled ? [...BASE_OPTIONS, TOILET_OPTION] : BASE_OPTIONS;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={styles.option}
            onPress={() => {
              onSelect(opt.key);
              onClose();
            }}
          >
            <Text style={styles.optionText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
  },
  option: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  optionText: {
    fontSize: 17,
  },
});
