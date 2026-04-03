import { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { entryFormStyles as s } from './entryFormStyles';

interface Props {
  timestamp: Date;
  onChangeTimestamp: (date: Date) => void;
}

export function TimePickerField({ timestamp, onChangeTimestamp }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={s.field}>
      <Text style={s.label}>Time</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={s.timeValue}>{dayjs(timestamp).format('HH:mm')}</Text>
      </TouchableOpacity>
      {(showPicker || Platform.OS === 'ios') && (
        <DateTimePicker
          value={timestamp}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowPicker(false);
            if (date) onChangeTimestamp(date);
          }}
        />
      )}
    </View>
  );
}
