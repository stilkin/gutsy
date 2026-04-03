import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { entryFormStyles as s } from './entryFormStyles';

interface Props {
  title: string;
  onSave: () => void;
  saveDisabled?: boolean;
}

export function EntryFormHeader({ title, onSave, saveDisabled }: Props) {
  return (
    <View style={s.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={s.cancel}>Cancel</Text>
      </TouchableOpacity>
      <Text style={s.title}>{title}</Text>
      <TouchableOpacity onPress={onSave} disabled={saveDisabled}>
        <Text style={[s.save, saveDisabled && s.saveDisabled]}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
