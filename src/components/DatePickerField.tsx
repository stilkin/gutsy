import { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { entryFormStyles as s } from './entryFormStyles';

interface Props {
  timestamp: Date;
  onChangeDate: (date: Date) => void;
}

export function DatePickerField({ timestamp, onChangeDate }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={s.field}>
      <Text style={s.label}>Date</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={s.timeValue}>{dayjs(timestamp).format('D MMMM YYYY')}</Text>
      </TouchableOpacity>
      {(showPicker || Platform.OS === 'ios') && (
        <DateTimePicker
          value={timestamp}
          mode="date"
          maximumDate={new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowPicker(false);
            if (date) {
              const merged = new Date(date);
              merged.setHours(timestamp.getHours(), timestamp.getMinutes(), timestamp.getSeconds());
              onChangeDate(merged);
            }
          }}
        />
      )}
    </View>
  );
}
